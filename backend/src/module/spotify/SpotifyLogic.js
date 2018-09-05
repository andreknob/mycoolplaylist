const AbstractLogic = require('../../core/logic/AbstractLogic');
const SpotifyStore = require('../spotify/SpotifyStore');
const https = require("https");
const querystring = require('querystring');

const AUTHORIZATION = {
    SCOPES: 'user-read-private user-read-email',
    // @todo build redirect page
    REDIRECT_URI: 'http://localhost:8080/api/spotify/redirect',
}

const CLIENT = {
}

const OPTIONS = {
    host: 'accounts.spotify.com',
    path: '/api/token',
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + new Buffer(`${CLIENT.ID}:${CLIENT.SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

class SpotifyLogic extends AbstractLogic {

    /**
     * Returns spotify's interface for the user to authenticate.
     * @todo remove hard coded client id, transfer to env variable.
     */ 
    static getRequestAuthorizationURI() {
        const {SCOPES, REDIRECT_URI} = AUTHORIZATION;
        const stateValue = SpotifyStore.getStateValue();

        return 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + CLIENT.ID +
        (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + stateValue;
    }

    static getRequestAccessURI({code, state}, res, responseEmitter) {
        if (!SpotifyStore.removeStateValue(state)) {
            return responseEmitter(res, {status: 500, message: 'No corresponding state found on SpotifyStore.'});
        }
        const {REDIRECT_URI} = AUTHORIZATION;

        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        });

        const req = https.request(OPTIONS, reqResponse => {
            reqResponse.on('data', data => {
                // responseEmitter(res, {status: 200, data: JSON.parse(data.toString())})
                this.getUserInfo(JSON.parse(data.toString()).access_token, res, responseEmitter);
            });
        });
          
        req.on('error', err => {
            responseEmitter(res, {status: 500, message: err.message});
        });

        req.end(postData);
    }

    static handleAccessDenied({error, state}, res, responseEmitter) {
        SpotifyStore.removeStateValue(state);
        responseEmitter(res, {status: 401, message: error});
    }

    static getUserInfo(accessToken, res, responseEmitter) {
        const options = {
            host: 'api.spotify.com',
            path: '/v1/me',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        };

        const req = https.request(options, reqResponse => {
            reqResponse.on('data', data => responseEmitter(res, {status: 200, data: JSON.parse(data.toString())}));
        });
          
        req.on('error', err => {
            responseEmitter(res, {status: 500, message: err.message});
        });

        req.end();
    }
}

module.exports = SpotifyLogic;