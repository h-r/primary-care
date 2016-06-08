var base_datos = require('./db');
var funciones = require('./funciones'); 
var html = require('./html');
var config = require('./config');

module.exports = function (app) {

//#########################################################################

app.get('/planner', function(req, res){
	funciones.autenticado_con_cookies(req,res,"planner",function(){
		html.cabecera_html(req,res,function (a){
				html.cabecera_planner(req,res,a,function (b){ 
					html.mensajes_y_pie_pagina(req,res,b,function (t){   
						res.send(t);
				})})});
		}
	);
});


app.get('/planner/my_count', function(req, res){
	funciones.autenticado_con_cookies(req,res,"planner",function(){
		var dni = req.cookies.dni;
		//--
		var f_fracaso = function (){
			//no deberia producirse nunca el fracaso			
			res.redirect('/planner');
		};
		var f_exito = function (user){
			html.cabecera_html(req,res,function (a){
				html.cabecera_planner(req,res,a,function (b){
					html.editar_datos_propios_planner(req,res,b,dni,user.name,function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});

			};
		base_datos.buscar_usuario (dni,f_exito,f_fracaso);
		//--
		
		}
	);
});

app.post('/planner/my_count', function(req, res){
	funciones.autenticado_con_cookies(req,res,"planner",function(){
		//
		//------
		var datos_user={}
		datos_user.dni = req.cookies.dni;
		datos_user.pass =req.body.pass;
		
		var callback = function () {
			if (datos_user.pass != '') {

			var new_pass=base_datos.cifrar_password(datos_user.pass,datos_user.dni)
			res.cookie('pass',new_pass);

			};
			res.cookie('mensaje','user_updated');
			res.redirect('/planner/my_count');
		};

		base_datos.editar_datos_propios(datos_user,callback);	
			   //------
	});
});
	
//--------------------------------------

app.get('/planner/meetings', function(req, res){
	funciones.autenticado_con_cookies(req,res,"planner",function(){
		//--
		var f_exito = function (citas){
			html.cabecera_html(req,res,function (a){
				html.cabecera_planner(req,res,a,function (b){
					//b=b+JSON.stringify(citas)+"<br>";
					html.html_citas_planner(req,res,b,citas,function (c){
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
					})
 				})})});

			};

		var ahora=new Date();
		ahora= ahora.toISOString();

		var collection = 'meeting';
		var query1={ "end" : {$gte: ahora} };
		base_datos.query_generica_busqueda(collection,query1,{},function(lista_citas){
			f_exito(lista_citas);
		});
		//--
		
		}
	);
});


app.post('/planner/meetings', function(req, res){
	funciones.autenticado_con_cookies(req,res,"planner",function(){
		//--
		var f_fracaso = function (error){
			res.cookie('mensaje',error);			
			res.redirect('/planner/meetings');
		};
		var f_exito = function (){
			//daria algun mensaje
			res.redirect('/planner/meetings');
			};
//-----------------------
switch (req.body.action) {
	  case "borrar":
	  	base_datos.borrar_cita (req.body.patient,req.body.doctor,req.body.sala,req.body.begin,req.body.end,f_exito,f_fracaso);
	  	break;
	  case "insertar":
		var d_begin=new Date();
		var d_end=new Date();
		    d_begin= d_begin.toISOString();
		    d_end= d_end.toISOString();
		base_datos.insertar_cita(req.body.patient,req.body.doctor,req.body.sala,d_begin,d_end,f_exito,f_fracaso);
	  	break;
	  default:
	   	res.redirect('/planner/meetings');
	  break;
}
//-------------------
		
		
		}
	);
});

//#########################################################################

//-----------
app.get('/planner/schedule', function(req, res) {
	funciones.autenticado_con_cookies(req,res,"planner",function(){

		var f_exito = function (horarios){
			html.cabecera_html(req,res,function (a){
				html.cabecera_planner(req,res,a,function (b){
					html.html_horarios_planner(req,res,b,horarios,function (c){
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
					}); 
				})})});

			};

		
		base_datos.buscar_horarios (f_exito);
		//--
	});	
});

app.post('/planner/schedule', function(req, res){
	funciones.autenticado_con_cookies(req,res,"planner",function(){
		//--
		var f_fracaso = function (error){
			res.cookie('mensaje',error);			
			res.redirect('/planner/schedule');
		};
		var f_exito = function (){
			//daria algun mensaje
			res.redirect('/planner/schedule');
			};
//-----------------------
switch (req.body.action) {
	  case "borrar":
	  	base_datos.borrar_horario (req.body.room,req.body.month,req.body.year,req.body.begin,req.body.end,f_exito,f_fracaso);
	  	break;
	  case "insertar":
		//--
		switch (req.body.horario) {
	  		case "morning":
	  			var begin=config.morning_begin;
				var end=config.morning_end;
	  			break;
	  		case "afternoon":
	  			var begin=config.afternoon_begin;
				var end=config.afternoon_end;
	  			break;
			default:
			   	res.redirect('/planner/schedule');
		}	
		//--
		base_datos.insertar_horario(req.body.family_doctor,req.body.room,req.body.month,req.body.year,begin,end,f_exito,f_fracaso);
	  	break;
	  default:
	   	res.redirect('/planner/schedule');
	  break;
}
//-------------------
});
});

//###########################################################
//###########################################################

} 
