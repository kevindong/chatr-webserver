const https = require('https');

function addModuleToBot(req, res) {
	let name = '', activeModules = [], allModules = [];

	getName(req.params.botId)
		.then(n => name = n)
		.then(getActiveModules(req.params.botId))
		.then(m => activeModules = m)
		.then(getAllModules(req.params.botId))
		.then(m => allModules = m)
		.then(
			res.render('site/add_module_to_bot', {
				botName: name,
				activeModules: activeModules,
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

function getActiveModules(botId) {
	return new Promise(function(resolve, reject) {
		resolve(["hello", "world"]);
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

function getModules(userId) {
	return new Promise(function(resolve, reject) {
		https.get('https://SERVER.URL/modules/' + userId + '/list', res => {
			res.on('data', d => {
				resolve(d);
			});
		}).on('error', err => reject(err));
	});
}

module.exports = {addModuleToBot};