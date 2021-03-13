'use strict'
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

const usuario_ruta = require("./src/rutas/usuario.rutas");
const categoria_ruta = require('./src/rutas/categoria.ruta');
const producto_ruta = require('./src/rutas/producto.ruta');
const factura_ruta = require('./src/rutas/factura.ruta');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());
app.use('/api',usuario_ruta,  categoria_ruta,  producto_ruta, factura_ruta);

module.exports = app;