var repository = require('../dataAccess/repository.js');
var asd = require('../businessLogic/asd.hta');
	
exports.getUsuarios = function(callback) {
	var params = {
		query: {},
		collection: 'users'
	};
	repository.getCollection(params, function(data){
	        callback(data);
	});
};

exports.getArchivoByName = function(archivo, callback) {


	asd.runexe();
	data={status:200};
	callback(data);
};


exports.nuevoUsuario = function(doc, callback) {
	var params = {
		query: doc,
		collection: 'users'
	};
	repository.addDocument(params, function(res) {
		callback(res);
	});
};


var http = require('http');
var emp = [];

var options = {
	host:  'http://prograso-carreratec.rhcloud.com',
	port: '8080',
	path: '/service/prograso/usuarios/todos',
	method: 'GET'
};

exports.getUsers = function() {
	http.get(options, function (res) {
		res.setEncoding('utf-8');
		res.on('data', function (data) {
			emp = JSON.parse(data);
			console.log(emp);
		});
	}).end();
};
