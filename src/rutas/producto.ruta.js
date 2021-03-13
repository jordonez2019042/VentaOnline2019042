'use strict'
const express = require('express');
const productoControlador = require('../controladores/prod.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

//Admin
api.post('/regproducto/:idCategoria',md_autentication.ensureAuth,productoControlador.regproducto);
api.get('/listproducto',md_autentication.ensureAuth,productoControlador.listproducto);
api.get('/listprodid/:idProducto',md_autentication.ensureAuth,productoControlador.listprodid);
api.get ('/lisnomproductoad/:nombreProducto',md_autentication.ensureAuth,productoControlador.lisnomproductoad);
api.put('/editarProducto/:idProducto', md_autentication.ensureAuth,productoControlador.editarProducto);
api.delete('/elimproducto/:idProducto', md_autentication.ensureAuth,productoControlador.elimproducto);
api.get('/promasvendido', md_autentication.ensureAuth,productoControlador.promasvendido);
api.get('/agotproducto', md_autentication.ensureAuth,productoControlador.agotproducto);


//Cliente
api.get ('/liscatacategoria/:idCategoria',md_autentication.ensureAuth,productoControlador.liscatacategoria);
api.get ('/lisnomproduc/:nombreProducto',md_autentication.ensureAuth,productoControlador.lisnomproduc);
api.get('/producagotado', md_autentication.ensureAuth,productoControlador.producagotado);
api.get('/prodmasvendido', md_autentication.ensureAuth,productoControlador.prodmasvendido);
module.exports = api;