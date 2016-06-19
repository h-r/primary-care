var base_datos = require('./db/db');
var funciones = require('./funciones'); 
var html = require('./html/html');

module.exports = function (app) {

//#########################################################################

app.get('/patient', function(req, res){
	funciones.autenticado_con_cookies(req,res,"patient",function(){
			html.cabecera_html(req,res,function (a){
				html.cabecera_pacientes(req,res,a,function (b){ 
					html.mensajes_y_pie_pagina(req,res,b,function (t){   
						res.send(t);
				})})});
		}
	);
});

app.get('/patient/my_count', function(req, res){
	funciones.autenticado_con_cookies(req,res,"patient",function(){
		var dni = req.cookies.dni;
		//--
		var f_fracaso = function (){
			//no deberia producirse nunca el fracaso			
			res.redirect('/patient');
		};
		var f_exito = function (user){

			html.cabecera_html(req,res,function (a){
				html.cabecera_pacientes(req,res,a,function (b){
					html.editar_datos_propios_paciente(req,res,b,dni,user.name,user.family_doctor,function (c){ 
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});

			};
		base_datos.buscar_usuario (dni,f_exito,f_fracaso);
		//--
		
		}
	);
});

app.post('/patient/my_count', function(req, res){
	funciones.autenticado_con_cookies(req,res,"patient",function(){
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
			res.redirect('/patient/my_count');
		};

		base_datos.editar_datos_propios(datos_user,callback);	
			   //------
	});
});
	
//#########################################################################
app.get('/patient/meetings', function(req, res) {
	funciones.autenticado_con_cookies(req,res,"patient",function(){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1; //porque es de 0 - 11  
	var year = d.getFullYear();
	res.redirect('/patient/meetings/'+day+'/'+month+'/'+year);
	});
	
});

//#########################################################################

app.get('/patient/meetings/:day/:month/:year', function(req, res) {
	funciones.autenticado_con_cookies(req,res,"patient",function(){
	//----------
	var dni_paciente=req.cookies.dni;

	// Devuelve el dni_del medico que le corresponda al paciente
	var collection = 'user';
	var query1={"dni" : dni_paciente};
	base_datos.query_generica_busqueda(collection,query1,{},function(usuario){
	//-----------
	if (usuario == [] ){ 
		res.redirect('/patient/meetings/'+day.toString()+'/'+month.toString()+'/'+year.toString());}
	else{
	var dni_doctor=usuario[0].family_doctor;
	}

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
				html.cabecera_pacientes(req,res,a,function (b){
					html.tabla_citas_paciente(req,res,b,
						day, month, year,lista_horarios,dni_doctor,lista_citas,dni_paciente,
						function (c){
							html.mensajes_y_pie_pagina(req,res,c,function (t){   
								res.send(t);
					});})
				})});
	//--
	})});
	//--
	})});
});

//#########################################################################

app.post('/patient/meetings/:day/:month/:year', function(req, res) {
	funciones.autenticado_con_cookies(req,res,"patient",function(){
	//--
	var paciente = req.body.patient;
	var doctor = req.body.doctor;
	var dia =req.body.dia;
	var hora_inicio = parseFloat(req.body.hora_inicio);
	var hora_fin = parseFloat(req.body.hora_fin);

	var day = parseInt(req.params.day);
	var month = parseInt(req.params.month);
	var year = parseInt(req.params.year);
	//--
	var collection = 'schedule';
	var query1={"doctor": doctor,"month":month.toString(),"year":year.toString(),"begin":{"$lte":hora_inicio},"end":{"$gte":hora_fin}};
	base_datos.query_generica_busqueda(collection,query1,{},function(horario){
	//---------
	if (horario==[]){res.redirect('/patient/meetings/'+day.toString()+'/'+month.toString()+'/'+year.toString());}
	else{
	var sala=horario[0].room;
	//console.log(JSON.stringify(horario));
	};

	var f_exito = function (){
		res.cookie('mensaje','cita_reservada');
		res.redirect('/patient/meetings/'+day.toString()+'/'+month.toString()+'/'+year.toString());
	};
	var f_fracaso = function (error){
		res.cookie('mensaje',error);
		res.redirect('/patient/meetings/'+day.toString()+'/'+month.toString()+'/'+year.toString());
	};
	
	var d_begin=new Date(dia);
	var h1=Math.floor(hora_inicio);
	var m1=Math.round((hora_inicio-h1)*100);
	d_begin.setHours(h1);
	d_begin.setMinutes(m1);
	d_begin.setSeconds(0);

	var d_end=new Date(dia);
	var h2=Math.floor(hora_fin);
	var m2=Math.round((hora_fin-h2)*100);
	d_end.setHours(h2);
	d_end.setMinutes(m2);
	d_end.setSeconds(0);

    	d_begin= d_begin.toISOString();
	d_end= d_end.toISOString();
	base_datos.insertar_cita(paciente,doctor,sala,d_begin,d_end,f_exito,f_fracaso);

	});
	//--
	});
});

//#################### LISTA CITAS PACIENTES ####################################
app.get('/patient/meetings_list', function(req, res){
	funciones.autenticado_con_cookies(req,res,"patient",function(){

	//--------
	var dni_paciente=req.cookies.dni;

	base_datos.citas_futuras_paciente (dni_paciente,function(lista_citas){
	//----- 
	//--------

		html.cabecera_html(req,res,function (a){
				html.cabecera_pacientes(req,res,a,function (b){
					html.lista_citas_paciente(req,res,b,lista_citas,function (c){
						html.mensajes_y_pie_pagina(req,res,c,function (t){   
							res.send(t);
				})})})});

	})})
});

app.post('/patient/meetings_list', function(req, res){
	funciones.autenticado_con_cookies(req,res,"patient",function(){
		//--
		var f_fracaso = function (error){
			res.cookie('mensaje',error);			
			res.redirect('/patient/meetings_list');
		};
		var f_exito = function (){
			//daria algun mensaje
			res.redirect('/patient/meetings_list');
			};
//-----------------------
switch (req.body.action) {
	  case "borrar":
	  	base_datos.borrar_cita (req.body.patient,req.body.doctor,req.body.sala,req.body.begin,req.body.end,f_exito,f_fracaso);
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
} 
