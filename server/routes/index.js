const exampleController = require('../controllers').example;

module.exports = (app) => {
	// Example non-trivial code; delete at will
	app.get('/route', (req, res) => {
		res.status(200).send(
			{
				message: 'Welcome to the main routes file!',
			}
		);
	});

	// Proof that the three controllers work
	app.get('/example/testGet', exampleController.testGet);
};