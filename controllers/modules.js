const https = require('http');

function getModules(userId) {
	return new Promise((resolve, reject) => {
		https.get(`${process.env.API_SERVER}/modules/getByUser/${userId}`, (res) => {
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
		res.render('module/upload_module', {
			modules: modules.map((m) => {
				return m.name;
			}),
			serverUrl: `${process.env.API_SERVER}/modules/upload`,
		});
	}).catch((e) => {
		console.error(e);
		res.status(500).send(e);
	});
}

function listAll(req, res) {
	new Promise((resolve, reject) => {
		https.get(`${process.env.API_SERVER}/modules/get`, (res) => {
			res.on('data', (d) => {
				console.log(d);
				resolve(d);
			});
		}).on('error', (err) => {
			console.log(err, `${process.env.API_SERVER}/modules/get`);
			reject(err);
		});
	}).then((data) => {
		res.render('module', {
			title: 'Modules',
			modules: JSON.parse(data),
		});
	}).catch((e) => {
		console.error(e);
		res.status(500).send(e);
	});
}

function viewDetails(req, res) {
	if (isNaN(Number(req.params.moduleId))) {
		res.status(500).send('Please use a valid module id');
		return;
	}

	https.get(`${process.env.API_SERVER}/modules/get/${req.params.moduleId}`, (httpsRes) => {
		httpsRes.on('data', (d) => {
			const module = JSON.parse(d.toString());

			https.get(`${process.env.API_SERVER}/users/get/${module.userId}`, (httpsRes2) => {
				httpsRes2.on('data', (d2) => {
					const author = JSON.parse(d2.toString());

					https.get(`${process.env.API_SERVER}/usermodules/${req.params.moduleId}/getCount`, (httpsRes3) => {
						httpsRes3.on('data', (d3) => {
							const count = JSON.parse(d3.toString());

							res.render('module/view_module_details', {
								botName: module.name,
								botDesc: module.description,
								author: author.email,
								created: module.createdAt,
								count: count,
								lastUpdated: module.updatedAt,
								code: module.code,
							});
						});

						httpsRes3.on('error', (e) => {
							console.error(e);
							res.send(e);
						});
					});
				});

				httpsRes2.on('error', (e2) => {
					console.error(e2);
					res.status(500).send(e2);
				});
			});
		});

		httpsRes.on('error', (e) => {
			console.error(e);
			res.status(500).send(e);
		});
	});
}

function search(req, res) {
	res.render('module/search');
}

function deleteConfirm(req, res) {
	https.get(`https://${process.env.API_SERVER}/modules/get/${req.params.moduleId}`, (httpsRes) => {
		httpsRes.on('data', (d) => {
			const module = JSON.parse(d.toString());
			const test = `/modules/${module.id}/delete`;
			console.log(test);
			res.render('confirm_module_delete', {
				module: module,
				deleteLink: test,
			});
		});
	});
}

function moduleDelete(req, res) {
	const options = {
		hostname: process.env.API_SERVER,
		port: 443,
		path: '/modules/delete',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const request = https.request(options, (a) => {
		console.log(`Status: ${a.statusCode}`);
		a.setEncoding('utf8');
		a.on('data', (body) => {
			console.log(`Body: ${body}`);
		});
	});
	request.on('error', (e) => {
		console.log(`problem with request: ${e.message}`);
	});
	request.write(`{"id": "${req.params.moduleId}"}`);
	request.end();
	res.redirect('/');
}

function updateModule(req, res) {
	// Get user's modules
	res.render('module/update_module', {
		modules: []
	});
}

module.exports = {uploadModule, listAll, viewDetails, moduleDelete, deleteConfirm, search, updateModule, };
