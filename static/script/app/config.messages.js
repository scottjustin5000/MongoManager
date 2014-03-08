define('config.messages', [],
function () {
    var message ={

        serverTree:{
            serverChanged:"serverChanged",
            databaseChanged: "databaseChanged",
            collectionChanged:"collectionChanged",
            objSelectionChanged:"objSelectionChanged"
        },
        mongo:{
            modeChanged:"modeChanged"
        },
        navigation:{
          documentSelected:"documentSelected",
          selectionChanged: "selectionChanged"  
        },
        query:{
          executeQuery:"executeQuery",
          newDbRequest:"newDbRequest",
          newQueryRequest:"newQueryRequest",
          cancelQueryRequest:"cancelQueryRequest",
          newCollectionRequest:"newCollectionRequest"
        },
        data:{
            cacheCollection:"cacheCollection"
           
        }


       };
    return message;
});