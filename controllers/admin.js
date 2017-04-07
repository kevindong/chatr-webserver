const https = require('https');
const request = require('request');
const User = require('../models/User');

exports.index = function(req, res) {
	(new Promise((resolve, reject) => {
		https.get('https://chatr-apiserver-dev.herokuapp.com/modules/pending', (res) => {
			res.on('data', (d) => {
				resolve(d);
			});
		}).on('error', (err) => {
			reject(err);
		});
	})).then((pendingModules) => {
		(new Promise((resolve, reject) => {
			https.get('https://chatr-apiserver-dev.herokuapp.com/modules/banned', (res) => {
				res.on('data', (d) => {
					resolve(d);
				});
			}).on('error', (err) => {
				reject(err);
			});
		})).then((bannedModules) => {
			(new Promise((resolve, reject) => {
				https.get('https://chatr-apiserver-dev.herokuapp.com/users/banned', (res) => {
					res.on('data', (d) => {
						resolve(d);
					});
				}).on('error', (err) => {
					reject(err);
					});
			})).then((bannedUsers) => {
				res.render('admin', {
					title: 'Admin',
					pendingModules: JSON.parse(pendingModules),
					bannedModules: JSON.parse(bannedModules),
					bannedUsers: JSON.parse(bannedUsers),
				});
			});
		});
	});
};

exports.users = function(req, res) {
	new Promise((resolve, reject) => {
		request(`http://${process.env.API_SERVER}/users/get`, (error, response, body) => {
			if (error) {
				reject(error);
			}
			resolve(JSON.parse(body));
		});
	}).then((data) => {
		console.log(data);
		res.render('admin/manage_users', {
			title: 'Manage Users',
			users: data,
		});
	}).catch((e) => {
		console.error(e);
		res.status(500).send(e);
	});
};

exports.adminAccountDelete = function(req, res, next) {
	const options = {
		hostname: process.env.API_SERVER,
		port: 443,
		path: '/users/delete',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
  		},
	};
	const request = https.request(options, (a) => {
		console.log(`Status: ${  a.statusCode}`);
		a.setEncoding('utf8');
		a.on('data', (body) => {
			console.log(`Body: ${  body}`);
		});
	});
	request.on('error', (e) => {
		console.log(`problem with request: ${  e.message}`);
	});
	request.write(`{"email": "${req.params.email}"}`);
	request.end();
	new User().where("email", req.params.email).destroy().then((user) => {
		res.redirect('/');
	});
};