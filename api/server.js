var express = require('express')
, app = module.exports = express()
, query = require('./controllers/queryController.js')
, serverController = require('./controllers/serverController.js')
, databaseController = require('./controllers/databaseController.js')
, collectionController = require('./controllers/collectionController.js')
, userController = require('./controllers/userController.js');

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
    q.executeMongo(req, res);
});
app.post('/sqlQuery', function (req, res) {
    var q = new query();
    q.executeSql(req, res);
});
app.post('/serverStats', function (req, res) {
    var sc = new serverController();
    sc.getServerStatus(req, res);
});
app.post('/dbStats', function (req, res) {
    var dbController = new databaseController();
    dbController.getDbStats(req, res);
});
app.post('/replSetGetStatus', function (req, res) {
     var sc = new serverController();
    sc.replSetGetStatus(req, res);
});
app.post('/collectionStats', function (req, res) {
    var cnt = new collectionController();
    cnt.getCollectionStats(req, res);
});
app.post('/createCollection', function (req, res) {
       var cnt = new collectionController();
    cnt.createCollection(req, res);
});
app.post('/renameCollection', function (req, res) {
    var cc = new collectionController();
    cc.renameCollection(req,res);
});
app.post('/replaceDocument', function (req, res) {
       var q = new query();
    q.executeReplace(req, res);
});
app.post('/addUser', function (req, res) {
    var uc = new userController();
    uc.addUser(req, res);
});
app.post('/loadUsers', function (req, res) {
    var uc = new userController();
    uc.loadUsers(req, res);
});
app.post('/removeUser', function (req, res) {
    var uc = new userController();
    uc.removeUser(req, res);
});
app.post('/editUser', function (req, res) {
    var uc = new userController();
    uc.editUser(req, res);
});
/*
app.post('/remove', function (req, res) {
      var q = new query();
    q.executeRemove(req, res);
});
app.post('/update', function (req, res) {
     var q = new query();
    q.executeUpdate(req, res);
});
app.post('/create', function (req, res) {
     var q = new query();
    q.executeInsert(req, res);
});
app.post('/findAndModify', function (req, res) {
     var q = new query();
    q.executeFindAndModify(req, res);
});
app.post('/createCollectionQuery', function (req, res) {
    var cnt = new collectionController();
    cnt.createCollection2(req, res);
});*/

