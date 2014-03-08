var express = require('express');
var ejsMiddleware = require('./ejs-Middleware.js');
var app = express();

require('./api/apps/navigation/routes')(app);
require('./api/apps/collection/routes')(app);
require('./api/apps/query/routes')(app);

app.listen(process.env.port || 8090);

app.use(ejsMiddleware(__dirname + '/static', 'html', app)); // Serve .html files via EJS renderer

app.use(express.static(__dirname + '/static')); 
console.log("server listening....");