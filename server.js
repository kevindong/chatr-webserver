const express = require('express');

const port = process.env.PORT || 8080;
const app = express();
const https = require('https');
app.set('view engine', 'pug');

// Imports routes from controller
require('./server/routes')(app);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

module.exports = app;