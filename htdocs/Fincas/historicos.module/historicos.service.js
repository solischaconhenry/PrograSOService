app.service('HistoricosService', ['$http','$q', function ($http, $q) {

    this.getFincas = function (idUser) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('historicos.module/historicos.logic.php?action=getFincas&idUser='+idUser)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    };
    
    
    this.preview = function (gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('historicos.module/historicos.logic.php?action=preview&gidFinca='+gidFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
    
    this.getGeomHistorico = function (gidFinca,numHistorico) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('historicos.module/historicos.logic.php?action=history&gidFinca='+gidFinca+'&numHistorico='+numHistorico)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
    this.getHistAparto = function (gidAparto,anterior,gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('historicos.module/historicos.logic.php?action=histAparto&gidAparto='+gidAparto+'&anterior='+anterior+'&gidFinca='+gidFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
    
    
    
    
}]);