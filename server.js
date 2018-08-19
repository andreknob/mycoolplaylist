const express = require('express');
const path = require('path');
const UNHEARDPLAYLIST = 'unheardplaylist';

const app = express();

app.use(express.static(`${__dirname}/dist/${UNHEARDPLAYLIST}`));

app.listen(process.env.PORT || 8080);

//PathLocationStrategy
app.get('/*', function(req, res) {
    res.sendFile(path.join(`${__dirname}/dist/${UNHEARDPLAYLIST}/index.html`));
});

console.log('Console listening!');