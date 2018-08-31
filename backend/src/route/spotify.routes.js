const express = require('express');
const router = express.Router();
const SpotifyController = require('../module/spotify/SpotifyController');

router.get('/login', SpotifyController.login.bind(SpotifyController));


module.exports = router;