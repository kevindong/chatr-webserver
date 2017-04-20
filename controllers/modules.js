'use strict';
const request = require('request');

function getModules(userId) {
	return new Promise((resolve, reject) => {
		request(`http://${process.env.API_SERVER}/modules/getByUser/${userId}`, (error, response, body) => {
			if (error) {
				reject(error);
			}
			resolve(JSON.parse(body));
		});
	});
}

function uploadModule(req, res) {
	getModules(req.params.userId).then((modules) => {
		res.render('module/upload_module', {
			modules: modules,
			userId: req.params.userId,
			serverUrl: `http://${process.env.API_SERVER}/modules/upload?doRedirect`,
		});
	}).catch((e) => {
		console.error(e);
		res.status(500).send(e);
	});
}

function listAll(req, res) {
	let modules = [];

	new Promise((resolve, reject) => {
		request(`http://${process.env.API_SERVER}/modules/get`, (error, response, body) => {
			if (error) {
				reject(error);
			}
			resolve(JSON.parse(body));
		});
	}).then((data) => {
		modules = data;
		return new Promise((resolve, reject) => {
			request(`http://${process.env.API_SERVER}/usermodules/${/*req.user.id*/ 1}/getModules`, (error, response, body) => {
				if (error) {
					reject(error);
				}
				resolve(JSON.parse(body));
			});
		});
	}).then((botModules) => {
		// If there are modules
		if (botModules.length > 0) {
			const modBotModules = botModules.map((e) => { return e.id; });
			modules.forEach((module) => {
				module.isAdded = modBotModules.includes(module.id);
			});

			res.render('module', {
				title: 'Modules',
				modules: modules,
				set_api: `let server="${process.env.API_SERVER}";\n`,
				userId: 1, // req.user.id
			});
		//Else, there are no modules, so just render empty
		} else {
			res.render('module', {
				title: 'Modules',
				modules: [],
				set_api: `let server="${process.env.API_SERVER}";\n`,
				userId: 1, // req.user.id
			});
		}
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

	request(`http://${process.env.API_SERVER}/modules/get/${req.params.moduleId}`, (error, response, body) => {
		if (error) {
			console.error(error);
			res.status(500).send(error);
		}

		const module = JSON.parse(body);

		request(`http://${process.env.API_SERVER}/users/get/${module.userId}`, (error2, response2, body2) => {
			if (error2) {
				console.error(error2);
				res.status(500).send(error2);
			}

			const author = JSON.parse(body2);

			request(`http://${process.env.API_SERVER}/usermodules/${req.params.moduleId}/getCount`, (error3, response3, body3) => {
				if (error3) {
					console.error(error3);
					res.status(500).send(error3);
				}

				const count = JSON.parse(body3);

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
		});
	});
}

function search(req, res) {
	res.render('module/search', {
		set_api: `let server="${process.env.API_SERVER}";\n`,
	});
}

function deleteConfirm(req, res) {
	request(`https://${process.env.API_SERVER}/modules/get/${req.params.moduleId}`, (error, response, body) => {
		if (error) {
			console.error(error);
			res.status(500).send(error);
		}

		const module = JSON.parse(body);
		const test = `/modules/${module.id}/delete`;
		console.log(test);
		res.render('module/confirm_module_delete', {
			module: module,
			deleteLink: test,
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
	const myRequest = request(options, (a) => {
		console.log(`Status: ${a.statusCode}`);
		a.setEncoding('utf8');
		a.on('data', (body) => {
			console.log(`Body: ${body}`);
		});
	});
	myRequest.on('error', (e) => {
		console.log(`problem with request: ${e.message}`);
	});
	myRequest.write(`{"id": "${req.params.moduleId}"}`);
	myRequest.end();
	res.redirect('/');
}

function updateModule(req, res) {
	// Get user's modules
	getModules(req.params.userId)
		.then((modules) => {
			res.render('module/update_module', {
				modules: modules,
				serverUrl: `http://${process.env.API_SERVER}/modules/update?doRedirect`,
			});
		})
		.catch((e) => {
			console.error(e);
			res.status(500).send(e);
		});
}

module.exports = {uploadModule, listAll, viewDetails, moduleDelete, deleteConfirm, search, updateModule, };
