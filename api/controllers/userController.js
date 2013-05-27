var mongoClient = require('mongodb').MongoClient,
async = require('async');

function userController(){
    
}
userController.prototype = {

    addUser: function (req, res) {

        var dataArray = req.body.data;
        var calls = [];
        dataArray.forEach(function (d) {
            mongoClient.connect("mongodb://" + d.server + "/" + d.db,
        function (err, db) {
            if (!err) {
                db.addUser(d.username, d.password, d.roles, function (err, res) {
                    callback(null, d);
                });
            }
            else {
                callback(err);
            }
        });
        });

        async.series(calls, function (err, result) {
            if (err) {
                return console.log(err);
            }
            var result = { 'status': 'success' };
            res.send(result);
        });
    },
    loadUsers: function (req, res) {
        var serverName = req.body.data.server;
        var dbName = req.body.data.db;
        var userCollection = [];
        mongoClient.connect("mongodb://" + serverName + "/" + dbName, function (err, db) {

            var col = db.collection("system.users");

            col.find().toArray(function (err, users) {
       
                for (var i= 0; i <users.length; i++) {
                    userCollection.push(users[i].user);
                }
                var results = { "data": userCollection, "status": "success" };
                res.send(results);

            });
        });
    },
    editUser: function (req, res) {

    },
    removeUser: function (req, res) {

    }
};
module.exports = userController;