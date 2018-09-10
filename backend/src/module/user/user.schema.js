const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    country: {
        type: String,
    },
    externalURLs: {
        type: Object,
    },
    images: {
        type: Object,
    },
    spotifyId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);