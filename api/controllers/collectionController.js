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

                    var results = { 'data': dx, 'status': 'success' };
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
                else {
                    res.send("{\"status\":\"success\"}");
                }


            });
        });
    },
    renameCollection: function (req, res) {
        var data = req.body.data;
        var server = data.server;
        var namespace = data.namespace;
        var oldName = data.oldName;
        var newName = data.newName;
        var droptarget =data.drop;
         mongoClient.connect("mongodb://" + server + "/admin", function (err, db) {

            db.command({ renameCollection: namespace+"."+oldName, to: namespace+"."+newName,dropTarget:droptarget }, function (err, dx) {
                if (!err) {
                    var results = { 'data': namespace+"."+newName, 'status': 'success' };
                    res.send(results);
                }
            });

        });

    },
    deleteCollection: function (req, res) {

    }
};
module.exports = collectionController;