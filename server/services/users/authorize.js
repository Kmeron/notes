const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const Joi = require('joi')

const { sequelize } = require('../../db.js')
const { User } = require('../../models/user.js')
const ServiceError = require('../../ServiceError.js')
const { jwtSecret } = require('../../config.js')

async function authUser ({ email, password }) {
  const transaction = await sequelize.transaction()

  try {
    const user = await User.findOne({
      where: {
        email
      },
      transaction
    })

    if (!user) {
      throw new ServiceError({
        message: 'User with such login does not exist',
        code: 'INVALID_LOGIN'
      })
    }

    if (user.status === 'PENDING') {
      throw new ServiceError({
        message: 'Please verify your email',
        code: 'VERIFICATION ERROR'
      })
    }

    const result = await bcrypt.compare(password, user.password)

    if (!result) {
      throw new ServiceError({
        message: 'Invalid Password',
        code: 'INVALID_PASSWORD'
      })
    }

    await transaction.commit()
    return { jwt: jwt.encode({ userId: user.id }, jwtSecret) }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const validationRules = {
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),

  password: Joi.string()
    .required()
}

module.exports = { service: authUser, validationRules }
