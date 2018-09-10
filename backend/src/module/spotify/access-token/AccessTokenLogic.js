const AccessTokenModel = require('./access-token.schema');
const AbstractLogic = require('../../../core/logic/AbstractLogic');

class AccessTokenLogic extends AbstractLogic {

    static get Model() {
        return AccessTokenModel;
    }

    static post(accessTokenObj, userId, now) {
        const {
            access_token: accessToken,
            scope,
            expires_in: expiresIn,
            refresh_token: refreshToken
        } = accessTokenObj;

        return super.post({
            accessToken,
            scope,
            expireDate: new Date(now + (expiresIn * 1000)),
            refreshToken,
            userId
        });
    }

    static putByUserId(accessTokenObj, userId, now) {
        const {
            access_token: accessToken,
            scope,
            expires_in: expiresIn,
            refresh_token: refreshToken
        } = accessTokenObj;

        return this.executeQuery(this.Model.update(
            {userId: userId},
            {$set: {
                accessToken,
                scope,
                expireDate: new Date(now + (expiresIn * 1000)),
                refreshToken,
            }}
        ));
    }
}

module.exports = AccessTokenLogic;