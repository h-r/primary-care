var express = require('express');
var funciones = require('./funciones');
var base_datos = require('./db');
var config = require('./config');

var net = require('net');
var fs = require("fs");
var https = require("https");

var options = {
    key: fs.readFileSync(config.certificado_web_key).toString(),
    cert: fs.readFileSync(config.certificado_web_crt).toString()
}


var app = express();

app.configure( 
	function() {

	app.use(express.static(__dirname + '/public'));
	
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(app.router);
	}
);

require('./routes')(app);
require('./admin')(app);
require('./patient')(app);
require('./doctor')(app);
require('./planner')(app);


//######################################################


app.use(function(req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});


//-------------
var webServer = https.createServer(options, app).listen(config.puerto_serv_https, function(){
console.log('Express server https listening on port ' + config.puerto_serv_https);
});


//var webServer = app.listen(config.puerto_serv_http);
//console.log('Servidor express en puerto '+ config.puerto_serv_http);
//-------------

//var server = https.createServer(options, app);
//server.listen(config.puerto_serv_https);
//console.log('Servidor express en puerto '+ config.puerto_serv_https);


//########################################################################
//############### Servidor con  Certificados #############################

//Server Certificates
var optionsCert = {
    key: fs.readFileSync(config.certificado_server_key),
    cert: fs.readFileSync(config.certificado_server_crt),
    ca: [fs.readFileSync(config.certificado_server_ca)],
    requestCert: true,
    rejectUnauthorized: false,
    passphrase: config.certificado_server_passphrase
};

var appCert = express();
appCert.set('port', config.puerto_serv_cert);
appCert.use(express.bodyParser());
appCert.use(express.methodOverride());
appCert.use(express.cookieParser());
appCert.use(appCert.router);

https.createServer(optionsCert, appCert).listen(appCert.get('port'), function(){
console.log('Express server https_cert listening on port ' + appCert.get('port'));
});

require('./routes_serv_cert')(appCert);


//########################################################################
//#########################################################################

 // Load required modules
var io      = require("socket.io"); // web socket external module
var easyrtc = require("easyrtc");   // EasyRTC external module

 
// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);

// Borrar_tokens_easyrtc
base_datos.borrar_tokens_easyrtc();

app.post('/token_easyrtc/', function(req, res) {
	var texto=req.body;
	var dni = req.cookies.dni;
	var role = req.cookies.role;
	var token = texto.id;
	if (dni != undefined){
		base_datos.insert_easyrtc_token (dni,token,function (){
			base_datos.buscar_interlocutor (dni,role,function (interlocutor){
				if (interlocutor==""){
					console.log("el usuario no tiene cita");
				}else {
					base_datos.buscar_easyrtc_token(interlocutor,function (lista_token){
						if (lista_token.length>0){
							res.send(lista_token[0].token);
						}
						else { 
							console.log("el interlocutor aun no esta conectado");
							res.send("");
						}
						
					});
				}
			});
		});
	}
});

