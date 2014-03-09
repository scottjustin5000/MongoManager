var express = require('express');
var collectionService = require('../../services/collectionService.js');

function routes(app){

app.use(express.json());
app.use(express.urlencoded());

app.post('/api/collectionStats', function (req, res) {
    var cnt = new collectionService();
    cnt.getCollectionStats(req, res);
});

};
module.exports = routes;