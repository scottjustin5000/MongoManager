function mongoServer(){
    this.id = '';
    this.ip = '';
    this.port = '';
    this.totalSize = '';
    this.databases = [];
    this.isOk = false;
    this.name =function()
    {
        return this.ip + ":" + this.port;
    } 
};
module.exports = mongoServer;