var express = require('express')
, serverService = require('../../services/serverService.js')
, databaseService = require('../../services/databaseService.js')
, collectionService = require('../../services/collectionService.js')

function routes(app){

//app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());

app.post('/api/allServers', function (req, res) {
    var servers = new serverService();
    servers.load(req, res);
 
});
app.post('/api/expandNavigation', function (req, res) {
    var requestType = req.body.type;
    switch (requestType) {
        case "server":
            new serverService().getServerDbs(req, res);
            break;
        case "database":
            new databaseService().getDbCollections(req, res)
            break;
        case "property":
            new collectionService().getCollectionInfo(req, res)
            break;
         case "index":
            new collectionService().getCollectionIndexInfo(req, res)
            break;
        default:
            return res.send(200);
    }

});

};
module.exports = routes;