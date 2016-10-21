app.controller('UnirController', function ($scope,UnirService) {
    $scope.fincas = [];
    $scope.gidFinca = "";

    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    UnirService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });

    $scope.change = function(){
        $scope.jsonSeleccionado=[];
        UnirService.preview($scope.gidFinca).then(function (data) {
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
            json.push({gid:puntos[i].gid,puntos: points.slice(0, points.length-1)});
            points = '';
        }
        $scope.json = json;
    }
    
    
    $scope.gidAparto = "";
    $scope.jsonSeleccionado=[];
    $scope.unir = function(gid, coordenadas,$event){
        
        if($event.ctrlKey)
        {
            var inserte=true;
            $scope.gidAparto = gid;
            
            $scope.jsonSeleccionado.forEach(function(value) {
              if(value.id===gid)
              {
                  inserte=false;
                  console.log("no inserto");
              }
            });
            if(inserte)
                $scope.jsonSeleccionado.push({id:gid,puntos:coordenadas});
        }  
    }
    
    $scope.unirApartos = function(){
        var idApartos="";
        $scope.jsonSeleccionado.forEach(function(value) {
            idApartos+=(value.id)+",";
        })
        
        idApartos = idApartos.slice(0,-1);
        
        UnirService.unir($scope.gidFinca,idApartos).then(function (data) {
           console.log(data);
        });
    }



});
