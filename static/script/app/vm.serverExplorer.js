define('vm.serverExplorer', ['jquery', 'ko', 'config.route', 'config.messages', 'datacontext', 'pubsub'],
function ($, ko, route, message, dtx, pubsub) {
    var 
    loaded = false,
    serverCredentials = {},
    invalidated = true,
    droptarget = false;
    load = function () {
        if (!loaded) {
            $('#serverConnection').bind('click', function (e) {
                $('#overlay').show();
                displayOverlay(true);

            });
            $('#closeColStats').bind('click', function (e) {
                $('#colStatsOverlay').hide();
            });
        }
        if (!loaded && invalidated) {
            $("#connect").bind('click', connect);
            dtx.postJson('api/allServers', { id: '0' },
           function (r) {
               $("#serverTree").jstree({
                   "json_data": {
                       "data": r.data,
                       "ajax": {
                           "method": "POST",
                           "url": "api/expandNavigation",
                           "data": function (n) {

                               if (n.attr("type") === "server") {
                                   return { id: n.attr ? n.attr("id") : 0, type: n.attr("type") };
                               }

                               switch (n.attr("type")) {
                                   case "server":
                                       return { server: n.attr("id"), type: n.attr("type") };
                                   case "database":
                                       return { db: n.attr("id"), server: n.attr("servername"), type: n.attr("type") };
                                   case "index":
                                   case "property":
                                       var arr = n.attr("collection").split('.');
                                       return { db: arr[0], collection: arr[1], server: n.attr("server"), type: n.attr("type") };
                               }


                           }
                       }
                   },
                   "plugins": ["themes", "json_data", "crrm", "ui", "contextmenu"],
                   "contextmenu": {
                       "items": function ($node) {

                           if ($node.attr("type") == "collection") {
                               return {
                                   "Rename": {
                                       "label": "Rename",
                                       "action": function (obj) {
                                           this.rename(obj);
                                           if (obj) {
                                               droptarget = false;
                                           }

                                       }
                                   },
                                   "Rename w/ Drop Target": {
                                       "label": "Rename w/ Drop Target",
                                       "action": function (obj) {
                                           this.rename(obj);
                                           if (obj) {
                                               droptarget = true;
                                           }
                                       }
                                   }
                               }
                           }

                       }

                   }
               }).bind("select_node.jstree", function (e, data) {


                   switch (data.rslt.obj.attr("type")) {
                       case "server":
                           pubsub.mediator.Publish(message.serverTree.objSelectionChanged, { "type": data.rslt.obj.attr("type"), "id": data.rslt.obj.attr("id") });
                           break;
                       case "database":
                           pubsub.mediator.Publish(message.serverTree.objSelectionChanged, { "type": data.rslt.obj.attr("type"), "id": data.rslt.obj.attr("id") });
                           break;
                       case "collection":

                           var info = data.rslt.obj.attr("id");
                           var infArray = info.split('.');
                           currentCollection(infArray[1]);

                           var reqData = { server: data.rslt.obj.attr("server"), db: infArray[0], collection: infArray[1] };
                           var mouseX = data.rslt.e.pageX;
                           var mouseY = data.rslt.e.pageY;
                           dtx.postJson(route.queries.collectionStats, reqData,
                               function (r) {
                                   var text = JSON.stringify(r.data, null, 4);
                                   statPreview(text);


                                   $('#colStatsOverlay').css({ 'top': mouseY, 'left': mouseX + 35 });
                                   $("#colStatsOverlay").show();

                               });
                           break;

                   }
               }).bind("rename.jstree", function (e, data) {


                   var serv = data.rslt.obj.attr("server");
                   var id = data.rslt.obj.attr("id");
                   var nn = data.rslt.new_name;
                   var on = data.rslt.old_name;
        
                   var dat = { server: serv, namespace: id.split('.')[0],oldName:on, newName:nn, drop:droptarget };
                   dtx.postJson(route.collection.renameCollection, { data: dat },
                    function (r) {
                        $(data.rslt.obj).attr("id", r.data);
                    });
                   

               });
           },
           function (err) {
               console.log(err);

           });

            loaded = true;
            invalidated = false;
        }

    },
    connect = function () {

        var serv = server();
        var arr = serv.split(':');
        var port = (arr.length > 1) ? arr[1] : 27017;
        if (user() && pw()) {
            serverCredentials[serv] = { u: user(), p: pw() };
            user('');
            pw('');
        }

        $("#serverTree").jstree("create", "#rootServer", "last",
        { "data": serv, "state": "closed", "attr": { "id": serv, "port": port, "type": "server"} }
        , false, true);
        displayOverlay(false);
        $('#overlay').hide();

        if (persist()) {
            var dat = { server: serv, port: port };
            dtx.postJson(route.server.newServer, { data: dat },
        function (r) {
            console.log(r);
        });
        }
    },
    close = function () {

        displayOverlay(false);
        $('#overlay').hide();
    },
    show = function () {

    },
    hide = function () {

    };
    displayOverlay = ko.observable(false);
    persist = ko.observable(true);
    server = ko.observable('');
    user = ko.observable('');
    pw = ko.observable('');
    currentCollection = ko.observable('');
    statPreview = ko.observable('');
    return {
        displayOverlay: displayOverlay,
        persist: persist,
        server: server,
        currentCollection: currentCollection,
        statPreview: statPreview,
        user: user,
        pw: pw,
        close: close,
        connect: connect,
        load: load,
        show: show,
        hide: hide
    }

});