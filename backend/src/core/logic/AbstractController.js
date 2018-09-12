class AbstractController {

    /**
     * Fetches a specific doc by its id.
     */ 
    static async get(req, res) {
        const {status, data, message} = await this.Logic.get(req.params.id);
        res.status(status);

        if (status === 200) return res.json(data);
        res.json(message);
    }
    
    /**
     * Fetches a list of docs.
     */ 
    static async list(req, res) {
        let response = await this.Logic.list();
        res.status(response.status).json(response);
    }
    
    /**
     * Creates a doc.
     */ 
    static async post(req, res) {
        let response = await this.Logic.post(req.body);
        res.status(response.status).json(response);
    }

    /**
     * Updates a doc.
     */ 
    static async put(req, res) {
        let response = await this.Logic.put(req.params.id, req.body);
        res.status(response.status).json(response);
    }

    /**
     * Deletes a doc.
     */ 
    static async delete(req, res) {
        let response = await this.Logic.delete(req.params.id);
        res.status(response.status).json(response);
    }
}

module.exports = AbstractController;