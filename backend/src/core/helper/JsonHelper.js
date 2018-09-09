class JsonHelper {
    /**
     * Parses a request's result to json.
     */ 
    static parse(data) {
        return JSON.parse(data.toString());
    }
}

module.exports = JsonHelper;