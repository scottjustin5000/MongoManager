define('vm.profiler', ['jquery', 'ko', 'config.route', 'datacontext'],
 function ($, ko, route, dtx) {

     var 
     loaded = false,
     load = function () {
         if(!loaded){
             //$("#rightProfileSplitterContainer").splitter({ splitHorizontal: true, A: $('#profileRightTopPane'), B: $('#profileRightBottomPane'), closeableto: 100 });
         }
  

     },
     show = function(){
       $('#profileEditor').show();
     },
     hide=function(){
          $('#profileEditor').hide();
     };
     return {
         show:show,
         hide:hide,
         load:load
     }
 });