const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')

const {sequelize} = require('./db.js')
const { User } = require('./models/user.js')
const ServiceError = require('./ServiceError.js')
const {jwtSecret} = require('./config.js')

const saltRounds = 10

function createUser(newUser) {
    return sequelize.transaction()
        .then(function (transaction) {
            return User.findAll({
                where: {
                    login: newUser.login
                },
            }, {transaction})
            .then((data) => {
                if (data.length) {
                    return transaction.rollback()
                        .then(() => {
                            throw new ServiceError ({
                                message: 'User with such login already exists',
                                code: 'INVALID_LOGIN'
                            })
                        })
                }
                return bcrypt.hash(newUser.password, saltRounds)
            })
            .then(function (hash) {
                return User.create({
                    login: newUser.login,
                    password: hash
                }, {transaction})
            })
            .then((data) => {
                return transaction.commit().then(() => ({login: data.login}))
            })
        })
}

function authUser({login, password}) {
    return sequelize.transaction()
        .then((transaction) => {
            return User.findAll({
                where: {
                    login
                }
            }, {transaction})
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
                                return {jwt: jwt.encode({userId: user.dataValues.id}, jwtSecret)}
                            })
                    })
            })
            
        })
}

module.exports = { createUser, authUser }