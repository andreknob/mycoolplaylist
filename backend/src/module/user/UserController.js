const UserLogic = require('./UserLogic');
const AbstractController = require('../../core/logic/AbstractController');

class UserController extends AbstractController {

    static get Logic() {
        return UserLogic;
    }

    static responseEmitter(res, result) {
        const {status, ...rest} = result;
        res.status(status).json({...rest});
    }
}

module.exports = UserController;