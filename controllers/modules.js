const https = require('https');

function getModules(userId) {
	return new Promise(function(resolve, reject) {
		https.get(`https://chatr-apiserver-dev/modules/${userId}/list`, (res) => {
			res.on('data', (d) => {
				resolve(d);
			});
		}).on('error', (err) =>  {
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

module.exports = { uploadModule, };