var objectUtility = require("../util/objectUtility.js")
,queryData = require("../models/queryData.js")
,queryParser = require("../queryParser.js")
,sql2Mongo =require('../parsing/sql2Mongo.js')
mongoClient = require('mongodb').MongoClient;

function queryController(){
    
}

queryController.prototype = {
    executeSql: function (req, res) {
        var data = req.body.query;
        var s2m = new sql2Mongo(data);
        var converted = s2m.convert();
        mongoClient.connect("mongodb://" + data.serverName + "/" + data.db,
        function (err, db) {

            var obj = {};

            obj = objectUtility.builder(obj, { "execCommand": converted });
            obj.execCommand(res, db);
        });

    },
    executeMongo: function (req, res) {
        var data = req.body.query;
        /* var serverName = data.serverName;
        var dbName = data.db;*/
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
        else if (query.indexOf('.mapReduce(') !== -1) {
            this.executeMapReduce(req, res);

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

        });
    },
    executeMapReduce: function (req, res) {
        var data = req.body.query;
        var serverName = data.serverName;
        var dbName = data.db;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName,
        function (err, db) {

            var parsed = queryParser.parseMapReduce(data.queryText);
            var q = parsed.query;
            var obj = {};

            obj = objectUtility.builder(obj, { "execCommand": q });
            obj.execCommand(res, db);

         /*  
            var map = function () {
                emit(this.cust_id, this.price);
            };
            var reduce = function (keyCustId, valuesPrices) {
                return Array.sum(valuesPrices);
            };

            var coll = db.collection('order');
            coll.mapReduce(map, reduce, { out: { replace: 'tempCollection'} }, function (err, coll) {
                if (err) {
                    console.log(err);
                }
                coll.find({}).toArray( function (e, col) {
                     console.log(col);
                var dd = { 'data': JSON.stringify(col), 'status': 'success', 'cmd': 'mapReduce' };
                res.send(dd);
                });
               

            });*/

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
                console.log(err);
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