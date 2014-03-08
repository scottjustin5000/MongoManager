define('vm.queryEditor', ['jquery', 'ko', 'config.messages',
 'pubsub', 'ace', 'toastr', 'base64', 'queryManager','serverManager'],
 function ($, ko, message, pubsub, ace, toastr, base64, queryManager, serverManager) {
    var visible = ko.observable(true);
    var loaded = false;
    var queries = {};
    var activeQuery = '';
    var queryContent = ko.observable('');
    var servers = ko.observableArray(['Select Server']);
    var selectedServer = ko.observable('');
    var documentResults = ko.observableArray([]);
    var db = ko.observable('');
    var currentSelect;
    var currentId = ko.observable();
    var dragging = false;
    var currentCollection = ko.observable('');
    var jsonPreview = ko.observable('');
    var newCollection = ko.observable('');
    var collectionSize = ko.observable('');
    var collectionMax = ko.observable('');
    var tabCount = 1;
    var queryLanguage = ko.observable('mongo');
    var capCollection = ko.observable(false);
    var newDbName = ko.observable('');
    
    var show = function () {
         visible(true);
         $("#queryEditor").show();
         pubsub.sub(message.serverTree.objSelectionChanged, serverTreeSelectionChange);
        
     };
    
    var hide = function () {
        pubsub.unsub(message.serverTree.objSelectionChanged);
        visible(false);
        $("#queryEditor").hide();
    };

    var load = function () {
        if (!loaded) {
            attachStyles();
            attachEvents();
            serverManager.loadServers(0,
           function (r) {
               for (var i = 0; i < r.data.children.length; i++) {
                   servers.push(r.data.children[i].data);
               }
           });
        }
        loaded = true;
    };

    var attachStyles = function () {

        var editor = ace.edit("code_1");
        editor.setTheme("ace/theme/tomorrow");
        editor.getSession().setMode("ace/mode/javascript");

        $("#splitterContainer").splitter({ minAsize: 100, maxAsize: 300, splitVertical: true, A: $('#leftPane'), B: $('#rightPane'), slave: $("#rightSplitterContainer"), closeableto: 0 });
        $("#rightSplitterContainer").splitter({ splitHorizontal: true, A: $('#rightTopPane'), B: $('#rightBottomPane'), closeableto: 100 });
        
        var navitem = $("#tabs ul li");
        var ident = $(navitem)[0].id.split("_")[1];

         navitem.parent().attr("data-current", ident);
         navitem.addClass("tabActiveHeader");

        $('.tabpage').each(function(i, obj) {
            if(i===0){
                $(this).show();
            }else{
                $(this).hide();
            }
        });

        $('#tabs ul li').each(function(i, obj) {
            $(this).on('click', displayPage);
        });
    };

    var attachEvents = function () {

        $("#rightPane").on('mousemove', onMouseMove);
        $("#rightPane").on('mouseup', onMouseUp);
        $('#docoverlay').on('mousedown', onMouseDown);
        $('#closeNewCollection, #cancelCreateCollection').on('click', function (e) {
            e.preventDefault();
            $('#crtoverlay').hide();
        });
        $('#closeNewDb, #cancelCreateDb').on('click', function (e) {
            e.preventDefault();
            $('#crtDbOverlay').hide();
        });
        $("#createCollection").on('click', sendNewCollection);
        $("#createNewDb").on('click', sendNewDb);
        $('.queryButton').on('click', controlPanelClick);

    };

    var controlPanelClick = function (e) {
        switch (e.currentTarget.id) {

            case "executeQuery":
                executeQuery();  
                break;
            case "newDb":
                newDb(e);
                break;
            case "newQuery":
                newQuery();
                break;
            case "cancelQuery":
                cancelQuery();
                break;
            case "newcol":
                newCollectionRequest(e);
                break;
        }
    };

    var toggleOver = function (data, evt) {

         if (currentSelect) {

             $(currentSelect).on('mouseout', toggleOut);
             $('#docoverlay').hide();
             currentSelect = null;
         }
         currentId(data.properties._id);
         jsonPreview(JSON.stringify(data.properties, null, 4));
         var mouseX = evt.pageX;
         var mouseY = evt.pageY - 200;

         $('#docoverlay').css({ 'top': mouseY, 'left': mouseX });
         $('#docoverlay').show();

     };

    var toggleOut = function (data, evt) {
        $('#docoverlay').hide();
    };

    var stickPreview = function (data, evt) {
         var elm = $(evt.currentTarget);
         currentSelect = elm;
         $(elm).off('mouseout');
     };
     
     var onMouseMove = function (e) {
         if (dragging) {
             $('#docoverlay').css({ 'top': e.clientY - 10, 'left': e.clientX - 10 });
         }

     };

     var onMouseUp = function () {
         document.body.style.cursor = 'default';
         dragging = false;
     };

     var onMouseDown = function (e) {
         document.body.style.cursor = 'move';
         document.onselectstart = function () { return false; };
         dragging = true;
     };
     /* saveQuery = function () {
     var elm = $(evt.target);
     elm.stop().fadeToggle("slow", "linear");
     },*/
    var newQuery = function () {

        var con = $("#tabscontent").find("div:visible");

        var at = $(".tabActiveHeader");
        $(at[0]).removeClass('tabActiveHeader');

        var index = $(at[0].id).selector.split("_")[1];
        queries[index.toString()] = getSettings();

        documentResults.removeAll();
        selectedServer('Select Server');
        db('');

        tabCount++;
        $("<div/>", {
            id: "tabpage_" + tabCount
        }).appendTo("#tabscontent").html('<div id="code_' + tabCount + '" style="width: 100%; height: 100%; min-height:500px"></textarea>');
        $("<li/>", {
            id: "tabHeader_" + tabCount,
            class: "tabActiveHeader"
        }).appendTo("#tabs ul").html("Query " + tabCount).on("click",displayPage);
 var editor = ace.edit("code_"+tabCount);
        editor.setTheme("ace/theme/tomorrow");
        editor.getSession().setMode("ace/mode/javascript");
        
        $(con[0]).hide();

    };

    var newDb = function (evt) {
        var mouseX = evt.pageX - 200;
        var mouseY = evt.pageY;

        $('#crtDbOverlay').css({ 'top': mouseY, 'left': mouseX });
        $('#crtDbOverlay').show();

    };

    var sendNewDb = function () {
        var query = { 'server': selectedServer(), 'db': newDbName() };
        queryManager.createNewdatabase(query);

        pubsub.sub(messages.data.query.newDbRequest,
           function (r) {
               var data2 = JSON.stringify(r.data, null, 4);
               toastr.success(data2);
               pubsub.unsub(messages.data.query.newDbRequest);
           });
    };
    
   var executeQuery = function () {

            var con = $("#tabscontent").find("div:visible");
            var index = con[0].id.split("_")[1];
            var editor = ace.edit("code_" + index);
            var queryText = editor.getValue().replace(/(\r\n|\n|\r)/gm, "");
            var server = selectedServer();

            var datab = db();
            var query = { 'serverName': server, 'db': datab, 'queryText': queryText, 'language': queryLanguage() };

            documentResults.removeAll();
             
            if (queryLanguage() === 'mongo' && queryText.indexOf('.createCollection(') !== -1) {
                toastr.error('Not supported in query editor. Use the create new collection button', 'Error')
            }
            else {
                queryManager.queryRequest(query);
                pubsub.sub(message.query.executeQuery,queryHandler);
            }

    };

    var queryHandler = function(r){
          if(r.language ==='mongo'){
              if (r.cmd === 'find') {
                          var data = JSON.parse(r.data);

                          currentCollection(r.collection);
                          for (var j = 0; j < data.length; j++) {
                              dr = { "id": data[j]._id, "properties": data[j], "editable": true };
                              documentResults.push(dr);
                          }
                          $("#documentPanel").show();
                          pubsub.pub(message.data.cacheCollection, data);
                      }
                      else if (r.cmd === 'mapReduce') {
                          var data = JSON.parse(r.data);

                          currentCollection(r.collection);
                          for (var j = 0; j < data.length; j++) {
                              dr = { "id": data[j]._id, "properties": data[j], "editable": false };
                              documentResults.push(dr);
                          }
                          $("#documentPanel").show();
                      }
                      else {
                          toastr.success(r.cmd + " Complete!");
                      }
          }
          else{
                 if (r.cmd === 'find') {
                          var data = JSON.parse(r.data);

                          currentCollection(r.collection);
                          for (var j = 0; j < data.length; j++) {
                              dr = { "id": data[j]._id, "properties": data[j], "editable": true };
                              documentResults.push(dr);
                          }
                          $("#documentPanel").show();
                          pubsub.pub(message.data.cacheCollection, data);
                      }
                      else {
                          toastr.success(r.cmd + " Complete!");
                      }
          }
          pubsub.unsub(message.query.executeQuery);
    };

    var documentSelected = function (data, event) {
        var obj = data.properties._id + "&&" + currentCollection() + "&&" + selectedServer() + "&&" + db();
        pubsub.pub(message.navigation.selectionChanged, 'documentDetail', base64.toBase64(obj));
    };

    var serverTreeSelectionChange = function (evt) {
        if (evt.type == "server") {
            selectedServer(evt.id);
        }
        else {
            db(evt.id);
        }
    };

    var getSettings = function () {
        var server = selectedServer();
        var datab = db();
        var qt = queryLanguage();
        var items = [];
        ko.utils.arrayForEach(documentResults(), function (item) {
            items.push(item);
        });

        return { 'serverName': server, 'db': datab, 'results': items, 'queryType': qt, 'currentCollection': currentCollection() };
    };

    var resetValues = function (obj) {
        selectedServer(obj.serverName);
        db(obj.db);
        currentCollection(obj.currentCollection);
        for (var i = 0; i < obj.results.length; i++) {
            documentResults.push(obj.results[i]);
        }
    };

    var displayPage = function () {

        var con = $("#tabscontent").find("div:visible");
        var current = con[0].id.split("_")[1];

        document.getElementById("tabHeader_" + current).removeAttribute("class");
        document.getElementById("tabpage_" + current).style.display = "none";

        queries[current.toString()] = getSettings();

        documentResults.removeAll();

        var ident = this.id.split("_")[1];
        var obj = queries[ident.toString()];

        resetValues(obj);

        this.setAttribute("class", "tabActiveHeader");
        document.getElementById("tabpage_" + ident).style.display = "block";
        this.parentNode.setAttribute("data-current", ident);

    };

    var newCollectionRequest = function (evt) {
        var mouseX = evt.pageX - 200;
        var mouseY = evt.pageY;

        $('#crtoverlay').css({ 'top': mouseY, 'left': mouseX });
        $('#crtoverlay').show();
    };

    var sendNewCollection = function (e) {
        e.preventDefault();
        $('#crtoverlay').hide();
            var server = selectedServer();
            var datab = db();

            var cmd = { 'server': server, 'db': datab, 'collection': newCollection() };
            if (capCollection() == true) {
                cmd.options = { capped: true, size: collectionSize(), max: collectionMax() };
            }

            pubsub.sub(message.data.query.newCollectionRequest,
           function (r) {
               for (var i = 0; i < r.data.children.length; i++) {
                   servers.push(r.data.children[i].data);
               }
           });
        
    };

     return {
         visible: visible,
         db: db,
         currentId: currentId,
         documentSelected: documentSelected,
         currentCollection: currentCollection,
         queryContent: queryContent,
         servers: servers,
         toggleOver: toggleOver,
         toggleOut: toggleOut,
         selectedServer: selectedServer,
         collectionSize: collectionSize,
         collectionMax: collectionMax,
         displayPage: displayPage,
         documentResults: documentResults,
         jsonPreview: jsonPreview,
         stickPreview: stickPreview,
         newCollection: newCollection,
         newDbName: newDbName,
         capCollection: capCollection,
         queryLanguage: queryLanguage,
         load: load,
         hide: hide,
         show: show
     }

 });