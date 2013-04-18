define('binder',
    ['jquery', 'ko', 'config.views', 'config.viewmodels'],
    function ($, ko, views, vm) {
        var binder = {

            bind: function () {
                ko.applyBindings(vm.explorer, this.getView(views.viewIds.explorer));
                ko.applyBindings(vm.queryEditor, this.getView(views.viewIds.queryEditor));
                ko.applyBindings(vm.documentEditor, this.getView(views.viewIds.documentEditor));
         
            },
            getView: function (viewName) {
                return $(viewName).get(0);
            }

        };

        return binder;

    });