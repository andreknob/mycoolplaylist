const express = require('express');
const router = express.Router();
const verifyJWToken = require('../middleware/verifyJWToken.middleware');
const verifyGet = require('../middleware/get.middleware');
const UserController = require('../module/user/UserController');

router.get('/me', verifyJWToken, UserController.get.bind(UserController));

router.get('/:id', verifyGet, UserController.get.bind(UserController));

router.get('/', UserController.list.bind(UserController));

router.post('/', UserController.post.bind(UserController));

router.put('/:id', UserController.put.bind(UserController));

router.delete('/:id', UserController.delete.bind(UserController));

module.exports = router;