define('router', ['sammy', 'config.viewmodels', 'pubsub', 'config.messages'],
function (sammy, vm, pubsub, message) {
    var 

        configure = function () {
            sammy.run();
           // pubsub.mediator.Subscribe(message.navigation.selectionChanged, updateApplicationState);
        },

        index = function (obj, i) {
            return obj[i];
        },
        hideAllButCurrent = function (cv, params) {
            if (cv != "") {
                for (var p in vm) {

                    var obj = vm[p];
                    if (obj) {
                        if (obj.hasOwnProperty('hide')) {
                            obj.hide();
                        } else {
                            console.log(p);
                        }
                    } else {
                        console.log('undefined ' + p);
                    }

                }
                var c = vm[cv];
                params == null ? c.show() : c.show(params);
            }
        },
        /*updateApplicationState = function (vmName, params) {
            if (params) {
                sammy.setLocation('#/' + vmName + '/' + params);

            }
            else {
                sammy.setLocation('#/' + vmName);
            }
        },*/

    sammy = $.sammy(function () {

        /* this.get('#/', function () {
        // hideAllButCurrent('queryEditor');
        });*/
        this.get('#/serverManager', function () {
            // hideAllButCurrent();
        });
        this.get('#/documentDetail/:param', function () {
            hideAllButCurrent('documentEditor', this.params.param);
        });
        this.get('#/indexManager', function () {
            // hideAllButCurrent('exchangeDetail', this.params.param);
        });
        this.get('#/replicationManager', function () {
            // hideAllButCurrent('exchange', this.params.param);

        });
        this.get('#/collectionManager', function () {
            // hideAllButCurrent('home');
        });
        this.get('', function () {
            hideAllButCurrent('queryEditor');
        });

    });

    return {
        configure: configure
        /*,
        updateApplicationState: updateApplicationState*/

    };


});