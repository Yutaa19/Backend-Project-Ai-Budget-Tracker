const express = require('express');
const router = express.Router();
const UseController = require('./user.controller');
const asyncErrorHandler = require('../../errors/asyncErrorHandler')
const { idParamValidator, updateUserValidator, createUserValidator } = require('./user.validator')
const validateRequest = require('../../middlewares/validation.middleware')

router.get('/', asyncErrorHandler(UseController.getAll.bind(UseController)));

router.get('/:id',
    idParamValidator,
    validateRequest,
    asyncErrorHandler(
    UseController.getById.bind(UseController)
));

router.post('/', 
    createUserValidator,
    validateRequest,
    asyncErrorHandler(
    UseController.create.bind(UseController)
)); 

router.put('/:id',
    idParamValidator,
    updateUserValidator,
    validateRequest, 
    asyncErrorHandler(
    UseController.update.bind(UseController)
));

router.delete('/:id', 
    idParamValidator,
    validateRequest,
    asyncErrorHandler(UseController.delete.bind(UseController)
));


module.exports = router;