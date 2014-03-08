!(function (factory) {
    //CommonJS
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        factory(exports);
        //AMD
    } else if (typeof define === "function" && define.amd) {
        define('pubsub',[], factory);
        //normal script tag
    } else {
        window.pubsub = factory();
    }
}(function pubsub () {
    var cache = {};
    var pub = function (id) {
        var args = [].slice.call(arguments, 1);
        if (!cache[id]) {
            cache[id] = { callbacks: [], args: [args] };
        }
        for (var i = 0; i < cache[id].callbacks.length; i++) {
            cache[id].callbacks[i].apply(null, args);
        }
    };
    var sub = function (id, fn) {
        if (!cache[id]) {
            cache[id] = {
                callbacks: [fn],
                args: []
            };
        } else {
            cache[id].callbacks.push(fn);
        }
        for (var i = 0; i < cache[id].args.length; i++) {
            fn.apply(null, cache[id].args[i]);
        }
    };
    var unsub = function (id, fn) {

        var index;
        if (!id) {
            return;
        }
        if (!fn) {
            cache[id] = {
                callbacks: [],
                args: []
            };
        } else {
            index = this.cache[id].callbacks.indexOf(fn);
            if (index > -1) {
                cache[id].callbacks = this.cache[id].callbacks.slice(0, index).concat(cache[id].callbacks.slice(index + 1));
            }
        }
    };
    return {
        pub: pub,
        sub: sub,
        unsub: unsub
    }
}));