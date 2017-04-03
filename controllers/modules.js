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
	console.log("listall reached");
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

module.exports = {uploadModule, listAll, viewDetails, moduleDelete, deleteConfirm};
