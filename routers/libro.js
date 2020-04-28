var express = require('express');
var router = express.Router();
var controller = require('../controller/libro')


router.get('/',  controller.getAll)
router.get('/:id' , controller.getById)


module.exports = router;