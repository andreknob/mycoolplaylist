const User = require('./user.schema');
const userLogic = require('./user.logic');

module.exports = {
    /**
     * Fetch a specific User by its id.
     */ 
    get: async (req, res) => {
        const response = await userLogic.get(req.params.id);
        res.status(response.status).json(response);
    },

    /**
     * Display list of all Users.
     */ 
    list: (req, res) => {
        User.find((err, users) => {
            return err ? handleError(err) : res.status(200).json(users);
        });
    },

    /**
     * Create a new User.
     */ 
    post: (req, res) => {
        let user = new User({
            name: req.body.name,
        });
        user.save((err, result) => {
            return err ? res.status(500).json(err) : res.status(200).json({msg: 'User created successfully', result});
        });
    },

    /**
     * Update an User.
     */ 
    put: (req, res) => {
        const updateOps = {};
        req.body.forEach(op => updateOps[op.fieldName] = op.value);

        User.update(
            {_id: req.params.id},
            {$set: updateOps}, 
            (err, result) => {
                return err ? handleError(err) : res.status(200).json({msg: 'User updated successfully', result});
            }
        );
    },

    /**
     * Remove an User.
     */ 
    delete: (req, res) => {
        User.remove(
            {_id: req.params.id},
            (err, result) => {
                return err ? handleError(err) : res.status(200).json(result);
            }
        );
    }
}