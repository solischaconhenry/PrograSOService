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
        console.log("params: " + eRequest.params.username)
        eResponse.send(data);
    });
};

exports.nuevoUsuario = function(eRequest, eResponse) {
    usuariosService.nuevoUsuario(eRequest.body, function(data){
        eResponse.send(data);
    });
};

exports.getUsers = function(){
    usuariosService.getUsers(function (data) {
        console.log(data);
    });
}

var fs = require('fs');


exports.getPages = function(eRequest, eResponse){
    usuariosService.getPage(function (data) {
        fs.readFile(data);
        //eResponse.sendFile(data);
    });
}
