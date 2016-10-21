var usuariosService = require('../businessLogic/usuariosService.js'); 

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