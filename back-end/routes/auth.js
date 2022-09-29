const router = require('express').Router();
const next = require('concurrent/lib/next');
const passport = require('passport');
const InitializePassport = require('../passport_settings/passport-config');
const profile = require('./profile');
const db_manager = require('../database/db_manager');
const Joi = require('joi');
const sendemail = require('../emailing_services/sendemail');
const randomtoken = require('rand-token');
const bcrypt = require('bcrypt');

InitializePassport(passport); // Initialization of strategies


router.use(passport.initialize()) // Initialize Passport
router.use(passport.session()) // Save variables persisted across the entire session

router.get('/', (req, res, next) => {
    res.send({ message: 'Authentication Endpoints', error: false });
});

router.get('/generatetoken', (req,res,next) => {
    const api_token = randomtoken.generate(200, "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    res.status(200).json({ token: api_token });
});

router.post('/saveprofile', async (req, res, next) => {

    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const aboutMe = req.body.aboutMe;
    const apiToken = req.body.apiToken;
    const password = req.body.password;

    try {
        
        const hashed_password = await bcrypt.hash(password, 10);

        await db_manager.Users.updateOne({ username: email }, {
            $set: { 
                    firstname: firstName,
                    lastname: lastName,
                    description: aboutMe,
                    api_token: apiToken,
                    password: hashed_password
                }
        });
        res.status(200).send({ message: `User ${email} has been successfully saved`, error: false })
    }catch(exception) {
        res.status(400).send({ message: exception, error: true });
    }
})

router.post('/passwordsequal', async (req, res, next) => {

    const password = req.body.password;
    const current_password = JSON.parse(JSON.stringify(req.user)).password;

    try {

        // Checking whether the user's password matches the real password
        await bcrypt.compare(password, current_password, (error, result) => {

            if (error) {
                res.status(200).send({ message: `Error: ${error}`, error: true});
                return;
            }
            if (!result) {
                res.status(200).send({ message: 'Passwords are not equal', error: true});
                return;
            }
            
            res.status(200).send({ message: 'Passwords are equal', error: false});
            return;
        });
        
    } catch (err) {
        console.log(`Matching password exception: ${err}`);
        return done(err)
    }    
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

router.post('/userexists', async (req, res, next) => {
    const email = req.body.email;
    let user_exists = await db_manager.Users.findOne({ username: email });
    if (user_exists) {
        res.status(409).send({ message: `User with ${email} username already exists`, error: true });
        return;
    }
    res.status(200).send({ message: 'Username is free', error: false });
});


router.use('/profile', profile)

module.exports = router;