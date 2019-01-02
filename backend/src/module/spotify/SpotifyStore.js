const StringHelper = require('../../core/helper/StringHelper');

const STATE_LIST = [];

class SpotifyStore {
    // @todo persist this on the db
    /**
     * Gets a random string and adds it to the state list.
     */ 
    static getStateValue() {
        const stateValue = StringHelper.getRandomString();
        STATE_LIST.push(stateValue);
        return stateValue;
    }

    /**
     * Checks if the state value's on the state list.
     */ 
    static removeStateValue(stateValue) {
        if (!stateValue) {
            return false;
        }

        const index = STATE_LIST.indexOf(stateValue);

        if (index >= 0) {
            return true;
        }
        return false;
    }

}

module.exports = SpotifyStore;