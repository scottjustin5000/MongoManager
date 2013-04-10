var express = require('express')
, app = module.exports = express()
,query = require('./controllers/queryController.js')
, serverController = require('./controllers/serverController.js')
, databaseController = require('./controllers/databaseController.js')
, collectionController = require('./controllers/collectionController.js');

app.use(express.bodyParser());

app.post('/allServers', function (req, res) {
    var servers = new serverController();
    servers.load(req, res);
 
});
app.post('/newServer', function (req, res) {
    var servers = new serverController();
    servers.addServer(req, res);
});
app.post('/expandNavigation', function (req, res) {
    var requestType = req.body.type;
    switch (requestType) {
        case "server":
            new serverController().getServerDbs(req, res);
            break;
        case "database":
            new databaseController().getDbCollections(req, res)
            break;
        case "property":
            new collectionController().getCollectionInfo(req, res)
            break;
         case "index":
            new collectionController().getCollectionIndexInfo(req, res)
            break;
        default:
            return res.send(200);

    }

});
app.post('/documentQuery', function (req, res) {
    var q = new query();
    q.executeSelect(req, res);
});
app.post('/replaceDocument', function (req, res) {
       var q = new query();
    q.executeReplace(req, res);
});

