const ServiceError = require('../ServiceError')

function responseToClient(res, promise) {
    promise
        .then(result => {
            console.log(result)
            const data = result?.data? result : {data: result}
            res.send({ok: true, ...data})
        })
        .catch(error => {
            console.warn(error)
            if (error instanceof ServiceError) {
                res
                    .status(400)
                    .send({
                        ok: false,
                        error: { message: error.message, code: error.code }
                    })
            } else {
                res
                    .status(500)
                    .send({
                        ok: false,
                        error: { message: 'Unknown server error', code: 'UNKNOWN_ERROR' }
                    })
            }

        })
}

function makeServiceRunner(service, dumpData) {
    return (req, res) => {
        const payload = dumpData(req, res)

        responseToClient(res, service(payload))
    }
}

function verifyMailSender(service, dumpData) {
    return (req, res) => {
        const payload = dumpData(req, res)

        service(payload)
            .then(() => res.redirect('/authorization'))
            .catch(() => res.send('<html><p>You have already verified your email!</p></html>'))
    }
}

module.exports = {makeServiceRunner, verifyMailSender}