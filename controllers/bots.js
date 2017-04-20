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
			resolve(JSON.parse(body));
		});
	});
}

function addModuleToBot(req, res) {
	let email = '';
	let botModules = [];

	getEmailOfBotsUser(req.params.userId)
		.then((e) => {
			email = `${e}'s Bot`;
			return req.params.userId;
		})
		.then(getBotsModules)
		.then((modules) => { botModules = modules; })//botModules = modules.map((e) => { return e.name; }); })
		.then(getAllModules)
		.then((allModules) => {
			res.render('module/add_module_to_bot', {
				botName: email,
				allModules: allModules,
				currentModules: botModules,
				userId: req.user.id, // req.user.id
				serverUrl: `let server = "${process.env.API_SERVER}";\n`,
			});
		})
		.catch((e) => {
			console.error(e);
			res.status(500).send(e);
		});
}

module.exports = {addModuleToBot,};