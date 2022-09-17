const nodemailer = require('nodemailer');


async function sendEmail(email, token) {

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


module.exports.sendEmail = sendEmail;