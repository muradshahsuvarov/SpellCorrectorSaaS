const router = require('express').Router();
const { date } = require('joi');
const db_manager = require('../scripts/db_manager');
const Joi = require('joi');
const { JSONCookie } = require('cookie-parser');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
    res.send('Registration Endpoints');
});

router.post('/register', async (req, res, next) => {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;

    var user_exists = false;

    await db_manager.Users.findOne({username: username}).then((doc) => {
        if (doc) {
            user_exists = true;        
        }
    });
    
    if (user_exists) {
        res.send('User exists');
        return;
    }

    const current_date = new Date();
    const month = (String)(current_date.getMonth()).length == 1 ? "0" + (String)(current_date.getMonth()) :  (String)(current_date.getMonth());
    const day = (String)(current_date.getDate()).length == 1 ? "0" + (String)(current_date.getDate()) :  (String)(current_date.getDate());
    const hours = (String)(current_date.getHours()).length == 1 ? "0" + (String)(current_date.getHours()) :  (String)(current_date.getHours());
    const minutes = (String)(current_date.getMinutes()).length == 1 ? "0" + (String)(current_date.getMinutes()) :  (String)(current_date.getMinutes());
    const seconds = (String)(current_date.getSeconds()).length == 1 ? "0" + (String)(current_date.getSeconds()) :  (String)(current_date.getSeconds());

    const account_creation_datetime = current_date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    const user_object = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        description: "",
        is_admin: false,
        profile_picture: "",
        account_creation_datetime: account_creation_datetime
    };

    var user_joi_schema = new Joi.object({
        firstname: Joi.string().min(5).max(40).required(),
        lastname: Joi.string().min(5).max(40).required(),
        username: Joi.string().min(10).max(40).required(),
        password: Joi.string().min(10).max(40).required(),
        description: Joi.string().min(0).max(1000),
        is_admin: Joi.boolean().required(),
        profile_picture: Joi.string().min(0).max(100),
        account_creation_datetime: Joi.string().min(19).max(19).required()
    });

    const { error } = user_joi_schema.validate(user_object);
    
    if (error) {
        return res.status(404).send(`Error: ${error}`);
    }

    const new_password = await bcrypt.hash(user_object.password, 10);

    const mongo_user = new db_manager.Users({

         firstname: user_object.firstname,
         lastname: user_object.lastname,
         username: user_object.username,
         password: new_password,
         description: user_object.description,
         is_admin: false,
         profile_picture: user_object.profile_picture,
         account_creation_datetime: user_object.account_creation_datetime

    });

    await mongo_user.save();
    res.status(201).send(`User ${mongo_user} has been successfully registered`);
});

module.exports = router;