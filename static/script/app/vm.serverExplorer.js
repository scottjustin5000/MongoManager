define('vm.serverExplorer', ['jquery', 'ko', 'config.route', 'config.messages', 'datacontext', 'pubsub'],
function ($, ko, route, message, dtx, pubsub) {
    var 
    loaded = false,
    serverCredentials = {},
    invalidated = true,
    load = function () {
        if (!loaded) {
            $('#serverConnection').bind('click', function (e) {
                $('#overlay').show();
                displayOverlay(true);

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
                               console.log(n);
           
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
                                       console.log({ db: arr[0], collection: arr[1], server: n.attr("server"), type: n.attr("type") })
                                       return { db: arr[0], collection: arr[1], server: n.attr("server"), type: n.attr("type") };
                               }
                               //else need to gret db

                           }
                       }
                   },
                   "plugins": ["themes", "json_data", "crrm", "ui"]
               }).bind("select_node.jstree", function (e, data) {

                   switch (data.rslt.obj.attr("type")) {
                       case "server":
                           pubsub.mediator.Publish(message.serverTree.serverChanged, data.rslt.obj.attr("id"));
                           break;
                       case "database":
                           pubsub.mediator.Publish(message.serverTree.databaseChanged, data.rslt.obj.attr("id"));
                           break;
                       case "collection":
                           alert('collection ' + data.rslt.obj.attr("id"));
                           break;

                   }
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
    //db = ko.observable('');
    user = ko.observable('');
    pw = ko.observable('');
    return {
        displayOverlay: displayOverlay,
        persist: persist,
        server: server,
        // db: db,
        user: user,
        pw: pw,
        close: close,
        connect: connect,
        load: load,
        show: show,
        hide: hide
    }

});