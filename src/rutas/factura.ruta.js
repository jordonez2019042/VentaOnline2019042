'use strict'
const express = require('express');
const facturaControlador = require('../controladores/fac.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

api.post('/crefactura/:idUser',md_autentication.ensureAuth,facturaControlador.crefactura);
api.get('/lisfactura',md_autentication.ensureAuth,facturaControlador.lisfactura);
api.get('/lisfacproductos/:idFactura',md_autentication.ensureAuth,facturaControlador.lisfacproductos);

module.exports = api;