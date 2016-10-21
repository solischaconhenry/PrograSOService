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
