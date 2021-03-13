'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriaShema = Schema({
nombreCategoria: String,
productos:[{type: Schema.Types.ObjectId, ref:'producto'}]
});

module.exports = mongoose.model('categoria',categoriaShema);
