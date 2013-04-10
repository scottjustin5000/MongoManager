define('config.messages', [],
function () {
    var message ={

        serverTree:{
            serverChanged:"serverChanged",
            databaseChanged: "databaseChanged",
            collectionChanged:"collectionChanged"
        },
        navigation:{
          documentSelected:"documentSelected",
          selectionChanged: "selectionChanged"  
        },
        data:{
            cacheCollection:"cacheCollection"
           
        }


       };
    return message;
});