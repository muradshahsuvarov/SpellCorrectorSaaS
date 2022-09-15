const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcrypt');
const db_manager = require('./db_manager');


require('dotenv').config();

function initialize(passport) {

    const authenticate_user_local = async (req, username, password, done) => {

        // user is a promise, so findOne is an async function circuling in the event loop (non-blocking I/O type, CPU unintensive)
        const user = db_manager.Users.findOne({"username": username}).then(async (auth_user) => {

            if (!auth_user) {
                return done(null, false, { message: 'No user with that username'});
            }
    
            try {

                // Checking whether the user's password matches the real password
                await bcrypt.compare(password, auth_user.password, (error, result) => {
        
                    if (error) throw error;
                    if (!result) {
                        return done(null, false, { message: 'Password incorrect'}); // first_arg: Error, second_arg: User, third_arg: return body properties
                    }
                    
                    // TODO: Authenticate user with passport API
                    const successfull_auth = `User ${username} has been successfully authenticated.\n`;

                    console.log(successfull_auth);
                    
                    return done(null, auth_user); // first_arg: Error, second_arg: User
                });
                
            } catch (err) {
                console.log(`Matching password exception: ${err}`);
                return done(err)
            }    
        });

    }

    const authenticate_user_google = (request, accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }

    const authenticate_user_github = (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile)
    }

    passport.use(new GoogleStrategy({ 
        
        clientID: global.process.env.GOOGLE_CLIENT_ID,
        clientSecret: global.process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/",
        passReqToCallback   : true }, authenticate_user_google)

    );
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true }, authenticate_user_local));
    
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
}

module.exports = initialize;