var queryData = require("./models/queryData.js");

module.exports = function () {

    var 
    keyword = ['findOne', 'find', 'count'],
    parseSelect = function (query) {

        if (query.indexOf('.count') !== -1) {
            return parseCountQuery(query);
        }
        else {
            return parseFindQuery(query);
        }
    },
    parseCountQuery = function (query) {

    },
    parseManagementQuery = function (query) {

    },
    parseRemove = function (query) {
        var collection = getCollection(query, '.remove');

        var q = new queryData();
        q.collection = collection;

        var body = getBody(query);

        if (body.indexOf("ObjectId") !== -1) {
            q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.remove(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success' };res.send(dd);});}";
        }
        else {
            q.query = "function(res,db){var col = db.collection('" + collection + "'); col.remove(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success' };res.send(dd);});}";
        }


        return q;
    },
    parseFindQuery = function (query) {

        var collection = getCollection(query, '.find');
        // query.substring(0, query.indexOf('.find')).replace('db.', '');

        var q = new queryData();
        q.collection = collection;
        //var matcher = query.match("\\((.*)\\)");
        //matcher[1];
        var body = getBody(query);

        if (query.indexOf(".findOne") !== -1) {
            if (body.indexOf("ObjectId") !== -1) {
                q.query = "function(res,db){var col = db.collection('" + collection + "');  var ObjectId = db.bson_serializer.ObjectID; col.findOne(" + body + ", function (err, doc) { if (err) { res.send(err); } var result = {'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success' }; res.send(result) });}";
            }
            else {
                q.query = "function(res,db){var col = db.collection('" + collection + "'); col.findOne(" + body + ", function (err, doc) { if (err) { res.send(err); } var result = {'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success' }; res.send(result) });}";
            }

        }
        else {
            if (body.indexOf("ObjectId") !== -1) {
                q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.find(" + body + ").toArray(function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success' };res.send(dd);});}";
            }
            else {
                q.query = "function(res,db){var col = db.collection('" + collection + "'); col.find(" + body + ").toArray(function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success' };res.send(dd);});}";
            }

        }
        return q;

    },
     parseUpdate = function (query) {
        var collection = getCollection(query, '.update');

        var q = new queryData();
        q.collection = collection;

        var body = getBody(query);

        if (body.indexOf("ObjectId") !== -1) {
            q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.remove(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success' };res.send(dd);});}";
        }
        else {
            q.query = "function(res,db){var col = db.collection('" + collection + "'); col.remove(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success' };res.send(dd);});}";
        }


        return q;
    },
    getCollection = function (query, key) {
        return query.substring(0, query.indexOf(key)).replace('db.', '');
    },
    getBody = function (query) {
        var matcher = query.match("\\((.*)\\)");

        return matcher[1];
    };
    return {
        parseSelect: parseSelect,
        parseRemove: parseRemove,
        parseUpdate:parseUpdate
    }


} ();
