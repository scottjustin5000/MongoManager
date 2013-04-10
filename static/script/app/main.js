(function () {
    var root = this;

    define3rdPartyModules();
    loadPluginsAndBoot();

    function define3rdPartyModules() {
        // These are already loaded via bundles. 
        // We define them and put them in the root object.
        define('jquery', [], function () { return root.jQuery; });
        define('sammy', [], function () { return root.Sammy });
        define('ko', [], function () { return root.ko; }); 
        define('mediator', [], function () { return root.Mediator; });
        define('ace', [], function () { return root.ace; });
    }
    
    function loadPluginsAndBoot() {
        // Plugins must be loaded after jQuery and Knockout, 
        // since they depend on them.
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