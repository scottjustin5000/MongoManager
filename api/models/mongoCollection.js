function mongoCollection(){
    this.id = '';
    this.name = '';
    this.namespace;
    this.indexes = [];
    this.properties = [];
};
module.exports = mongoCollection;