var mongoIndex = require("../models/mongoIndex.js")
,mongoInstance = require("../models/mongoInstance.js")
,mongoCollection = require("../models/mongoCollection.js")
,mongoTreeFormatter = require("../util/mongoTreeFormatter.js")
,mongoClient = require('mongodb').MongoClient
,fs = require('fs');

function collectionController(){
    
}
collectionController.prototype = {
    getCollectionInfo: function (req, res) {
        var serverName = req.body.server;
        var dbName = req.body.db;
        var collection = req.body.collection;
        var props = [];
        mongoClient.connect("mongodb://" + serverName + "/" + dbName, function (err, db) {

            var col = db.collection(collection);

            col.findOne({}, { sort: [['__v', -1]] }, function (err, doc) {
                for (var prop in doc) {
                    props.push(prop);
                }
                var m = new mongoTreeFormatter();
                var results = m.formatPropertyResponse(props);

                res.send(results);

            });

        });
    },
    getCollectionStats: function (req, res) {
        var serverName = req.body.server;
        var dbName = req.body.db;
        var collection = req.body.collection;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName, function (err, db) {

            db.command({ collStats: collection }, function (err, dx) {
                if (!err) {
                    console.log(dx);
                    var results = "{ \"data\" :" + JSON.stringify(dx) + ",\"status\":\"success\"}";
                    res.send(results);
                }

            });

        });
    },
    getCollectionIndexInfo: function (req, res) {
        var serverName = req.body.server;
        var dbName = req.body.db;
        var collection = req.body.collection;
        var indexes = [];
        mongoClient.connect("mongodb://" + serverName + "/" + dbName, function (err, db) {

            db.indexInformation(collection, function (err, info) {
                if (err) {
                    console.log(err);
                }
                if (info._id_) {
                    for (var i = 0; i < info._id_.length; i++) {

                        indexes.push(info._id_[i][0]);
                    }
                }
                var m = new mongoTreeFormatter();
                var results = m.formatIndexResponse(indexes);
                res.send(results);
            });
        });
    },
    createCollection: function (req, res) {
        var serverName = req.body.server;
        var dbName = req.body.db;
        var collection = req.body.collection;
        var options = req.body.options;
        mongoClient.connect("mongodb://" + serverName + "/" + dbName, function (err, db) {

            db.createCollection(collection, options, function (err, info) {
                if (err) {
                    console.log(err);
                      res.send("{\"status\":\"error\"}");
                }
                else{
                     res.send("{\"status\":\"success\"}");
                }
     
               
            });
        });
    },
    deleteCollection: function (req, res) {

    }
};
module.exports = collectionController;