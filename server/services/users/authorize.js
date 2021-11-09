const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const Joi = require('joi')

const { sequelize } = require('../../db.js')
const { User } = require('../../models/user.js')
const ServiceError = require('../../ServiceError.js')
const { jwtSecret } = require('../../config.js')

function authUser ({ email, password }) {
  return sequelize.transaction().then((transaction) => {
    return User.findAll({
      where: {
        email
      }
    }, { transaction })
      .then(([user]) => {
        if (!user) {
          return transaction.rollback()
            .then(() => {
              throw new ServiceError({
                message: 'User with such login does not exist',
                code: 'INVALID_LOGIN'
              })
            })
        }
        if (user.status === 'PENDING') {
          return transaction.rollback()
            .then(() => {
              throw new ServiceError({
                message: 'Please verify your email',
                code: 'VERIFICATION ERROR'
              })
            })
        }
        return bcrypt.compare(password, user.password)
          .then((result) => {
            if (!result) {
              return transaction.rollback()
                .then(() => {
                  throw new ServiceError({
                    message: 'Invalid Password',
                    code: 'INVALID_PASSWORD'
                  })
                })
            }
            return transaction.commit()
              .then(() => {
                return { jwt: jwt.encode({ userId: user.dataValues.id }, jwtSecret) }
              })
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

module.exports = { service: authUser, validationRules }
