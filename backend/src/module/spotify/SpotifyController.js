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
        const response = SpotifyLogic.getRequestAuthorizationURI();
        res.redirect(response);
    }

    /**
     * Receives spotify's response for the user authentication.
     * @param req has authorization code and the sent state (from the login method) on the url query 
     */ 
    static redirect(req, res) {
        const {error} = req.query;
        const response = error ? SpotifyLogic.handleAccessDenied(req.query) : SpotifyLogic.getRequestAccessURI(req.query);
 
        res.status(response.status).json(response);
    }
}

module.exports = SpotifyController;