!(function (factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(exports);
        //AMD
    } else if (typeof define === "function" && define.amd) {
        define('base64',[], factory);
        //normal script tag
    } else {
        window.base64 = factory();
    }
}
(function() {
        var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var toBase64 = function(input){
             var output = "";
             var chr1;
             var chr2;
             var chr3; 
             var enc1; 
             var enc2;
             var enc3;
             var enc4;
             var i = 0;

            input = encode(input);

             while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                b64chars.charAt(enc1) + b64chars.charAt(enc2) +
                b64chars.charAt(enc3) + b64chars.charAt(enc4);
        }
    return output;
    };
     var fromBase64 =function(input){
           var output = "";
           var chr1;
           var chr2;
           var chr3;
           var enc1;
           var enc2;
           var enc3;
           var enc4;
           var i = 0;

           input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {
            enc1 = b64chars.indexOf(input.charAt(i++));
            enc2 = b64chars.indexOf(input.charAt(i++));
            enc3 = b64chars.indexOf(input.charAt(i++));
            enc4 = b64chars.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }
     output = decode(output);
    return output;
   };
    var encode = function(data){
        data = data.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < data.length; n++) {
        var c = data.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }
    return utftext;
    };
    var decode = function(data){
        var results = "";
        var i = 0;
        var c = c1 = c2 = 0;
        
        while ( i < data.length ) {
        c = data.charCodeAt(i);
        if (c < 128) {
            results += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = data.charCodeAt(i+1);
            results += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = data.charCodeAt(i+1);
            c3 = data.charCodeAt(i+2);
            results += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }
    return results;
    };
    return{
            toBase64:toBase64,
            fromBase64:fromBase64
      }
 }));