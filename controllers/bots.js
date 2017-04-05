'use strict';
const https = require('http');

function getEmailOfBotsUser(id) {
	return new Promise((resolve, reject) => {
		https.get(`${process.env.API_SERVER}/modules/${id}`, (res) => {
			res.on('data', (d) => {
				resolve(d.userId);
			});
		}).on('error', (err) => {
			return reject(err);
		});
	}).then((userId) => {
		return new Promise((resolve, reject) => {
			https.get(`${process.env.API_SERVER}/users/get/${userId}`, (res) => {
				res.on('data', (d) => {
					resolve(d.email);
				});
			}).on('error', (err) => {
				return reject(err);
			});
		});
	});
}

function getAllModules() {
	return new Promise((resolve, reject) => {
		https.get(`${process.env.API_SERVER}/modules/get`, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d.toString()));
			});
		}).on('error', (err) => {
			return reject(err);
		});
	});
}

function addModuleToBot(req, res) {
	let email = '';

	getEmailOfBotsUser(req.params.botId)
		.then((e) => {
			email = `${e}'s Bot`;
		})
		.then(getAllModules)
		.then((allModules) => {
			res.render('module/add_module_to_bot', {
				botName: email,
				allModules: allModules.map((e) => { return e.name; }),
				serverUrl: process.env.API_SERVER,
			});
		}).catch((e) => {
			console.error(e);
			res.status(500).send(e);
		});
}

module.exports = {addModuleToBot, };