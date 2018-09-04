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
        'Authorization': 'Basic ' + CLIENT.B64,
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

    static getRequestAccessURI({code, state}) {
        if (!SpotifyStore.removeStateValue(state)) {
            return {status: 500, message: 'No corresponding state found on SpotifyStore.'};
        }
        const {REDIRECT_URI} = AUTHORIZATION;

        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        });

        const req = https.request(OPTIONS, res => {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.on('data', chunk => {
                console.log('RESPONSE BODY: ' + chunk);
            });
          });
          
          req.on('error', e => {
            console.log('Problem with request: ' + e.message);
          });
          
          req.end(postData);

        return {status: 200, msg: req.body};
    }

    static handleAccessDenied({error, state}) {
        SpotifyStore.removeStateValue(state);
        return {status: 401, err: {message: error}};
    }
}

module.exports = SpotifyLogic;