var User = require('./user.schema');

module.exports = {
    // Display list of all Users.
    list: (req, res) => {
        // todo - .find is deprecated
        User.find({}, (err, users) => {
            if (err) {
                return handleError(err);
            }
            res.status(200).json(users);
        });
    }
}