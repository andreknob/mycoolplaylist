const express = require('express');
const router = express.Router();
const getMiddleware = require('../middleware/getMiddleware');
const UserController = require('../module/user/UserController');

router.get('/:id', getMiddleware, UserController.get.bind(UserController));

router.get('/', UserController.list.bind(UserController));

router.post('/', UserController.post.bind(UserController));

router.put('/:id', UserController.put.bind(UserController));

router.delete('/:id', UserController.delete.bind(UserController));

module.exports = router;