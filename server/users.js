const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')

const {sequelize} = require('./db.js')
const { User } = require('./models/user.js')
const ServiceError = require('./ServiceError.js')
const {jwtSecret} = require('./config.js')
const {transportSendMail} = require('./mail')

const saltRounds = 10

function createUser(newUser) {
    console.log(newUser);
    return sequelize.transaction()
        .then(function (transaction) {
            return User.findAll({
                where: {
                    login: newUser.login
                },
            }, {transaction})
            .then((data) => {
                console.log(data);
                if (data.length) {
                    throw new ServiceError ({
                        message: 'User with such login already exists',
                        code: 'INVALID_LOGIN'
                    })
                }
                return bcrypt.hash(newUser.password, saltRounds)
            })
            .then(function (hash) {
                console.log(hash);
                return User.create({
                    login: newUser.login,
                    password: hash,
                    status: 'PENDING'
                }, {transaction})
            })
            .then((user) => {
                console.log(user);
                const token = jwt.encode({userId: user.id}, jwtSecret)
                return transportSendMail({
                    from: 'thonykh21@gmail.com',
                    to: newUser.login,
                    subject: 'Email verification',
                    text: `Hello, to confirm the verification click: http://localhost:3000/authentication?token=${token}`
                })
                .then(() => {
                    return transaction.commit().then(() => ({login: user.login}))
                })
            })
            .catch(error => {
                console.log(error);
                return transaction.rollback()
                    .then(() => { 
                    throw error
                })
            })
        })
}

function verifyUser({userId}) {
    return sequelize.transaction()
        .then((transaction) => {
            return User.findOne({
                where: {
                    id: userId,
                }
            }, {transaction})
            .then(user => {
                return User.update({
                    status: 'ACTIVE',
                },
                {
                    where: {
                        id: user.id
                    }
                }, {transaction})
            })
            .then(([result]) => {
                if(!result) {
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

function authUser({login, password}) {
    return sequelize.transaction()
        .then((transaction) => {
            return User.findAll({
                where: {
                    login
                }
            }, {transaction})
            .then(([user]) => {
                console.log(user)
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
                                return {jwt: jwt.encode({userId: user.dataValues.id}, jwtSecret)}
                            })
                    })
            })
            
        })
}

module.exports = { createUser, authUser, verifyUser }