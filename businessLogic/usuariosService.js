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

exports.getUserByUsername = function(username, callback) {
	var params = {
		query: {username: username},
		collection: 'users'
	};
	repository.getDocument(params, function(data){
		callback(data);
	});
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
	host:  'prograso-carreratec.rhcloud.com',
	port: '80',
	path: '/service/prograso/usuarios/todos',
	method: 'GET'
};

exports.getUsers = function(callback) {
	http.get(options, function (res) {
		res.setEncoding('utf-8');
		res.on('data', function (data) {
			//emp = JSON.parse(data);
			callback(data);
		});
	}).end();
};

var options2 = {
	host:  'prograso-carreratec.rhcloud.com',
	port: '80',
	path: '/index.html',
	method: 'GET'
};

exports.getPage = function(callback) {
	http.get(options2, function (res) {
		callback(res);
	}).end();
};
