/* eslint no-console: 0 */

'use strict';

const bunyan = require('bunyan');
const nodemailer = requsearchClassire('./lib/nodemailer');

// Create a SMTP transporter object
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'kwonkki83',
        pass:  'Rlqja1000'
    },
    logger: bunyan.createLogger({
        name: 'nodemailer'
    }),
    debug: true // include SMTP traffic in the logs
}, {
    // default message fields

    // sender info
    from: 'Alarm <no-reply@toilet7.cafe24.net>',
    headers: {
        'X-Laziness-level': 1000 // just an example header, no need to use this
    }
});

console.log('SMTP Configured');


// Message object
let message = {

    // Comma separated list of recipients
    to: '<kwonkki83@gmail.com>',

    // Subject of the message
    subject: '알람입니다...', //

    // HTML body
    html: '<p>' + '첨부파일 입니다.'+ '</p><img src="cid:screenshot">',

    // An array of attachments
    attachments: [

        // File Stream attachment
        {
            filename: 'screenshot.png',
            path: __dirname + '/screenshot.png',
            cid: 'screenshot' // should be as unique as possible
        }
    ]
};

exports.email= function ( msg ) {

    if(msg == null ) {
        msg = message;
    }

    console.log('Sending Mail');
    transporter.sendMail(msg, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
        transporter.close();
    });

}


//email_screenshot();


//module.exports = email_screenshot;
