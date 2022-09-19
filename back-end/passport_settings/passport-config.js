const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy
const bcrypt = require('bcrypt');
const db_manager = require('../database/db_manager');


require('dotenv').config();

function initialize(passport) {

    const authenticate_user_local = async (req, username, password, done) => {

        // user is a promise, so findOne is an async function circuling in the event loop (non-blocking I/O type, CPU unintensive)
        const user = db_manager.Users.findOne({"username": username}).then(async (auth_user) => {

            if (!auth_user) {
                return done(null, false, { message: 'No user with that username', error: true });
            }
    
            try {

                // Checking whether the user's password matches the real password
                await bcrypt.compare(password, auth_user.password, (error, result) => {
        
                    if (error) throw error;
                    if (!result) {
                        return done(null, false, { message: 'Password incorrect', error: true }); // first_arg: Error, second_arg: User, third_arg: return body properties
                    }
                    
                    // TODO: Authenticate user with passport API
                    console.log({ message: `User ${username} has been successfully authenticated.\n`, error: false});
                    
                    return done(null, auth_user, { message: `User ${username} has been successfully authenticated.`, error: false }); // first_arg: Error, second_arg: User, third: Message
                });
                
            } catch (err) {
                console.log(`Matching password exception: ${err}`);
                return done(err)
            }    
        });

    }

    const authenticate_user_google = async (request, accessToken, refreshToken, profile, done) => {
        await db_manager.Users.findOne({ username: profile.email }).then( async (user) => {
            if (user) {
                console.log({ message: `User ${user.username} has been successfully authenticated.`, error: false });
                done(null, user, { message: `User ${user.username} has been successfully authenticated.`, error: false });
            } else {

                const current_date = new Date();
                const month = (String)(current_date.getMonth()).length == 1 ? "0" + (String)(current_date.getMonth()) :  (String)(current_date.getMonth());
                const day = (String)(current_date.getDate()).length == 1 ? "0" + (String)(current_date.getDate()) :  (String)(current_date.getDate());
                const hours = (String)(current_date.getHours()).length == 1 ? "0" + (String)(current_date.getHours()) :  (String)(current_date.getHours());
                const minutes = (String)(current_date.getMinutes()).length == 1 ? "0" + (String)(current_date.getMinutes()) :  (String)(current_date.getMinutes());
                const seconds = (String)(current_date.getSeconds()).length == 1 ? "0" + (String)(current_date.getSeconds()) :  (String)(current_date.getSeconds());

                const created_at_date = current_date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

                await new db_manager.Users({ 
                    
                    firstname: profile.name.givenName, 
                    lastname: profile.name.familyName, 
                    username: profile.email, 
                    password: '', 
                    description: '', 
                    is_admin: false, 
                    profile_picture: '', 
                    account_creation_datetime: created_at_date ,
                    google_id: profile.id
                    
                }).save().then((newUser) => {
                    console.log({ message: `User ${newUser.username} has been successfully authenticated.`, error: false });
                    done(null, newUser, { message: `User ${newUser.username} has been successfully authenticated.`, error: false });
                });
            }
        });
    }

    passport.use(new GoogleStrategy({ 
        
        clientID: global.process.env.GOOGLE_CLIENT_ID,
        clientSecret: global.process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/authenticategoogle",
        passReqToCallback: true }, authenticate_user_google)

    );
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true }, authenticate_user_local));
    
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
}

module.exports = initialize;