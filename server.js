'use strict';

var express = require('express');
var http = require('http');
var url = require('url');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var usuariosController = require('./controllers/usuariosController.js');


//-------------------------------------------------------------------------

app.use(express.static(__dirname + '/htdocs'));
app.use('/styles', express.static(__dirname + '/node_modules/bootstrap/dist/css/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/bootstrap/dist/js/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/angular/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist/'));
app.use('/scripts',  express.static(__dirname + '/node_modules/angular-ui-router/release/'));

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));



//define ubición del directorio principal
//app.use('/', express.static(__dirname + '/app'));

app.use(function (req, res, next) {
  next();
});

//End: Server configuration

//Start: Routing


/*
Devuelve todos los usuarios
  Entrada: ninguna
  Salida:
        { success   // éxito: true, fracaso: false
           data        // Array con la información de todos los usuarios
           statusCode // éxito: 200, fracaso: 400
        }
  */




app.get('/service/prograso/usuarios/todos', usuariosController.getUsuarios);

app.get('/service/prograso/execute/:id', usuariosController.getArchiveById);

app.get('/service/prograso/getNombre/:nombre:apellido',function(request, response){
  var nombre = request.params.nombre;
  var apellido = request.params.apellido;
  console.log(nombre);
  response.json({'data':'Gracias '+nombre + " " + apellido});
});


/*
 Agrega un nuevo usuario
 Entrada:
 {
 tipoEvento, // tipo del evento a crear
 nombre,      // nombre del evento
 descripcion // descripción del evento
 }
 Salida:
 { success   // éxito: true, fracaso: false
 data        // éxito: id del evento insertado, fracaso: null
 statusCode // éxito: 200, fracaso: 400
 }
 */
app.post('/service/prograso/usuarios/nuevo', usuariosController.nuevoUsuario);

var req = request.get('172.24.180.173:8080/service/prograso/usuarios/todos', function (err,res, body) {
  if(!err){
    var results =JSON.parse(body);
    console.log(results);
  }

});



/*server.listen(port, function(){
  console.log('Server listening on port: ' + port);
});
*/
app.listen(port, function(){
  console.log("Listening on localhost server_port " + port);


});

