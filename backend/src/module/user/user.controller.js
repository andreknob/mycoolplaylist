const User = require('./user.schema');
const userLogic = require('./user.logic');

module.exports = {
    /**
     * Fetch a specific User by its id.
     */ 
    get: (req, res) => {
        userLogic.get(req.params.id).then(response => {
            res.status(response.status).json(response);
        }).catch(err => {
            res.status(err.status).json(err);
        });;
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
            return err ? handleError(err) : res.status(200).json({msg: 'User created successfully', result});
        });
    },

    /**
     * Update an User.
     */ 
    put: (req, res) => {
        User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: {name: req.body.name}}, 
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