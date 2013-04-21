define('model.CollectionQuery', ['jquery', 'ko', 'config.route',
'config.messages', 'datacontext', 'pubsub', 'collectionCache'],
 function ($, ko, route, message, dtx, pubsub, cache) {

     var 
     loaded = false,
     load = function(){
         if(!loaded){
            var editor = ace.edit("code_1");
            editor.setTheme("ace/theme/tomorrow");
            editor.getSession().setMode("ace/mode/javascript");
         }
     }
     return{
         load:load
     }
 });

 