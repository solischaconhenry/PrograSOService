app.controller('ProduccionesController', function ($scope,ProduccionesService) {
    $scope.fincas = [];
    $scope.gidFinca = "";
    $scope.apartoGid;
    $scope.apartoAtual = "";
    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    ProduccionesService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });

    $scope.change = function(){
        ProduccionesService.preview($scope.gidFinca).then(function (data) {
            $scope.numHistoricoActual = data.max;
            $scope.Max = data.max;
            reconvertJsonPolygon(data.finca,false);
        });

        //obtener idUsuario
        ProduccionesService.getFincasByID("1", $scope.gidFinca).then(function(data){
          $scope.dataFinca = data[0];
          console.log(data);
        });
    }

    $scope.json = [];
    function reconvertJsonPolygon(puntos,aparto) {
        var json = [];
        var points = '';

        for(var i = 0; i < puntos.length; i++) {
            for (var j = 0; j < puntos[i].puntos.length; j++) {
                points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
            }
            json.push({gid:puntos[i].gid,puntos: points.slice(0, points.length-1)});
            points = '';
        }
        if(!aparto)
            $scope.json = json;
        else
            $scope.jsonSeleccionado=json;
    }


    $scope.gidAparto = "";
    $scope.jsonSeleccionado=[];
    $scope.unir = function(gid, coordenadas){
        console.log(gid);
        $scope.apartoGid=gid;
        $scope.jsonSeleccionado=[];
        $scope.jsonSeleccionado.push({id:gid,puntos:coordenadas});

        //obtener idUsuario
        ProduccionesService.getApartoByID($scope.apartoGid).then(function(data){
          $scope.dataAparto = data[0];
          console.log(data);
        });
        $scope.apartoAtual = true;
    }

    $scope.siguienteFinca = function(){
        if($scope.numHistoricoActual+1 > 0 && $scope.numHistoricoActual+1 <= $scope.Max)
        {
            $scope.numHistoricoActual+=1;
            getHistorico();
        }
    }

    $scope.AnteriorFinca = function(){
        if($scope.numHistoricoActual-1 > 0 && $scope.numHistoricoActual-1 <= $scope.Max)
        {
            $scope.numHistoricoActual-=1;
            getHistorico();
        }
    }


    var getHistorico = function()
    {
        MostrarService.getGeomHistorico($scope.gidFinca,$scope.numHistoricoActual).then(function (data) {
            reconvertJsonPolygon(data,false);
        });
    }

    $scope.siguienteAparto= function(){

        MostrarService.getHistAparto($scope.apartoGid,0,$scope.gidFinca).then(function(data)
        {
            console.log(data);
            $scope.apartoGid= data[0].gid;
            reconvertJsonPolygon(data,true);
        });
    }

    $scope.AnteriorAparto = function(){
        MostrarService.getHistAparto($scope.apartoGid,1,$scope.gidFinca).then(function(data)
        {
            console.log(data[0].gid);
            $scope.apartoGid= data[0].gid;
            reconvertJsonPolygon(data,true);
        });
    }
    $scope.hist=function(gid)
    {
        console.log(gid);
        $scope.apartoGid= gid;
    }



    });
