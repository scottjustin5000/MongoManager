var sqlParser = require('./sqlParser.js');

function sql2mongo(command){
     this.serverName = command.serverName;
     this.dbName = command.db;
     this.query = command.queryText; 
      this.objectIdClause = '';
     this.clauseSet = false;
}
sql2mongo.prototype = {

    convert: function () {
        var ast = sqlParser.sql2ast(this.query);
        console.log(ast);
        if (ast.hasOwnProperty('SELECT')) {
            return this.convertSelect(ast);
        }
        else if (ast.hasOwnProperty('INSERT')) {
            return this.convertInsert(ast);
        }
        else if (ast.hasOwnProperty('UPDATE')) {
            return this.convertUpdate(ast);
        }
        else if (ast.hasOwnProperty('DELETE')) {
            return this.convertDelete(ast);
        }
    },
    //need to handle map reduce/aggregates
    //more complex or/and combos
    convertSelect: function (ast) {
        var columnClause = '{}';
        var whereClause = '';
        var limitClause = ast['LIMIT'];
        var sortClause = ast['ORDER BY'];
        var collection = ast['FROM'];
        var columns = ast['SELECT'];
        if (columns[0].indexOf('*') === -1) {

            columnClause = "{";

            for (var s = 0; s < columns.length; s++) {
                columnClause += columns[s] + ": 1,";
            }
            columnClause = columnClause.substring(0, columnClause.length - 1);
            columnClause += "}";
        }

        var where = ast['WHERE'];
        if (where) {

            whereClause = this.processWhere(where);

        }

        var findClause = "col.find({" + whereClause + '},' + columnClause + ")";

        if (sortClause) {
            for (var i = 0; i < sortClause.length; i++) {
                var direction = sortClause[i].order == "asc" ? 1 : -1;
                findClause += ".sort({" + sortClause[i].column + ":" + direction + "})";
            }
        }
        if (limitClause) {
            findClause += ".limit(" + limitClause.nb + ")";
        }
        var query = "function(res,db){var col = db.collection('" + collection + "');" + this.objectIdClause + " " + findClause + ".toArray(function (err, doc) {if (err) { res.send(err); } var dd = { 'collection': '" + collection + "', 'data': JSON.stringify(doc), 'status': 'success', 'cmd':'find' };res.send(dd);});}";
        //console.log(query);
        return query;

    },
    convertInsert: function (ast) {
        var ins = ast["INSERT INTO"];
        var values = ast["VALUES"][0];
        var collectionName = ins.table;
        var query = '';
        for (var i = 0; i < ins.columns.length; i++) {

            query +=ins[i] + ":"+values[i] +",";
        }
    },
    convertUpdate: function (ast) {

    },
    convertDelete: function (ast) {

    },
    processWhere: function (where) {
        var whereClause = '';
        if (where.hasOwnProperty('logic')) {
            whereClause = this.buildLogicalWhere(where);
        }
        else {
            if (where.left.indexOf("_id") !== -1) {
                this.objectIdClause = 'var ObjectId = db.bson_serializer.ObjectID;'
            }
            whereClause = this.buildWhere(where);
        }
        return whereClause;
    },
    buildLogicalWhere: function (where) {
        var whereClause = '';
        var ands = '';
        var orterms = [];

        for (var t = 0; t < where.terms.length; t++) {
            if (where.terms[t].hasOwnProperty('logic')) {
                whereClause += this.buildLogicalWhere(where.terms[t])
            }
            else {
                if (where.logic === 'and') {
                    ands += this.buildWhere(where.terms[t]) + ",";
                }
                else {
                    orterms.push(this.buildWhere(where.terms[t]));
                }
                if (!this.clauseSet && where.terms[t].left.indexOf("_id") !== -1) {
                    this.objectIdClause = 'var ObjectId = db.bson_serializer.ObjectID;'
                }
            }
        }

        if (ands !== '') {
            if (whereClause !== '') {
                whereClause = whereClause + "," + ands.substring(0, ands.length - 1);
            }
            else {
                whereClause = ands.substring(0, ands.length - 1);
            }
        }
        if (orterms.length > 0) {
            var orClause = '';
            for (var o = 0; o < orterms.length; o++) {
                orClause += '{' + orterms[o] + '},';
            }
            var or = " $or:[" + orClause.substring(0, orClause.length - 1) + "]";

            if (whereClause !== '') {

                whereClause += "," + or;
            }
            else {
                whereClause = or;
            }
        }

        return whereClause;
    },

    buildWhere: function (where) {
        var whereClause = "";

        if (where.operator === '=') {
            if (where.left.indexOf("_id") !== -1) {
                whereClause += "_id: ObjectId(" + where.right + ")";
            }
            else {
                whereClause += where.left + ":" + where.right;
            }
        }
        else {
            whereClause = this.buildComplex(where);
        }
        return whereClause;
    },

    buildComplex: function (where) {
        var mongoOperator = '';
        var whereClause = '';
        switch (where.operator) {
            case "!=":
            case "<>":
                mongoOperator = "$ne";
                break;
            case ">":
                mongoOperator = "$gt";
                break;
            case ">=":
                mongoOperator = "$gte";
                break;
            case "<":
                mongoOperator = "$lt";
                break;
            case "<=":
                mongoOperator = "$lte";
                break;
        }

        if (where.left.indexOf("_id") !== -1) {
            whereClause += "_id: {" + mongoOperator + ":" + "ObjectId(" + where.right + ")}";
        }
        else {
            whereClause += where.left + ":" + "{" + mongoOperator + ":" + where.right + "}";
        }
        return whereClause
    }


}
module.exports = sql2mongo;