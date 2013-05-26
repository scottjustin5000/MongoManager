define('vm.admin', ['jquery', 'ko', 'config.route', 'datacontext', 'config.messages', 'pubsub', 'model.userProfile'],
 function ($, ko, route, dtx, message, pubsub, UserProfile) {

     var 
     loaded = false,
     mUserName = ko.observable(''),
     mPassword = ko.observable(''),
    mConfirmPassword =  ko.observable(''),
     commands = ko.observableArray(['serverStatus', 'replSetGetStatus', 'dbStats', 'collStats']),
     selectedCommand = ko.observable('serverStatus'),
     userCommands = ko.observableArray(['addUser', 'removeUser', 'editUser']),
     selectedUserCommand = ko.observable('addUser'),
     dbCommands = ko.observableArray(['addDb', 'removeDb']),
     selectedDbCommand = ko.observable('addDb'),
     adminSelectedServer = ko.observable(''),
     jobCommands = ko.observableArray(['backUp', 'restore']),
     selectedJobCommand = ko.observable('backUp'),
     backupTypes = ko.observableArray(['mongoDump', 'fileSystem']),
     selectedBackupType = ko.observable('mongoDump'),
     backupIntervals = ko.observableArray(['monthly', 'weekly', 'daily', 'hourly']),
     selectedBackupInterval = ko.observable('daily'),
     backupHours = ko.observableArray(['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']),
     selectedHourInterval = ko.observable('12:00'),
     adminDb = ko.observable(''),
     adminCol = ko.observable(''),
     adminResult = ko.observable(''),
     userRoles = ko.observableArray(['read', 'readWrite', 'dbAdmin', 'userAdmin', 'clusterAdmin', 'readAnyDatabase', 'readWriteAnyDatabase', 'dbAdminAnyDatabase', 'userAdminAnyDatabase']),
     selectedRole = ko.observableArray([]),
     profiles = ko.observableArray([]),
     userProfiles = ko.observableArray([])
     /*Global*/

     load = function () {
         if (!loaded) {


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
                         execReplSetGetStatus();
                         break;
                     case "collStats":
                         //show div that instructs user to 
                         // click on collection in tree
                         break;
                 }

             });

             $('#executeUserCommand').bind('click', function (e) {
                 addUser();
             });
             $('#executeAdditionalProfile').bind('click', function (e) {
                 addProfile();
             });
             $('#passwordConfirm').keyup(validatePassword);
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
      },

     /*USER*/

     removeSelected = function () {
         userRoles.removeAll(selectedRole());
         selectedRole([]);
     },
     addUser = function () {
         var dat;
         if (profiles().length > 0) {
             dat = ko.toJS(profiles);
         }
         else {
             var rls = ko.toJS(selectedRole());
             dat = [{ "username": mUserName(), "password": mPassword(), "server": adminSelectedServer(), "db": adminDb(), "roles": rls}];
         }
         dtx.postJson(route.commands.addUser, { data: dat },
           function (r) {
               mUserName('');
               mPassword('');
               profiles.removeAll();
           });
     },
     addProfile = function () {
         if (mUserName().length > 0 && mPassword().length > 0 && adminSelectedServer().length > 1) {
             var p = new UserProfile();
             p.username = mUserName();
             p.password = mPassword();
             p.server = adminSelectedServer();
             p.db = adminDb();
             var str = '';
             ko.utils.arrayForEach(selectedRole(), function (r) {
                 p.roles.push(r);
                 str += r + ',';
             });
             p.flatRoles = str.slice(0, -1);
             profiles.push(p);
         }
     },
     validatePassword = function () {
        // console.log(mPassword() + " sp " + mConfirmPassword());
         if (mPassword() != $("#passwordConfirm").val()) {

             $("#validateStatus").text("passwords don't match");
         }
         else {
             $("#validateStatus").text(" ");
            
         }
     },

     /*OVERVIEW*/
    execServerStatus = function () {
        if (adminSelectedServer().length > 1) {
            var query = { 'serverName': adminSelectedServer() };
            dtx.postJson(route.queries.serverStats, { query: query },
           function (r) {
               var data2 = JSON.stringify(r.data, null, 4);

               adminResult(data2);

           });
        }
        else {
            alert("server selection required");
        }

    },
    execDbStats = function () {
        if (adminSelectedServer().length > 1 && adminDb().length > 1) {
            var query = { 'server': adminSelectedServer(), 'db': adminDb() };
            dtx.postJson(route.queries.dbStats, query,
           function (r) {

               var data2 = JSON.stringify(r.data, null, 4);
               adminResult(data2);

           });
        }
        else {
            alert("server and db selection required");
        }
    },
    execReplSetGetStatus = function () {

        if (adminSelectedServer().length > 1) {
            var query = { 'server': adminSelectedServer() };
            dtx.postJson(route.queries.replSetGetStatus, query,
           function (r) {

               var data2 = JSON.stringify(r.data, null, 4);
               adminResult(data2);

           });
        }
        else {
            alert("server and db selection required");
        }
    };
     /*execCollStats = function () {
     var query = { 'server': adminSelectedServer(), 'db': adminDb(), 'collection': adminCol() };
     dtx.postJson(route.queries.collectionStats, query,
     function (r) {
     var data2 = JSON.stringify(r.data, null, 4);

     adminResult(data2);

     });
     },*/

     return {
         load: load,
         show: show,
         hide: hide,
         adminResult: adminResult,
         adminCol: adminCol,
         adminSelectedServer: adminSelectedServer,
         adminDb: adminDb,
         commands: commands,
         backupTypes: backupTypes,
         selectedBackupType: selectedBackupType,
         selectedCommand: selectedCommand,
         backupIntervals: backupIntervals,
         selectedBackupInterval: selectedBackupInterval,
         backupHours: backupHours,
         selectedHourInterval: selectedHourInterval,
         dbCommands: dbCommands,
         selectedDbCommand: selectedDbCommand,
         jobCommands: jobCommands,
         selectedJobCommand: selectedJobCommand,
         userCommands: userCommands,
         selectedUserCommand: selectedUserCommand,
         userRoles: userRoles,
         selectedRole: selectedRole,
         mUserName: mUserName,
         mPassword: mPassword,
         mConfirmPassword : mConfirmPassword,
         profiles: profiles,
         userProfiles:userProfiles
     }
 });