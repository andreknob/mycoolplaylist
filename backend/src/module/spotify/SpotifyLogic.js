const SpotifyHelper = require('./SpotifyHelper');
const UserLogic = require('../user/UserLogic');
const PlaylistLogic = require('../playlist/PlaylistLogic');
const AccessTokenLogic = require('./access-token/AccessTokenLogic');
const StateLogic = require('./state/StateLogic');
const JsonHelper = require('../../core/helper/JsonHelper');
const querystring = require('querystring');
const https = require("https");
const {AUTHORIZATION, MESSAGES, METHODS, OPTIONS} = require('./spotify.contants');

class SpotifyLogic {

    /**
     * @returns spotify's interface for the user to authenticate.
     */ 
    static async getAuthorizationURI() {
        const stateValue = await StateLogic.getStateValue();

        return SpotifyHelper.getAuthorizationURI(stateValue);
    }

    /**
     * Method to handle the redirect executed by the accounts.spotify's authorize endpoint.
     * @param object obj containing the authorization code and state previously sent to the endpoint.
     * @param function the method to emit the response.
     */
    static handleRedirect({code, state}, responseEmitter) {
        if (!StateLogic.removeStateValue(state)) {
            return responseEmitter({status: 500, message: MESSAGES.NO_STATE});
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
        const req = https.request(OPTIONS.getAccessTokenOptions(), res => {
            res.on('data', this._handleAccessTokenResponse.bind(this, responseEmitter, now, userId));
        });
          
        req.on('error', err => responseEmitter({status: 500, message: err.message}));

        req.end(postData);
    }

    /**
     * Creates/updates an accessToken and creates a new user if it doesn't exist yet.
     * @param responseEmitter the method to emit the response (in success, emits a new jsonWebToken).
     * @param now the date (in ms) right before the request.
     * @param userId the id of the user.
     * @param data the response data containing the accessToken.
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
     * @param accessToken the spotify's generated access token for some user.
     * @param callback a function to be called back with the user's info.
     */
    static getSpotifyUserInfo(accessToken, callback) {
        const req = https.request(OPTIONS.getUserInfoOptions(accessToken), res => {
            res.on('data', data => callback({status: 200, spotifyUser: JsonHelper.parse(data)}));
        });
          
        req.on('error', err => {
            callback({status: 500, message: err.message});
        });

        req.end();
    }

    /**
     * Gets the top artists/tracks for an user.
     * @param accessToken the access token
     * @param type the returning object type (artist/track)
     * @param callback a function to be called back with the user's info.
     */
    static getTop(accessToken, type, callback) {
        const path = `/v1/me/top/${type}?limit=15`;
        const options = SpotifyHelper.getOptions(accessToken, path, METHODS.GET);

        SpotifyHelper.request(options, callback);
    }

    /**
     * Gets an artist's related artists.
     * @param callback a function to be called back with the info.
     */
    static getRelatedArtists(accessToken, artistId, callback) {
        const path = `/v1/artists/${artistId}/related-artists`;
        const options = SpotifyHelper.getOptions(accessToken, path, METHODS.GET);

        SpotifyHelper.request(options, callback);
    }

    /**
     * Gets an artist's top tracks.
     */
    static getTopTracksByArtist(accessToken, artistId, callback) {
        const path = `/v1/artists/${artistId}/top-tracks?market=from_token`;
        const options = SpotifyHelper.getOptions(accessToken, path, METHODS.GET);

        SpotifyHelper.request(options, callback);
    }

    /**
     * Returns a randomly generated playlist based on the user's top artists.
     * @param accessToken the access token.
     * @param callback a function to be called back with the info.
     */
    static async getPlaylistFromTopArtists(accessToken, callback) {
        try {
            const {data: {items: topArtists}} = await SpotifyHelper.promiseCall(this.getTop.bind(this, accessToken, 'artists'));
            const playlistArtists = [];
            let promises = [];

            topArtists.forEach(artist => promises.push(SpotifyHelper.promiseCall(this.getRelatedArtists.bind(this, accessToken, artist.id))));

            let results = await Promise.all(promises);
            results.forEach(({data: {artists: relatedArtists}}) => SpotifyHelper.pushRandomRelatedArtists(topArtists, relatedArtists, playlistArtists));

            promises = [];
            playlistArtists.forEach(artist => promises.push(SpotifyHelper.promiseCall(this.getTopTracksByArtist.bind(this, accessToken, artist.id))));

            callback({status: 200, playlistTracks: SpotifyHelper.pushRandomTracks(await Promise.all(promises))}); 
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Returns a randomly generated playlist based on a single artist. 
     * @param accessToken the access token.
     * @param artistId the artist's id.
     * @param callback a function to be called back with the info.
     */
    static async getPlaylistFromArtist(accessToken, artistId, callback) {
        try {
            const {data: {artists: relatedArtists}} = await SpotifyHelper.promiseCall(this.getRelatedArtists.bind(this, accessToken, artistId));
            const promises = [];
            if (!relatedArtists || relatedArtists.length === 0) {
                return callback({status: 404, message: MESSAGES.UNDERGROUND});
            }
            relatedArtists.forEach(artist => promises.push(SpotifyHelper.promiseCall(this.getTopTracksByArtist.bind(this, accessToken, artist.id))));

            callback({status: 200, playlistTracks: SpotifyHelper.pushRandomTracks(await Promise.all(promises))});
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Post a playlist on the user's spotify account. The playlist will be empty until tracks are added.
     */
    static async postPlaylist(accessToken, spotifyUserId, title, state, callback) {
        const path = `/v1/users/${spotifyUserId}/playlists`;
        const options = SpotifyHelper.getOptions(accessToken, path, METHODS.POST);

        const body = {
            name: title,
            public: state === 'public',
            description: MESSAGES.GENERATED
        };

        SpotifyHelper.request(options, callback, JSON.stringify(body));
    }

    /**
     * Post the tracks to be added to a specific playlist.
     */
    static async postTracksToPlaylist(accessToken, playlistId, playlist, callback) {
        const path = `/v1/playlists/${playlistId}/tracks`;
        const options = SpotifyHelper.getOptions(accessToken, path, METHODS.POST);
        options.headers['Content-Type'] = 'application/json';

        const body = {
            uris: playlist
        };

        SpotifyHelper.request(options, callback, JSON.stringify(body));
    }

    /**
     * Method to create the playlist.
     */
    static async createPlaylist(accessToken, userId, {title, state, playlist}, callback) {
        try {
            const spotifyUserId = await UserLogic.getSpotifyId(userId);
            const {status, ...result} = await SpotifyHelper.promiseCall(this.postPlaylist.bind(this, accessToken, spotifyUserId, title, state));

            await PlaylistLogic.post({title, userId});

            if (status !== 200) {
                return callback({status, result}); 
            }

            const {data: {id: playlistId}} = result;

            const {status: tracksStatus, ...tracksResult} = await SpotifyHelper.promiseCall(this.postTracksToPlaylist.bind(this, accessToken, playlistId, playlist));
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
        const options = SpotifyHelper.getOptions(accessToken, path, METHODS.GET);

        SpotifyHelper.request(options, callback);
    }

    /**
     * This method is called if the user did not accept the request.
     * @param object an object containing the error and passed state.
     * @param function the method to emit the response. 
     */
    static handleAccessDenied({error, state}, responseEmitter) {
        StateLogic.removeStateValue(state);
        responseEmitter({status: 401, message: error});
    } 
}

module.exports = SpotifyLogic;