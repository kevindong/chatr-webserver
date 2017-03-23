const https = require('https');

exports.index = function(req, res) {
	(new Promise((resolve, reject) => {
		https.get('https://chatr-apiserver-dev.herokuapp.com/modules/pending', (res) => {
			res.on('data', (d) => {
				resolve(d);
			});
		}).on('error', (err) => {
			reject(err);
		});
	})).then((data) => {
		res.render('admin', {
			title: 'Admin',
			pendingModules: JSON.parse(data),
		});
	});
};
