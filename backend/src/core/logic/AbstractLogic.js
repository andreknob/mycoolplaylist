class AbstractLogic {

    /**
     * Fetches a specific doc by its id.
     */ 
    static get(_id) {
        return this.executeQuery(this.Model.findById(_id));
    }

    /**
     * Fetches a list of docs.
     */ 
    static list() {
        return this.executeQuery(this.Model.find());
    }
    
    /**
     * Creates a doc.
     */ 
    static post(doc) {
        const newDoc = new this.Model(doc);
        return this.executeQuery(newDoc.save());
    }

    /**
     * Updates a doc.
     */ 
    static put(id, doc) {
        return this.executeQuery(this.Model.update(
            {_id: id},
            {$set: doc}
        ));
    }

    /**
     * Deletes a doc.
     */ 
    static delete(id) {
        return this.executeQuery(this.Model.remove({_id: id}));
    }

    /**
     * Executes a query and returns the result/error.
     */
    static executeQuery(query) {
        return query.then(docs => {
            return {status: 200, docs};
        }).catch(err => {
            return {status: 500, err};
        });
    }
}

module.exports = AbstractLogic;