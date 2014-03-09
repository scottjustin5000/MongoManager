!(function (factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require('pubsub'), require('datacontext'), require('config.messages'), require('config.route'),exports);
        //AMD
    } else if (typeof define === "function" && define.amd) {
        define('queryManager',['pubsub','datacontext', 'config.messages', 'config.route'], factory);
        //normal script tag
    } else {
        window.queryManager = factory(pubsub,datacontext);
    }
}(function queryManager (pubsub,dtx, messages, route) {
    
  var queryRequest= function (query) {
   // console.log(query);
       if (query.serverName && query.db) {
            if (query.language=== 'mongo') {
                 dtx.postJson(route.queries.documentQuery, { query: query },
                  function (r) {
                    r.language ='mongo';
                    pubsub.pub(messages.query.executeQuery, r);
                    });
            }
            else {
                dtx.postJson(route.queries.sqlQuery, { query: query },
                  function (r) {
                  r.language = 'sql';
                  pubsub.pub(messages.query.executeQuery, r);
                });
            }
        }else {
            alert("server and db required");
        }
    };

    var createNewDatabase = function(query){
     
        dtx.postJson(route.commands.createDb, query,
           function (r) {
            pubsub.pub(messages.query.newDbRequest, r);
           });
    }

    var createNewCollection = function(cmd){
        if (cmd.server && cmd.db) {

            dtx.postJson(route.commands.createCollection, cmd,
           function (r) {
               pubsub.pub(message.query.newCollectionRequest, r);
           });
        }
        else {
            alert("server and db required");
        }
    }
   
    return {
        queryRequest: queryRequest,
        createNewCollection:createNewCollection,
        createNewCollection:createNewCollection
    }
}));