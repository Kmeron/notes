const jwt = require('jwt-simple')
const {jwtSecret} = require('./config.js')

function checkSession (req, res, next) {
    try {
        const {userId} = jwt.decode(req.headers.authorization, jwtSecret)
        if(!userId) throw new Error()
        res.locals.userId = userId
        next()
    } catch {
        res.send({
            ok: false,
            error: {message: 'User undefined', code: 'AUTHORIZATION_ERROR'}
        })
    }
}

module.exports = {
    checkSession
}