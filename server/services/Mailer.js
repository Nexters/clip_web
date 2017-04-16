var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'clipit.kr@gmail.com',
        pass: 'clipit1234'
    }
});

function MailerService() {

}

MailerService.sendMail = function(to, title, msg, callback) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'clipit <clipit.kr@gmail.com>', // sender address
        to: to, // list of receivers
        subject: title, // Subject line
        text: msg // plaintext body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err, info){
        if (callback) callback(err, info);
    });
};

module.exports = MailerService;

