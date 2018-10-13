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
        res.send(SpotifyLogic.getAuthorizationURI());
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
     * Returns a randomly generated playlist based on the user's top artists. 
     */ 
    static getPlaylistFromTopArtists(req, res) {
        const {accessToken} = req.params;
        SpotifyLogic.getPlaylistFromTopArtists(accessToken, (result) => {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        });
    }
    
    /**
     * A response emitter.
     * @param res the response object (from express' request handler) 
     * @param result the result object (from node's request call) 
     */ 
    static responseEmitter(res, result) {
        if (result.status !== 200) {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        }
        res.redirect(`http://localhost:4200/authenticated/${result.jsonWebToken}`);
    }
}

module.exports = SpotifyController;