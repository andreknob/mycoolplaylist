const AbstractLogic = require('../../core/logic/AbstractLogic');

const SCOPES = 'user-read-private user-read-email';
const CLIENT_ID = '993e260818e14852b08b78fc9e7055eb';
// @todo build redirect page
const REDIRECT_URI = 'https://google.com';

class SpotifyLogic extends AbstractLogic {

    /**
     * Returns spotify's interface for the user to authenticate.
     * @todo remove hard coded client id, transfer to env variable.
     */ 
    static getLoginURI() {
        return 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
    }

}

module.exports = SpotifyLogic;