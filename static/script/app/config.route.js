define('config.route', [],
function () {
    var routes = {
        
        server:{
          allServers:"api/allServers", 
          newServer:"api/newServer"
        },
        collection:{
            renameCollection:"api/renameCollection"
        },
        queries:{
          documentQuery:"api/documentQuery",
          sqlQuery:"api/sqlQuery",
          replaceDocument:"api/replaceDocument",
          serverStats:"api/serverStats",
          dbStats:"api/dbStats",
          collectionStats:"api/collectionStats",
          replSetGetStatus:"api/replSetGetStatus"
        },
        commands: {
           createCollection:"api/createCollection",
           addUser:"api/addUser",
           loadUsers: "api/loadUsers"
        }

    };
    return routes;
});