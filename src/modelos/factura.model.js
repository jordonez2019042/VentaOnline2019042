'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = Schema({
fecha: Date,
cliente: String,

productos:[{
    nombreProducto: String,
    stock: Number,
    precio: Number,
    monto: Number
}],
total: Number

});
module.exports = mongoose.model('factura', facturaSchema);