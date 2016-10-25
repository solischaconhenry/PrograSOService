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
};


exports.getUserByIdUser = function(eRequest, eResponse) {
    usuariosService.getUserByUser(eRequest.params.username, function(data){
        console.log("params: " + eRequest.params.username)
        eResponse.send(data);
    });
};

exports.newUser= function(eRequest, eResponse) {
    usuariosService.newUsuario(eRequest.body, function(data){
        console.log(eRequest.body);
        eResponse.send(data);
    });
};



exports.getPages = function(eRequest, eResponse){
    usuariosService.getPage(eRequest.params.page, function (data) {
        eResponse.send(data);
    });
}

exports.callExe = function (eRequest, eResponse) {
    var exec = require('child_process').exec;

    var cmd = eRequest.params.name+'.exe';
    var path = 'C:\\Windows';
    var child = exec(
        cmd, {
            cwd: path
        },
        function(error, stdout, stderr) {
            if (error === null) {
                console.log('success');
                eResponse.send("Success");
            } else {
                console.log('error');
                eResponse.send("Error");
            }
        }
    );
}
