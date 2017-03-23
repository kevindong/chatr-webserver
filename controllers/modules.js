const https = require('https');

function getModules(userId) {
	return new Promise((resolve, reject) => {
		https.get(`${process.env.SERVER_URL}/modules/${userId}/list`, (res) => {
			res.on('data', (d) => {
				resolve(d);
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

function viewDetails(req, res) {
	https.get(`${process.env.SERVER_URL}/modules/${req.params.moduleId}/list`, (httpsRes) => {
		httpsRes.on('data', (d) => {
			const module = {
				botName: d.name,
				botDesc: d.description,
				author: d.userId,
				created: d.createdAt,
				lastUpdated: d.updatedAt,
				code: d.code,
			};

			res.render('view_module_details', module);
		});
	});
}

module.exports = {uploadModule, viewDetails, };