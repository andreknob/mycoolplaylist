const UserModel = require('./user.schema');

func = function (Model, method, params) {
    return new Promise((resolve, reject) => {
        if (!params._id) {
            reject({status: 400, err: {
                message: 'No _id informed',
                name: 'NoId',
            }});
            return;
        }
        method.call(Model, params, (err, res) => {
            console.log(res);
            if (!res && !err) {
                reject({status: 404, err: {
                    message: 'Document not found',
                    name: 'NoDocument'
                }});
                return;
            }
            err ? reject({status: 400, err}) : resolve(res);
        });
    }); 
}

module.exports = {
    /**
     * Fetch a specific User by its id.
     */ 
    get: (_id) => {
        if (!_id) {
            return Promise.reject({status: 400, err: {
                message: 'No _id informed',
                name: 'NoId',
            }});
        }

        return UserModel.findById(_id).then(user => {
            return {status: 200, user};
        }).catch(err => {
            return {status: 500, err};
        });
        /* return new Promise((resolve, reject) => {
            UserModel.find({_id}, (err, user) => {
                err ? reject(err) : resolve({status: 200, user});
            });
        });
        return func(UserModel, UserModel.findOne, {_id}).then(res => {
            return ({status: 200, res});
        });*/
    },



    /**
     * Display list of all Users.
     */ 
    list: () => {
    },

    /**
     * Create a new User.
     */ 
    post: (user) => {

    },

    /**
     * Update an User.
     */ 
    put: (id) => {

    },

    /**
     * Remove an User.
     */ 
    delete: (id) => {
 
    }
}