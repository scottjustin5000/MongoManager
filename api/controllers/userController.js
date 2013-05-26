var mongoClient = require('mongodb').MongoClient,
async = require('async');

function userController(){
    
}
userController.prototype = {

    /* addUser: function (req, res) {
    var data = req.body.query;
    var serverName = data.serverName;
    var user = data.user;
    var pw = data.password;
    var opts = data.options;

    mongoClient.connect("mongodb://" + serverName + "/admin",
    function (err, db) {
    if (err) {
    console.log(err);
    }
    else {
    var admin = db.admin();
    admin.addUser(user, pw, opts,function (err, results) {
    if (!err) {
    var dd = {'status': 'success' };
    res.send(dd);
    }

    });
    }
    });
    }*/

    addUser: function (req, res) {

        var dataArray = req.body.data;
        var calls = [];
        dataArray.forEach(function (d) {
            mongoClient.connect("mongodb://" + d.server + "/" + d.db,
        function (err, db) {
            if (!err) {
                db.addUser(d.username, d.password, d.roles, function (err, res) {
                    callback(null,d);
                });
            }
            else {
                callback(err);
            }
        });
        });

        async.series(calls, function(err, result) {
        if (err){
           return console.log(err);
        }
          var result = {'status': 'success' };
          res.send(result);
      });
      

   }
};
module.exports = userController;