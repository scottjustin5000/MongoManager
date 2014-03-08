define('vm.profiler', ['jquery', 'ko', 'config.route', 'datacontext'],
 function ($, ko, route, dtx) {

     var  loaded = false;
     var load = function () {
         if(!loaded){
             //$("#rightProfileSplitterContainer").splitter({ splitHorizontal: true, A: $('#profileRightTopPane'), B: $('#profileRightBottomPane'), closeableto: 100 });
         }
  

     };
     
     var show = function(){
       $('#profileEditor').show();
     };

     var hide=function(){
          $('#profileEditor').hide();
     };

     return {
         show:show,
         hide:hide,
         load:load
     }
 });