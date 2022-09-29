const nodemailer = require('nodemailer');


async function sendVerificationEmail(email, token) {

    var email = email;
    var token = token;

    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: global.process.env.NODEMAILER_EMAIL,
            pass: global.process.env.NODEMAILER_APP_PASSWORD
        }
    });

    var mailOptions = {
        from: global.process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Account Verification - spellyy.com',
        html: '<p>You requested account verification, kindly use the link below to verify your account.<br/><br/>' +
         '\n<a href="http://localhost:3000/auth/register?token=' + token + '">Verify Account</a></p><p><br/><br/>Don\'t respond to this email</p>'

    };

    let email_sending_status = await mail.sendMail(mailOptions);
    return email_sending_status;
}

async function sendUpdateVerificationEmail(email, token) {

    var email = email;
    var token = token;

    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: global.process.env.NODEMAILER_EMAIL,
            pass: global.process.env.NODEMAILER_APP_PASSWORD
        }
    });

    var mailOptions = {
        from: global.process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Account Verification - spellyy.com',
        html: '<p>An attempt to changing the email address has been made. If this attempt has been done by you, then click the link below to confirm email changing. <br/><br/>' +
         '\n<a href="http://localhost:3000/admin/user-profile?token=' + token + '">Update Email Address</a></p><p><br/><br/>Don\'t respond to this email</p>'

    };

    let email_sending_status = await mail.sendMail(mailOptions);
    return email_sending_status;
}


module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.sendUpdateVerificationEmail = sendUpdateVerificationEmail;