function uploadModule(req, res) {
	res.render('upload_module', {
		modules: ["hello", "world"],
		serverUrl: ""
	});
}

module.exports = {uploadModule};