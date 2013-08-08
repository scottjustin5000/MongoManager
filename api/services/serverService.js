var server = require("../models/mongoServer.js")
,mongoIndex = require("../models/mongoIndex.js")
,mongoInstance = require("../models/mongoInstance.js")
,mongoCollection = require("../models/mongoCollection.js")
,mongoTreeFormatter = require("../util/mongoTreeFormatter.js")
,mongoClient = require('mongodb').MongoClient
,fs = require('fs');

function serverController(){
    
}

serverController.prototype = {
    load: function (req, res) {
        fs.readFile('./public/servers.json', 'utf8', function (err, data) {
            if (err) {
                res.send(500);
            }
            var results = JSON.parse(data);
            var dd = "{ \"data\" :" + data + ",\"status\":\"success\"}";
            res.send(dd);
        });
    },
    addServer: function (req, res) {
        fs.readFile('./public/servers.json', 'utf8', function (err, data) {
            if (err) {
                res.send(500);
            }
           var server = req.body.data.server;
           var port = req.body.data.port;
            var results = JSON.parse(data);
            results.children.push({ "data": server, "state": "closed", "attr": { "id": server, "port":port, "type": "server"} });
            fs.writeFile("./public/servers.json", JSON.stringify(results), function(err) {
                 if(err) {
                    console.log(err);
                } else {
                      res.send("{ \"status\":\"success\"}");
                }
            });

          
        });
    },
   getServerStatus: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        mongoClient.connect("mongodb://" + serverName + "/admin",
        function (err, db) {
            if (err) {
                console.log(err);
            }
            else {
                var admin = db.admin();
                admin.serverStatus(function (err, results) {
                    if (!err) {
                        var dd = { 'data': results, 'status': 'success' };
                        res.send(dd);
                    }

                });
            }
        });
    },
    replSetGetStatus: function (req, res) {
        var serverName = req.body.server;
           mongoClient.connect("mongodb://" + serverName + "/admin", function (err, db) {

            db.command({ replSetGetStatus: 1 }, function (err, dx) {
                if (!err) {
                    console.log(dx);
                    var results = { 'data': dx, 'status': 'success' };
                    res.send(results);
                }
            });

        });
    },
    getCollections: function (dbName) {

    },
    getProperties: function (table) {

    },
    getIndexes: function (table) {

    },
    getServerDbs: function (req, res) {
        var serverName = req.body.id;
        mongoClient.connect("mongodb://" + serverName + "/admin", function (err, db) {
            var admin = db.admin();
            admin.listDatabases(function (err, result) {
                if (!err) {
                    var arr = new Array();
                    for (var j = 0; j < result.databases.length; j++) {
                        var ins = new mongoInstance();
                        ins.name = result.databases[j].name;
                        ins.size = result.databases[j].sizeOnDisk;
                        ins.isEmpty = result.databases[j].empty;

                        arr.push(ins);
                    }
                    var m = new mongoTreeFormatter();
                    var complete = m.formatDbResponse(arr, serverName);
            
                    res.send(complete);
                }
            });
        });
    }
};
module.exports = serverController;