const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const request = require('request');


const User = require('../models/User');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	new User({id: id,}).fetch().then((user) => {
		done(null, user);
	});
});

// Sign in with Email and Password
passport.use(new LocalStrategy({usernameField: 'email',}, (email, password, done) => {
	new User({email: email,})
		.fetch()
		.then((user) => {
			if (!user) {
				return done(null, false, {
					msg: `The email address ${  email  } is not associated with any account. ` +
					'Double-check your email address and try again.',
				});
			}
			user.comparePassword(password, (err, isMatch) => {
				if (!isMatch) {
					return done(null, false, {msg: 'Invalid email or password',});
				}
				return done(null, user);
			});
		});
}));

// Sign in with Facebook
passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_ID,
	clientSecret: process.env.FACEBOOK_SECRET,
	callbackURL: '/auth/facebook/callback',
	profileFields: ['name', 'email', 'gender', 'location',],
	passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
	if (req.user) {
		new User({facebook: profile.id,})
			.fetch()
			.then((user) => {
				if (user) {
					req.flash('error', {msg: 'There is already an existing account linked with Facebook that belongs to you.',});
					return done(null);
				}
				new User({id: req.user.id,})
					.fetch()
					.then((user) => {
						user.set('name', user.get('name') || `${profile.name.givenName  } ${  profile.name.familyName}`);
						user.set('gender', user.get('gender') || profile._json.gender);
						user.set('picture', user.get('picture') || `https://graph.facebook.com/${  profile.id  }/picture?type=large`);
						user.set('facebook', profile.id);
						user.save(user.changed, {patch: true,}).then(() => {
							req.flash('success', {msg: 'Your Facebook account has been linked.',});
							done(null, user);
						});
					});
			});
	} else {
		new Promise((resolve, reject) => {
			request(`https://${process.env.API_SERVER}/users/get/${profile._json.email}/email`, (error, response, body) => {
				if (JSON.parse(body)['message'] === 'User Not Found') {
					reject(error);
				} else {
					resolve();
				}
			});
		})
		.then(() => {
			new User({facebook: profile.id,})
				.fetch()
				.then((user) => {
					if (user) {
						return done(null, user);
					}
					new User({email: profile._json.email,})
						.fetch()
						.then((passedUser) => {
							if (passedUser) {
								req.flash('error', {msg: `${passedUser.get('email')  } is already associated with another account.`,});
								return done();
							}
							const user = new User();
							user.set('name', `${profile.name.givenName  } ${  profile.name.familyName}`);
							user.set('email', profile._json.email);
							user.set('gender', profile._json.gender);
							user.set('location', profile._json.location && profile._json.location.name);
							user.set('picture', `https://graph.facebook.com/${  profile.id  }/picture?type=large`);
							user.set('facebook', profile.id);
							user.save().then((user) => {
								done(null, user);
							});
						});
				});
		})
		.catch((error) => {
			console.log('User is not registered on Facebook Messenger');
			return done(null, false, {
				message: 'You have not set up your account yet on Facebook Messenger. Please do that first before you sign up here'
			});
		})
	}
}));
