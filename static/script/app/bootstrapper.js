define('bootstrapper',
    ['jquery', 'ko', 'binder', 'pubsub', 'router', 'vm.serverExplorer', 'vm.queryEditor', 'collectionCache'],
    function ($, ko, binder, pubsub, router, server, qe, cc) {
        var 
            run = function () {
                binder.bind();
                //probably should just have a data primer
                pubsub.initialize();
                server.load();
                router.configure();
                qe.load();
                cc.init();
                // de.load();

            };

        return {
            run: run
        };
    });