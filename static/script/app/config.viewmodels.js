define('config.viewmodels',
[
        'vm.serverExplorer',
        'vm.queryEditor',
        'vm.documentEditor',
        'vm.profiler',
        'vm.replication',
        'vm.admin'
],
    function (explorer, queryEditor, documentEditor, profiler,replication,admin) {

        var 
        viewmodels = {
            explorer: explorer,
            queryEditor: queryEditor,
            documentEditor: documentEditor,
            profiler:profiler,
            replication:replication,
            admin:admin
        };

        return viewmodels
    });