const UserLogic = require('./UserLogic');
const AbstractController = require('../../core/logic/AbstractController');

class UserController extends AbstractController {

    static get Logic() {
        return UserLogic;
    }
}

module.exports = UserController;