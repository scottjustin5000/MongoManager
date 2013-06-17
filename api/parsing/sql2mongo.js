var sqlParser = require('./sqlParser.js');

function sql2mongo(command){
     this.serverName = command.serverName;
     this.dbName = command.db;
     this.query = command.queryText; 
}
sql2mongo.prototype = {

    convert:function(){
        var ast = sqlParser.sql2ast(this.query);
        console.log(ast);
    },
    convertSelect:function(command){
        
    },
    convertUpdate:function(command){
        
    },
    convertDelete:function(command){
        
    }
}
module.exports = sql2mongo;