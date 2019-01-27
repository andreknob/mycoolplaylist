const PlaylistModel = require('./playlist.schema');
const AbstractLogic = require('../../core/logic/AbstractLogic');

class PlaylistLogic extends AbstractLogic {

    static get Model() {
        return PlaylistModel;
    }

    static post(playlist) {
        const {title, userId} = playlist;

        return super.post({
            title,
            created: new Date().getTime(),
            userId
        });
    }
}

module.exports = PlaylistLogic;