const express = require('express');
const compression = require('compression')
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

mongoose.set('debug', true);
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds149252.mlab.com:49252/mycoolplaylistdb`, {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected at port 27017');
});

mongoose.connection.on('error', error => {
    console.log(error);
});

const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: process.env.FRONTEND_ADDRESS,
    optionsSuccessStatus: 200
}
// adding cors
app.use(cors(corsOptions));
// compress all responses
app.use(compression());
// adding json
app.use(bodyparser.json());
// use routes
app.use('/api', require('./src/route'));
// intercepts non existent api requests
app.use('/api/*', (req, res, next) => {
    const error = new Error('API handler not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status).json({
        status: error.status,
        message: error.message
    });
})

//use static content
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});