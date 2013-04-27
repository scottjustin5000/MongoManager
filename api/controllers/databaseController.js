var mongoIndex = require("../models/mongoIndex.js")
,mongoInstance = require("../models/mongoInstance.js")
,mongoCollection = require("../models/mongoCollection.js")
 ,async = require('async')
 ,mongoTreeFormatter = require("../util/mongoTreeFormatter.js")
,mongoClient = require('mongodb').MongoClient
,fs = require('fs');

function databaseController(){
    
}
databaseController.prototype = {
 
    getDbCollections: function (req, res) {
        var serverName = req.body.server;
        var dbName = req.body.db;
        var collections = new Array();
        mongoClient.connect("mongodb://" + serverName + "/" + dbName, function (err, db) {

                db.collectionNames(function (err, cols) {
                    if (err) {
                        console.log(err);
                      }
                 for (var f = 0; f < cols.length; f++) {
                 
                     if(cols[f].name.indexOf('.system') ===-1)
                     {
                         var nc = new mongoCollection();
                         nc.name =cols[f].name;
                         collections.push(nc);
                     }
                }
                  
                var m = new mongoTreeFormatter();
                var f = m.formatCollectionsResponse(collections, serverName);
 
                res.send(f);
               });
            }); 
    },
    getDbStats: function(req, res){
         var serverName = req.body.server;
         var dbName = req.body.db;
         
         mongoClient.connect("mongodb://" + serverName + "/" + dbName, function (err, db) {

            db.command({ dbStats: dbName }, function (err, dx) {
                if (!err) {
                    console.log(dx);
                    var results = "{ \"data\" :" + dx + ",\"status\":\"success\"}";
                    res.send(results);
                }

            });

        });
    }
    /*,
    getIndexInfo: function(collection){
        
        try{
            var dbname =  collection.name.substring(0, collection.name.search("\\."));
            var ndb = _db.db(dbname);
          
          ndb.indexInformation(collection.name, function (err, info) {
            if (err) {
            console.log(err);
            }
               collection.name = collection.name.replace(dbname+".", "");
               console.log(info);
             for(var i=0; i<info.length; i++){
                var idx = new mongoIndex();
               idx.name = "_id";
              
                 collection.indexes.push(idx);
             }
            
            });
        }catch(error){
            console.log('errr');
            console.log(error);
        }
         

           
    }*/
  
};
module.exports = databaseController;