define('bootstrapper',
    ['binder', 'pubsub', 'router', 'vm.serverExplorer', 'vm.queryEditor', 'vm.navigation', 'collectionCache'],
    function (binder, pubsub, router, server, qe, navigation, cc) {
        var 
            run = function () {
                binder.bind();
                pubsub.initialize();
                //  primer.prime();
                server.load();
                router.configure();
                qe.load();
                cc.init();
                navigation.load();
                // de.load();

            };

        return {
            run: run
        };
    });