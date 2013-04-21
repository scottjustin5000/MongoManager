define('vm.navigation', ['jquery', 'ko', 'config.messages', 'datacontext', 'pubsub'],
 function ($, ko, message, dtx, pubsub) {

     var 
     load = function () {
         $('.nav').bind('click', function (e) {

             var prev = $(".selectedNav");
             var prevParent = prev.parent();


             $(prev[0]).removeClass('selectedNav');
             var curr = $('#' + e.currentTarget.id).children().first();
             curr.addClass('selectedNav');


             var evtData = e.currentTarget.id === 'collection' ? '' : e.currentTarget.id;

             pubsub.mediator.Publish(message.navigation.selectionChanged, evtData, null);


         });
     };
     return {
         load: load
     }

 });