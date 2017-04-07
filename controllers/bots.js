'use strict';
const request = require('request');

function getEmailOfBotsUser(id) {
	return new Promise((resolve, reject) => {
		request(`http://${process.env.API_SERVER}/users/get/${id}`, (error, response, body) => {
			if (error) {
				reject(error);
			}
			resolve(JSON.parse(body).email);
		});
	});
}

function getAllModules() {
	return new Promise((resolve, reject) => {
		request(`http://${process.env.API_SERVER}/modules/get`, (error, response, body) => {
			if (error) {
				reject(error);
			}
			resolve(JSON.parse(body));
		});
	});
}

function getBotsModules(id) {
	return new Promise((resolve, reject) => {
		request(`http://${process.env.API_SERVER}/usermodules/${id}/getModules`, (error, response, body) => {
			if (error) {
				reject(error);
			}
			console.log(error, response, body);
			resolve(JSON.parse(body));
		});
	});
}

function addModuleToBot(req, res) {
	let email = '';
	let botModules = [];

	getEmailOfBotsUser(req.params.botId)
		.then((e) => {
			email = `${e}'s Bot`;
			return req.params.botId;
		})
		.then(getBotsModules)
		.then((modules) => { botModules = modules.map((e) => { return e.name; }); })
		.then(getAllModules)
		.then((allModules) => {
			res.render('module/add_module_to_bot', {
				botName: email,
				allModules: allModules.map((e) => {
					return e.name;
				}),
				currentModules: botModules,
				serverUrl: `http://${process.env.API_SERVER}`,
			});
		})
		.catch((e) => {
			console.error(e);
			res.status(500).send(e);
		});
}

module.exports = {addModuleToBot,};