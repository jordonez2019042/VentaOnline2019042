'use strict'
const Categoria = require('../modelos/categoria.model');
//Registra
function regcategoria(req,res) {
    var categoria = new Categoria;
    var params = req.body;
    
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo Adminis pueden registrar categorias'})

    if(params.nombreCategoria){
        Categoria.findOne({nombreCategoria:params.nombreCategoria},(err, categoriaEncontrada)=>{
            if(err){
                return  res.status(500).send({mensaje:'Error en la consulta'});
            }else if(categoriaEncontrada){
                return  res.send({mensaje:'Categoria ya creada'});
            }else{
                categoria.nombreCategoria = params.nombreCategoria;

                categoria.save((err, CategoriaGuardada)=>{
                    if(err){
                        return  res.status(500).send({mensaje:'Error al guardar la categoria'});
                    }else if(CategoriaGuardada){
                        return  res.send({CategoriaGuardada});
                    }else{
                        return   res.status(404).send({mensaje:'Categoria no guardada.'});
                    }
                });
            }
        });
    }else{
        return res.send({mensaje:'Ingrese nombre para categoria.'});
    }
}

// Edita
function editcategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var params = req.body;

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo adminis pueden editar'})
       delete params.password;
    
        Categoria.findByIdAndUpdate(idCategoria, params, { new: true }, (err, CategoriaActualizada)=>{ 
        if(err) return status(500).send({mensaje: 'Error en la consulta'});
        if(!CategoriaActualizada) return res.status(500).send({ mensaje: 'No se pudo actualizar'})
      
        return res.status(200).send({ CategoriaActualizada });
        } )
    }
    
// Lista r
function liscategoria(req,res) {

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden listar'})

    Categoria.find().exec((er, CategoriasEncontradas)=>{
       if(er) return res.status(500).send({mensaje: 'Error al listar categorias encontradsa'});
       if(!CategoriasEncontradas) return res.status(500).send({mensaje: 'Error al conseguir categoria'});
       return res.status(200).send({CategoriasEncontradas});
    })
 
}
// Lista Categoria/Id
function liscatid(req, res){

    var idCategoria = req.params.idCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden lista las categorias por id'})

    Categoria.find({ '_id': idCategoria}, (err, CategoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error" });
        if (!CategoriaEncontrada) return res.status(500).send({ mensaje: "Error en la busqueda de id" });
        return res.status(200).send({ CategoriaEncontrada });
    })
}

// Eliminra
function elimcategoria(req, res){
    var idCategoria = req.params.idCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden eliminar categoria'})

    Categoria.findOne({'_id':idCategoria, nombreCategoria:'default'}, (err, categoriaEncontrada)=>{
    if(err){
    return res.status(500).send({mensaje: 'Error al buscar categoria'});
        }else if(categoriaEncontrada){
            res.send({mensaje:'No es posible eliminar la categoria por defecto.'});
        }else{
        Categoria.findByIdAndRemove(idCategoria, (err, categoriaEliminada)=>{
            if(err){
            res.status(500).send({mensaje: 'Error general'});
             }else if(categoriaEliminada){
             Categoria.findOneAndUpdate({nombreCategoria:'default'}, {$push:{productos:categoriaEliminada.productos}},{new:true},(err, categoriaEncontrada)=>{
                if(err){
                   res.status(500).send({mensaje: 'Error general'});
                    }else if(categoriaEncontrada){
                    res.send({categoriaEliminada:categoriaEliminada});
                    }else{
                    res.status(404).send({mensaje: 'Error categoria no encontrada.'});
                            }
                        });
                    }else{
                        res.status(404).send({mensaje: 'Categoria inexistente.'});  
                    }
                });
        }
    });
}
// Listar Nombre Categoria
function lisnomcategoria(req, res){
    var nombreCategoria = req.params.nombreCategoria;
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Solo admins pueden listasr por nombre'})
    Categoria.find({ 'nombreCategoria': nombreCategoria}, (err, CategoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en connsulta" });
        if (!CategoriaEncontrada) return res.status(500).send({ mensaje: "Error en la consulta de nombre" });
        return res.status(200).send({ CategoriaEncontrada });
    })
}

module.exports={
    regcategoria,
    editcategoria,
    liscategoria,
    liscatid,
    elimcategoria,
    lisnomcategoria
}
