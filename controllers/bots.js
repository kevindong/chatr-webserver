"use strict";
const https = require('https');

function addModuleToBot(req, res) {
	let name = 'Bot', allModules = ["how", "are", "you"];

	getName(req.params.botId)
		.then(n => name = n)
		.then(getAllModules(req.params.botId))
		.then(m => allModules = m)
		.then(
			res.render('add_module_to_bot', {
				botName: name,
				allModules: allModules,
				serverUrl: process.env.dev ? "" : ""
			})
		).catch(err => console.error(err));
}

function getName(id) {
	return new Promise(function(resolve, reject) {
		https.get('https://SERVER.URL/modules/' + id, res => {
			res.on('data', d => {
				resolve(d);
			});
		}).on('error', err => reject(err));
	});
}

function getAllModules() {
	return new Promise(function(resolve, reject) {
		https.get('https://SERVER.URL/modules/list', res => {
			res.on('data', d => {
				resolve(d);
			});
		}).on('error', err => reject(err));
	});
}

module.exports = {addModuleToBot};