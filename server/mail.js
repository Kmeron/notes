const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport')
const {promisify} = require('util')

const auth = {
    auth: {
        api_key: '1e4366367da95f4fa7745301925f6a11-20ebde82-35179680',
        domain: 'sandbox66e5fa4b3cb8425f9f038fed1d0ccd22.mailgun.org'
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