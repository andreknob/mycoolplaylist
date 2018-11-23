const express = require('express');
const router = express.Router();
const verifyJWToken = require('../middleware/verifyJWToken.middleware');
const verifyAccessToken = require('../middleware/verifyAccessToken.middleware');
const SpotifyController = require('../module/spotify/SpotifyController');

router.get('/authorize', SpotifyController.authorize.bind(SpotifyController));

router.get('/redirect', SpotifyController.redirect.bind(SpotifyController));

router.get('/playlistFromTopArtists', verifyJWToken, verifyAccessToken, SpotifyController.getPlaylistFromTopArtists.bind(SpotifyController));

router.get('/playlistFromArtist/:artistId', verifyJWToken, verifyAccessToken, SpotifyController.getPlaylistFromArtist.bind(SpotifyController));

router.post('/createPlaylist', verifyJWToken, verifyAccessToken, SpotifyController.createPlaylist.bind(SpotifyController));

router.get('/search/:searchTerm', verifyJWToken, verifyAccessToken, SpotifyController.search.bind(SpotifyController));

module.exports = router;