const UserModel = require('./user.schema');
const AbstractLogic = require('../../core/logic/AbstractLogic');

class UserLogic extends AbstractLogic {

    static get Model() {
        return UserModel;
    }
}

module.exports = UserLogic;