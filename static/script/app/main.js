(function () {
    var root = this;

    define3rdPartyModules();
    loadPluginsAndBoot();

    function define3rdPartyModules() {

        define('jquery', [], function () { return root.jQuery; });
        define('sammy', [], function () { return root.Sammy });
        define('ko', [], function () { return root.ko; }); 
        define('ace', [], function () { return root.ace; });
        define('toastr', [], function () { return root.toastr; });
        define('base64', [], function () { return root.base64; });
        define('pubsub',[],function(){return root.pubsub;})
    }
    
    function loadPluginsAndBoot() {

        requirejs.config({
            baseUrl: 'script/app'
        });
        requirejs([
        ], boot);
    }

    function boot() {
        require(['bootstrapper'], function (bs) { bs.run(); });
    }
    })();