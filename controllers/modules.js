function uploadModule(req, res) {
	res.render('upload_module', {
		modules: getModules(req.params.userId),
		serverUrl: ""
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

module.exports = {uploadModule};