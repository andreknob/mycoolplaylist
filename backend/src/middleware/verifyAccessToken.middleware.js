const AccessTokenLogic = require('../module/spotify/access-token/AccessTokenLogic');
const SpotifyLogic = require('../module/spotify/SpotifyLogic');

module.exports = async (req, res, next) => {
    const {data} = await AccessTokenLogic.getByUserId(req.params.id);
    if (new Date() >= data.expireDate) {
        if (!data.refreshToken) {
            return res.status(403).json({message: 'No refresh token is present, the accessToken was probably already refreshed.'});
        }
        return SpotifyLogic.requestAccessToken(data.refreshToken, accessTokenResponse.bind(this, req, res, next), req.params.id, true);
    }
    callNext(req, next, data.accessToken);
}

function accessTokenResponse(req, res, next, result) {
    if (result.status !== 200) {
        const {status, ...rest} = result;
        return res.status(status).json({...rest});
    }
    callNext(req, next, result.accessToken);
}

function callNext(req, next, accessToken) {
    req.params.accessToken = accessToken;
    next();
}