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
	})).then((pendingModules) => {
		(new Promise((resolve, reject) => {
			https.get('https://chatr-apiserver-dev.herokuapp.com/modules/banned', (res) => {
				res.on('data', (d) => {
					resolve(d);
				});
			}).on('error', (err) => {
				reject(err);
			});
		})).then((bannedModules) => {
			(new Promise((resolve, reject) => {
				https.get('https://chatr-apiserver-dev.herokuapp.com/users/banned', (res) => {
					res.on('data', (d) => {
						resolve(d);
					});
				}).on('error', (err) => {
					reject(err);
					});
			})).then((bannedUsers) => {
				res.render('admin', {
					title: 'Admin',
					pendingModules: JSON.parse(pendingModules),
					bannedModules: JSON.parse(bannedModules),
					bannedUsers: JSON.parse(bannedUsers),
				});
			});
		});
	});
};
