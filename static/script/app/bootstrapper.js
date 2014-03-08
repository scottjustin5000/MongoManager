define('bootstrapper',
    ['binder', 'router', 'vm.serverExplorer', 'vm.queryEditor', 'vm.navigation', 'collectionCache'],
    function (binder, router, server, qe, navigation, cc) {
        var 
            run = function () {
                binder.bind();
                //  primer.prime();
                server.load();
                router.configure();
                qe.load();
                cc.init();
                navigation.load();
            };

        return {
            run: run
        };
    });