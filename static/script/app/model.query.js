define('model.query',
    [],
    function () {

        var Query = function () {
            var self = this;
            queryType = '';
            self.text = '';
            self.server = '';
            self.database = '';
            self.index = 0;

            return self;
        };
        return Query;
    });