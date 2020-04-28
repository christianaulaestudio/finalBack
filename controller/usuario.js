
var Usuario = require('../models/usuario')
var mongoose = require('mongoose');
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//validacion
const schemaRegister = Joi.object({
    nombre: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['es','com', 'net'] } }),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    repeat_password: Joi.ref('password'),

   
  })
   
   const schemaLogin= Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['es','com', 'net'] } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  })



async function getAll(req,res) {
    try{
        let usuarios = await Usuario.find();
        res.status(200).json({accion:'get all', datos: usuarios}) 
    }catch(err){
        res.status(500).json({accion:'get all', mensaje:'error al obtener los usuarios'}) 
    }

}

async function getById(req,res) {
    let usuarioId = req.params.id;

    try{
        let usuario = await Usuario.findById(usuarioId);
        res.status(200).json({accion:'get one', datos: usuario}) 
    }catch(err){
        res.status(500).json({accion:'get one', mensaje:'error al obtener el usuario'}) 
    }
}


async function login(req, res){
    // Validamos los campos
    try {
        const { error, value } = await schemaLogin.validateAsync(req.body)
    }
    catch (err) { 
        return res.status(400).json({accion:'save', mensaje:'error al validar el login'+err}) 
    }

    // Comprobar que el usuario si existe
    let usuarioExistente = await Usuario.findOne({email:req.body.email})
    if(!usuarioExistente) return res.status(400).json({accion:'save', mensaje:'Error en el usuario/password (pista: el usuario no existe).'}) 
   
   
    // Comprobamos si el password coincide
    const passwordValido = await bcrypt.compare(req.body.password, usuarioExistente.password)
    if(!passwordValido) return res.status(400).json({accion:'save', mensaje:'Error en el usuario/password'}) 
  
    // Creamos el token jwt (jsonwebtoken)  Ver web: https://jwt.io/
    const token = jwt.sign( 
        {
            _id: usuarioExistente._id, 
            exp: Math.floor(Date.now() / 1000) + (60 * 60), //1 hora
            //exp: exp: moment().add(20, "seconds").unix()
        }, 
        process.env.TOKEN_SECRETO )
    res.header('auth-token', token)

    res.status(200).send({token}) 
    
    
}

async function register(req, res){

    // Comprobar que el usuario no existe antes

    try {
        let usuarioExistente = await Usuario.findOne({email:req.body.email})
        if(usuarioExistente) return res.status(400).json({accion:'save', mensaje:'Error en el usuario/password (pista: ya existe el user).'}) 
    }
    catch (err) { 
        return res.status(400).json({accion:'save', mensaje:'Error en el usuario/password'+err}) 
    }
   
    // Creamos el hash del password (nunca debemos guardar el password en texto claro)
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const usuario = new Usuario(req.body)
    usuario.puntuaciones=[]
    usuario.password = hashPassword
    try{
        let usuarioGuardado = await usuario.save();
        res.status(200).json({accion:'save', datos: usuarioGuardado}) 
    }catch(err){
        res.status(500).json({accion:'save', mensaje:'error al guardar el usuario'}) 
    }
    
}




module.exports = {getAll, getById,  register, login}