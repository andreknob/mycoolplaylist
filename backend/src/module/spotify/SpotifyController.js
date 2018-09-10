const SpotifyLogic = require('./SpotifyLogic');
const AbstractController = require('../../core/logic/AbstractController');

class SpotifyController extends AbstractController {

    static get Logic() {
        return SpotifyLogic;
    }

    /**
     * Returns spotify's interface for the user to authenticate.
     */ 
    static authorize(req, res) {
        const response = SpotifyLogic.getAuthorizationURI();
        res.send(response);
    }

    /**
     * Receives spotify's response for the user authentication.
     * @param req has authorization code and the sent state (from the authorize method) on the url query 
     */ 
    static redirect(req, res) {
        const {error} = req.query;
        error ? SpotifyLogic.handleAccessDenied(req.query, this.responseEmitter.bind(this, res)) 
        : SpotifyLogic.handleRedirect(req.query, this.responseEmitter.bind(this, res));
    }
    
    /**
     * A response emitter.
     * @param res the response object (from express' request handler) 
     * @param result the result object (from node's request call) 
     */ 
    static responseEmitter(res, result) {
        if (result.status !== 200) {
            return res.status(result.status).json(result);
        }
        res.redirect(`http://localhost:4200/authenticated/${result.jsonWebToken}`);
    }
}

module.exports = SpotifyController;