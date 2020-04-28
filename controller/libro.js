var Libro = require('../models/libro')


async function getAll(req,res) {
    try{
        let libros = await Libro.find();
        res.status(200).json({accion:'get all', datos: libros}) 
    }catch(err){
        res.status(500).json({accion:'get all', mensaje:'error al obtener los libros'}) 
    }

}

async function getById(req,res) {
    let libroId = req.params.id
    try{
        let libros = await Libro.findById(libroId);
        res.status(200).json({accion:'get all', datos: libros}) 
    }catch(err){
        res.status(500).json({accion:'get all', mensaje:'error al obtener los libros por id '}) 
    }

}

module.exports = {getAll , getById}