'use strict'
const Producto = require('../modelos/producto.model');
var Categoria = require('../modelos/categoria.model');
//funciones admin
// registra producto
function regproducto(req, res){
    var producto = new Producto();
    var params = req.body;
    var idCategoria = req.params.idCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Administradores pueden registrar Productos'})
    
    if(params.nombreProducto && params.stock && params.precio){
        Producto.findOne({'nombreProducto': params.nombreProducto}, (err, ProductoEncontrado)=>{
            if(err){
               return res.status(500).send({mensaje:'Error en la consulta.'});
            }else if(ProductoEncontrado){
              return  res.status(500).send({mensaje:'Nombre ya usado.'});
            }else{
                Categoria.findOne({'_id':idCategoria},(err, CategoriaEncontrada)=>{
                    if(err){
                        res.status(500).send({mensaje:'Error en la consulta.'});
                    }else if(CategoriaEncontrada){

                        if(params.stock>=0 && params.precio>0){
                            producto.nombreProducto = params.nombreProducto;
                            producto.stock = params.stock;
                            producto.precio = params.precio;
                            producto.ventas = 0;
            
                            producto.save((err, ProductoGuardado)=>{
                                if(err){
                                    res.status(500).send({mensaje:'Error al guardar producto.'});
                                }else if(ProductoGuardado){
                                    
                                    Categoria.findByIdAndUpdate(idCategoria,{$push:{productos:producto._id}},
                                        {new:true},(err, CategoriaActualizada)=>{
                                            if(err){
                                                res.status(500).send({mensaje:'Error al guardar producto.'});
                                            }else if(CategoriaActualizada){
                                                res.send({'Producto Agregado':ProductoGuardado});
                                            }else{
                                                res.status(404).send({mensaje:'Producto no se pudo guardar.'});
                                            }
                                        });
                                }else{
                                    res.status(404).send({mensaje:'Producto no se pudo guardar.'});
                                }
                            });
                        }else{
                            res.send({mensaje:'Precio en valor positivo.'});
                        }
                    }else{
                        res.status(404).send({mensaje:'Categoria no se logro encontrar.'});
                    }
                });
            }
        });
    }else{
        res.send({mensaje
            :'Ingresa datos completos.'});
    }

}


// Editar Productos
function editarProducto(req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden editar'})

    var idProducto = req.params.idProducto;
    var params = req.body;

   delete params.password;

    Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err, ProductoActualizado)=>{ 
    if(err) return status(500).send({mensaje: 'Error en la consulta'});
    if(!ProductoActualizado) return res.status(500).send({ mensaje: 'No se pudo actualizar datos del producto'})
  
    return res.status(200).send({ ProductoActualizado });

    } )
}

// Listar Productos
function listproducto(req,res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden listar.'})

    Producto.find().exec((er, ProductosEncontrados)=>{
       if(er) return res.status(500).send({mensaje: 'Error al listar Productos'});
       if(!ProductosEncontrados) return res.status(500).send({mensaje: 'Erro al obtener Productos'});
       return res.status(200).send({ProductosEncontrados});
    })
}

// Lista por id
function listprodid(req, res){

    var idProducto = req.params.idProducto;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden listar por id'})

    Producto.find({ '_id': idProducto}, (err, ProductoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en consulta" });
        if (!ProductoEncontrado) return res.status(500).send({ mensaje: "Error en la busqueda por id" });
        return res.status(200).send({ ProductoEncontrado });
    })
}
               
// Eliminar producto0
function elimproducto(req, res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden eliminar productos'})
        var idProducto = req.params.idProducto;
        Producto.findByIdAndRemove(idProducto, (err, productoEliminado)=>{
        if(err){
        res.status(500).send({mensaje: 'Error en la peticion'});
        }else if(productoEliminado){
            Categoria.findOneAndUpdate({'productos':idProducto}, {$pull:{productos:idProducto}},{new:true},(err, categoriaActualizada)=>{
            if(err){
            res.status(500).send({mensaje: 'Error en la peticion'});
    }else if(categoriaActualizada){
    res.send({productoEliminado:productoEliminado});
    }else{
    res.send({mensaje:'No se elimino el producto.'});
    }
    });
    }else{
    res.status(404).send({mensaje: 'Producto Ya eliminado.'});  
    }
    });
}
// Producto más vendido
function promasvendido(req,res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'solo los admins pueden ver los productos mas vendidos'})


    Producto.find({ventas: {$gt: 0}},(err,ProductosMasVendidos)=>{
        if(err){ return  res.status(500).send({mensaje : 'Error en el servidor'});
        } else if (ProductosMasVendidos){ return res.send({ProductosMasVendidos});
        } else { return res.status(404).send({ mensaje : 'No hay productos que ver.'});
        }
    }).sort({ventas:-1}).limit(10);
}

// Productos agotado
function agotproducto(req,res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'solo los admins pueden verificar los productos Agotados'})

    Producto.find({ stock: 0}, (err,ProductosAgotados)=>{
        if(err){  return  res.status(500).send({mensaje : 'Error en la consulta'});
        } else if (ProductosAgotados){
            if(ProductosAgotados.length > 0){ return res.send({ProductosAgotados});
            } else {  res.send({mensaje : 'No hay productos agotados.'});
            }
        } else {
            return res.status(404).send({mensaje : 'No hay productos que mostrar.'});
        }   
    })
}

function lisnomproductoad(req, res){
    var nombreProducto = req.params.nombreProducto;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Inicia Sesion como Admin para buscar productos por nombre'})

    Producto.find({ 'nombreProducto': nombreProducto}, (err, ProductoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en consulta" });
        if (!ProductoEncontrado) return res.status(500).send({ mensaje: "Error al busquedar por nombre" });
        return res.status(200).send({ ProductoEncontrado });
    })
}

//Funciones cliente

//listar por nombre del producto
function lisnomproduc(req, res){
    var nombreProducto = req.params.nombreProducto;
    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Inicia sesion para ver productos por nombre'})

    Producto.find({ 'nombreProducto': nombreProducto}, (err, ProductoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en consulta" });
        if (!ProductoEncontrado) return res.status(500).send({ mensaje: "Error al busquedar por nombre" });
        return res.status(200).send({ ProductoEncontrado });
    })
}


function liscatacategoria(req, res){
    var idCategoria = req.params.idCategoria;

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Inicia Sesion  para ver el Catalago De '})

    Categoria.find({ '_id': idCategoria}, (err, CategoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la consulta" });
        if (!CategoriaEncontrada) return res.status(500).send({ mensaje: "Error en la busqueda por id" });
        return res.status(200).send({ CategoriaEncontrada });
    })
}


// Productos agotados.
function producagotado(req,res){
    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Inicia Sesion paraara ver si Hay productos Agotados'})

    Producto.find({ stock: 0}, (err,ProductosAgotados)=>{
        if(err){
          return  res.status(500).send({mensaje : 'Error en la consulta'});
        } else if (ProductosAgotados){
            
            if(ProductosAgotados.length > 0){
                return res.send({ProductosAgotados});
            } else {
                res.send({mensaje : 'Por el momento no hay productos agotados.'});
            }
        } else {
            return res.status(404).send({mensaje : 'Error no hay productos que mostrar.'});
        }   
    })
}

// Productos Más vendidos
function prodmasvendido(req,res){
    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Inicia Sesion para ver los productos mas'})


    Producto.find({ventas: {$gt: 0}},(err,ProductosMasVendidos)=>{
        if(err){
            res.status(500).send({mensaje : 'Error'});
        } else if (ProductosMasVendidos){
            res.send({ProductosMasVendidos});
        } else {
            res.status(404).send({ mensaje : 'No hay nada que mostrar.'});
        }
    }).sort({ventas:-1}).limit(10);
}



module.exports={
regproducto,
listproducto,
listprodid,
editarProducto,
elimproducto,
lisnomproductoad,
lisnomproduc,
promasvendido,
agotproducto,
producagotado,
prodmasvendido,
liscatacategoria,



}