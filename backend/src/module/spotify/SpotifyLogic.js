const AbstractLogic = require('../../core/logic/AbstractLogic');
const SpotifyStore = require('../spotify/SpotifyStore');
const http = require("http");

const AUTHORIZATION = {
    SCOPES: 'user-read-private user-read-email',
    CLIENT_ID: '993e260818e14852b08b78fc9e7055eb',
    // @todo build redirect page
    REDIRECT_URI: 'http://localhost:8080/api/spotify/redirect',
}

const OPTIONS = {
    host: 'www.google.com',
    port: 80,
    path: '/upload',
    method: 'POST'
};

var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });
  
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  // write data to request body
  req.write('data\n');
  req.end();

class SpotifyLogic extends AbstractLogic {

    /**
     * Returns spotify's interface for the user to authenticate.
     * @todo remove hard coded client id, transfer to env variable.
     */ 
    static getRequestAuthorizationURI() {
        const {CLIENT_ID, SCOPES, REDIRECT_URI} = AUTHORIZATION;
        const stateValue = SpotifyStore.getStateValue();

        return 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + stateValue;
    }

    static getRequestAccessURI({code, state}) {
        if (!SpotifyStore.removeStateValue(state)) {
            return {status: 500, err: {message: 'No corresponding state found on SpotifyStore.'}};
        }
        return {status: 200, uri: ''};
    }

    static handleAccessDenied({error, state}) {
        SpotifyStore.removeStateValue(state);
        return {status: 401, err: {message: error}};
    }
}

module.exports = SpotifyLogic;