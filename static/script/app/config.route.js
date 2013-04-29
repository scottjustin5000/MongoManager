define('config.route', [],
function () {
    var routes = {
        
        server:{
          allServers:"api/allServers", 
          newServer:"api/newServer" 
        },
        queries:{
          documentQuery:"api/documentQuery",
          replaceDocument:"api/replaceDocument",
          serverStats:"api/serverStats",
          dbStats:"api/dbStats",
          collectionStats:"api/collectionStats"
        },
        commands: {
           createCollection:"api/createCollection",
           addUser:"api/addUser" 
        }

    };
    return routes;
});