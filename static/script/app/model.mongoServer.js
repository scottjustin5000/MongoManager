define('model.mongoServer',
    [],
    function () {

        var MongoServer = function () {
            var self = this;
            self.id = '';
            self.ip = '';
            self.port = '';
            self.totalSize = '';
            self.databases = [];
            self.isOk = false;

            return self;
        };
        return MongoServer;
    });