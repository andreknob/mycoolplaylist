const UserLogic = require('./UserLogic');
const AbstractController = require('../../core/logic/AbstractController');

class UserController extends AbstractController {

    static get Logic() {
        return UserLogic;
    }

    /**
     * Returns info about the user logged in.
     */ 
    static me(req, res) {
        UserLogic.me(this.responseEmitter.bind(this, res), req.params.id);
    }

    static responseEmitter(res, result) {
        res.status(result.status).json(result);
    }
}

module.exports = UserController;