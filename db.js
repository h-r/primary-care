var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var config = require('./config');
var url = config.url_bd;

var comprobaciones = require('./db/db_comprobaciones');
var crypto = require('crypto');

//---------------------------------------------
var cifrar_password = function(password,dni){ 
//tambien ponemos el dni para que aunque varios usuarios tengan la misma clave sea diferente
	var salt= config.salt
	var hash = crypto
        .createHmac("sha1",salt)
        .update(password+dni)
        .digest('hex');
	return hash
}



//----------------------------------------------

var comprobar_dni_pass_role = function(dni,pass,role,
						funccion_exito,funcion_fracaso){
	if (dni === undefined || pass === undefined || role === undefined){
		dni="";
		pass="";
		role="";
	};
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var user={"dni":dni,"pass":pass}
	switch (role) {
	  case "patient":
	    user.patient = true;
	    break;
	  case "admin":
	    user.admin = true;
	    break;
	  case "doctor":
	    user.doctor = true;
	    break;
	  case "planner":
	    user.planner = true;
	    break;
	  default:
	    user.patient = true;
	}
	
	var cursor =db.collection('user').find(user);
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ db.close();
		if (resultado.length==1){funccion_exito();}
		else{funcion_fracaso();}
		}
	});
	
   	   
	});
};

//------------
var buscar_usuario = function(dni,
				funccion_exito,funcion_fracaso){
	if (dni === undefined){	
		console.log('problema en buscar_usuario, dni undefined');
		dni="";
	};
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var user={"dni":dni}
	
	var cursor =db.collection('user').find(user);
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ db.close();
		if (resultado.length==1){ user=resultado.pop();
					funccion_exito(user);}  //la funcion exito recibe el usuario en cuestion
		else{funcion_fracaso();}
		}
	});
	
   	   
	});
};

//------------

var editar_usuario = function(datos_user,f_exito,f_fracaso){

	var f_insert = function (){ // no esta en BD
		//--------
		MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		datos_user.patient = ((datos_user.patient === undefined)?false:true);
		datos_user.admin = ((datos_user.admin === undefined)?false:true);
		datos_user.doctor = ((datos_user.doctor === undefined)?false:true);
		datos_user.planner = ((datos_user.planner === undefined)?false:true);

		var fracaso= function(error){
		db.close();
		f_fracaso(error);
		}

		comprobaciones.comprobar_medico_cabecera (datos_user.family_doctor,fracaso,function(){
			var cipher_pass=cifrar_password(datos_user.pass,datos_user.dni);
			datos_user.pass = cipher_pass;
			db.collection('user').insert(datos_user);
			db.close();
			f_exito();
		})
		});
		};
	
	var f_update = function (u){ // si esta en BD
		//--------
		MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var user={};
		user._id=u._id;
		user.dni= datos_user.dni;
		user.name = datos_user.name;
		var cipher_pass=cifrar_password(datos_user.pass,datos_user.dni);
		user.pass = ((datos_user.pass == "")? u.pass : cipher_pass);
		user.patient = ((datos_user.patient === undefined)?false:true);
		user.admin = 	((datos_user.admin === undefined)?false:true);
		user.doctor = 	((datos_user.doctor === undefined)?false:true);
		user.planner = ((datos_user.planner === undefined)?false:true);
		user.family_doctor= datos_user.family_doctor;

		var fracaso= function(error){
		db.close();
		f_fracaso(error);
		}

		comprobaciones.comprobar_medico_cabecera (user.family_doctor,fracaso,function(){

			db.collection('user').update({"_id":u._id},user);
			db.close();
			f_exito();
		})

		});
		//--------
		};

	buscar_usuario(datos_user.dni,f_update,f_insert);
}

//------------
var borrar_usuario = function(dni,
				funccion_exito,funcion_fracaso){
//Comprobaciones

var hacer_comprobaciones = function (dni,f_fracaso,f_exito){

	comprobaciones.comprobar_horarios_medico (dni,f_fracaso,function () {
		comprobaciones.comprobar_citas_usuario (dni,f_fracaso,function () {
			comprobaciones.comprobar_pacientes_doctor (dni,f_fracaso,f_exito);
		});
	});
}
//--------------

	if (dni === undefined){	dni="";};
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var user={"dni":dni}
	
	var cursor =db.collection('user').find(user);
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
		if (resultado.length==1){
					user=resultado.pop();
					var f_fracaso =function(error){
						db.close();
						funcion_fracaso(error);
					};
					hacer_comprobaciones(dni,f_fracaso,function(){
						 db.collection('user').remove(user);
						 db.close(); 
						funccion_exito();
						});
					}  
		else{   db.close();
			var error="more_one_result"
			funcion_fracaso(error);}
		}
	});
	
   	   
	});
};

//------------
//------------

var editar_datos_propios = function(datos_user,callback){
	var f_fracaso = function (){ // no esta en BD
		//--------
		//no deberia producirse nunca
		//--------
		callback();		
		};
	
	var f_exito = function (u){ // si esta en BD
		//--------
		MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var user={};
		user._id=u._id;
		user.dni= u.dni;
		user.name = u.name;
		user.pass = ((datos_user.pass == "")? u.pass : datos_user.pass);
		user.patient = u.patient;
		user.admin = u.admin;
		user.doctor = u.doctor;
		user.planner = u.planner;
		user.family_doctor= u.family_doctor;
		db.collection('user').update({"_id":u._id},user);
		});
		//--------
		callback();		
		};

	buscar_usuario(datos_user.dni,f_exito,f_fracaso);
}

//------------
var buscar_doctores = function(funccion_exito){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var query1={"doctor" : true };
	var query2={ name:1, dni: 1, _id:0 };
	var cursor =db.collection('user').find(query1,query2);
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
			db.close(); 
			funccion_exito(resultado);  //la funcion exito recibe los doctores
		}
	});
	
   	   
	});
};

//###################################################

var buscar_citas = function(funccion_exito){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var cursor =db.collection('meeting').find();
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
			db.close(); 
			funccion_exito(resultado);  
		}
	});

	});
};

//--

var borrar_cita = function(patient,doctor,sala,begin,end,
				funccion_exito,funcion_fracaso){
	if (patient === undefined){	patient="";};
	if (doctor === undefined){	doctor="";};
	if (sala === undefined){	sala="";};
	if (begin === undefined){	begin="";};
	if (end === undefined){		end="";};

	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var query={"patient":patient,"doctor":doctor,"sala":sala,"begin":begin,"end":end}
	var cursor =db.collection('meeting').find(query);
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
		if (resultado.length==1){
					
					 db.collection('meeting').remove(query);
					 db.close(); 
					funccion_exito();} 
		else{   db.close();
			funcion_fracaso();}
		}
	});
	
   	   
	});
};

//---------

var insertar_cita = function(patient,doctor,sala,begin,end,
				funccion_exito,funccion_fracaso){

	//Comprobaciones

	var hacer_comprobaciones = function (f_fracaso,f_exito){
		comprobaciones.comprobar_paciente_existe(patient,f_fracaso,function (){
			comprobaciones.comprobar_doctor_existe (doctor,f_fracaso,function (){
				comprobaciones.comprobar_sala_existe (sala,f_fracaso,function (){
					comprobaciones.comprobar_subcitas (sala,begin,end,f_fracaso,function (){
						comprobaciones.comprobar_cita_en_horario (sala,begin,end,f_fracaso,f_exito);			
					});
				});
			});
		});	
	};

	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var cita={};
	cita.patient= patient;
	cita.doctor = doctor;
	cita.begin = begin;
	cita.end = end;
	cita.sala = sala;

	var f_fracaso= function (error){
		db.close();
		funccion_fracaso(error);
	}
	
	var f_exito = function (){
		db.collection('meeting').insert(cita);
		db.close();
		funccion_exito();
	} 

	hacer_comprobaciones(f_fracaso,f_exito);
	});

}

var buscar_salas = function(funccion_exito){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var cursor =db.collection('room').find();
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
			db.close(); 
			funccion_exito(resultado);  
		}
	});

	});
};

var borrar_sala = function(sala,
				funccion_exito,funcion_fracaso){

//Comprobaciones

var hacer_comprobaciones = function (sala,f_fracaso,f_exito){

	comprobaciones.comprobar_horarios_sala (sala,f_fracaso,function () {
		comprobaciones.comprobar_citas_sala (sala,f_fracaso,f_exito);
	});

}
//----------
	if (sala === undefined){sala="";};
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var query={"name":sala}
	
	var cursor =db.collection('room').find(query);
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
		if (resultado.length==1){
					var f_fracaso= function (error){
						db.close();
						funcion_fracaso(error);
					};
					
					hacer_comprobaciones (sala,f_fracaso,function (){
						 db.collection('room').remove(query);
						 db.close(); 
						funccion_exito();}); 

					}

		else{   db.close();
			var error="more_one_result"
			funcion_fracaso(error);}
		}
	});
	
   	   
	});
};


var insertar_sala = function(nombre_sala,
				funccion_exito){

	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var sala={};
	sala.name= nombre_sala;
	db.collection('room').insert(sala);
	db.close();
	funccion_exito();
	})
}

//---------
var buscar_sala_cita_usuario = function(dni,rol,
				funccion_exito,funcion_fracaso){
	if (dni === undefined){dni="";};
	if (rol === undefined){rol="";};

	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	//db.meeting.find({"doctor":"11111111H"},{"sala":1,_id: 0})
	var ahora=new Date();
	ahora= ahora.toISOString();

	//-----------
	var query1={"lo_que_sea":"lo_que_sea"};
	switch (rol) {
	  case "patient":
	  	query1={"patient":dni, "begin" : {$lt: ahora}, "end" : {$gte: ahora} };
	  	break;
	  case "doctor":
		query1={"doctor":dni, "begin" : {$lt: ahora}, "end" : {$gte: ahora}};
	  	break;
	  default:
	   	break;
	}
	var query2={"sala":1,_id: 0};
	//console.log(JSON.stringify(query1));
	var cursor =db.collection('meeting').find(query1,query2);
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ db.close();
		if (resultado.length==1){ sala=resultado.pop();
					funccion_exito(sala);}  
		else{funcion_fracaso();}
		}
	});
	
   	   
	});
};
//####################################################
var buscar_horarios = function(funccion_exito){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var cursor =db.collection('schedule').find();
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
			db.close(); 
			funccion_exito(resultado);  
		}
	});

	});
};


var borrar_horario = function(room,month,year,begin,end,
				funcion_exito,funcion_fracaso){
	if (room === undefined){	room="";};
	if (month === undefined){	month="";};
	if (year === undefined){	year="";};
	if (begin === undefined){	begin="";};
	if (end === undefined){		end="";};
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var query={"room":room,"month":month,"year":year,"begin":parseFloat(begin),"end":parseFloat(end)}
	
	var cursor =db.collection('schedule').find(query);

	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
		if (resultado.length==1){
					var f_exito= function (){
						db.collection('schedule').remove(query);
						db.close(); 
						funcion_exito();
					};
					var f_fracaso = function (error){
						db.close();
						funcion_fracaso(error);
					};
					comprobaciones.comprobar_citas_horario ( room, parseFloat(begin), parseFloat(end) ,month , year,  f_fracaso,f_exito);
					} 
		else{   db.close();
			var error="more_one_result"
			funcion_fracaso(error);}
		}
	});
	
   	   
	});
};

var insertar_horario = function(doctor,room,month,year,begin,end,
				funccion_exito,funccion_fracaso){

//Comprobaciones

	var hacer_comprobaciones = function (f_fracaso,f_exito){
		comprobaciones.comprobar_doctor_existe (doctor,f_fracaso,function (){
			comprobaciones.comprobar_sala_existe (room,f_fracaso,function (){
			   comprobaciones.comprobar_argumentos_validos(begin,end,month,year,f_fracaso,f_exito);					
			});
		});
	};	
	

	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var horario={};
	horario.doctor = doctor;
	horario.room= room;
	horario.begin = begin;
	horario.end = end;
	horario.month = month;
	horario.year = year;

	var fracaso= function (error){
		db.close();
		funccion_fracaso(error);
	};
	var exito= function (){
		db.collection('schedule').insert(horario);
		db.close();
		funccion_exito();
	}
	hacer_comprobaciones(fracaso,exito);
	})

}
//---------

var buscar_horarios_doctor = function(doctor,funccion_exito){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var cursor =db.collection('schedule').find({"doctor" : doctor});
	var resultado = [];  
 	cursor.each(function(err, doc) {
   	   assert.equal(err, null);
	   
   	   if (doc != null) {
		resultado.push(doc)}
	   else{ 
			db.close(); 
			funccion_exito(resultado);  
		}
	});

	});
};

//#################################################
var citas_futuras_paciente = function(dni_paciente,funccion_exito){
	// Devuelve todas las citas de un paciente que sean presentes o futuras
	var ahora=new Date();
	ahora= ahora.toISOString();

	var collection = 'meeting';
	var query1={"patient" : dni_paciente, "end" : {$gte: ahora} };
	comprobaciones.query_generica_busqueda(collection,query1,{},function(lista_citas){
		funccion_exito(lista_citas);
	});
};

var citas_futuras_doctor = function(dni_doctor,funccion_exito){
	// Devuelve todas las citas de un paciente que sean presentes o futuras
	var ahora=new Date();
	ahora= ahora.toISOString();

	var collection = 'meeting';
	var query1={"doctor" : dni_doctor, "end" : {$gte: ahora} };
	comprobaciones.query_generica_busqueda(collection,query1,{},function(lista_citas){
		funccion_exito(lista_citas);
	});
};
//###################################################
var buscar_easyrtc_token = function(dni,funccion_exito){

	var collection = 'token';
	var query1={"dni" : dni};
	comprobaciones.query_generica_busqueda(collection,query1,{},function(lista){
		funccion_exito(lista);
	});
}

var insert_easyrtc_token = function(dni,token,funccion_exito){

	var callback = function (lista){

	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var datos={};
	datos.dni = dni;
	datos.token= token;

	if (lista.length==0) {
		db.collection('token').insert(datos);
		db.close();
		funccion_exito();
		}
	else {  db.collection('token').update({"dni":datos.dni},datos);
		db.close();
		funccion_exito();
		}
	})
	};
	
	buscar_easyrtc_token (dni,callback);
}
//###################################################
var buscar_cita_actual_usuario = function(dni,rol,
				funccion_exito){
	if (dni === undefined){dni="";};
	if (rol === undefined){rol="";};

	var ahora=new Date();
	ahora= ahora.toISOString();

	var query1={"lo_que_sea":"lo_que_sea"};
	switch (rol) {
	  case "patient":
	  	query1={"patient":dni, "begin" : {$lt: ahora}, "end" : {$gte: ahora} };
	  	break;
	  case "doctor":
		query1={"doctor":dni, "begin" : {$lt: ahora}, "end" : {$gte: ahora}};
	  	break;
	  default:
	   	break;
	}

	var collection = 'meeting';
	comprobaciones.query_generica_busqueda(collection,query1,{},function(lista){
		funccion_exito(lista);
	});

};

var buscar_interlocutor = function(dni,rol,   //busca con quien tienes la cita, para luego buscar su token
				callback){

	buscar_cita_actual_usuario (dni,rol,function (lista){
		var result="";
		//console.log(JSON.stringify(lista));
		if (lista.length>0) {
			switch (rol) {
			  case "patient":
			  	result= lista[0].doctor;
			  	break;
			  case "doctor":
				result= lista[0].patient;
			  	break;
			  default:
			   	break;
			}
		}
		callback(result);
	});
}

//####################################################
var borrar_tokens_easyrtc = function(){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);

	db.collection('token').remove();
	db.close(); 
 	});
};

//####################################################

module.exports = {
	cifrar_password : cifrar_password,
	comprobar_dni_pass_role : comprobar_dni_pass_role,
	buscar_usuario : buscar_usuario,
	editar_usuario : editar_usuario,
	borrar_usuario : borrar_usuario,
	editar_datos_propios : editar_datos_propios,
	buscar_doctores : buscar_doctores,
	//##########################
	buscar_citas : buscar_citas,
	borrar_cita : borrar_cita,
	insertar_cita : insertar_cita,
	buscar_salas : buscar_salas,
	borrar_sala : borrar_sala,
	insertar_sala : insertar_sala,
	buscar_sala_cita_usuario : buscar_sala_cita_usuario,
	//#########################
	buscar_horarios : buscar_horarios,
	borrar_horario : borrar_horario,
	insertar_horario : insertar_horario,
	//---
	buscar_horarios_doctor : buscar_horarios_doctor,
	query_generica_busqueda : comprobaciones.query_generica_busqueda, //la cogemos de comprobaciones y la exportamos desde aqui
	//#########################
	citas_futuras_paciente : citas_futuras_paciente,
	citas_futuras_doctor : citas_futuras_doctor,
	buscar_easyrtc_token : buscar_easyrtc_token,
	insert_easyrtc_token : insert_easyrtc_token,
	buscar_cita_actual_usuario : buscar_cita_actual_usuario,
	buscar_interlocutor : buscar_interlocutor,
	borrar_tokens_easyrtc : borrar_tokens_easyrtc
}
