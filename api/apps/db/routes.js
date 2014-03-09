var express = require('express');
var databaseService = require('../../services/databaseService.js');
function routes(app){
	app.use(express.bodyParser());
	
	app.post('/api/createDb', function (req, res) {
    var dbController = new databaseService();
    dbController.getDbStats(req, res);
});
}
module.exports = routes;