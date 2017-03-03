const controllers = require('../controllers');

module.exports = app => {
	app.get('/bots/:botId/add-module', controllers.bots.addModuleToBot);
	app.get('/modules/:userId/upload', controllers.modules.uploadModule);
};