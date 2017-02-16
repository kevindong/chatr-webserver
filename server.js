const express = require('express');

const port = process.env.PORT || 8080;
const app = express();

app.get('*', (req, res) => {
	res.send('Hello world!');
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
