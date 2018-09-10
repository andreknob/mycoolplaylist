const express = require('express');
const router = express.Router();
const SpotifyController = require('../module/spotify/SpotifyController');

router.get('/authorize', SpotifyController.authorize.bind(SpotifyController));

router.get('/redirect', SpotifyController.redirect.bind(SpotifyController));

module.exports = router;