const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport')
const { env } = require('process')
const {promisify} = require('util')

const auth = {
    auth: {
        api_key: env.MG_API_KEY,
        domain: env.MG_DOMAIN
    }
}

const transport = nodemailer.createTransport(mailgun(auth))
const transportSendMail = promisify(transport.sendMail.bind(transport))

module.exports = {transportSendMail}