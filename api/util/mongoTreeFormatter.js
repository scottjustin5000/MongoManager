
function mongoTreeFormatter(){

}

mongoTreeFormatter.prototype = {

    formatDbResponse: function (dbs, serverInfo) {
           
           var beg = "[{\"data\": \"Dbs\",\"state\" : \"open\", \"attr\":{\"id\":\"db1\"}, \"children\" : ["
                    var bdy = "";
                    var end = "] }]";
                    for (var u = 0; u < dbs.length; u++) {
                        bdy += "{\"data\":\"" + dbs[u].name + "\", \"state\":\"closed\", \"attr\":{\"id\":\"" + dbs[u].name + "\", \"serverName\":\""+serverInfo+ "\", \"type\":\"database\",\"size\":\"" + dbs[u].size + "\", \"isEmpty\":\"" + dbs[u].isEmpty + "\"}},";
                    }

           return beg + bdy.substring(0, bdy.length - 1) + end;
    },

    formatCollectionsResponse: function (collections, serverInfo) {

        var beg = "[{\"data\": \"collections\",\"state\" : \"open\", \"attr\":{\"id\":\"cl1\"}, \"children\" : ["
        var bdy = "";
        var end = "] }]";
        for (var i = 0; i < collections.length; i++) {

            var nme = collections[i].name;
            var cleanName = nme.substring(nme.search("\\.") + 1, nme.length);

            bdy += "{\"data\":\"" + cleanName + "\", \"state\":\"closed\", \"attr\":{\"id\":\"" + collections[i].name + "\",\"type\":\"collection\", \"server\":\"" + serverInfo + "\"}";


            bdy += ",\"children\":[{\"data\": \"indexes\",\"state\" : \"closed\", \"attr\":{\"id\":\"in1\", \"type\":\"index\", \"server\":\"" + serverInfo + "\", \"collection\":\"" + collections[i].name + "\"},"
            bdy += "\"children\":[]},{\"data\": \"properties\",\"state\" : \"closed\", \"attr\":{\"id\":\"prop1\", \"type\":\"property\",  \"server\":\"" + serverInfo + "\", \"collection\":\"" + collections[i].name + "\"}, \"children\" : []}]},"

        }
   
        return beg + bdy.substring(0, bdy.length - 1) + end;

    },
    formatPropertyResponse:function(properties){
          var beg = "["
        var bdy = "";
        var end = "]";
        for(var i=0; i< properties.length; i++){
            bdy += "{\"data\":\"" + properties[i] + "\", \"state\":\"\", \"attr\":{\"id\":\"" +properties[i]+ "\"}},";

        }
        return beg + bdy.substring(0, bdy.length - 1) + end;
    },
      formatIndexResponse:function(indexes){
          var beg = "["
        var bdy = "";
        var end = "]";
        for(var i=0; i< indexes.length; i++){
            bdy += "{\"data\":\"" + indexes[i] + "\", \"state\":\"\", \"attr\":{\"id\":\"" +indexes[i]+ "\"}},";

        }
        return beg + bdy.substring(0, bdy.length - 1) + end;
    }

};
module.exports = mongoTreeFormatter;