const bcrypt = require('bcryptjs')
const jwt = require('jwt-simple')

const { connection, initDatabase } = require('./db.js')
const ServiceError = require('./ServiceError.js')
const {jwtSecret} = require('./config.js')

const saltRounds = 10

function createUser(newUser) {
    return connection.beginTransaction()
        .then(() => connection.query('SELECT login FROM users WHERE login=?', newUser.login))
        .then(([data]) => {
            if (data.length) {
                connection.rollback()
                throw new ServiceError({
                    message: 'User with such login already exists',
                    code: 'INVALID_LOGIN'
                })
            }
            return bcrypt.hash(newUser.password, saltRounds)
                
        })
        .then((hash) => {
            const values = [newUser.login, hash]
            return connection.query('INSERT INTO users(login, password) VALUES(?, ?)', values)
        })
        .then(([result]) => connection.query('SELECT login FROM users WHERE id=?', result.insertId))
        .then(([[loginInfo]]) => {
            return connection.commit().then(()=> dumpLogin(loginInfo))
        })
}

function dumpLogin(dbLogin) {
    return {login: dbLogin.login}
}

function authUser({login, password}) {
    return connection.beginTransaction()
        .then(() => connection.query('SELECT * FROM users WHERE login=?', login))
        .then(([[user]]) => {
            if (!user) {
                connection.rollback()
                throw new ServiceError({
                    message: 'User with such login does not exist',
                    code: 'INVALID_LOGIN'
                })
            }
            return bcrypt.compare(password, user.password)
                .then(result => {
                    if (!result) {
                        connection.rollback()
                        throw new ServiceError({
                            message: 'Invalid Password',
                            code: 'INVALID_PASSWORD'
                        })
                    }
                    return connection.commit().then(() => {
                        return {jwt: jwt.encode({userId: user.id}, jwtSecret)}
                    }) 
                })
                    
        })
        
}

module.exports = { createUser, authUser }