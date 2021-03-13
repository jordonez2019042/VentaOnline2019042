'use strict'
const express = require('express');
const usuarioControlador = require('../controladores/user.controlador');
const md_autentication = require('../middlewares/authenticated');

const api = express.Router();

//Login
api.post('/login', usuarioControlador.login );

//Admin
api.post('/regnuevousuario',md_autentication.ensureAuth,usuarioControlador. regnuevousuario);
api.put('/editarUser/:idUser',md_autentication.ensureAuth,usuarioControlador.editarUser);
api.delete('/eliminarUser/:idUser', md_autentication.ensureAuth, usuarioControlador.eliminarUser);
api.put('/editroles/:idUser', md_autentication.ensureAuth,usuarioControlador.editroles);

//Cliente
api.post('/regcliente',usuarioControlador.regcliente );
api.put('/editcliente',md_autentication.ensureAuth, usuarioControlador.editcliente);
api.delete('/elimcliente',md_autentication.ensureAuth,usuarioControlador.elimcliente);
api.put('/agrecarro/:idUser/:idProducto',md_autentication.ensureAuth, usuarioControlador.agrecarro);
api.put('/editproductocarro/:idUser/:idProducto', md_autentication.ensureAuth,usuarioControlador.editproductocarro);
api.delete('/elimproduccarro/:idUser/:idProducto', md_autentication.ensureAuth,usuarioControlador.elimproduccarro);
api.get('/listaFacturaId/:idUser',md_autentication.ensureAuth, usuarioControlador.listaFacturaId);
api.get('/dedtfactura/:idUser/:idFactura', md_autentication.ensureAuth,usuarioControlador.dedtfactura);

module.exports = api;