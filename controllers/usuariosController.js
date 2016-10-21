var usuariosService = require('../businessLogic/usuariosService.js');
var request = require('request');

exports.getUsuarios = function(eRequest, eResponse) {
  usuariosService.getUsuarios(function(data){
        eResponse.send(data);
    });
};

exports.getArchiveById = function(eRequest, eResponse) {
    usuariosService.getArchivoByName(eRequest.params.id, function(data){
        eResponse.send(data);
    });
};

exports.nuevoUsuario = function(eRequest, eResponse) {
    usuariosService.nuevoUsuario(eRequest.body, function(data){
        eResponse.send(data);
    });
};

exports.getUsers = function(){
    usuariosService.getUsers();
}
