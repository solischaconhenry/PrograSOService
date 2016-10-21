app.service('AgregarService', ['$http', '$q',function ($http, $q) {
    this.getFincas = function (idUser) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('dividir.module/dividir.logic.php?action=getFincas&idUser='+idUser)
            .success(function(response) {            
            defered.resolve(response);
        });

        return promise;
    };

    this.preview = function (gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('dividir.module/dividir.logic.php?action=preview&gidFinca='+gidFinca)
            .success(function(response) {
            console.log(response)
            defered.resolve(response);
        });

        return promise;
    };
    
    this.agregar = function (gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('agregar.module/agregar.logic.php?action=add&gidFinca='+gidFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }

}]);
