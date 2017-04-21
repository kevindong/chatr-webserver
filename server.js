const express = require('express');
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const passport = require('passport');
// Load environment variables from .env file
dotenv.load();
// Controllers
const adminController = require('./controllers/admin');
const HomeController = require('./controllers/home');
const userController = require('./controllers/user');
const contactController = require('./controllers/contact');
const modulesController = require('./controllers/modules');
// Passport OAuth strategies
require('./config/passport');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));
app.get('/', (req, res) => {
    res.render('index');
});
app.set('port', process.env.PORT || 3000);
/*
app.use('*', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${  req.headers.host  }${req.url}`);
        }
        else {
            return next();
        }
    }
    else {
        return next();
    }
});
*/
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
, }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET
    , resave: true
    , saveUninitialized: true
, }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user ? req.user.toJSON() : null;
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', HomeController.index);
app.get('/admin', adminController.index);
app.post('/admin', adminController.index);
app.get('/admin/users/:userId/:email/delete',userController.ensureAuthenticated, adminController.adminAccountDelete);
app.get('/contact', contactController.contactGet);
app.post('/contact', contactController.contactPost);
app.get('/account', userController.ensureAuthenticated, userController.accountGet);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.get('/signup', userController.signupGet);
app.post('/signup', userController.signupPost);
app.get('/login', userController.loginGet);
app.post('/login', userController.loginPost);
app.get('/forgot', userController.forgotGet);
app.post('/forgot', userController.forgotPost);
app.get('/reset/:token', userController.resetGet);
app.post('/reset/:token', userController.resetPost);
app.get('/logout', userController.logout);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location', ]
, }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/modules'
    , failureRedirect: '/getting-started'
, }));
app.get('/modules/:userId/upload', userController.ensureAuthenticated, modulesController.uploadModule);
app.get('/modules/:userId/update',userController.ensureAuthenticated, modulesController.updateModule);
app.get('/modules/search', userController.ensureAuthenticated, modulesController.search);
app.get('/modules/:moduleId', modulesController.viewDetails);
app.get('/modules', userController.ensureAuthenticated, modulesController.listAll);
app.get('/modules/:moduleId/delete/confirm', modulesController.deleteConfirm);
app.get('/modules/:moduleId/delete', modulesController.moduleDelete);
app.get('/getting-started', HomeController.getting_started);
// Production error handler
if (app.get('env') === 'production') {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.sendStatus(err.status || 500);
    });
}
app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});
module.exports = app;