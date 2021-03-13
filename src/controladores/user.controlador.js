'use strict'
const bcrypt  = require('bcrypt-nodejs');
const jwt = require('../servicios/jwt');
const Usuario = require('../modelos/usuario.model');
const Producto = require('../modelos/producto.model');
const Factura = require ('../modelos/factura.model');

// Login 
function login(req, res){
    var params = req.body;

    if(params.user){
        if(params.password){
            Usuario.findOne({$or:[{user:params.user},
                
            ]},(err, usuarioEncontrado)=>{
                if(err){
                    res.status(500).send({mensaje:'Error en la consulta'});
                }else if(usuarioEncontrado){
                    bcrypt.compare(params.password, usuarioEncontrado.password, (err, passwordCorrecta)=>{
                        if(err){
                            res.status(500).send({mensaje:'Error en la peticion de parte del usuario'});
                        }else if(passwordCorrecta){
                                if(usuarioEncontrado.rol == 'ROL_CLIENTE'){
                                    if(params.obtenerToken){
                                        res.send({ user:usuarioEncontrado.user, facturas:usuarioEncontrado.facturas,
                                            token:jwt.createToken(usuarioEncontrado)});
                                    }else{
                                        res.send({user:usuarioEncontrado.user, facturas:usuarioEncontrado.facturas});
                                    }
                                }else{
                                    if(params.obtenerToken){
                                        res.send({user:usuarioEncontrado.user,token:jwt.createToken(usuarioEncontrado)});
                                    }else{
                                        res.send({user:usuarioEncontrado.user});
                                    }
                                }
                        }else{
                            res.send({mensaje:'Usuario no identificado.'});
                        }
                    });
                }else{
                    res.send({mensaje:'Datos ingresados incorrectos.'});
                }
            }).populate('facturas');
        }else{
            res.send({mensaje:'Ingresa tu contraseña.'});
        }
    }else{
        res.send({mensaje:'Ingresa tu usuario'});
    }
}

//funciones cliente

// Cliente Nuevo
    function regcliente(req,res) {
    var usuarioModel = new Usuario;
    var params = req.body;
    var idCliente = req.params.idCliente;

    if (params.user && params.password){
    usuarioModel.user=params.user;
    usuarioModel.rol = "ROL_CLIENTE"
    Usuario.find({user:usuarioModel.user}).exec((err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la consulta'})
    if (usuarioEncontrado && usuarioEncontrado.length >=1 ){
       return res.status(500).send({mensaje:'Cliente ya registrado'})
    }else{
        bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
        usuarioModel.password = passwordEncriptada;
        usuarioModel.save((err, UsuarioGuardado)=>{
            if (err) res.status(500).send({mensaje: 'Error en la consulta'})
            if(usuarioEncontrado){
              return res.status(200).send(UsuarioGuardado);

            }else{
                return res.status(500).send({mensaje: 'Error al guardar'})
            }

                })
            })
        }
        })

}else{
    return res.status(500).send({mensaje: 'Ingrese todos los datos para registrarse'})
    }
}
 
// Editar Perfil
    function editcliente(req, res) {
    var params = req.body;
             
    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Solo tu puedes modificar sus datos'})
               
        Usuario.findByIdAndUpdate(req.user.sub, params, { new: true }, (err, ClienteActualizado)=>{ 
        if(err) return res.status(500).send({mensaje: 'Error en la consulta'});
        if(!ClienteActualizado) return res.status(500).send({ mensaje: 'No se pudo actualizar'})
  
        return res.status(200).send({ ClienteActualizado });
        })
    }

    // Eliminar Perfil
    function elimcliente(req, res) {
    var params = req.body;
             
    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Solo tu pueden borrar tu perfil'})
             
         Usuario.findByIdAndDelete(req.user.sub, (err, ClienteEliminado)=>{
         if(err) return res.status(500).send({ mensaje: 'Error al Eliminar'});
         if(!ClienteEliminado) return res.status(500).send({mensaje: 'Cliente ya eliminado anteriormente'});
           
         return res.status(200).send({ ClienteEliminado});
            })
        }
        
        // Agregar Productos
    function agrecarro(req, res){
    var idUser = req.params.idUser;
    var idProducto = req.params.idProducto;
    var params = req.body;

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje: 'Funcion solo para clientes'})

        if(params.stock){
        Usuario.findOne({'_id': idUser, 'carrito._id':idProducto}, (err, UsuarioEncontrado)=>{
            if(err){
               return res.status(500).send({mensaje:'Error en la peticion.'});
            }else if(UsuarioEncontrado){
                res.send({mensaje:'Producto ya se añadido ante.'});
            }else{
                Producto.findOne({'_id':idProducto},(err, ProductoEncontrado)=>{
                    if(err){
                     return   res.status(500).send({mensaje:'Error en la consulta.'});
                    }else if(ProductoEncontrado){
                        if(ProductoEncontrado.stock>=params.stock){
                            ProductoEncontrado.stock = params.stock;
            
                            Usuario.findOneAndUpdate({'_id':idUser},
                            {$push:{carrito:ProductoEncontrado}},{new:true},(err, UsuarioActualizado)=>{
                                if(err){
                                    res.status(500).send({mensaje:'Error en la consulta'});
                                }else {(UsuarioEncontrado)}{
                                    res.send({AñadididoAcarrito:UsuarioActualizado.carrito});
                                }
                            });
                            }else{
                                res.send({mensaje:'Error supera la cantidad de productos.'});
                            }
                    }else{
                        res.status(404).send({mensaje:'No se encuentra el producto.'});
                    }
                });
            }
        });
       }else{
        res.send({mensaje:'Coloca la cantidad del producto que desea añadir a su carrito.'});
       }
   }

   // Factura Detallada
    function dedtfactura(req, res){
    var idFactura = req.params.idFactura;
    var idUser = req.params.idUser;

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje: 'Funcion disponible para clientes'})

    
        Usuario.findOne({'_id':idUser, 'facturas':idFactura}, (err, UsuarioEncontrado)=>{
            
            if(err){ return  res.status(500).send({mensaje : 'Error en la peticion'});
            }else if(UsuarioEncontrado){
            Factura.findOne({'_id':idFactura}, (err, FacturaEncontrada) =>{
                    if(err){
                        return  res.status(500).send({mensaje : 'Error en la peticion'})
                    }else if(FacturaEncontrada){
                      return  res.send({FacturaEncontrada});
                    }else{
                        res.send({mensaje:'Factura no encontrada'});
                    }
                });
            }else{
            return res.status(404).send({mensaje:'La factura no se ha encontrado en el registro.'});
            }
        });
    }

   // Editar Productos
    function editproductocarro(req, res){
    var idUser=req.params.idUser;
    var idProducto=req.params.idProducto;
    var params = req.body;

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje: 'Funcion disponible'})

        if(params.stock){
            Producto.findOne({'_id':idProducto},(err, ProductoEncontrado)=>{
                if(err){return  res.status(500).send({mensaje:'Error en la peticion'});
                }else if(ProductoEncontrado){
                    if(ProductoEncontrado.stock>=params.stock){
                     Usuario.findOneAndUpdate({'_id':idUser,'carrito._id':idProducto},{'carrito.$.stock':params.stock},{new:true},(err, UsuarioEncontrado)=>{
                        if(err){ return  res.status(500).send({mensaje:'Error en la peticion'});
                        }else if(UsuarioEncontrado){
                        return res.send({CarritoActualizado:UsuarioEncontrado.carrito});
                        }else{ return res.status(404).send({mensaje: 'Cliente inexistente.'});  
                            }
                        }); 
                    }else{ return res.send({mensaje:'Error, cantidad excede la cantidad que se posee'});
                    }
                }else{ return  res.send({mensaje:'producto inexistente.'});
                }
            });
        }else{  res.send({mensaje:'Debe ingresar el campo de cantidad que desea actualizar.'});
        }
    }
    
    function elimproduccarro(req, res){
    var idUser=req.params.idUser;
    var idProducto=req.params.idProducto;

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje: 'Funcion disponible para clientes'})

        Usuario.findOneAndUpdate({'_id':idUser, 'carrito._id':idProducto}, {$pull:{carrito:{_id:idProducto}}}, {new:true},(err, UsuarioActualizado)=>{
            if(err){  return  res.status(500).send({mensaje:'Error en la petición'});
            }else if(UsuarioActualizado){ return res.send({ProductoEliminadoDeCarrito:UsuarioActualizado.carrito});
            }else{ return res.status(404).send({mensaje:'No se encontraron coincidencias.'});
            }
        });
    
}

    // Obtener Id Factura 
    function listaFacturaId(req, res){
    var idUser = req.params.idUser;

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje: 'Funcion disponible para clientes'})

    Usuario.findById({_id: idUser,rol:'ROL_CLIENTE'}, (err,UsuarioEncontrado)=>{
     
        if(err){ return  res.status(500).send({mensaje : 'Error en la consulta'});
        } else if (UsuarioEncontrado){
            if(UsuarioEncontrado.facturas.length > 0){
               return res.send({Facturas: UsuarioEncontrado.facturas});
            } else {  return  res.send({ mensaje : 'No posee facturas a su nombre.'});
            }
        } else { return  res.status(404).send({ mensaje : 'Error en la busqueda de registros'});
        }
    });
}
//Funcion admin

     // Agregar 
    function regnuevousuario(req,res) {
        var usuarioModel = new Usuario();
        var params = req.body;

        if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden hacerlo'})

        if (params.user && params.password && params.rol){
        usuarioModel.user = params.user;
        usuarioModel.rol = params.rol;
       
    
         Usuario.find({user: usuarioModel.user}).exec((err, usuarioEncontrado)=>{
         if (err) return res.status(500).send({mensaje: 'Error en la consulta'});
         if (usuarioEncontrado && usuarioEncontrado.length >=1){
             return res.status(500).send({mensaje: 'Usuario ya registrado'})
         }else{
            if(params.rol =='ROL_ADMIN' | params.rol == 'ROL_CLIENTE'  ){
            bcrypt.hash(params.password,null,null,(err, passwordEncriptada)=>{
              usuarioModel.password = passwordEncriptada;
              usuarioModel.save((err, UsuarioGuardado)=>{
              if(err) return res.status(500).send({mensaje:'Error al guardar los datos'});
              if(UsuarioGuardado){
                  return res.status(200).send(UsuarioGuardado);
              }else{
                  return res.status(500).send({mensaje: 'Error al guardar constraseña'})
                    }
                })
            })
             }else{
                return res.status(500).send({mensaje:'Error Puede ser ROL_ADMIN o ROL_CLIENTE'})
             }
         }             
        })    
    
    }else{
     return res.status(500).send({mensaje:'Ingrese todos los datos para crear un nuevo usuario'});
    }
    }

   //Editar Rol
   function editroles(req,res){
   var idUser = req.params.idUser
   var params = req.body

   if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden hacerlo'})
   
   Usuario.findByIdAndUpdate({_id: idUser, rol: 'ROL_CLIENTE'}, {rol: params.rol}, {new: true, useFindAndModify: false}, (err, RolActualizado)=>{
   if(err) return res.status(500).send({mensaje: 'Error en la consulta'});
   if(!RolActualizado) return res.status(500).send({mensaje: 'Usuario no encontrado o es un usuario tipo admin'});
   return res.status(500).send({ 'Cliente con nuevo Rol': RolActualizado});
   });
}

   // Editar clientes registrado como Admin
   function editarUser(req, res) {
   var idUser = req.params.idUser
   var params = req.body;
    
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admin pueden hacerlo'})
    
    Usuario.findByIdAndUpdate({_id: idUser, rol: 'ROL_CLIENTE'}, {user: params.user},{new: true, useFindAndModify: false}, (err,ClienteActualizado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la consulta'});
    if(!ClienteActualizado) return res.status(500).send({mensaje: 'Cliente no encontrado o es un usuario admin'});
    return res.status(500).send({'Cliente con Nuevo Nombre': ClienteActualizado});
    }); 
   }

   // Eliminar Clientes registrado como Admin 
   function eliminarUser(req,res){
   var idUser = req.params.idUser;
   var params = req.body;

   if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje: 'Solo admin pueden hacerlo'})
   Usuario.findByIdAndDelete({_id: idUser, rol: 'ROL_CLIENTE'}, (err, ClienteEliminado)=>{
   if(err) return res.status(500).send({mensaje: 'Error en la consulta'});
   if(!ClienteEliminado) return res.status(500).send({mensaje: 'Cliente no encontrado o es un usuario admin. '});
   return res.status(500).send({'Cliente Eliminado': ClienteEliminado});   
   });

   }
    
module.exports={
    login,
    regcliente,
    regnuevousuario,
    editcliente,
    elimcliente,
    editarUser,
    editroles,
    agrecarro,
    editproductocarro,
    elimproduccarro,
    listaFacturaId,
    dedtfactura,
    eliminarUser
    }