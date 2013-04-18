define('vm.navigation', ['jquery', 'ko', 'config.route', 'config.messages', 'datacontext', 'pubsub'],
 function ($, ko, route, message, dtx, pubsub) {
     var 
     load = function () {
         $('.nav').bind('click', function (e) {
             var evtdata;
             switch (e.currentTarget.id) {

                 case "collections":
                     evtdata = 'queryEditor';
                     break;
                 case "admin":
                     evtdata = 'admin';
                     break;
                 case "index":
                     evtdata = 'indexManager';
                     break;
                 case "profile":
                     evtdata = 'profileManager';
                     break;
                 case "replication":
                     evtdata = 'replicationManager';
                     break;
             }
             if (evtdata) {
                 var prev = $(".selectedNav");
                 $(prev[0]).removeClass('selectedNav');
                 var curr =  $('#' + e.currentTarget.id).children().first();
                 curr.addClass('selectedNav');
                 //event to be handled by query editor...which will 
                 //organize queries and results.
               //  pubsub.mediator.Publish(message.navigation.selectionChanged, evtdata);

             }

         });
     };
     return {
         load: load
     }

 });