const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500
// Asignamos el puerto

app.use(logger)

// Cors es para que no hayan problemas al hacer consultas a la API
app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))
// Asiganmos la carpeta principal

app.use('/', require('./routes/root'))
// Ruta principañ

// Si un request no existe, lo enviamos a la pagina 404.html error
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Error'})
    } else {
        res.type('txt').send('404 Error')
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))