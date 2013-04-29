var mongoClient = require('mongodb').MongoClient;

function userController(){
    
}
userController.prototype = {

    addUser: function (req, res) {
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
    }

};
module.exports = userController;