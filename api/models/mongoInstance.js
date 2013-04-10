function mongoInstance(id){
    this.id = id;
    this.name = '';
    this.size = '';
    this.isEmpty = false;
    this.collections = [];
}
module.exports = mongoInstance;