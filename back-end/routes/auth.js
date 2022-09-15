const router = require('express').Router();
const passport = require('passport');
const InitializePassport = require('../scripts/passport-config');
const profile = require('./profile');

InitializePassport(passport); // Initialization of strategies


router.use(passport.initialize()) // Initialize Passport
router.use(passport.session()) // Save variables persisted across the entire session

router.get('/', (req, res, next) => {
    res.send('Authentication Endpoints');
});

router.post('/authenticatelocal', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
}));


// Scope is a mechanism in OAuth 2.0 to limit an application's access to a user's account
router.get('/authenticategoogle', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
    scope: ['profile', 'email']
 }));

// router.post('/authenticategithub', passport.authenticate());

router.delete('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        req.logout((err) => {
            if (err) {
                throw err;
            }
            console.log(`User ${user.username} has been successfully logged out`);
            res.status(200).send(`User ${user.username} has been successfully logged out`);
        });
    }else{
        console.log('No user to log out off the system');
        res.status(401).send('No user to log out off the system');
    }
});


router.use('/profile', profile)

module.exports = router;