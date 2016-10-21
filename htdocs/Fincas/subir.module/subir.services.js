app.service('fileUpload', ['$http', '$q',function ($http, $q) {
    this.uploadFileToUrl = function(file, uploadUrl){

        var defered = $q.defer();
        var promise = defered.promise;

        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined,'Process-Data': false}
        })
            .success(function(response){
            myString="";
            for (feature in response.features)
            {

                for (cordenada in response.features[feature].geometry.coordinates[0])
                {
                    if(cordenada==response.features[feature].geometry.coordinates[0].length-1){
                        myString+=response.features[feature].geometry.coordinates[0][cordenada][0]+ " "+ response.features[feature].geometry.coordinates[0][cordenada][1];
                    }
                    else
                    {
                        myString+=response.features[feature].geometry.coordinates[0][cordenada][0]+ " "+ response.features[feature].geometry.coordinates[0][cordenada][1]+",";
                    }
                }
                if(feature==response.features.length-1){
                    myString+=""; 
                }
                else{
                    myString+=";"; 
                }
            }

            /*$http.post('subir.module/subir.logic.php',{string: myString, action: 'insert'}
                      ).success(function(response) {
                console.log(response)
                defered.resolve(response);

            })*/


            var dat = {"string": myString, "action": 'insert'};
            $http({
                method: 'GET',
                url: "subir.module/subir.logic.php",
                params: dat
            })
            .success(function (response) {
                console.log(response)
                defered.resolve(response);
            })
            .error(function (err) {
                 console.log(err)
                defered.reject(err)
            });


        });

        return promise;
    }

}]);


app.service('Previsualizar', ['$http','$q', function ($http, $q) {

    this.getData = function () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('subir.module/subir.logic.php?action=preview')
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
}]);


app.service('Save', ['$http','$q', function ($http, $q) {

    this.putData = function (idUser) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('subir.module/subir.logic.php?action=save&idUser='+idUser)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
}]);