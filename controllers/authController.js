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

    // buscaremos el usuario en la base de datos, si no encontramos un usuario
    // o el usuario no está activo, (cada usuario tiene un un estado activo
    // el cual puede estar desactivado o activo)
    const foundUser = await User.findOne({ username }).exec()

    // si el usuario no está activo o no existe, enviaremos este error, no autorizado
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    // si el usuario existe, haremoss coincidir las contraseñas y estamos usando bcrypt para compararlos
    const match = await bcrypt.compare(password, foundUser.password)

    // si no coincide devolveremos un error unathorized
    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    // creamos el token de acceso y estamos usando jwt para crear el token
    // 
    const accessToken = jwt.sign(
        // objeto que tiene informacion del usuario
        {
            "UserInfo": {
                // dentro del objeto tenemos informacion del usuario
                // por lo que esta informacion se está agregando al token jwt de accceso
                // por lo que tendriamos que desestructurar este token de acceso en el front end para usarlo
                // y descifrar toda la informacion
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        // estamos pasando la variable de entorno que tiene la secret key del token
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // expiracion del token
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // la cookie crea una cookie segura junto al refreskToken
    // que acabamos de crear arriba
    // le pasamos jwt a la respuesta y le estamos pasando ese token de actualizacion

    res.cookie('jwt', refreshToken, {
        // configuraciones para que http solo sea accesible
        httpOnly: true, //solo es accesible por un sitio web
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    // devolvemos el token de acceso que contiene username y password
    // el front recibe la token y el servidor la crea
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
// Aca nuestro token de acceso nos dará acceso
const refresh = (req, res) => {
    const cookies = req.cookies // estamos esperando la cookie con la solicitud

    // si no tenemos una cookie llamada jwt como esperamos, que luego envie un res status 401 no autorizado
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    // estableceremos la variable token de actualizacion en esa cookie
    const refreshToken = cookies.jwt

    // usamos nuestra dependencia jwt junto al metodo verify
    jwt.verify(
        refreshToken,
        // pasamos la variable token de actualizacion y llamamos a la variable de entorno
        // refresh token secret
        process.env.REFRESH_TOKEN_SECRET,
        // controlador asincronico con lo que controlaremos los erroress que no esperabamos

        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            // buscaremos si hay un usuario y si tenemos el usuario, dentro del usuario
            // tendriamos que tener el username decodificado
            const foundUser = await User.findOne({ username: decoded.username }).exec()

            // si no tenemos ese usuario pondremos un 401 no autorizado
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            // si no tenemos el la token de usuario, crearemos una nueva
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
    // borraremos la cookie cuando el usuario cierre sesion
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    // exportamos los tres metodos del controlador de autenticacion
    login,
    refresh,
    logout
}