const AbstractLogic = require('../../core/logic/AbstractLogic');
const UserLogic = require('../user/UserLogic');
const SpotifyStore = require('../spotify/SpotifyStore');
const JsonHelper = require('../../core/helper/JsonHelper');
const https = require("https");
const querystring = require('querystring');

const AUTHORIZATION = {
    SCOPES: 'user-read-private user-read-email',
    // @todo build redirect page
    REDIRECT_URI: 'http://localhost:8080/api/spotify/redirect',
}

const CLIENT = {
    ID: '993e260818e14852b08b78fc9e7055eb',
    SECRET: '',
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
    static getAuthorizationURI() {
        const {SCOPES, REDIRECT_URI} = AUTHORIZATION;
        const stateValue = SpotifyStore.getStateValue();

        return 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + CLIENT.ID +
        (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + stateValue;
    }

    static getAccessToken({code, state}, responseEmitter) {
        if (!SpotifyStore.removeStateValue(state)) {
            return responseEmitter({status: 500, message: 'No corresponding state found on SpotifyStore.'});
        }
        const {REDIRECT_URI} = AUTHORIZATION;

        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        });

        const req = https.request(OPTIONS, res => {
            res.on('data', data => {
                const {
                    access_token: accessToken,
                    scope,
                    expires_in: expires_in,
                    refresh_token: refreshToken
                } = JsonHelper.parse(data);

                this.getSpotifyUserInfo(accessToken, ({status, data, message}) => {
                    if (status !== 200) return responseEmitter({status, message});

                    UserLogic.getBySpotifyId(data.id).then((user) => {
                        if (!user) {
                            // create user, await
                        }
                        // create accessToken and persist, generate jwt token (separate post from generate jwt on UserLogic)
                    });
                });
            });
        });
          
        req.on('error', err => {
            responseEmitter({status: 500, message: err.message});
        });

        req.end(postData);
    }

    static getSpotifyUserInfo(accessToken, callback) {
        const options = {
            host: 'api.spotify.com',
            path: '/v1/me',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        };

        const req = https.request(options, res => {
            res.on('data', data => callback({status: 200, data: JsonHelper.parse(data)}));
        });
          
        req.on('error', err => {
            callback({status: 500, message: err.message});
        });

        req.end();
    }

    static handleAccessDenied({error, state}, responseEmitter) {
        SpotifyStore.removeStateValue(state);
        responseEmitter({status: 401, message: error});
    }
}

module.exports = SpotifyLogic;