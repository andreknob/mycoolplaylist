const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./route/routes');

const app = express();

mongoose.connect('mongodb://localhost:27017/unlistenedplaylistdb', {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected at port 27017');
});

mongoose.connection.on('error', error => {
    console.log(error);
});

//adding cors
app.use(cors());
//adding json
app.use(bodyparser.json());
//use routes
app.use('/api', router);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('foobars');
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});