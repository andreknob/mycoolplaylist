const SpotifyLogic = require('./SpotifyLogic');
const AbstractController = require('../../core/logic/AbstractController');

class SpotifyController extends AbstractController {

    static get Logic() {
        return SpotifyLogic;
    }

    /**
     * Returns spotify's interface for the user to authenticate.
     */ 
    static login(req, res) {
        let response = SpotifyLogic.getLoginURI();
        res.redirect(response);
    }
}

module.exports = SpotifyController;