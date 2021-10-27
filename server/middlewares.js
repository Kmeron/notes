const jwt = require('jwt-simple')
const {jwtSecret} = require('./config.js')

function checkSession (req, res, next) {
    try {
        const authUser = req.headers.authorization || req.query.token
        const {userId} = jwt.decode(authUser, jwtSecret)
        if(!userId) throw new Error()
        res.locals.userId = userId
        next()
    } catch {
        res.send({
            ok: false,
            error: {message: 'User undefined', code: 'VERIFICATION_ERROR'}
        })
    }
}

module.exports = {
    checkSession
}