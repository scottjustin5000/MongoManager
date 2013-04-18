define('dataprimer',
    ['ko', 'datacontext', 'config.viewmodels'],
      function (ko, datacontext, vms) {
          var prime = function () {
              console.log('initialize...');
              vms.initialize();
          };
          return {
              prime: prime
          }

      });