//------------------------
//- Node Module Requires -
//------------------------
const express = require('express');
const path = require('path');
const reload = require('reload');
const fs = require('fs');

//--------------------
//- Script Constants -
//--------------------
const app = express();
const reload_server = reload(app);
const hostname = 'localhost';
const port = process.env.EXPRESSPORT | 3000;
const app_path = path.join(__dirname, 'app');

// Listen on a server
app.listen(port, () => {
    console.log(`Listening on "http://${hostname}:${port}"`)
});

//--------------------
//- App Static Files -
//--------------------
app.use('/other', express.static(path.join(app_path, 'test'), {
    dotfiles: 'ignore'
}));

//-----------------
//- Set up routes -
//-----------------
function badRequest(req, res, next) {
    res.status(400).send('Bad Request');
}

// Index route
app.route('/')
// Define verbs you want specific action for first
.get((req, res) => {
    res.sendFile(path.join(app_path, 'index.html'));
});

// Put other routes here

// All other routes
app.route('*')
// Define all get requests to * as 404s
.get((req, res) => {
    res.status(404).sendFile(path.join(app_path, 'not-found.html'));
})
.all(badRequest);

//----------------
//- Start reload -
//----------------
fs.watch(app_path, { recursive: true }, () => {
    reload_server.reload();
});
