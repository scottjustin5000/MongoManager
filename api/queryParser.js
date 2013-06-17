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
            q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.remove(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success', 'cmd':'remove' };res.send(dd);});}";
        }
        else {
            q.query = "function(res,db){var col = db.collection('" + collection + "'); col.remove(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success','cmd':'remove' };res.send(dd);});}";
        }


        return q;
    },
    parseFindQuery = function (query) {

        var collection = getCollection(query, '.find');

        var q = new queryData();
        q.collection = collection;

        var body = getBody(query);

        if (query.indexOf(".findOne") !== -1) {
            if (body.indexOf("ObjectId") !== -1) {
                q.query = "function(res,db){var col = db.collection('" + collection + "');  var ObjectId = db.bson_serializer.ObjectID; col.findOne(" + body + ", function (err, doc) { if (err) { res.send(err); } var result = {'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success','cmd':'find' }; res.send(result) });}";
            }
            else {
                q.query = "function(res,db){var col = db.collection('" + collection + "'); col.findOne(" + body + ", function (err, doc) { if (err) { res.send(err); } var result = {'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success', 'cmd':'find' }; res.send(result) });}";
            }

        }
        else {
            if (body.indexOf("ObjectId") !== -1) {
                q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.find(" + body + ").toArray(function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success', 'cmd':'find' };res.send(dd);});}";
            }
            else {
                q.query = "function(res,db){var col = db.collection('" + collection + "'); col.find(" + body + ").toArray(function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success', 'cmd':'find' };res.send(dd);});}";
            }

        }
        return q;

    },
     parseFindAndModify = function (query) {

         var collection = getCollection(query, '.findAndModify');
         var q = new queryData();
         q.collection = collection;

         var body = getBody(query);
         var obj = eval("(" + body + ')');

         if (body.indexOf("ObjectId") !== -1) {
             q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.findAndModify(" + JSON.stringify(obj.query) + "," + JSON.stringify(obj.sort) + "," + JSON.stringify(obj.update) + ",function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success', 'cmd':'findAndModify' };res.send(dd);});}";
         }
         else {
             q.query = "function(res,db){var col = db.collection('" + collection + "'); col.findAndModify(" + JSON.stringify(obj.query) + "," + JSON.stringify(obj.sort) + "," + JSON.stringify(obj.update) + ",function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success','cmd':'findAndModify' };res.send(dd);});}";
         }
         console.log(q.query);
         return q;

     },
     parseUpdate = function (query) {
         var collection = getCollection(query, '.update');

         var q = new queryData();
         q.collection = collection;

         var body = getBody(query);

         if (body.indexOf("ObjectId") !== -1) {
             q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.update(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success','cmd':'update' };res.send(dd);});}";
         }
         else {
             q.query = "function(res,db){var col = db.collection('" + collection + "'); col.update(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success', 'cmd':'update' };res.send(dd);});}";
         }
         return q;
     },
    parseInsert = function (query) {

        var collection = getCollection(query, '.insert');

        var q = new queryData();
        q.collection = collection;

        var body = getBody(query);

        if (body.indexOf("ObjectId") !== -1) {
            q.query = "function(res,db){var col = db.collection('" + collection + "'); var ObjectId = db.bson_serializer.ObjectID; col.insert(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success','cmd':'create' };res.send(dd);});}";
        }
        else {
            q.query = "function(res,db){var col = db.collection('" + collection + "'); col.insert(" + body + " ,function (err, result) {if (err) { res.send(err); } var dd = { 'data': JSON.stringify(result), 'status': 'success','cmd':'create' };res.send(dd);});}";
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
        parseUpdate: parseUpdate,
        parseInsert: parseInsert,
        parseFindAndModify: parseFindAndModify
    }


} ();
