define('vm.documentEditor', ['jquery', 'ko', 'config.route',
'config.messages', 'datacontext', 'pubsub', 'collectionCache'],
 function ($, ko, route, message, dtx, pubsub, cache) {

     var 
     selectedValue = ko.observable('json'),
     viewMode = 'json',
     loaded = false,
     currentCollection = '',
     server = '',
     db = '',
     load = function () {
         $('.dataFormat').click(function (event) {
             viewMode = event.currentTarget.value;
             if (viewMode === 'json') {
                 $("#formView").hide();
                 $("#jsonView").show();
             }
             else {
                 $("#jsonView").hide();
                 $("#formView").show();
             }
         });
         $('.docButton').click(function (event) {
             //console.log(event.currentTarget.id);
             if (event.currentTarget.id == "saveDoc") {
                 save();
             }
             else {

             }

         });
     },
     show = function (eobj) {
         if (!loaded) {
             load();
         }
         var obj = eobj.split("~~");
         var id = obj[0];
         currentCollection = obj[1];
         server = obj[2];
         db = obj[3];
         pr.removeAll();
         data = cache.getById(id);
          $("#splitterContainer").hide();
         $("#documentEditor").show();
         $("#jsonView").show();
         if (data) {
             hydrate(data);
         }
         else {
             getDocumentById(id);
         }
     },
     getDocumentById = function (id) {

         //need to append, server, db, 
         dtx.postJson(route.queries.documentQuery, { query: query },
           function (r) {
           });
     },
     hydrate = function (data) {
         var props = [];
         for (var prop in data) {
             props.push({ "key": prop, "value": data[prop] });

         };
         pr(props);

         var text = JSON.stringify(data, null, 4);

         jsonValue(text);
     },
     hide = function () {
         console.log('hiding...');
         $('#documentEditor').hide();
         $("#splitterContainer").show();
     };
     pr = ko.observableArray([{ "key": " ", "value": " "}]),

     save = function () {
         var datum = { collection: currentCollection, server: server, db: db };
         if (viewMode === 'json') {
             var rawData = JSON.parse(jsonValue());
             datum.id = rawData._id;
             delete rawData._id;
             datum.data = rawData;
         }
         else {
             //collect all kvps, create json, send to 
         }
         dtx.postJson(route.queries.replaceDocument, { cmd: datum },
           function (r) {
               console.log(r);
               //update cache
           });
     },
     jsonValue = ko.observable("");

     return {
         pr: pr,
         jsonValue: jsonValue,
         load: load,
         save: save,
         show: show,
         hide: hide
     }
 });