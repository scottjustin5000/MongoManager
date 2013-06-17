var objectUtility = require("../util/objectUtility.js")
,queryData = require("../models/queryData.js")
,queryParser = require("../queryParser.js")
,sql2Mongo =require('../parsing/sql2Mongo.js')
mongoClient = require('mongodb').MongoClient;

function queryController(){
    
}

queryController.prototype = {
    executeSql: function (req, res) {
        var s2m = new sql2Mongo(req.body.query);
        s2m.convert();

    },
    executeMongo: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        var query = data.queryText;

        if (query.indexOf('.remove(') !== -1) {
            this.executeRemove(req, res);

        }
        else if (query.indexOf('.update(') != -1) {

            this.executeUpdate(req, res);
        }
        else if (query.indexOf('.insert(') !== -1) {
            this.executeInsert(req, res);
        }
        else if (query.indexOf('.findAndModify(') !== -1) {
            this.executeFindAndModify(req, res);

        }
        else {
            this.executeSelect(req, res);
        }

    },
    executeSelect: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {

            var parsed = queryParser.parseSelect(data.queryText);
            var q = parsed.query;
            var obj = {};

            obj = objectUtility.builder(obj, { "execCommand": q });
            obj.execCommand(res, db);

            // db.close();
        });
    },
    executeFindAndModify: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {

            var parsed = queryParser.parseFindAndModify(data.queryText);
            var q = parsed.query;
            var obj = {};

            obj = objectUtility.builder(obj, { "execCommand": q });
            obj.execCommand(res, db);

            // db.close();
        });
    },
    executeRemove: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {

            var parsed = queryParser.parseRemove(data.queryText);
            var q = parsed.query;
            var obj = {};
            console.log(q);
            obj = objectUtility.builder(obj, { "execCommand": q });
            obj.execCommand(res, db);

        });
    },
    executeUpdate: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {

            var parsed = queryParser.parseUpdate(data.queryText);
            var q = parsed.query;
            var obj = {};
            obj = objectUtility.builder(obj, { "execCommand": q });
            obj.execCommand(res, db);

        });
    },
    executeInsert: function (req, res) {

        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {

            var parsed = queryParser.parseInsert(data.queryText);
            var q = parsed.query;
            var obj = {};
            obj = objectUtility.builder(obj, { "execCommand": q });
            obj.execCommand(res, db);

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