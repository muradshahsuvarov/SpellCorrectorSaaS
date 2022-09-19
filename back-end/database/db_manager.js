const mongoose = require('mongoose');

require('dotenv').config();


mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
    console.log('Connected to mongodb');
})

var Schema = mongoose.Schema;

var account_verification_schema = new Schema({

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    verified: { type: Boolean, required: true },
    created_at: { type: String, required: true},
    updated_at: { type: String, required: false}
    
});

var user_schema = new Schema({

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: false },
    description: { type: String, required: false },
    is_admin: { type: Boolean, required: true },
    profile_picture: {type: String, required: false },
    account_creation_datetime: {type: String, required: false },
    google_id: { type: String, required: false }

});

var model_schema = new Schema({

    model_name: {type: String, required: true},
    model_owner_email: {type: String, required: true},
    model_file: {type: String, required: true },
    model_language: {type: String, required: true },
    model_letters: {type: [String], required: true },
    model_vocabulary: {type: [String], required: true },
    model_creation_datetime: { type: String, required: true }

});

var Users = mongoose.model('Users', user_schema, 'users');
var Models = mongoose.model('Models', model_schema, 'models');
var AccountVerifications = mongoose.model('AccountVerifications', account_verification_schema, 'account_verifications');

module.exports.Users = Users;
module.exports.Models = Models;
module.exports.AccountVerifications = AccountVerifications;