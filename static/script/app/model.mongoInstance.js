define('model.mongoInstance',
    [],
    function () {
        var MongoInstance = function () {
            var self = this;
            self.id;
            self.name = '';
            self.size = '';
            self.tables = [];

            return self;
        };
        return MongoInstance;

    });
