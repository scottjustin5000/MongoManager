define('vm.navigation', ['jquery', 'ko', 'config.messages', 'pubsub'],
 function ($, ko, message, pubsub) {

     var load = function () {
         $('.nav').bind('click', function (e) {

             var prev = $(".selectedNav");
             var prevParent = prev.parent();

             $(prev[0]).removeClass('selectedNav');
             var curr = $('#' + e.currentTarget.id).children().first();
             curr.addClass('selectedNav');


             var evtData = e.currentTarget.id === 'collection' ? '' : e.currentTarget.id;

             pubsub.pub(message.navigation.selectionChanged, evtData);


         });
     };
     return {
         load: load
     }

 });