app.controller('SubirController', function ($scope, fileUpload, Previsualizar, Save) {

    $scope.svg = false;

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log(file)
        var uploadUrl = "subir.module/subir.logic.php?action=upload";
        fileUpload.uploadFileToUrl(file, uploadUrl)
            .then(function (data) {
            $scope.svg = true;
            $scope.previsualizar();
        });

    };


    $scope.previsualizar = function(){
        Previsualizar.getData()
            .then(function (data) {
            reconvertJsonPolygon(data);
        });
    }

    $scope.json = [];
    function reconvertJsonPolygon(puntos) {
        var json = [];
        var points = '';

        for(var i = 0; i < puntos.length; i++) {
            for (var j = 0; j < puntos[i].puntos.length; j++) {
                points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
            }
            json.push({puntos: points.slice(0, points.length-1)});
            points = '';
        }
        $scope.json = json;
    }

    
    $scope.idUser = 1;
    $scope.save = function(){
        Save.putData($scope.idUser)
            .then(function (data) {
            alert("ok");
            console.log(data);
        });        
    }

});
