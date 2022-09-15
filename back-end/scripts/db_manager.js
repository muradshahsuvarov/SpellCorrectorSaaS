const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/spell_corrector_db").then(() => {
    console.log('Connected to mongodb');
})

var Schema = mongoose.Schema;

var user_schema = new Schema({

    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String, required: false },
    is_admin: { type: Boolean, required: true },
    profile_picture: {type: String, required: false },
    account_creation_datetime: {type: String, required: false }

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

module.exports.Users = Users;
module.exports.Models = Models;