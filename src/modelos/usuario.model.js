'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
user: String,
password: String,
rol: String,

carrito:[{
nombreProducto: String,
stock: Number,
precio: Number,

}],
facturas:[{type: Schema.Types.ObjectId, ref: 'factura'}]

});

module.exports = mongoose.model('Usuarios', UsuarioSchema)