define('dataprimer',
    ['ko', 'datacontext', 'config.viewmodels'],
      function (ko, datacontext, vms) {
          var prime = function () {
              vms.initialize();
          };
          return {
              prime: prime
          }

      });