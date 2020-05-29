var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail'
    ,prot : 587
    ,host :'smtp.gmlail.com'
    ,secure : false
    ,requireTLS : true
    , auth: {
        user: 'dev.owlsogul@gmail.com'
        ,pass: 'p@ssword!234'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    sendMail: (to, title, body)=>{
        return new Promise((res, rej)=>{
            var mailOption = {
                from : 'dev.owlsogul@gmail.com',
                to : to,
                subject : title,
                html : body
            };
            transporter.sendMail(mailOption, function(err, info) {
                if ( err ) {
                    console.error('Send Mail error : ', err);
                    rej(err)
                }
                else {
                    console.log('Message sent : ', info);
                    res(info)
                }
            });
        })
    }
}