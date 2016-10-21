app.service('UnirService', ['$http','$q', function ($http, $q) {

    this.getFincas = function (idUser) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('unir.module/unir.logic.php?action=getFincas&idUser='+idUser)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    };
    
    
    this.preview = function (gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('unir.module/unir.logic.php?action=preview&gidFinca='+gidFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
    
    this.unir = function (gidFinca,arrayIdAparto) {
        var defered = $q.defer();
        var promise = defered.promise;
        var data= $.param({
                action: 'unir',
                gidFinca: gidFinca,
                arrayAparto: arrayIdAparto
            })
        console.log(data);
        $http.get('unir.module/unir.logic.php?'+data)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
    
    
    
}]);