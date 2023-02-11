// Comenzaremos definiendo el limite de velocidad
const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

// Estamos creando un limitador de inicio de sesion con el rateLimit
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, // Limita a 5 solicitudes de inicio de sesión por ventana por minuto
    message:
        { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter
