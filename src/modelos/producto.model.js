'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productosSchema = Schema({
nombreProducto: String,
stock: Number,
precio: Number,
ventas: Number,
});

module.exports = mongoose.model('productos',productosSchema)