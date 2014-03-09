var express= require('express');
var query = require('../../services/queryService.js');
function routes(app){

	app.use(express.json());
    app.use(express.urlencoded());

	app.post('/api/replaceDocument', function (req, res) {
       var q = new query();
    q.executeReplace(req, res);
});
	app.post('/api/documentQuery', function (req, res) {
    var q = new query();
    q.executeMongo(req, res);
});
app.post('/api/sqlQuery', function (req, res) {
    var q = new query();
    q.executeSql(req, res);
});

};
module.exports = routes;