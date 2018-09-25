const mongoose = require('mongoose');

const accessTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    scope: {
        type: String,
        required: true,
    },
    expireDate: {
        type: Number,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('AccessToken', accessTokenSchema);