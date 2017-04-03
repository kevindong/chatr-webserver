const https = require('http');

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
	}).catch((e) => {
		console.error(e);
		res.status(500).send(e);
	});
}

function listAll(req, res) {
	new Promise((resolve, reject) => {
		https.get(`${process.env.API_SERVER}/modules/get`, (res) => {
			console.log('statusCode:', res.statusCode);
			console.log('headers:', res.headers);

			res.on('data', (d) => {
				console.log(d);
				resolve(d);
			});
		}).on('error', (err) => {
			console.log(err, `${process.env.API_SERVER}/modules/get`);
			reject(err);
		});
	}).then((data) => {
		console.log(data);
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
	if (req.params.moduleId !== 'number') {
		res.end();
		return;
	}

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

		httpsRes.on('error', (e) => {
			console.error(e);
			res.status(500).send(e);
		});
	});
}

function search(req, res) {
	res.render('search');
}

function deleteConfirm(req, res) {
	https.get(`https://${process.env.API_SERVER}/modules/get/${req.params.moduleId}`, (httpsRes) => {
		httpsRes.on('data', (d) => {
			const module = JSON.parse(d.toString());
			const test = `/modules/${module.id}/delete`;
			console.log(test);
			res.render('confirm_module_delete', {
				module: module,
				deleteLink: test
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

module.exports = {uploadModule, listAll, viewDetails, moduleDelete, deleteConfirm, search};
