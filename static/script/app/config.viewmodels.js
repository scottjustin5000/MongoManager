define('config.viewmodels',
[
        'vm.serverExplorer',
        'vm.queryEditor',
        'vm.documentEditor'
],
    function (explorer, queryEditor, documentEditor) {

        var 
        viewmodels = {
            explorer: explorer,
            queryEditor: queryEditor,
            documentEditor: documentEditor
        };

        return viewmodels
    });