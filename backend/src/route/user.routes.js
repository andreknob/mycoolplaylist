const express = require('express');
const router = express.Router();
const verifyTokenMiddleware = require('../middleware/verifyToken.middleware');
const getMiddleware = require('../middleware/get.middleware');
const UserController = require('../module/user/UserController');

router.get('/me', verifyTokenMiddleware, UserController.get.bind(UserController));

router.get('/:id', getMiddleware, UserController.get.bind(UserController));

router.get('/', UserController.list.bind(UserController));

router.post('/', UserController.post.bind(UserController));

router.put('/:id', UserController.put.bind(UserController));

router.delete('/:id', UserController.delete.bind(UserController));

module.exports = router;