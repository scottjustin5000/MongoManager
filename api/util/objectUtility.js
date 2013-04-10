module.exports = function () {
    var 
    builder = function(fn, methods){

        for (p in methods) {
            method = 'fn.' + p + '=' + methods[p];
            eval(method);
        }
        return fn;
    }

    return{
        builder:builder
    }
} ();
