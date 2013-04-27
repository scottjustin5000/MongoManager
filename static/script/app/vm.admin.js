define('vm.admin', ['jquery', 'ko', 'config.route', 'datacontext', 'config.messages', 'pubsub'],
 function ($, ko, route, dtx, message, pubsub) {

     var 
     loaded = false,
     commands = ko.observableArray(['serverStatus', 'replSetGetStatus', 'dbStats', 'collStats']),
     selectedCommand = ko.observable('serverStatus'),
     userCommands = ko.observableArray(['addUser', 'removeUser', 'selectUsers']),
     selectedUserCommand = ko.observable('addUser'),
     dbCommands = ko.observableArray(['addDb', 'removeDb']),
     selectedDbCommand = ko.observable('addDb'),
     adminSelectedServer = ko.observable(''),
     adminDb = ko.observable(''),
     adminCol = ko.observable(''),
     adminResult = ko.observable(''),
     load = function () {
         if (!loaded) {

             // $("#rightAdminSplitterContainer").splitter({ splitHorizontal: true, A: $('#adminRightTopPane'), B: $('#adminRightBottomPane'), closeableto: 100 });


             var container = document.getElementById("adminEditor");
             var navitem = container.querySelector("#adminTabs ul li");

             var ident = navitem.id.split("_")[1];

             navitem.parentNode.setAttribute("data-current", ident);

             navitem.setAttribute("class", "tabActiveHeader");

             var pages = container.querySelectorAll(".adminTabpage");
             pages[0].style.display = "block";
             for (var i = 1; i < pages.length; i++) {
                 pages[i].style.display = "none";
             }
             var tabs = container.querySelectorAll("#adminTabs ul li");
             for (var i = 0; i < tabs.length; i++) {
                 tabs[i].onclick = displayPage;
             }

             $('#executeCommand').bind('click', function (e) {

                 switch (selectedCommand()) {

                     case "serverStatus":
                         execServerStatus();
                         break;
                     case "dbStats":
                         execDbStats();
                         break;
                     case "replSetGetStatus":
                         break;
                 }

             });

         }
     },
     show = function () {
         $('#adminEditor').show();
         pubsub.mediator.Subscribe(message.serverTree.objSelectionChanged, serverTreeSelectionChange);

         load();
     },
     hide = function () {
         $('#adminEditor').hide();
         pubsub.mediator.Remove(message.serverTree.objSelectionChanged);

     },
    execServerStatus = function () {
        var query = { 'serverName': adminSelectedServer() };
        dtx.postJson(route.queries.serverStats, { query: query },
           function (r) {
               var data2 = JSON.stringify(r.data, null, 4);

               adminResult(data2);

           });
    },
    execDbStats = function () {
         var query = { 'server': adminSelectedServer(), 'db':adminDb() };
        dtx.postJson(route.queries.dbStats, { query: query },
           function (r) {
               var data2 = JSON.stringify(r.data, null, 4);

               adminResult(data2);

           });
    },
    execCollStats = function () {
        var query = { 'server': adminSelectedServer(), 'db':adminDb(), 'collection':adminCol() };
        dtx.postJson(route.queries.collectionStats, { query: query },
           function (r) {
               var data2 = JSON.stringify(r.data, null, 4);

               adminResult(data2);

           });
    },
     serverTreeSelectionChange = function (evt) {
         if (evt.type == "server") {
             adminSelectedServer(evt.id);
         }
         else {
             adminDb(evt.id);
         }
      
     },
      displayPage = function () {

          var con = $("#adminTabscontent").find("div:visible");
          var current = con[0].id.split("_")[1];

          document.getElementById("adminTabHeader_" + current).removeAttribute("class");
          document.getElementById("adminTabpage_" + current).style.display = "none";


          var ident = this.id.split("_")[1];

          this.setAttribute("class", "tabActiveHeader");
          document.getElementById("adminTabpage_" + ident).style.display = "block";
          this.parentNode.setAttribute("data-current", ident);
      };
     return {
         load: load,
         show: show,
         hide: hide,
         adminResult: adminResult,
         adminCol: adminCol,
         adminSelectedServer: adminSelectedServer,
         adminDb: adminDb,
         commands: commands,
         selectedCommand: selectedCommand,
         dbCommands:dbCommands,
         selectedDbCommand:selectedDbCommand,
         userCommands:userCommands,
         selectedUserCommand:selectedUserCommand
     }
 });