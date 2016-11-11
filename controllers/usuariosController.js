var usuariosService = require('../businessLogic/usuariosService.js');
var request = require('request');

exports.getUsuarios = function(eRequest, eResponse) {
  usuariosService.getUsuarios(function(data){
        var lista={
            data : data,
            ip: "Slave1: " + eRequest.connection.remoteAddress
        };

        eResponse.send(JSON.stringify(lista));
    });
};

exports.getArchiveById = function(eRequest, eResponse) {
    usuariosService.getArchivoByName(eRequest.params.id, function(data){
        eResponse.send(data);
    });
};

exports.nuevoUsuario = function(eRequest, eResponse) {
    usuariosService.nuevoUsuario(eRequest.body, function(data){
        var lista={
            data : data,
            ip: "Slave1: " + eRequest.connection.remoteAddress
        };

        eResponse.send(JSON.stringify(lista));
    });
};

exports.getUsers = function(){
    usuariosService.getUsers();
}


