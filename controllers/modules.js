const https = require('https');

function getModules(userId) {
	return new Promise((resolve, reject) => {
		https.get(`${process.env.API_SERVER}/modules/${userId}/list`, (res) => {
			res.on('data', (d) => {
				resolve(JSON.parse(d.toString()));
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
}

function uploadModule(req, res) {
	getModules(req.params.userId).then((modules) => {
		res.render('upload_module', {
			modules: modules,
			serverUrl: '',
		});
	});
}

function listAll(req, res) {
	(new Promise((resolve, reject) => {
		https.get(`https://${process.env.API_SERVER}/modules/get`, (res) => {
			res.on('data', (d) => {
				resolve(d);
			});
		}).on('error', (err) => {
			reject(err);
		});
	})).then((data) => {
		res.render('module', {
			title: 'Modules',
			modules: JSON.parse(data),
		});
	});
}

function viewDetails(req, res) {
	https.get(`${process.env.API_SERVER}/modules/get/${req.params.moduleId}`, (httpsRes) => {
		httpsRes.on('data', (d) => {
			const module = JSON.parse(d.toString());
			res.render('view_module_details', {
				botName: module.name,
				botDesc: module.description,
				author: module.userId,
				created: module.createdAt,
				lastUpdated: module.updatedAt,
				code: module.code,
			});
		});
	});
}

function search(req, res) {
	res.render('search');
}

module.exports = {uploadModule, listAll, viewDetails, search, };