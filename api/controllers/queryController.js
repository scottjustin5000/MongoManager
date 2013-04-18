var objectUtility = require("../util/objectUtility.js")
,queryData = require("../models/queryData.js")
,queryParser = require("../queryParser.js")
mongoClient = require('mongodb').MongoClient;

function queryController(){
    
}

queryController.prototype = {

    executeSelect: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {

            var parsed = queryParser.parse(data.queryText);
            var q = parsed.query;
            var obj = {};
            obj = objectUtility.builder(obj, { "execCommand": q });
            obj.execCommand(res, db);

            // db.close();
        });
    },
    executeManagementSelect: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {
            if (err) {
                console.log(err);
            }
            else {
                var admin = db.admin();
                admin.serverStatus(function (err, results) {
                    if (!err) {
                       // console.log(results);
                        var dd = { 'data': JSON.stringify(results), 'status': 'success' };
                        res.send(dd);
                    }
                    else {
                        console.log(err);
                    }
                });
            }
        });
    },
    executeReplace: function (req, res) {

        var datum = req.body.cmd;
        var serverName = datum.server;
        var dbName = datum.db;
        var collection = datum.collection;
        var id = datum.id;
        var doc = datum.data;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {
            if (err) {
                db.close();
            }
            var ObjectID = db.bson_serializer.ObjectID;
            var col = db.collection(collection);
            col.update({ _id: ObjectID(id) }, doc, { safe: true }, function (err) {
                if (err) {
                    console.log(err);
                }

                // db.close();
            });
        });

    }
};
module.exports = queryController;