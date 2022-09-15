const router = require('express').Router();
const home = require('./home');
const dashboard = require('./dashboard');
const editprofile = require('./editprofile');
const followers = require('./followers');
const usermodels = require('./usermodels');
const manageusers = require('./manageusers');
const adminmodels = require('./adminmodels');
const adminanalytics = require('./adminanalytics');
const sc_model_eps = require('./sc_model_eps'); // Spell Corrector Model End Points
const messages = require('./messages');

// Middleware which checks a user to be authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.send('Not Authenticated');
}

// Middleware which checks a user to be an admin
function checkIsAdmin(req, res, next) {
    if (req.user.is_admin == true) {
        return next();
    }
    return res.status(404).send("Unauthorized"); 
}

router.get('/', checkAuthenticated, (req, res, next) => {
    res.send('Profile Endpoints');
});

router.use('/home', checkAuthenticated, home);

router.use('/dashboard', checkAuthenticated, dashboard);

router.use('/editprofile', checkAuthenticated, editprofile);

router.use('/followers', checkAuthenticated, followers);

router.use('/usermodels', checkAuthenticated, usermodels);

router.use('/manageusers', checkAuthenticated, checkIsAdmin, manageusers);

router.use('/adminmodels', checkAuthenticated, checkIsAdmin, adminmodels);

router.use('/adminanalytics', checkAuthenticated, checkIsAdmin, adminanalytics);

router.use('/sc_model_eps', checkAuthenticated, checkIsAdmin, sc_model_eps);

router.use('/messages', checkAuthenticated, checkIsAdmin, messages);

module.exports = router;