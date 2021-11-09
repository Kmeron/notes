const { sequelize } = require('../../db.js')
const { User } = require('../../models/user.js')
const ServiceError = require('../../ServiceError.js')
const Joi = require('joi')

function verifyUser ({ userId }) {
  return sequelize.transaction().then((transaction) => {
    return User.findOne({
      where: {
        id: userId
      }
    }, { transaction })
      .then(user => {
        return User.update({
          status: 'ACTIVE'
        },
        {
          where: {
            id: user.id
          }
        }, { transaction })
      })
      .then(([result]) => {
        if (!result) {
          throw new ServiceError({
            message: 'User has been verified already',
            code: 'VERIFICATION_ERROR'
          })
        }
        return transaction.commit()
      })
      .catch(error => {
        return transaction.rollback()
          .then(() => {
            throw error
          })
      })
  })
}

const validationRules = {
  userId: Joi.number()
    .integer()
    .positive()
    .required()
}

module.exports = { service: verifyUser, validationRules }
