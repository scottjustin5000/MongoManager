define('vm.admin', ['jquery', 'ko', 'config.route', 'datacontext'],
 function ($, ko, route, dtx) {

     var 
     loaded = false,
     commands = ko.observableArray(['serverStatus', 'replSetGetStatus', 'dbStats', 'collStats']),
     selectedCommand = 'serverStatus',
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

         }


     },
     show = function () {
          $('#adminEditor').show();
         load();
     },
     hide = function () {
         $('#adminEditor').hide();
     },
     selectionChanged = function (event) {

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
         commands: commands,
         selectedCommand: selectedCommand,
         selectionChanged: selectionChanged
     }
 });