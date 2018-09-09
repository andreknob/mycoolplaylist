const jwt = require('jsonwebtoken');
const config = require('../../../config');
const UserModel = require('./user.schema');
const AbstractLogic = require('../../core/logic/AbstractLogic');

class UserLogic extends AbstractLogic {

    static get Model() {
        return UserModel;
    }

    static post(user) {
        return super.post(user).then(({status, docs: created, err}) => {
            if (status !== 200) return {status, err};
        
            // create a token
            const token = jwt.sign({id: created._id}, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });
        
            return {status, token, created};
        });
    };

    static me(responseEmitter, id) { 
        responseEmitter({status: 200, id});
    };

    /**
     * Fetches a user by its spotifyId.
     */ 
    static getBySpotifyId(spotifyId) {
        return super.executeQuery(this.Model.findOne({'spotifyId': spotifyId}));
    }
}

module.exports = UserLogic;