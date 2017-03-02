const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const https = require('https');
app.set('view engine', 'pug');

app.get('*', (req, res) => {
	res.send('Hello world!');
});

app.get('/modules/:userId/upload', function uploadModule(req, res) {
	res.render('site/upload_module', {});
});

app.get('/bots/:botId/add-module', function addModuleToBot(req, res) {
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
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

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

	});
}

function getAllModules() {
	return new Promise(function(resolve, reject) {

	});
}

function getModules(userId) {
	return new Promise(function(resolve, reject) {

	});
}