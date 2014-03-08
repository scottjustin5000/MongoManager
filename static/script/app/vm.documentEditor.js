define('vm.documentEditor', ['jquery', 'ko', 'config.route',
'config.messages', 'datacontext', 'collectionCache', 'base64'],
 function ($, ko, route, message, dtx, cache, base64) {

     var selectedValue = ko.observable('json');
     var viewMode = 'json';
     var loaded = false;
     var currentCollection = '';
     var server = '';
     var db = '';
     var load = function () {
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
    
             if (event.currentTarget.id == "saveDoc") {
                 save();
             }
             else {

             }

         });
     };

     var show = function (eobj) {
         if (!loaded) {
             load();
         }
         var obj = base64.fromBase64(eobj).split("&&");
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
     };

     var getDocumentById = function (id) {

         //need to append, server, db, 
         dtx.postJson(route.queries.documentQuery, { query: query },
           function (r) {
           });
     };

     var hydrate = function (data) {
         var props = [];
         for (var prop in data) {
             props.push({ "key": prop, "value": data[prop] });

         };
         pr(props);

         var text = JSON.stringify(data, null, 4);

         jsonValue(text);
     };

     var hide = function () {
         $('#documentEditor').hide();
         $("#splitterContainer").show();
     };

    var pr = ko.observableArray([{ "key": " ", "value": " "}]),

     var save = function () {
        
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
     };

     var jsonValue = ko.observable("");

     return {
         pr: pr,
         jsonValue: jsonValue,
         load: load,
         save: save,
         show: show,
         hide: hide
     }
 });