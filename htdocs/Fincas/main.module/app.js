var app = angular.module('app', ['ngRoute'])

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.config(function($routeProvider){
    $routeProvider
        .when("/subir", {
        controller: "SubirController",
        templateUrl: "subir.module/subir.view.html"

         });
    $routeProvider
        .when("/agregar", {
        controller: "AgregarController",
        templateUrl: "agregar.module/agregar.view.html"

         });
    $routeProvider
        .when("/dividir", {
        controller: "DividirController",
        templateUrl: "dividir.module/dividir.view.html"

        });
    $routeProvider
        .when("/unir", {
        controller: "UnirController",
        templateUrl: "unir.module/unir.view.html"
        });
    $routeProvider
        .when("/historicos", {
        controller: "HistoricosController",
        templateUrl: "historicos.module/historicos.view.html"
        });
    $routeProvider
        .when("/mostrar", {
            controller: "MostrarController",
            templateUrl: "mostrar.module/mostrar.view.html"
        });
});


