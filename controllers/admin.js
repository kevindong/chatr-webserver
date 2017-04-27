const https = require('https');
const request = require('request');
const User = require('../models/User');

exports.index = function (req, res) {
	if (!req.user) {
		return res.redirect('/');
	}
	new Promise((resolve, reject) => {
		request(`https://${process.env.API_SERVER}/users/get/${req.user.attributes.email}/email`, (error, response, body) => {
			if (error) {
				reject(error);
			}
			resolve(JSON.parse(body));
		});
	}).then((user) => {
		console.log("User #" + user.id + " is an admin: " + user.isAdmin);
		if (user.isAdmin) {
			new Promise((resolve, reject) => {
				request(`https://${process.env.API_SERVER}/modules/pending`, (error, response, body) => {
					if (error) {
						reject(error);
					}
					resolve(JSON.parse(body));
				});
			}).then((pendingModules) => {
				new Promise((resolve, reject) => {
					request(`http://${process.env.API_SERVER}/modules/get`, (error, response, body) => {
						if (error) {
							reject(error);
						}
						resolve(JSON.parse(body));
					});
				}).then((modules) => {
					new Promise((resolve, reject) => {
						request(`http://${process.env.API_SERVER}/users/get`, (error, response, body) => {
							if (error) {
								reject(error);
							}
							resolve(JSON.parse(body));
						});
					}).then((users) => {
						res.render('admin', {
							title: 'Admin',
							pendingModules: pendingModules,
							modules: modules,
							users: users,
							server: `${process.env.API_SERVER}`,
						});
					}).catch((e) => {
						console.error(e);
						res.status(500).send(e);
					});
				}).catch((e) => {
					console.error(e);
					res.status(500).send(e);
				});
			}).catch((e) => {
				console.error(e);
				res.status(500).send(e);
			});
		} else {
			res.status(400).send("ERROR: You are not an admin.");
		}
	}).catch((e) => {
		console.error(e);
		res.status(500).send(e);
	});
};

exports.adminAccountDelete = function (req, res, next) {
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
		console.log(`Status: ${a.statusCode}`);
		a.setEncoding('utf8');
		a.on('data', (body) => {
			console.log(`Body: ${body}`);
		});
	});
	request.on('error', (e) => {
		console.log(`problem with request: ${e.message}`);
	});
	request.write(`{"email": "${req.params.email}"}`);
	request.end();
	new User().where("email", req.params.email).destroy().then((user) => {
		res.redirect('/');
	});
};
