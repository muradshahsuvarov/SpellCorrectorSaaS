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
    successMessage: { message: "User has been successfully authenticated", error: false },
    failureMessage: { message: "User has not been authenticated", error: true },
    successRedirect: 'http://localhost:3000/auth/profile/home',
    failureRedirect: 'http://localhost:3000/auth/login',
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