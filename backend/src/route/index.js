const express = require('express');
const router = express.Router();
const spotifyRouter = require('./spotify.routes');
const userRouter = require('./user.routes');

router.use('/spotify', spotifyRouter);
router.use('/user', userRouter);

module.exports = router;
