const UserLogic = require('../user/UserLogic');
const AccessTokenLogic = require('./access-token/AccessTokenLogic');
const SpotifyStore = require('../spotify/SpotifyStore');
const JsonHelper = require('../../core/helper/JsonHelper');
const querystring = require('querystring');
const https = require("https");

const METHODS = {
    GET: 'GET',
    POST: 'POST'
}

const AUTHORIZATION = {
    SCOPES: 'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private',
    REDIRECT_URI: 'http://localhost:8080/api/spotify/redirect',
}

const OPTIONS = {
    host: 'accounts.spotify.com',
    path: '/api/token',
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};
// @todo encapsular métodos genéricos em outra classe
class SpotifyLogic {

    /**
     * @returns spotify's interface for the user to authenticate.
     */ 
    static getAuthorizationURI() {
        const {SCOPES, REDIRECT_URI} = AUTHORIZATION;
        const stateValue = SpotifyStore.getStateValue();

        return 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.CLIENT_ID +
        (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + stateValue;
    }

    /**
     * Method to handle the redirect executed by the accounts.spotify's authorize endpoint.
     * @param object obj containing the authorization code and state previously sent to the endpoint.
     * @param function the method to emit the response.
     */
    static handleRedirect({code, state}, responseEmitter) {
        if (!SpotifyStore.removeStateValue(state)) {
            return responseEmitter({status: 500, message: 'No corresponding state found on SpotifyStore.'});
        }

        this.requestAccessToken(code, responseEmitter);
    }

    /**
     * Method to request an accessToken to the accounts.spotify's api/token endpoint.
     * @param string the authorization code.
     * @param function the method to emit the response.
     */ 
    static requestAccessToken(code, responseEmitter, userId, isRefresh = false) {
        const {REDIRECT_URI} = AUTHORIZATION;

        const postData = querystring.stringify(
            isRefresh ? {
                grant_type: 'refresh_token',
                refresh_token: code,
            } : {
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
            }
        );

        const now = Date.now();
        const req = https.request(OPTIONS, res => {
            res.on('data', this._handleAccessTokenResponse.bind(this, responseEmitter, now, userId));
        });
          
        req.on('error', err => responseEmitter({status: 500, message: err.message}));

        req.end(postData);
    }

    /**
     * Creates/updates an accessToken and creates a new user if it doesn't exist yet.
     * @param function the method to emit the response (in success, emits a new jsonWebToken).
     * @param long the date (in ms) right before the request.
     * @param object the response data containing the accessToken.
     */ 
    static _handleAccessTokenResponse(responseEmitter, now, userId, data) {
        const accessTokenObj = JsonHelper.parse(data);

        if (accessTokenObj.error) {
            return responseEmitter({status: 500, message: accessTokenObj.error_description});
        }

        this.getSpotifyUserInfo(accessTokenObj.access_token, async ({status, spotifyUser, message}) => {
            if (status !== 200) return responseEmitter({status, message});

            try {
                let jsonWebToken;
                if (!userId) {
                    userId = await UserLogic.getBySpotifyId(spotifyUser.id);
                }

                if (!userId) {
                    const {jwtToken, user: {_id: createdId}} = await UserLogic.createUserFromSpotifyUser(spotifyUser);
                    jsonWebToken = jwtToken;

                    await AccessTokenLogic.post(accessTokenObj, createdId, now);
                } else {
                    jsonWebToken = UserLogic.generateJWT(userId);

                    await AccessTokenLogic.putByUserId(accessTokenObj, userId, now);
                }

                responseEmitter({status, jsonWebToken, accessToken: accessTokenObj.access_token});
            } catch (err) {
                responseEmitter(err.status ? err : {status: 500, message: err.message});
            }
        });
    }

    /**
     * Gets the spotify user's info.
     * @param string the spotify's generated access token for some user.
     * @param function a function to be called back with the user's info.
     */
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
            res.on('data', data => callback({status: 200, spotifyUser: JsonHelper.parse(data)}));
        });
          
        req.on('error', err => {
            callback({status: 500, message: err.message});
        });

        req.end();
    }

    /**
     * Gets the top artists/tracks for an user.
     * @param type the returning object type (artist/track)
     * @param function a function to be called back with the user's info.
     */
    static getTop(accessToken, type, callback) {
        const path = `/v1/me/top/${type}?limit=15`;
        const options = this._getCommonOptions(accessToken, path, METHODS.GET);

        this._commonRequest(options, callback);
    }

    /**
     * Gets an artist's related artists.
     * @param function a function to be called back with the info.
     */
    static getRelatedArtists(accessToken, artistId, callback) {
        const path = `/v1/artists/${artistId}/related-artists`;
        const options = this._getCommonOptions(accessToken, path, METHODS.GET);

        this._commonRequest(options, callback);
    }

    /**
     * Gets an artist's top tracks.
     */
    static getTopTracksByArtist(accessToken, artistId, callback) {
        const path = `/v1/artists/${artistId}/top-tracks?market=from_token`;
        const options = this._getCommonOptions(accessToken, path, METHODS.GET);

        this._commonRequest(options, callback);
    }

    /**
     * Returns a randomly generated playlist based on the user's top artists.
     * @param String the access token.
     * @param function a function to be called back with the info.
     */
    static async getPlaylistFromTopArtists(accessToken, callback) {
        try {
            const {data: {items: topArtists}} = await this._promiseCall(this.getTop.bind(this, accessToken, 'artists'));
            const playlistArtists = [];
            let promises = [];

            topArtists.forEach(artist => promises.push(this._promiseCall(this.getRelatedArtists.bind(this, accessToken, artist.id))));

            let results = await Promise.all(promises);
            results.forEach(({data: {artists: relatedArtists}}) => this._pushRandomRelatedArtists(topArtists, relatedArtists, playlistArtists));

            promises = [];
            playlistArtists.forEach(artist => promises.push(this._promiseCall(this.getTopTracksByArtist.bind(this, accessToken, artist.id))));

            callback({status: 200, playlistTracks: this._pushRandomTracks(await Promise.all(promises))}); 
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Returns a randomly generated playlist based on a single artist. 
     * @param String the access token.
     * @param String the artist's id.
     * @param function a function to be called back with the info.
     */
    static async getPlaylistFromArtist(accessToken, artistId, callback) {
        try {
            const {data: {artists: relatedArtists}} = await this._promiseCall(this.getRelatedArtists.bind(this, accessToken, artistId));
            const promises = [];
            if (!relatedArtists || relatedArtists.length === 0) {
                return callback({status: 404, message: 'That\'s so underground... please try another artist.'});
            }
            relatedArtists.forEach(artist => promises.push(this._promiseCall(this.getTopTracksByArtist.bind(this, accessToken, artist.id))));

            callback({status: 200, playlistTracks: this._pushRandomTracks(await Promise.all(promises))});
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Post a playlist on the user's spotify account. The playlist will be empty until tracks are added.
     */
    static async postPlaylist(accessToken, spotifyUserId, title, state, callback) {
        const path = `/v1/users/${spotifyUserId}/playlists`;
        const options = this._getCommonOptions(accessToken, path, METHODS.POST);

        const body = {
            name: title,
            public: state === 'public',
            description: 'Generated by mycoolplaylist.'
        };

        this._commonRequest(options, callback, JSON.stringify(body));
    }

    /**
     * Post the tracks to be added to a specific playlist.
     */
    static async postTracksToPlaylist(accessToken, playlistId, playlist, callback) {
        const path = `/v1/playlists/${playlistId}/tracks`;
        const options = this._getCommonOptions(accessToken, path, METHODS.POST);
        options.headers['Content-Type'] = 'application/json';

        const body = {
            uris: playlist
        };

        this._commonRequest(options, callback, JSON.stringify(body));
    }

    /**
     *
     */
    static async createPlaylist(accessToken, userId, {title, state, playlist}, callback) {
        try {
            const spotifyUserId = await UserLogic.getSpotifyId(userId);
            const {status, ...result} = await this._promiseCall(this.postPlaylist.bind(this, accessToken, spotifyUserId, title, state));

            if (status !== 200) {
                return callback({status, result}); 
            }

            const {data: {id: playlistId}} = result;

            const {status: tracksStatus, ...tracksResult} = await this._promiseCall(this.postTracksToPlaylist.bind(this, accessToken, playlistId, playlist));
            if (tracksStatus !== 201) {
                return callback({status: tracksStatus, result: tracksResult}); 
            }
        } catch (err) {
            console.log(err);
        }    
    }

    /**
     * Search for artists. 
     */ 
    static search(accessToken, searchTerm, callback) {
        const path = `/v1/search?q=${encodeURI(searchTerm)}&type=artist&market=from_token`;
        const options = this._getCommonOptions(accessToken, path, METHODS.GET);

        this._commonRequest(options, callback);
    }

    static _getCommonOptions(accessToken, path, method) {
        return {
            host: 'api.spotify.com',
            path,
            method,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        };
    }

    static _commonRequest(options, callback, body) {
        const req = https.request(options, res => {

            let fullData = '';
            res.on('data', data => {
                fullData += data;
            });
            res.on('end', () => {
                const parsed = JSON.parse(fullData);
                const {error} = parsed;
                if (error) {
                    const {status, ...err} = error;
                    return callback({status: error.status, data: err});
                }
                callback({status: 200, data: parsed});
            });
        });

        req.on('error', err => callback({status: 500, message: err.message}));

        req.end(body);
    }

    static _promiseCall(callback) {
        return new Promise(resolve => callback(result => resolve(result)));
    }

    static _pushRandomRelatedArtists(topArtists, relatedArtists, playlistArtists) {
        for (let i = 0; i < 3 && relatedArtists.length > 0; i++) {
            const index = Math.trunc(Math.random() * relatedArtists.length);
            const artist = relatedArtists[index];

            relatedArtists.splice(index, 1);
            if (topArtists.some(obj => obj.id === artist.id)
              || playlistArtists.some(obj => obj.id === artist.id)) {
                i--;
                continue;
            }
            playlistArtists.push(artist);
        }
    }

    static _pushRandomTracks(artistsTracks) {
        const playlist = [];
        for (let i = 0;  i < 50 && artistsTracks.length > 0; i++) {
            const outerIndex = Math.trunc(Math.random() * artistsTracks.length);
            const innerIndex = Math.trunc(Math.random() * artistsTracks[outerIndex].data.tracks.length);

            playlist.push(artistsTracks[outerIndex].data.tracks.splice(innerIndex, 1)[0]);
            if (artistsTracks[outerIndex].data.tracks.length === 0) {
                artistsTracks.splice(outerIndex, 1);
            }
        }
        return playlist;
    }

    /**
     * This method is called if the user did not accept the request.
     * @param object an object containing the error and passed state.
     * @param function the method to emit the response. 
     */
    static handleAccessDenied({error, state}, responseEmitter) {
        SpotifyStore.removeStateValue(state);
        responseEmitter({status: 401, message: error});
    } 
}

module.exports = SpotifyLogic;