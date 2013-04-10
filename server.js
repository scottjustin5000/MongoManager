var express = require('express'),
    app = express(),
    apiServer = require('./api/server.js'),
    ejsMiddleware = require('ejs-middleware');
    app.listen(process.env.port || 8888);
    app.use('/api', apiServer); // Mount the HTTP API on the URL space /api


app.use(ejsMiddleware(__dirname + '/static', 'html', app)); // Serve .html files via EJS renderer

app.use(express.static(__dirname + '/static')); // For other requests, just serve /static