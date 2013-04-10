define('model.mongoTable',
    [],
    function () {

        var MongoTable = function () {
            var self = this;
            self.id = '';
            self.name = '';
            self.namespace;
            self.indexes = [];
            self.columns = [];

            return self;
        }
        return MongoTable;
    });