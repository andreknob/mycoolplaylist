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
     * Returns spotify's top artists/tracks for an user.
     * @param req has the returning object type (artist/track) in the params 
     */ 
    static top(req, res) {
        const {accessToken, type} = req.params;
        SpotifyLogic.getTop(accessToken, type, (result) => {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        });
    }
    
    /**
     * Returns an artist's related artists.
     * @param req has the artist's id in the params 
     */ 
    static getRelatedArtists(req, res) {
        const {accessToken, artistId} = req.params;
        SpotifyLogic.getRelatedArtists(accessToken, artistId, (result) => {
            const {status, ...rest} = result;
            res.status(status).json({...rest});
        });
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