const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const Joi = require('joi')

const { sequelize } = require('../../db.js')
const { User } = require('../../models/user.js')
const ServiceError = require('../../ServiceError.js')
const { jwtSecret } = require('../../config.js')
const { transportSendMail } = require('../../mail.js')

const saltRounds = 10

function createUser (newUser) {
  return sequelize.transaction()
    .then(function (transaction) {
      return User.findAll({
        where: {
          email: newUser.email
        }
      }, { transaction })
        .then((data) => {
          if (data.length) {
            throw new ServiceError({
              message: 'User with such login already exists',
              code: 'INVALID_LOGIN'
            })
          }
          return bcrypt.hash(newUser.password, saltRounds)
        })
        .then(function (hash) {
          return User.create({
            email: newUser.email,
            password: hash,
            status: 'PENDING'
          }, { transaction })
        })
        .then((user) => {
          const token = jwt.encode({ userId: user.id }, jwtSecret)
          return transportSendMail({
            from: 'thonykh21@gmail.com',
            to: newUser.email,
            subject: 'Email verification',
            text: `Hello, to confirm the verification click: http://localhost:3000/api/v1/authentication?token=${token}`
          })
            .then(() => {
              return transaction.commit().then(() => ({ email: user.email }))
            })
        })
        .catch(error => {
          console.log(error)
          return transaction.rollback()
            .then(() => {
              throw error
            })
        })
    })
}

const validationRules = {
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),

  password: Joi.string()
    .required()
}

module.exports = { service: createUser, validationRules }
