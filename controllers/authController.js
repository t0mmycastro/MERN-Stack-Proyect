const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
// asynchandler sirve para detectar error inesperados y pasarlos a nuestro controlador de errores

// @desc Login
// @route POST /auth
// @accesso publico

// Nuestra aplicación API, una vez el usuario se autentique, se le emitirá al cliente un token de acceso y 
// un token de actualización, un token de acceso se otorga poco tiempo antes de que caduque
// token de acceso dura: 5 a 15 minutos y de actualizacion dura horas o dias. Todo esto se enviará como datos JSON
// Las token las almacenaremos en nuestro estado de la aplicación, para que se pierdan automáticamente cuando se cierre la aplicación
// No colocaremos estos tokens de acceso en el almacenamiento local o en las cookies, ya que es vulnerable a hackers

// Se emitiran tokens de actualizacion en una cookie solo de http. No se puede acceder a este tipo de cookie
// Con tokens de actualizacion de js. Luego solicitaremos a los usuarios que inicien sesion nuevamente
// Los tokens de actualización no deberian tener la capacidad de emitir nuevos tokens, ya que eso nos daria tokens indefinido

// El proceso general seria emitir un token de acceso despues de la autenticacion. La aplicación  del usuario puede acceder a las rutas protegidas
// De nuestra API de descanso hasta que caduque, una vez caducada, el api verificará el token con el middleware cada vez que se use el token para realizar una solicitud

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
// Aca nuestro token de acceso nos dará acceso
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists, borraremos las cookies que existan
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}