const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')
const Joi = require('joi')

const { sequelize } = require('../../db.js')
const { User } = require('../../models/user.js')
const ServiceError = require('../../ServiceError.js')
const { jwtSecret, saltRounds } = require('../../config.js')
const { transportSendMail } = require('../../mail.js')

async function createUser (newUser) {
  const transaction = await sequelize.transaction()

  try {
    const data = await User.findAll({
      where: {
        email: newUser.email
      }
    }, { transaction })

    if (data.length) {
      throw new ServiceError({
        message: 'User with such login already exists',
        code: 'INVALID_LOGIN'
      })
    }
    const hash = await bcrypt.hash(newUser.password, saltRounds)

    const user = await User.create({
      email: newUser.email,
      password: hash,
      status: 'PENDING'
    }, { transaction })

    const token = jwt.encode({ userId: user.id }, jwtSecret)

    await transportSendMail({
      from: 'thonykh21@gmail.com',
      to: newUser.email,
      subject: 'Email verification',
      text: `Hello, to confirm the verification click: http://localhost:3000/api/v1/authentication?token=${token}`
    })
    await transaction.commit()
    return { email: user.email }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
// return sequelize.transaction().then(function (transaction) {
//   return User.findAll({
//     where: {
//       email: newUser.email
//     }
//   }, { transaction })
//     .then((data) => {
//       if (data.length) {
//         throw new ServiceError({
//           message: 'User with such login already exists',
//           code: 'INVALID_LOGIN'
//         })
//       }
//       return bcrypt.hash(newUser.password, saltRounds)
//     })
//     .then(function (hash) {
//       return User.create({
//         email: newUser.email,
//         password: hash,
//         status: 'PENDING'
//       }, { transaction })
//     })
//     .then((user) => {
//       const token = jwt.encode({ userId: user.id }, jwtSecret)
//       return transportSendMail({
//         from: 'thonykh21@gmail.com',
//         to: newUser.email,
//         subject: 'Email verification',
//         text: `Hello, to confirm the verification click: http://localhost:3000/api/v1/authentication?token=${token}`
//       })
//         .then(() => {
//           return transaction.commit().then(() => ({ email: user.email }))
//         })
//     })
//     .catch(error => {
//       console.log(error)
//       return transaction.rollback()
//         .then(() => {
//           throw error
//         })
//     })
// })

const validationRules = {
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),

  password: Joi.string()
    .required()
}

module.exports = { service: createUser, validationRules }
