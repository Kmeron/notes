const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport')
const {promisify} = require('util')

const auth = {
    auth: {
        api_key: '6df448f4d9b3866f78efa917df04a24f-2bf328a5-5b542320',
        domain: 'sandbox7f3a7199375c4f44a2b5bb2458826114.mailgun.org'
    }
}

const transport = nodemailer.createTransport(mailgun(auth))
const transportSendMail = promisify(transport.sendMail.bind(transport))

// transportSendMail({
//     from: 'lkmeronl@gmail.com',
//     to: 'lkmeronl@gmail.com',
//     subject: 'testMail',
//     text: 'Hello, test mail was sent.'
// }, (err, info) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(info)
//     }
// })

module.exports = {transportSendMail}