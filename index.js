'use strict'
const mongoose = require("mongoose");
const app = require('./app');
const Usuario = require('./src/modelos/usuario.model');
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ProyectoFinal',{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
   
    var user1 = 'ADMIN';
    var password = '123456';
    var rol = 'ROL_ADMIN';
   
    var usuarioModel = new Usuario(); 
    
    usuarioModel.user = user1;
    usuarioModel.rol = rol;
    
    Usuario.find({ user: usuarioModel.user }).exec((err, usuariosEncontrados)=>{
      if(usuariosEncontrados && usuariosEncontrados.length ==1){
          return console.log('Administrador creado con anterioridad');
      }else{
        bcrypt.hash(password, null,null, (err,passwordEncriptada)=>{
            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuariosEncontrados)=>{
            if(err) return res.status(500).send({mensaje: 'Imposible guardar administrador'})
            if(usuariosEncontrados){
             return console.log(usuariosEncontrados);
            }else{
              return res.status(500).send({ mensaje: 'Administrador no registrado'})
            }
          })
        })
      }
    })
      
    app.listen(3000, function(){
        console.log('El servidor esta arrancando en el puerto: 3000')
    })
    
}).catch(err => console.log(err))
