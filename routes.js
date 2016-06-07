var base_datos = require('./db');
var html = require('./html'); 
var funciones = require('./funciones'); 

module.exports = function (app) {

//----------------------------------------

app.get('/', function(req, res){
	  var dni = req.cookies.dni;
	  var pass = req.cookies.pass;
	  var role = req.cookies.role;
	  if (dni === undefined || pass === undefined)
  		 {
		html.cabecera_html(req,res,function (a){
			html.cabecera_basica(req,res,a,function (b){
				html.cuerpo_login(req,res,b,function (c){ 
					html.mensajes_y_pie_pagina(req,res,c,function (t){
						res.send(t);
		})})})});
  	  	}
	  else {

		//------------------
		var f_exito = function(){
			// Usuario Autorizado
			switch (role) {
			  case "patient":
			    res.redirect('/patient');
			    break;
			  case "admin":
			    res.redirect('/admin');
			    break;
			  case "doctor":
			    res.redirect('/doctor');
			    break;
			  case "planner":
			    res.redirect('/planner');
			    break;
			  default:
			    res.redirect('/');
			}
			

		};

		var f_fracaso = function(){
			res.clearCookie('dni');
			res.clearCookie('pass');
			res.clearCookie('role');
			req.cookies.mensaje ='user_pass_incorrect';	//parece absurdo pero como es en la misma peticion es necesario
			html.cabecera_html(req,res,function (a){
				html.cabecera_basica(req,res,a,function (b){
					html.cuerpo_login(req,res,b,function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});	
		};
		//------------------
		base_datos.comprobar_dni_pass_role(dni,pass,role,f_exito,f_fracaso);	
	
	  };
});


app.post('/', function(req, res){
	var dni = req.cookies.dni;
	var pass = req.cookies.pass;
	var role = req.cookies.role;
	  if (dni === undefined || pass === undefined)
  		{
		var usuario=req.body.dni.toUpperCase();
		var password=req.body.pass;
		var cipher_pass= base_datos.cifrar_password(password,usuario);
		var rol=req.body.role;
	 	res.cookie('dni',usuario);
	 	res.cookie('pass',cipher_pass);
		res.cookie('role',rol);
   	 	//console.log('cookie fue creada');
		}		
	  res.redirect('/');
});


app.get('/logout', function(req, res){
	  var dni = req.cookies.dni;
	  var pass = req.cookies.pass;
	  var role = req.cookies.role;
	  if (!(dni === undefined || pass === undefined))
  		{
		res.clearCookie('dni');
		res.clearCookie('pass');
		res.clearCookie('role');
		}
	  res.redirect('/');
});


app.get('/idioma/es_ES', function(req, res){
	  res.cookie('idioma','es_ES');
	  res.redirect('/');
});

app.get('/idioma/en_US', function(req, res){
	  res.cookie('idioma','en_US');
	  res.redirect('/');
});


app.get('/patient/conference_room', function(req, res){
	funciones.autenticado_con_cookies(req,res,"patient",function(){
			html.cabecera_html(req,res,function (a){
				html.cabecera_pacientes(req,res,a,function (b){
	//--------------------------------------

	var callback = function (texto_anterior){
		html.mensajes_y_pie_pagina(req,res,texto_anterior,function (t){   
			res.send(t);
		});
	};
		
	var dni = req.cookies.dni;
        var rol = req.cookies.role;

	var f_exito = function (){
	html.html_videoconferencia_easyrtc (req,res,b,function (c){callback(c)});
	}
	
	var f_fracaso = function (){
	req.cookies.mensaje ="usuario_sin_cita"; //req en lugar de res, para que sea efectivo en el momento
	callback(b);
	}
	
	base_datos.buscar_sala_cita_usuario(dni,rol,f_exito,f_fracaso);
				
	//--------------------------------------
				
		})});
	});
});

app.get('/doctor/conference_room', function(req, res){
	funciones.autenticado_con_cookies(req,res,"doctor",function(){
			html.cabecera_html(req,res,function (a){
				html.cabecera_doctor(req,res,a,function (b){
	//--------------------------------------
	
	var callback = function (texto_anterior){
		html.mensajes_y_pie_pagina(req,res,texto_anterior,function (t){   
			res.send(t);
		});
	};
		
	var dni = req.cookies.dni;
        var rol = req.cookies.role;

	var f_exito = function (){
	html.html_videoconferencia_easyrtc (req,res,b,function (c){callback(c)});
	}
	
	var f_fracaso = function (){
	req.cookies.mensaje ="usuario_sin_cita"; //req en lugar de res, para que sea efectivo en el momento
	callback(b);
	}
	
	base_datos.buscar_sala_cita_usuario(dni,rol,f_exito,f_fracaso);
				
	//--------------------------------------
				})});
		}
	);
});

//----------------------------------------
}
