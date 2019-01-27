const StateModel = require('./state.schema');
const AbstractLogic = require('../../../core/logic/AbstractLogic');
const StringHelper = require('../../../core/helper/StringHelper');

class StateLogic extends AbstractLogic {

    static get Model() {
        return StateModel;
    }

    /**
     * Gets a random string and adds it to the db.
     */ 
    static getStateValue() {
        const stateObj = {
            state: StringHelper.getRandomString(),
        };

        return super.post(stateObj).then(() => stateObj.state);
    }

    /**
     * Checks if the state value's on the db.
     */ 
    static async removeStateValue(stateValue) {
        if (!stateValue) {
            return false;
        }

        const stateObj = await this.Model.findOne({'state': stateValue}, '_id');

        if (stateObj && stateObj._id) {
            super.delete(stateObj._id);
            return true;
        }
        return false;
    }
}

module.exports = StateLogic;