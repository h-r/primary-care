var base_datos = require('./db/db');
var html = require('./html/html'); 
var funciones = require('./funciones'); 
var config = require('./config');

module.exports = function (appCert) {

//----------------------------------------
appCert.get('/admin', function(req, res){
	res.cookie('role','admin');
	res.redirect('/');
});

appCert.get('/patient', function(req, res){
	res.cookie('role','patient');
	res.redirect('/');
});

appCert.get('/doctor', function(req, res){
	res.cookie('role','doctor');
	res.redirect('/');
});

appCert.get('/planner', function(req, res){
	res.cookie('role','planner');
	res.redirect('/');
});

appCert.get('/', function(req, res){
	var ip_servidor= req.ip;
	if (req.client.authorized){
		var dni="";
		var rol= req.cookies.role;
		var ip= req.cookies.ip;
		//console.log(ip);
	
		//------------
		var cert = req.connection.getPeerCertificate();
	        //console.log(cert);
	            if (cert && Object.keys(cert).length){
                		var subject = cert.subject,
                	        //dni = subject.serialNumber;
				dni = subject.CN;
				
			}
		//------------

	  if (dni === "" || dni === undefined || rol === undefined)
		{ res.cookie('mensaje','datos_erroneos');
		  //res.redirect("https://" + ip_servidor+":"+config.puerto_serv_https.toString());
		res.send('<script> window.location.replace("https://"+location.hostname+":'+config.puerto_serv_https.toString()+'");</script>');
		}
  		
		var f_fracaso = function () {
			res.cookie('mensaje','usuario_no_valido');
			//res.redirect("https://" + ip_servidor+":"+config.puerto_serv_https.toString());
		  res.send('<script> window.location.replace("https://"+location.hostname+":'+config.puerto_serv_https.toString()+'");</script>');
			}

		var f_exito = function (user) {
			res.cookie('dni',user.dni);
		 	res.cookie('pass',user.pass);
			res.cookie('role',rol);
			//res.redirect("https://" + ip_servidor+":"+config.puerto_serv_https.toString());
		res.send('<script> window.location.replace("https://"+location.hostname+":'+config.puerto_serv_https.toString()+'");</script>');
		}

		base_datos.buscar_usuario(dni,f_exito,f_fracaso);

	} else {
		res.cookie('mensaje','no_certificado');
		//res.redirect("https://" + ip_servidor+":"+config.puerto_serv_https.toString());
		res.send('<script> window.location.replace("https://"+location.hostname+":'+config.puerto_serv_https.toString()+'");</script>');
	}
});


//----------------------------------------
}
