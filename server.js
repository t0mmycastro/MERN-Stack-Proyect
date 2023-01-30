const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500
// Asignamos el puerto

app.use(express.json())

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

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))