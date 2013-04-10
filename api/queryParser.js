var queryData = require("./models/queryData.js");

module.exports = function () {

    var 
    keyword = ['findOne', 'find', 'count'],
    parse = function (query) {

        if (query.indexOf('.count')!==-1) {
            return parseCountQuery(query);
        }
        else {
            return parseFindQuery(query);
        }
    },
    parseCountQuery = function (query) {

    },
    parseFindQuery = function (query) {

        var collection = query.substring(0, query.indexOf('.find')).replace('db.', '');

        var q = new queryData();
        q.collection = collection;
        var matcher = query.match("\\((.*)\\)");

        var body = matcher[1];
        if (query.indexOf(".findOne") !== -1) {

            q.query = "function(res,db){var col = db.collection('" + collection + "'); col.findOne(" + body + ", function (err, doc) { if (err) { res.send(err); } var result = {'collection': '"+ collection+"', 'data': JSON.stringify(doc), 'status': 'success' }; res.send(result) });}";
        }
        else {

            q.query = "function(res,db){var col = db.collection('" + collection + "'); col.find(" + body + ").toArray(function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '"+ collection+"', 'data': JSON.stringify(doc), 'status': 'success' };res.send(dd);});}";
        }
        return q;

    };
    return {
        parse: parse
    }


} ();
