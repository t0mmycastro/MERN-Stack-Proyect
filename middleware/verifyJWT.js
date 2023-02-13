const jwt = require('jsonwebtoken')


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    // va a buscar la autorizacion de los headers en a minuscula y A mayuscula
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    // obtenemos el token al dividir la misma cadena del header que estamos viendo arriba
    const token = authHeader.split(' ')[1]

    // le pasamos el token al verify
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET, // la access token secret
        (err, decoded) => {
            // si tenemos un errror...
            if (err) return res.status(403).json({ message: 'Forbidden' })
            // decodifcamos la informacion
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles
            next() // pasamos al controlador
        }
    )
}

module.exports = verifyJWT