const { sequelize } = require('../../db.js')
const { User } = require('../../models/user.js')
const ServiceError = require('../../ServiceError.js')
const Joi = require('joi')

async function verifyUser ({ userId }) {
  const transaction = await sequelize.transaction()

  try {
    const user = await User.findOne({
      where: {
        id: userId
      },
      transaction
    })

    const [result] = await User.update({
      status: 'ACTIVE'
    }, {
      where: {
        id: user.id
      },
      transaction
    })

    if (!result) {
      throw new ServiceError({
        message: 'User has been verified already',
        code: 'VERIFICATION_ERROR'
      })
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const validationRules = {
  userId: Joi.number()
    .integer()
    .positive()
    .required()
}

module.exports = { service: verifyUser, validationRules }
