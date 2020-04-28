var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan')
var cors = require('cors')
const dotenv = require('dotenv'); // Para las variables de entorno
dotenv.config();
const routerLibro= require('./routers/libro')
const routerUsuario= require('./routers/usuario')


var app = express();
// Preparo body parser para que transforme las peticiones de texto a json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.use(morgan('dev'))

app.use('/libro' , routerLibro)
app.use('/usuario' , routerUsuario)



const run = async () => {
    await mongoose.connect(process.env.URL_BASEDATOS, { useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true })
    await app.listen(process.env.PUERTO_SERVIDOR)
    console.log("Servidor y base de datos arrancados")
}

run().catch(err => console.log('Fallo al arrancar:' + err))