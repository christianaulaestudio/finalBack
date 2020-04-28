var express = require('express');
var router = express.Router();
var controller = require('../controller/usuario')
var verify = require('./verifyToken')

router.get('/',  controller.getAll)
router.get('/:id', controller.getById)
router.post('/register', controller.register)
router.post('/login', controller.login)




module.exports = router;