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
            expireDate: now + (expiresIn * 1000),
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
                expireDate: now + (expiresIn * 1000),
                refreshToken,
            }}
        ));
    }

    /**
     * Fetches an access token by it's userId.
     */ 
    static getByUserId(userId) {
        return super.executeQuery(this.Model.findOne({'userId': userId})).then(result => {
            if (result.status === 200) {
                return {
                    ...result,
                    data: {
                        ...result.data.toObject(),
                        expireDate: new Date(result.data.expireDate),
                    }
                }
            }
            return result;
        });
    }
}

module.exports = AccessTokenLogic;