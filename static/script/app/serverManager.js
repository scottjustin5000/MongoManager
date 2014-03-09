!(function (factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(require('pubsub'), require('datacontext'), require('config.messages'), require('config.route'),exports);
        //AMD
    } else if (typeof define === "function" && define.amd) {
        define('serverManager',['pubsub','datacontext', 'config.messages', 'config.route'], factory);
        //normal script tag
    } else {
        window.queryManager = factory(pubsub,datacontext);
    }
}(function serverManager (pubsub,dtx, messages, routes) {
    
var loadServers = function(sid,callback){

 dtx.postJson(routes.server.allServers, { id: sid },
           function (result) {
                callback.call(this, result);
    });

};

var getCollectionStats = function(reqData,callback){
    
    dtx.postJson(routes.queries.collectionStats, reqData,
                               function (r) {
                                   callback.call(this,r);

                               });
};

var renameCollection = function(dat, callback){

dtx.postJson(routes.collection.renameCollection, { data: dat },
                    function (r) {
                        callback.call(this,r);
                    });
};

var createServer = function(data,callback){
 dtx.postJson(routes.server.newServer, data,
        function (r) {
            console.log(r);
        });
};
   
    return {
        loadServers: loadServers,
        getCollectionStats:getCollectionStats,
        renameCollection:renameCollection,
        createServer:createServer
    }
}));