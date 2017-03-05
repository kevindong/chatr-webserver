const https = require('https');

exports.index = function (req, res) {
    (new Promise(function (resolve, reject) {
        https.get(`https://chatr-apiserver-dev.herokuapp.com/modules/pending`, (res) => {
            res.on('data', (d) => {
                resolve(d);
            });
        }).on('error', (err) => {
            reject(err);
        });
    })).then(function (data) {
        res.render('admin', {
            title: 'Admin',
            pendingModules: JSON.parse(data),
        });
    });
};
