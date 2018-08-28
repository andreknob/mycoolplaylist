const express = require('express');
const router = express.Router();
const userController = require('../module/user/user.controller');

router.get('/:id', userController.get);

router.get('/', userController.list);

router.post('/', userController.post);

router.put('/:id', userController.put);

router.delete('/:id', userController.delete);

module.exports = router;