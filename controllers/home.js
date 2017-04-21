/**
 * GET /
 */
exports.index = function(req, res) {
	if (req.query.code) {
		res.redirect(`/auth/facebook/callback?code=${req.query.code}`);
	} else {
		res.render('home', {
			title: 'Home',
		});
	}
};

exports.getting_started = (req, res) => {
	res.render('getting_started');
};
