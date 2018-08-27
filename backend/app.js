const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// todo - search how to put the password on the environment
mongoose.connect('mongodb://unlistenedplaylistuser:unlistenedplaylistpassword123@ds133202.mlab.com:33202/unlistenedplaylistdb', {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected at port 27017');
});

mongoose.connection.on('error', error => {
    console.log(error);
});

const PORT = process.env.PORT || 8080;

//adding cors
app.use(cors());
//adding json
app.use(bodyparser.json());
//use routes
app.use('/api', require('./src/route'));
//use static content
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});