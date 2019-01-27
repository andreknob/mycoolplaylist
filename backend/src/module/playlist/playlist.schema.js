const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    created: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Playlist', playlistSchema);