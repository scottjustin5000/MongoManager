var express = require('express');
var userService = require('../../services/userService.js');

function routes(app){

app.use(express.bodyParser());

app.post('/api/addUser', function (req, res) {
    var uc = new userService();
    uc.addUser(req, res);
});
app.post('/api/loadUsers', function (req, res) {
    var uc = new userService();
    uc.loadUsers(req, res);
});
app.post('/api/removeUser', function (req, res) {
    var uc = new userService();
    uc.removeUser(req, res);
});
app.post('/api/editUser', function (req, res) {
    var uc = new userService();
    uc.editUser(req, res);
});

};
module.exports = routes;