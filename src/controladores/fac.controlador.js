'use strict'
const bcrypt  = require('bcrypt-nodejs');
const jwt = require('../servicios/jwt');
const Usuario = require('../modelos/usuario.model');
const Producto = require('../modelos/producto.model');
const moment = require('moment');
const Factura = require('../modelos/factura.model');

// Crear factura
function crefactura(req, res){
    var idUser = req.params.idUser;
    var factura = new Factura();
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden generar Facturas'})

    Usuario.findOne({'_id':idUser}, (err, UsuarioEncontrado)=>{
        if(err){
        return    res.status(500).send({mensaje:'Error en la peticion'});
        }else if(UsuarioEncontrado){
            if(UsuarioEncontrado.carrito.length>0){
                factura.cliente = UsuarioEncontrado.user;
                var num=0;

                UsuarioEncontrado.carrito.forEach(producto =>{
                    Producto.findOne({'_id':producto._id},(err, ProductoEncontrado)=>{
                        if(err){
                            return res.status(500).send({mensaje:'Error en la peticion'});
                        }else if(ProductoEncontrado){
                            if(ProductoEncontrado.stock>=producto.stock){
                                var facturaProducto = {
                                    nombreProducto:String,
                                    stock:Number,
                                    precio:Number,
                                    monto:Number
                                };
                                facturaProducto._id = ProductoEncontrado._id;
                                facturaProducto.nombreProducto = ProductoEncontrado.nombreProducto;

                                facturaProducto.stock = producto.stock;
                                facturaProducto.precio = ProductoEncontrado.precio;
                                facturaProducto.monto = parseFloat(producto.stock)*parseFloat(ProductoEncontrado.precio);
                                num = num + facturaProducto.monto;
                                factura.total = num;
                                factura.productos.push(facturaProducto);
                                
                                if(UsuarioEncontrado.carrito.indexOf(producto)==UsuarioEncontrado.carrito.length-1){
                                    var fechaFactura = new Date(moment().format('YYYY MM DD'));
                                    factura.fecha = fechaFactura;

                                    factura.save((err, FacturaGuardada)=>{
                                        if(err){
                                            res.status(500).send({mensaje:'Error en la petición'});
                                        }else if(FacturaGuardada){
                                            res.send({facturaCreada:FacturaGuardada});
                                                UsuarioEncontrado.carrito.forEach(producto =>{
                                                    Producto.findOne({'_id':producto._id}, (err, ProductoEncontrado)=>{
                                                        if(err){
                                                            return res.status(500).send({mensaje:'Error en la peticion'});
                                                        }else if(ProductoEncontrado){
                                                            var num = ProductoEncontrado.stock-producto.stock;
                                                            var venta = parseInt(ProductoEncontrado.ventas)+parseInt(producto.stock);
                                                            Producto.findByIdAndUpdate(producto._id,{'stock':num, 'ventas':venta},{new:true},(err, ProductoEncontrado)=>{
                                                                if(err){
                                                                    return res.status(500).send({mensaje:'Error en la peticion'});
                                                                }else if(ProductoEncontrado){
                                                                    if(UsuarioEncontrado.carrito.indexOf(producto)==UsuarioEncontrado.carrito.length-1){
                                                                        var newCarrito = [];
                                                                            Usuario.findByIdAndUpdate(idUser, {'carrito':newCarrito, $push:{'facturas':FacturaGuardada._id}},{new:true},(err, UsuarioActualizado)=>{
                                                                                if(err){
                                                                                    return res.status(500).send({mensaje:'Error en la peticion'});
                                                                                }else if(UsuarioActualizado){
                                                                                }
                                                                            });
                                                                    }
                                                                }else{ return res.send({mensaje:'Algun producto no se encuentra o ha sido eliminado.'});
                                                                }
                                                            });
                                                        }else{  return res.status(404).send({mensaje:'Producto no encontrado.'});
                                                        }
                                                    });
                                                    
                                                });
                                        }else{ return res.send({mensaje:'Error en la creación de la factura'});
                                        }
                                    });
                                }
                            }else{  return res.send({mensaje:'La cantidad que desea supera las existencias en stock'});
                            }
                        }else{ return res.send({mensaje:'Algun producto no se encuentra o ha sido eliminado.'});
                        }
                    });
                });
            }else{  res.send({mensaje:'Cobro Ya Realizado, añada mas productos a su carrito'});
            }

        }else{  res.status(404).send({mensaje:'Usuario no encontrado.'});
        }
    });
}

function lisfactura(req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden listar Facturas'})

    Factura.find({}, (err, facturas)=>{
        if(err){ return  res.status(500).send({mensaje: 'Error en la peticion'});
        }else if(facturas){
            if(facturas.length>0){ return res.send({facturas});
            }else{ return res.send({mensaje:'No se encontraron facturas.'});
            }
        }else{ return res.status(404).send({mensaje: 'No se encontraron facturas.'});
        }
	});
}

function lisfacproductos(req,res){
    let idFactura = req.params.idFactura;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden listar Facturas'})

    Factura.findById(idFactura, (err, FacturasEncontrada)=>{
        if(err){ return res.status(500).send({mensaje : 'Error en la peticion'});
        } else if (FacturasEncontrada){ return res.send({FacturaProductos:FacturasEncontrada.productos});
        } else { return res.status(404).send({ mensaje : 'No se ha encontrado la factura.'});
        }
    })
}


module.exports = {
    crefactura,
    lisfactura,
    lisfacproductos
}