define('vm.queryEditor', ['jquery', 'ko', 'config.route', 'config.messages', 'datacontext', 'pubsub', 'ace'],
 function ($, ko, route, message, dtx, pubsub, ace) {
     var 
    visible = ko.observable(true),
    loaded = false,
    queries = {},
    activeQuery = '',
    queryContent = ko.observable(''),
    servers = ko.observableArray(['Select']),
    selectedServer = ko.observable(''),
    documentResults = ko.observableArray([]),
    db = ko.observable(''),
    currentSelect,
    currentId = ko.observable(),
    dragging = false,
    currentCollection = ko.observable(''),
    jsonPreview = ko.observable(''),
     tabCount = 1,
     show = function () {
         visible(true);
          pubsub.mediator.Subscribe(message.serverTree.objSelectionChanged, serverTreeSelectionChange);
         $("#queryEditor").show();
     },
    hide = function () {
        visible(false);
         pubsub.mediator.Remove(message.serverTree.objSelectionChanged);
       $("#queryEditor").hide();
    },
    load = function () {
        if (!loaded) {

            var editor = ace.edit("code_1");
            editor.setTheme("ace/theme/tomorrow");
            editor.getSession().setMode("ace/mode/javascript");
            pubsub.mediator.Subscribe(message.mongo.modeChanged, mongoModeChanged);
            dtx.postJson('api/allServers', { id: '0' },
           function (r) {
               for (var i = 0; i < r.data.children.length; i++) {
                   servers.push(r.data.children[i].data);
               }
           });

            $("#rightPane").bind('mousemove', onMouseMove);
            $("#rightPane").bind('mouseup', onMouseUp);
            $('#docoverlay').bind('mousedown', onMouseDown);

            $("#splitterContainer").splitter({ minAsize: 100, maxAsize: 300, splitVertical: true, A: $('#leftPane'), B: $('#rightPane'), slave: $("#rightSplitterContainer"), closeableto: 0 });
            $("#rightSplitterContainer").splitter({ splitHorizontal: true, A: $('#rightTopPane'), B: $('#rightBottomPane'), closeableto: 100 });

            var container = document.getElementById("queryEditor");

            var navitem = container.querySelector("#tabs ul li");

            var ident = navitem.id.split("_")[1];


            navitem.parentNode.setAttribute("data-current", ident);

            navitem.setAttribute("class", "tabActiveHeader");

            var pages = container.querySelectorAll(".tabpage");
            pages[0].style.display = "block";
            for (var i = 1; i < pages.length; i++) {
                pages[i].style.display = "none";
            }
            var tabs = container.querySelectorAll("#tabs ul li");
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].onclick = displayPage;
            }

            $('.queryButton').bind('click', function (e) {

                switch (e.currentTarget.id) {

                    case "executeQuery":
                        executeQuery();
                        break;
                    case "openQuery":
                        openQuery();
                        break;
                    case "saveQuery":
                        saveQuery();
                        break;
                    case "newQuery":
                        newQuery();
                        break;
                    case "cancelQuery":
                        cancelQuery();
                        break;
                }

            });
        }
        loaded = true;
    },
    toggleOver = function (data, evt) {

        if (currentSelect) {

            $(currentSelect).bind('mouseout', toggleOut);
            $('#docoverlay').hide();
            currentSelect = null;
        }
        currentId(data.properties._id);
        jsonPreview(JSON.stringify(data.properties, null, 4));
        var mouseX = evt.pageX;
        var mouseY = evt.pageY - 200;

        $('#docoverlay').css({ 'top': mouseY, 'left': mouseX });
        $('#docoverlay').show();

    },
    toggleOut = function (data, evt) {
        $('#docoverlay').hide();
    },
     stickPreview = function (data, evt) {
         var elm = $(evt.currentTarget);
         currentSelect = elm;
         $(elm).unbind('mouseout');
     },

     onMouseMove = function (e) {
         if (dragging) {
             $('#docoverlay').css({ 'top': e.clientY - 10, 'left': e.clientX - 10 });
         }

     },
     onMouseUp = function () {
         document.body.style.cursor = 'default';
         dragging = false;
     },
     onMouseDown = function (e) {
         document.body.style.cursor = 'move';
         document.onselectstart = function () { return false; };
         dragging = true;
     },
    saveQuery = function () {
        var elm = $(evt.target);
        elm.stop().fadeToggle("slow", "linear");
    },
    newQuery = function () {
        var con = $("#tabscontent").find("div:visible");

        var at = $(".tabActiveHeader");

        $(at[0]).removeClass('tabActiveHeader');
        var index = $(at[0].id).selector.split("_")[1];

        queries[index.toString()] = getSettings();

        documentResults.removeAll();
        selectedServer('Select');
        db('');

        tabCount++;
        $("<div/>", {
            id: "tabpage_" + tabCount
        }).appendTo("#tabscontent").html('<div id="code_"' + tabCount + '" style="width: 100%; height: 100%; min-height:500px"></textarea>');
        $("<li/>", {
            id: "tabHeader_" + tabCount,
            class: "tabActiveHeader"
        }).appendTo("#tabs ul").html("Query " + tabCount).click(displayPage);

        $(con[0]).hide();
    },
    openQuery = function () {

    },
   extractNumber = function (value) {
       var n = parseInt(value);
       return n == null || isNaN(n) ? 0 : n;
   },
    executeQuery = function () {
        if (selectedServer().length > 1 && db().length > 1) {

            var con = $("#tabscontent").find("div:visible");
            var index = con[0].id.split("_")[1];
            var editor = ace.edit("code_" + index);
            var query = editor.getValue();
            var server = selectedServer();

            var datab = db();
            var query = { 'serverName': server, 'db': datab, 'queryText': query };

            documentResults.removeAll();
  
            dtx.postJson(route.queries.documentQuery, { query: query },
           function (r) {

               var data = JSON.parse(r.data);

               currentCollection(r.collection);
               for (var j = 0; j < data.length; j++) {
                   dr = { "id": data[j]._id, "properties": data[j], "editable": true };
                   documentResults.push(dr);
               }
               $("#documentPanel").show();
               pubsub.mediator.Publish(message.data.cacheCollection, data);
           });
        }
        else {
            alert("server and db required");
        }

    },
    documentSelected = function (data, event) {
        var obj = data.properties._id + "~~" + currentCollection() + "~~" + selectedServer() + "~~" + db();
        pubsub.mediator.Publish(message.navigation.selectionChanged, 'documentDetail', obj);
    },
    serverTreeSelectionChange = function(evt){
        if(evt.type=="server"){
             selectedServer(evt.id);
        }
        else{
             db(evt.id);
        }
    },

    mongoModeChanged = function (mode) {
        console.log(mode);
    },
    getSettings = function () {
        var server = selectedServer();
        var datab = db();
        var qt = selectedModeType();
        var items = [];
        ko.utils.arrayForEach(documentResults(), function (item) {
            items.push(item);
        });

        return { 'serverName': server, 'db': datab, 'results': items, 'queryType': qt, 'currentCollection': currentCollection() };
    },
    resetValues = function (obj) {
        selectedServer(obj.serverName);
        db(obj.db);
        currentCollection(obj.currentCollection);
        for (var i = 0; i < obj.results.length; i++) {
            documentResults.push(obj.results[i]);
        }
    },
    displayPage = function () {

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
         displayPage: displayPage,
         documentResults: documentResults,
         jsonPreview: jsonPreview,
         stickPreview: stickPreview,
         load: load,
         hide: hide,
         show: show
     }

 });