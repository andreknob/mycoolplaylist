const express = require('express');
const router = express.Router();
const userController = require('../module/user/user.controller');

router.get('/get/:id', userController.get);

router.get('/list', userController.list);

router.post('/post', userController.post);

router.put('/put/:id', userController.put);

router.delete('/delete/:id', userController.delete);

module.exports = router;