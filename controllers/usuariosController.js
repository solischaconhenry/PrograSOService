var usuariosService = require('../businessLogic/usuariosService.js');
var request = require('request');
var path = require('path');

exports.getUsuarios = function(eRequest, eResponse) {
  usuariosService.getUsuarios(function(data){
        eResponse.send(data);
    });
};

exports.getUserById = function(eRequest, eResponse) {
    usuariosService.getUserByUsername(eRequest.params.username, function(data){
        eResponse.send(data);
    });
};

exports.nuevoUsuario = function(eRequest, eResponse) {
    usuariosService.nuevoUsuario(eRequest.body, function(data){
        eResponse.send(data);
    });
};

exports.getUsers = function(eRequest, eResponse){
    usuariosService.getUsers(function (data) {
        eResponse.send(data);
    });
}


exports.getPages = function(eRequest, eResponse){
    usuariosService.getPage(eRequest.params.page, function (data) {
        eResponse.send(data);
    });
}
