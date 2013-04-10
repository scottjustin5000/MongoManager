define('datacontext', ['jquery'], function ($) {

    var 
    combineUrl = function () {
        var result = '', i, frag;
        for (i = 0; i < arguments.length; i += 1) {
            frag = arguments[i];
            if (i > 0) {
                if (frag.charAt(0) == '/') {
                    frag = frag.substring(1, frag.length - 1);
                }
                if (result.charAt(result.length - 1) != '/') {
                    frag = '/' + frag;
                }
            }
            result += frag;
        }
        return result;
    },
    parseIsoDates = function (data) {
        var matcher, prop, value, datestring, date;
        for (prop in data) {
            value = data[prop];
            if (value && typeof value === "string") {
                matcher = value.match('^/Date\\((.+)\\)/$');
                if (matcher) {
                    datestring = matcher[1];
                    date = Date.parse(datestring);
                    data[prop] = date;
                }
                continue;
            }
            if (typeof data[prop] === "object") {
                parseIsoDates(data[prop]);
            }
        }
    },
    replaceParams = function (url, params) {
        var result = url, prop;
        if (url.indexOf(":") != -1) {
            for (prop in params) {
                if (url.indexOf(":" + prop) != -1) {
                    result = result.replace(":" + prop, params[prop]);
                }
            }
        }
        return result;
    },
     postJson = function (url, data, success, fail) {
         var fullUrl = combineUrl("", url);
         data = data || {};
         $.ajax({
             type: "POST",
             url: fullUrl,
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             data: JSON.stringify(data),
             success: function (result) {
                 var callback = result.status === "success" ? success : fail;
                 if (callback) {

                     // parseIsoDates(result.data);
                     // var res = result.data;
                     callback.call(this, result);
                 }
             },
             error: function (request, status, error) {
                 // handle error
                 console.log(status);
                 var errorData = {};

                 if (status == "timeout") {
                     console.error("The request timed out");
                     console.log("The request to {0} timed out", fullUrl);
                     errorData.message = "";
                 } else {
                     console.log(error);
                     errorData = $.parseJSON(request.responseText);

                 }
                 if (fail) {
                     fail.call(errorData);
                 }
             }
         });
     },

     postJsonAndMap = function (url, data, success, fail, map, entity) {

         var objectMapper = mapper[map];


         var fullUrl = combineUrl("", url);
         data = data || {};


         $.ajax({
             type: "POST",
             url: fullUrl,
             contentType: "application/json; charset=utf-8",
             dataType: "json",
             data: JSON.stringify(data),
             success: function (result) {

                 var callback = result.status === "success" ? success : fail;
                 if (callback) {

                     parseIsoDates(result.data);
                     //perform mapper, passing in result and entity
                     var res = result.data;
                     objectMapper.map(res, entity);

                     callback.call(this, entity);
                 }
             },
             error: function (request, status, error) {
                 // handle error
                 var errorData = {};

                 if (status == "timeout") {
                     console.error("The request timed out");
                     console.log("The request to {0} timed out", fullUrl);
                     errorData.message = "";
                 } else {
                     errorData = $.parseJSON(request.responseText);

                 }
                 if (fail) {
                     fail.call(errorData);
                 }
             }
         });
     };

    return {
        postJson: postJson,
        postJsonAndMap: postJsonAndMap,
    };

});