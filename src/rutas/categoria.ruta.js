'use strict'
const express = require('express');
const categoriaControlador = require('../controladores/cat.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

api.post('/regcategoria',md_autentication.ensureAuth,categoriaControlador.regcategoria);
api.put('/editcategoria/:idCategoria',md_autentication.ensureAuth,categoriaControlador.editcategoria);
api.get('/liscategoria',md_autentication.ensureAuth,categoriaControlador.liscategoria);
api.get('/liscatid/:idCategoria',md_autentication.ensureAuth,categoriaControlador.liscatid);
api.get('/lisnomcategoria/:nombreCategoria',md_autentication.ensureAuth,categoriaControlador.lisnomcategoria);

api.delete('/elimcategoria/:idCategoria', md_autentication.ensureAuth,categoriaControlador.elimcategoria);


module.exports = api;