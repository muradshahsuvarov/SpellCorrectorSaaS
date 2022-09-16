const router = require('express').Router();
const { date } = require('joi');
const db_manager = require('../scripts/db_manager');
const Joi = require('joi');
const { JSONCookie } = require('cookie-parser');
const bcrypt = require('bcrypt');
var randomtoken = require('rand-token');
const sendemail = require('../scripts/sendemail');
const nodemailer = require('nodemailer');
const cookie_parser = require('cookie-parser');
const express = require('express');



router.use(cookie_parser());
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/', (req, res, next) => {
    res.send('Registration Endpoints');
});

router.post('/request-user', async (req, res, next) => {

    
    const target_email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;

    const verificating_user = await db_manager.AccountVerifications.findOne({ email: target_email });

    if(verificating_user && verificating_user.verified === true) {

        res.status(404).json({ message: 'User has already been verified', error: true });
        return;

    }else if(verificating_user && verificating_user.verified === false) {

        // Override currently requesting user by deleting it
        await db_manager.AccountVerifications.deleteOne({ email: verificating_user.email });

    }

    const current_date = new Date();
    const month = (String)(current_date.getMonth()).length == 1 ? "0" + (String)(current_date.getMonth()) :  (String)(current_date.getMonth());
    const day = (String)(current_date.getDate()).length == 1 ? "0" + (String)(current_date.getDate()) :  (String)(current_date.getDate());
    const hours = (String)(current_date.getHours()).length == 1 ? "0" + (String)(current_date.getHours()) :  (String)(current_date.getHours());
    const minutes = (String)(current_date.getMinutes()).length == 1 ? "0" + (String)(current_date.getMinutes()) :  (String)(current_date.getMinutes());
    const seconds = (String)(current_date.getSeconds()).length == 1 ? "0" + (String)(current_date.getSeconds()) :  (String)(current_date.getSeconds());

    const created_at_date = current_date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    const token = randomtoken.generate(50, "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");

    const account_verification_object = {

        firstname: firstname,
        lastname: lastname,
        email: target_email,
        password: password,
        token: token,
        verified: false,
        created_at: created_at_date,
        updated_at: ""

    };

    var account_verification_joi_schema = new Joi.object({

        firstname: Joi.string().min(5).max(40).required(),
        lastname: Joi.string().min(5).max(40).required(),
        email: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(10).max(40).required(),
        token: Joi.string().min(5).max(100).required(),
        verified: Joi.boolean().required(),
        created_at: Joi.string().min(19).max(19).required(),
        updated_at: Joi.string().min(0).max(19)

    });

    const { error } = account_verification_joi_schema.validate(account_verification_object);
    
    if (error) {
        res.status(404).json({ message: `Error ${error}`, error: true });
        return;
    }

    const new_password = await bcrypt.hash(account_verification_object.password, 10);

    const mongo_account_verification = new db_manager.AccountVerifications({

         firstname: account_verification_object.firstname,
         lastname: account_verification_object.lastname,
         email: account_verification_object.email,
         password: new_password,
         token: account_verification_object.token,
         verified: account_verification_object.verified,
         created_at: account_verification_object.created_at,
         updated_at: account_verification_object.updated_at

    });

    await mongo_account_verification.save();

    // Sending an email
    var email_sending_status;
    await sendemail.sendEmail(account_verification_object.email, account_verification_object.token).then((status)=>{
        email_sending_status = status;
    });
    if (email_sending_status.error === true) {
        res.status(200).json({ message: email_sending_status.message, error: true });
        return;
    }

    res.status(200).json({ message: `Verification email has been successfully sent to ${target_email}`, error: false });

});

router.get('/verify-email/:token', async (req, res, next) => {

    const token = req.params.token;

    let account_verification_user = await db_manager.AccountVerifications.findOne({ token: token });
    
    if (!account_verification_user) {
        res.status(404).json({ message: `User does not exist`, error: true });
        return;
    }else{
        if (account_verification_user.verified === true) {
            res.status(401).json({ message: `User ${account_verification_user.email} has already been verified`, error: true });
            return;
        }
    }

    const current_date = new Date();
    const month = (String)(current_date.getMonth()).length == 1 ? "0" + (String)(current_date.getMonth()) :  (String)(current_date.getMonth());
    const day = (String)(current_date.getDate()).length == 1 ? "0" + (String)(current_date.getDate()) :  (String)(current_date.getDate());
    const hours = (String)(current_date.getHours()).length == 1 ? "0" + (String)(current_date.getHours()) :  (String)(current_date.getHours());
    const minutes = (String)(current_date.getMinutes()).length == 1 ? "0" + (String)(current_date.getMinutes()) :  (String)(current_date.getMinutes());
    const seconds = (String)(current_date.getSeconds()).length == 1 ? "0" + (String)(current_date.getSeconds()) :  (String)(current_date.getSeconds());

    const account_creation_datetime = current_date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

    const user_object = {
        firstname: account_verification_user.firstname,
        lastname: account_verification_user.lastname,
        username: account_verification_user.email,
        password: account_verification_user.password, // Hashed Password
        description: "",
        is_admin: false,
        profile_picture: "",
        account_creation_datetime: account_creation_datetime
    };

    var user_joi_schema = new Joi.object({
        firstname: Joi.string().min(5).max(40).required(),
        lastname: Joi.string().min(5).max(40).required(),
        username: Joi.string().min(10).max(40).required(),
        password: Joi.string().min(10).max(200).required(),
        description: Joi.string().min(0).max(1000),
        is_admin: Joi.boolean().required(),
        profile_picture: Joi.string().min(0).max(100),
        account_creation_datetime: Joi.string().min(19).max(19).required()
    });

    const { error } = user_joi_schema.validate(user_object);
    
    if (error) {
        res.status(404).json({ message: `Error: ${error}`, error: true });
        return;
    }

    const mongo_user = new db_manager.Users({

        firstname: user_object.firstname, 
        lastname: user_object.lastname, 
        username: user_object.username, 
        password: user_object.password, 
        description: user_object.description, 
        is_admin: user_object.is_admin, 
        profile_picture: user_object.profile_picture, 
        account_creation_datetime: user_object.account_creation_datetime 

    });

    try {
        await db_manager.AccountVerifications.updateOne({ token: token }, { $set: { verified: true } });
        await mongo_user.save();
    }catch(error){
        res.status(201).json({ message: `User verification error: ${error}`, error: true });
        return;
    }


    res.status(201).json({ message: `User ${user_object.username} has been successfully verified`, error: false });
});

module.exports = router;