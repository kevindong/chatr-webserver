'use strict';
const request = require('request');
const rp = require('request-promise');

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
	const userObj = JSON.parse(JSON.stringify(req.user));
	//First get the API server's info on this user.
	rp.get(`https://${process.env.API_SERVER}/users/get/${userObj.email}/email`)
		.then((response) => {
			const user = JSON.parse(response);
			return user;
		})
		.then((user) => {
			getModules(user.id).then((modules) => {
				res.render('module/upload_module', {
					modules: modules,
					userId: user.id,
					serverUrl: `http://${process.env.API_SERVER}/modules/upload?doRedirect`,
				});
			}).catch((e) => {
				console.error(e);
				res.status(500).send(e);
			});
		});
}

function listAll(req, res) {
	let modules = [];
	const userObj = JSON.parse(JSON.stringify(req.user));
	let apiUser = {};
	rp.get(`https://${process.env.API_SERVER}/users/get/${userObj.email}/email`)
		.then((response) => {
			apiUser = JSON.parse(response);
		}).then(() => {
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
					request(`http://${process.env.API_SERVER}/usermodules/${apiUser.id}/getModules`, (error, response, body) => {
						if (error) {
							reject(error);
						}
						resolve(JSON.parse(body));
					});
				});
			}).then((botModules) => {
				if (botModules.length > 0) {
					const modBotModules = botModules.map((e) => { return e.id; });
					modules.forEach((module) => {
						module.isAdded = modBotModules.includes(module.id);
					});
				} else {
					modules.forEach((module) => {
						module.isAdded = false;
					});
				}
				res.render('module', {
					title: 'Modules',
					modules: modules,
					set_api: `let server="${process.env.API_SERVER}";\n`,
					userId: apiUser.id,
				});
			}).catch((e) => {
				console.error(e);
				res.status(500).send(e);
			});
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
					id: module.id,
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
	request(`https://${process.env.API_SERVER}/modules/delete/${req.params.moduleId}`, (error, response, body) => {
		if (error) {
			console.error(error);
			res.status(500).send(error);
		}
	});
	res.redirect('/modules');
}

function updateModule(req, res) {
	// Get user's modules
	getModules(req.user.id)
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
