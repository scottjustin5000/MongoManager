define('collectionCache',
    ['pubsub', 'config.messages'],
    function (pubsub, message) {
        init = function () {
            pubsub.sub(message.data.cacheCollection, setAll);
        }

        var 
            getAll = function () {

            },
            getById = function (id) {
                var data = localStorage.getItem(id);
                if (data) {
                    return JSON.parse(data);
                }
            },
            set = function (data) {

            },
            setAll = function (data) {
                if (localStorage) {
                    for (var j = 0; j < data.length; j++) {
                        var key = data[j]._id;
                        var val = JSON.stringify(data[j]);
                        localStorage.setItem(key, val);
                    }
                }
            };
        return {
            init: init,
            getAll: getAll,
            getById: getById,
            set: set,
            setAll: setAll
        };
    });