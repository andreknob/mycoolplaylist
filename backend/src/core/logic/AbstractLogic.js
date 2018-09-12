class AbstractLogic {

    /**
     * Fetches a specific doc by its id.
     */ 
    static get(_id) {
        return this.executeQuery(this.Model.findById(_id))
            .then(({status, data}) => {
                data = data.toObject();
                delete data.__v;
                return {status, data};
            });
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
     * Executes a query and returns/throws the result/error.
     */
    static executeQuery(query) {
        return query.then(data => {
            return {status: 200, data};
        }).catch(message => {
            throw {status: 500, message};
        });
    }
}

module.exports = AbstractLogic;