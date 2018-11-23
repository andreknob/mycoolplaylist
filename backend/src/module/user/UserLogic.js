const jwt = require('jsonwebtoken');
const UserModel = require('./user.schema');
const AbstractLogic = require('../../core/logic/AbstractLogic');

class UserLogic extends AbstractLogic {

    static get Model() {
        return UserModel;
    }

    static get(id) {
        return super.get(id).then(({status, data}) => {
            data.images.some(img => img.url ? ((data.image = img), true) : false);
            delete data.images;
            return {status, data};
        });
    }

    static post(user) {
        return super.post(user).then(({status, data: user}) => {
            const jwtToken = UserLogic.generateJWT(user._id);
        
            return {status, jwtToken, user};
        });
    };

    static generateJWT(id) {
        return jwt.sign({id}, process.env.JWT_SECRET, {
            expiresIn: 172800
        });
    }

    /**
     * Fetches a user by it's spotifyId.
     */ 
    static getBySpotifyId(spotifyId) {
        return super.executeQuery(this.Model.findOne({'spotifyId': spotifyId}, '_id'))
            .then(({data}) => data && data._id);
    }

    /**
     * Fetches a user's spotify id by it's id.
     */ 
    static getSpotifyId(userId) {
        return super.executeQuery(this.Model.findOne({'_id': userId}, 'spotifyId'))
            .then(({data}) => data && data.spotifyId);
    }

    static createUserFromSpotifyUser(spotifyUser) {
        const {
            display_name: name,
            email,
            country,
            external_urls: externalURLs,
            images,
            id: spotifyId,
        } = spotifyUser;

        return this.post({
            name,
            email,
            country,
            externalURLs,
            images,
            spotifyId
        });
    }
}

module.exports = UserLogic;