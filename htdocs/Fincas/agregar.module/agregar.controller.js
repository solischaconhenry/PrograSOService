app.controller('AgregarController', function ($scope, AgregarService, fileUpload, Previsualizar, Save) {

    $scope.fincas = [];
    $scope.svg = false;
    $scope.gidFinca = "";

    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    AgregarService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });
    
    $scope.change = function(){
        AgregarService.preview($scope.gidFinca).then(function (data) {
           $scope.json = reconvertJsonPolygon(data);
        });
    }
    
    function reconvertJsonPolygon(puntos) {
        var json = [];
        var points = '';

        for(var i = 0; i < puntos.length; i++) {
            for (var j = 0; j < puntos[i].puntos.length; j++) {
                points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
            }
            json.push({gid:puntos[i].gid,puntos: points.slice(0, points.length-1)});
            points = '';
        }
        return json;
    }
    
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
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
            $scope.jsonCargado = reconvertJsonPolygon(data);
        });
    }
    
    $scope.save = function(){
        AgregarService.agregar($scope.gidFinca)
            .then(function (data) {
            alert("ok");
            console.log(data);
        });        
    }

});
