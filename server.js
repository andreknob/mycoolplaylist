const express = require('express');
const path = require('path');
const UNLISTENEDPLAYLIST = 'unlistenedplaylist';

const app = express();

app.use(express.static(`${__dirname}/dist/${UNLISTENEDPLAYLIST}`));

app.listen(process.env.PORT || 8080);

//PathLocationStrategy
app.get('/*', function(req, res) {
    res.sendFile(path.join(`${__dirname}/dist/${UNLISTENEDPLAYLIST}/index.html`));
});

console.log('Console listening!');