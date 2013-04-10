define('model.mongoIndex', [], function () {
    var 
    MongoIndex = function () {
        var self = this;
        self.id = '';
        self.name = '';
        self.indexColumns = [];
        self.unique = false;

        return self;
    };
    return MongoIndex;
}); 