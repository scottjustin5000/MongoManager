define('model.userProfile', [],
 function () {

     var 
    UserProfile = function () {
        var self = this;
        self.username = '';
        self.password = '';
        self.server = '';
        self.db = '';
        self.roles = [];

        self.flatRoles = ko.computed(function () {
            var str = '';
            for (var i = 0; i < self.roles.length; i++){
                 str += self.roles[i] + ',';
            }
            return str.slice(0, -1);
        })
        return self;
    };
     return UserProfile;
 });