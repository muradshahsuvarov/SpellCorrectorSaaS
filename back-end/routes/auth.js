const router = require('express').Router();
const next = require('concurrent/lib/next');
const passport = require('passport');
const InitializePassport = require('../passport_settings/passport-config');
const profile = require('./profile');

InitializePassport(passport); // Initialization of strategies


router.use(passport.initialize()) // Initialize Passport
router.use(passport.session()) // Save variables persisted across the entire session

router.get('/', (req, res, next) => {
    res.send({ message: 'Authentication Endpoints', error: false });
});

router.get('/getcurrentuser', (req, res, next) => {
    if (req.user) {
        res.json({ message: JSON.stringify(req.user), error: false });
        return;
    }
    res.status(404).json({ message: 'User is not authenticated', error: true });
});

router.post('/authenticatelocal', (req, res, next) =>  { passport.authenticate('local', (err, user, info) => {
    if (!user) {
        res.send({ message: 'Password or username is incorrect', error: true });
        return;
    }
    req.logIn(user, err => {
        if (err) {
            res.send({ message: err, error: true });
            return;
        }
        res.send({ message: req.user, error: false });
    });
})(req, res, next);
});


router.get('/auth_failure', (req, res, next) => {
    res.status(401).json({ message: 'User has not been authenticated', error: true });
});


// Scope is a mechanism in OAuth 2.0 to limit an application's access to a user's account
router.get('/authenticategoogle', (req, res, next) => { passport.authenticate('google', {
    scope: ['profile', 'email']
}, (err, user, info) => {
    if (err) {
        res.send({ message: err, error: true });
        return;
    }
    req.logIn(user, err => {
        if (err) throw err;
        res.redirect('http://localhost:3000/admin/index');
    });
})(req, res, next)}
);

router.delete('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        req.logout((err) => {
            if (err) {
                throw err;
            }
            console.log({ message: `User ${user.username} has been successfully logged out`, error: false });
            res.status(200).json({ message: `User ${user.username} has been successfully logged out`, error: false });
        });
    }else{
        console.log('No user to log out off the system');
        res.status(401).json({ message: 'No user to log out off the system', error: true });
    }
});


router.use('/profile', profile)

module.exports = router;