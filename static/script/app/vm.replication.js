define('vm.replication', ['jquery', 'ko', 'config.route', 'datacontext'],
 function ($, ko, route, dtx) {

     var  loaded = false;

     var load = function () {
         if (!loaded) {
             //$("#rightReplicationSplitterContainer").splitter({ splitHorizontal: true, A: $('#replicationRightTopPane'), B: $('#replicationRightBottomPane'), closeableto: 100 });
         }


     };

     var show = function () {
         $('#replicationEditor').show();
     };

     var hide = function () {
         $('#replicationEditor').hide();
     };
     
     return {
         load: load,
         show: show,
         hide: hide
     }
 });