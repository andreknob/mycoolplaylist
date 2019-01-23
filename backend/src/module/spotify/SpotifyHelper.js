const https = require("https");
const {AUTHORIZATION} = require('./spotify.contants');

class SpotifyHelper {

    static getAuthorizationURI(stateValue) {
        const {SCOPES, REDIRECT_URI} = AUTHORIZATION;

        return 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.CLIENT_ID +
        (SCOPES ? '&scope=' + encodeURIComponent(SCOPES) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&state=' + stateValue;
    }

    static getOptions(accessToken, path, method) {
        return {
            host: 'api.spotify.com',
            path,
            method,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            }
        };
    }

    static request(options, callback, body) {
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

    static promiseCall(callback) {
        return new Promise(resolve => callback(result => resolve(result)));
    }

    static pushRandomRelatedArtists(topArtists, relatedArtists, playlistArtists) {
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

    static pushRandomTracks(artistsTracks) {
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
}

module.exports = SpotifyHelper;