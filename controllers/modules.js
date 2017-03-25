const https = require('https');

function getModules(userId) {
	return new Promise((resolve, reject) => {
		https.get(`https://chatr-apiserver-dev/modules/${userId}/list`, (res) => {
			res.on('data', (d) => {
				resolve(d);
			});
		}).on('error', (err) => {
			reject(err);
		});
	});
}

function uploadModule(req, res) {
	res.render('upload_module', {
		modules: getModules(req.params.userId),
		serverUrl: '',
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
};


module.exports = {uploadModule, listAll};