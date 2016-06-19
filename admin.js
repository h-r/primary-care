var base_datos = require('./db/db');
var funciones = require('./funciones'); 
var mas_funciones = require('./mas_funciones'); 
var html = require('./html/html');

module.exports = function (app) {

//#########################################################################

app.get('/admin', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		html.cabecera_html(req,res,function (a){
				html.cabecera_admin(req,res,a,function (b){ 
					html.mensajes_y_pie_pagina(req,res,b,function (t){   
						res.send(t);
				})})});

		}
	);
});

//----------
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/admin/insert_user', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
			html.cabecera_html(req,res,function (a){
				html.cabecera_admin(req,res,a,function (b){
					html.editar_usuario_admin(req,res,b,"insert","","","","","","","",function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});


	}
    );
});

app.post('/admin/insert_user', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		//
		var datos_user={}
			datos_user.dni = req.body.dni.toUpperCase();;
			datos_user.name =req.body.name;
			datos_user.pass =req.body.pass;
			datos_user.patient = req.body.patient;
			datos_user.admin = req.body.admin;
			datos_user.doctor = req.body.doctor;
			datos_user.planner = req.body.planner;
			datos_user.family_doctor = req.body.family_doctor;		

		var f_exito = function (user){   //el usuario ya existe
				res.cookie('mensaje','user_found');
				res.redirect('/admin/insert_user');
				};

		var f_fracaso = function (){  //el usuario no existe, lo que nos interesa
				//--
			var callback_exito = function () {
				res.cookie('mensaje','user_inserted');
				res.cookie('datos_usuario_nuevo',JSON.stringify(datos_user));
				res.redirect('/admin/insert_user');
			};

			var callback_fracaso = function (error) {
				res.cookie('mensaje',error);
				res.redirect('/admin/insert_user');
			};

			if (mas_funciones.dni_valido(datos_user.dni)){
				base_datos.editar_usuario(datos_user,callback_exito,callback_fracaso);
				}
			else{ var error="dni_inconsistente";
				callback_fracaso(error); 
			}	
				//--
		};
		

		base_datos.buscar_usuario (datos_user.dni,f_exito,f_fracaso);
			
		

	});
});


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/admin/edit_user', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		var datos_str = req.cookies.datos_usuario_nuevo;
		if (datos_str === undefined){
			res.redirect('/admin/find_user');
		}
		else{
		var datos = JSON.parse(datos_str);
			html.cabecera_html(req,res,function (a){
				html.cabecera_admin(req,res,a,function (b){
					html.editar_usuario_admin(req,res,b,"update",datos.dni,datos.name,datos.patient,datos.admin,
							datos.doctor,datos.planner,datos.family_doctor,function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});

		}	
	}
    );
});


app.post('/admin/edit_user', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		//
		var datos_user={}
			datos_user.dni = req.body.dni.toUpperCase();;
			datos_user.name =req.body.name;
			datos_user.pass =req.body.pass;
			datos_user.patient = req.body.patient;
			datos_user.admin = req.body.admin;
			datos_user.doctor = req.body.doctor;
			datos_user.planner = req.body.planner;
			datos_user.family_doctor = req.body.family_doctor;		

			    var f_fracaso = function (){  //usuario no encontrado, en este caso no interesa
				res.cookie('mensaje','user_not_found');
				res.redirect('/admin/edit_user');
				};
			    var f_exito = function (user){
				//---
					var callback_exito = function () {
						res.cookie('mensaje','user_updated');
						res.cookie('datos_usuario_nuevo',JSON.stringify(datos_user));
						//comprobar si nos hemos editado a nosotros mismos
						if (datos_user.dni == req.cookies.dni){
						   if (datos_user.pass != "") { //hemos cambiado la contraseña
							var cipher_pass=base_datos.cifrar_password(datos_user.pass,datos_user.dni);
							res.cookie('pass',cipher_pass);
						   }
							
						}
						//-----------------
						res.redirect('/admin/edit_user');
					};

					var callback_fracaso = function (error) {
						res.cookie('mensaje',error);
						res.cookie('datos_usuario_nuevo',JSON.stringify(datos_user));
						res.redirect('/admin/edit_user');
					};

					if (mas_funciones.dni_valido(datos_user.dni)){
						base_datos.editar_usuario(datos_user,callback_exito,callback_fracaso);
						}
					else{ var error="dni_inconsistente";
						callback_fracaso(error); 
					}	

				//---
				
			};


	    base_datos.buscar_usuario (datos_user.dni.toUpperCase(),f_exito,f_fracaso);
		

	});
});
//--------------------------------------

app.get('/admin/rooms', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		html.cabecera_html(req,res,function (a){
				html.cabecera_admin(req,res,a,function (b){
					html.crear_html_admin_salas (req,res,b,function (c){
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});

		}
	);
});

app.post('/admin/rooms', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		//--
		var f_fracaso = function (error){
			res.cookie('mensaje',error);		
			res.redirect('/admin/rooms');
		};
		
		var f_exito_borrar = function (){
			//daria algun mensaje
			res.redirect('/admin/rooms');
			};

		var f_exito_insertar = function (){
			//daria algun mensaje
			res.redirect('/admin/rooms');
			};
//-----------------------
switch (req.body.action) {
	  case "borrar":
	  	base_datos.borrar_sala (req.body.sala,f_exito_borrar,f_fracaso);
	  	break;
	  case "insertar":
		base_datos.insertar_sala(req.body.sala,f_exito_insertar,f_fracaso);
	  	break;
	  default:
	   	res.redirect('/admin/rooms');
	  break;
}
//-------------------
		
		
		}
	);
});

//###########################################################

app.get('/admin/find_user', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		html.cabecera_html(req,res,function (a){
				html.cabecera_admin(req,res,a,function (b){
					res.clearCookie('datos_busqueda');
					res.clearCookie('datos_usuario_nuevo');
					html.buscar_usuario(req,res,b,function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});

		}
	);
});

app.post('/admin/find_user', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		datos={}
		datos.dni = req.body.dni.toUpperCase();
		datos.name = req.body.name;
		datos.patient = req.body.patient;
		datos.admin = req.body.admin;
		datos.doctor = req.body.doctor;
		datos.planner = req.body.planner;
		if (req.body.family_doctor != 'Ninguno'){
		datos.family_doctor = req.body.family_doctor;}
		res.cookie('datos_busqueda',JSON.stringify(datos));
		res.redirect('/admin/list_users');
	
	});
});

app.get('/admin/list_users', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		html.cabecera_html(req,res,function (a){
				html.cabecera_admin(req,res,a,function (b){

	res.clearCookie('datos_usuario_nuevo');
	var datos_str = req.cookies.datos_busqueda;
	if  (datos_str == undefined) 
		{
			var dni =""; var name =""; var patient =""; var admin =""; var doctor =""; var planner =""; var family_doctor ="";
		}
	else { datos = JSON.parse(datos_str)

		var dni = datos.dni;
		var name = datos.name;
		var patient = datos.patient;
		var admin = datos.admin;
		var doctor = datos.doctor;
		var planner = datos.planner;
		var family_doctor = datos.family_doctor;
}
					html.listar_usuarios(req,res,b,
								dni,name,patient,admin,doctor,planner,family_doctor,
								function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});

		}
	);
});

app.post('/admin/list_users', function(req, res){
	funciones.autenticado_con_cookies(req,res,"admin",function(){
		//--
		var dni=req.body.dni;

		var f_fracaso = function (error){
			res.cookie('mensaje',error);		
			res.redirect('/admin/list_users');
		};
		
		var f_exito_borrar = function (){
			res.redirect('/admin/list_users');
			};

//-----------------------
switch (req.body.action) {
	  case "borrar":
	  	base_datos.borrar_usuario (dni,f_exito_borrar,f_fracaso);
	  	break;
	  case "actualizar":
		var datos_user={}
		datos_user.dni = req.body.dni.toUpperCase();
		datos_user.name =req.body.name;
		datos_user.patient = ((req.body.patient=="true")?"checked":"");
		datos_user.admin = ((req.body.admin=="true")?"checked":"");
		datos_user.doctor = ((req.body.doctor=="true")?"checked":"");
		datos_user.planner = ((req.body.planner=="true")?"checked":"");
		datos_user.family_doctor = req.body.family_doctor;		
		res.cookie('datos_usuario_nuevo',JSON.stringify(datos_user));
		res.redirect('/admin/edit_user');
	  	break;
	  default:
	   	res.redirect('/admin/list_users');
	  break;
}
//-------------------
		
		
		}
	);
});
//###########################################################

}
