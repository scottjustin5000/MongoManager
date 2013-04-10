define('pubsub', ['mediator'], function (Mediator) {

    var mediator,
    initialize= function(){
      this.mediator  = new Mediator();
    } 

    return {
        initialize:initialize,
        mediator:mediator
    };

});