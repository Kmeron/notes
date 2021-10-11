const jwt = require('jwt-simple')
const {jwtSecret} = require('./config.js')

function checkSession (req, res, next) {
    const {userId} = jwt.decode(req.headers.authorization, jwtSecret)
    // if(!userId) res.send()
    res.locals.userId = userId
    next()
}

module.exports = {
    checkSession
}