var base_datos = require('./db');
var funciones = require('./funciones'); 
var html = require('./html');

module.exports = function (app) {

//#########################################################################

app.get('/doctor', function(req, res){
	funciones.autenticado_con_cookies(req,res,"doctor",function(){
			html.cabecera_html(req,res,function (a){
				html.cabecera_doctor(req,res,a,function (b){ 
					html.mensajes_y_pie_pagina(req,res,b,function (t){   
						res.send(t);
				})})});
		}
	);
});


app.get('/doctor/my_count', function(req, res){
	funciones.autenticado_con_cookies(req,res,"doctor",function(){
		var dni = req.cookies.dni;
		//--
		var f_fracaso = function (){
			//no deberia producirse nunca el fracaso			
			res.redirect('/doctor');
		};
		var f_exito = function (user){
			html.cabecera_html(req,res,function (a){
				html.cabecera_doctor(req,res,a,function (b){
					html.editar_datos_propios_doctor(req,res,b,dni,user.name,function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});
			};
		base_datos.buscar_usuario (dni,f_exito,f_fracaso);
		//--
		
		}
	);
});

app.post('/doctor/my_count', function(req, res){
	funciones.autenticado_con_cookies(req,res,"doctor",function(){
		//
		//------
		var datos_user={}
		datos_user.dni = req.cookies.dni;
		datos_user.pass =req.body.pass;
		
		var callback = function () {
			if (datos_user.pass != '') {
			res.cookie('pass',datos_user.pass);
			};
			res.cookie('mensaje','user_updated'); 
			res.redirect('/doctor/my_count');
		};

		base_datos.editar_datos_propios(datos_user,callback);	
			   //------
	});
});
//#########################################################################
app.get('/doctor/meetings', function(req, res) {
	funciones.autenticado_con_cookies(req,res,"doctor",function(){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1; //porque es de 0 - 11  
	var year = d.getFullYear();
	res.redirect('/doctor/meetings/'+day+'/'+month+'/'+year);
	});
	
});


app.get('/doctor/meetings/:day/:month/:year', function(req, res) {
	funciones.autenticado_con_cookies(req,res,"doctor",function(){
	//----------
	var dni_doctor=req.cookies.dni;
	base_datos.buscar_horarios_doctor(dni_doctor,function(lista_horarios){

	// Devuelve todas las citas de un doctor, en un futuro se podria filtrar por fecha tambien
	var collection = 'meeting';
	var query1={"doctor": dni_doctor};
	base_datos.query_generica_busqueda(collection,query1,{},function(lista_citas){
	//----- 
	//--
	var day = parseInt(req.params.day);
	var month = parseInt(req.params.month) -1;
	var year = parseInt(req.params.year);

	html.cabecera_html(req,res,function (a){
				html.cabecera_doctor(req,res,a,function (b){
					html.tabla_citas_doctor(req,res,b,
						lista_horarios,dni_doctor,lista_citas,day,month,year,
						function (c){
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
						});
				})})});
	//--
	})});
	//--
	});
});
	
//#########################################################################
} 
