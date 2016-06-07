var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var config = require('./../config');
var url = config.url_bd;

//$$$$$$$
var query_generica_busqueda = function(collection,query1,query2,
					funccion_exito){ //siendo collection la tabla, query1 el where y query2 el select
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var cursor =db.collection(collection).find(query1,query2);
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

//###############################################
//----Comprobacion de que el medico de cabecera exista o sea ninguno----------- (Editar_usuario)
var comprobar_medico_cabecera = function (dni,
				fracaso,exito){
	if (dni=="Ninguno"){
		exito()
	}else{

	var collection='user'
	var query1={"dni":dni,"doctor":true}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		
		if (resultado.length==0){var error="doctor_not_found";
			fracaso(error);
		}else{
			exito()
		}
	});
	}
}
//---------------
//----Comprobacion que si es medico no tenga horarios----------- (Borrar_usuario)
var comprobar_horarios_medico = function (dni,
				fracaso,exito){
	var collection='schedule'
	var query1={"doctor":dni}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		if (resultado.length==0){
			exito()

		}else{
			var error="doctor_con_horarios";
			fracaso(error);
		}
	});
	}

//---------------
//----Comprobacion que no tenga citas----------- (Borrar_usuario)
var comprobar_citas_usuario = function (dni,
				fracaso,exito){
	var collection='meeting'
	var query1={$or:[{"doctor":dni},{"patient":dni}]}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		if (resultado.length==0){
			exito()

		}else{
			var error="usuario_con_citas";
			fracaso(error);
		}
	});
}

//---------------
//----Comprobacion que no tenga pacientes (si es medico)-----------
var comprobar_pacientes_doctor = function (dni,
				fracaso,exito){
	var collection='user'
	var query1={"family_doctor":dni}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		if (resultado.length==0){
			exito()

		}else{
			var error="medico_con_pacientes";
			fracaso(error);
		}
	});
}

//---------------
//----Comprobacion que la sala no tenga horarios----------- (Borrar Sala)
var comprobar_horarios_sala = function (nombre_sala,
				fracaso,exito){
	var collection='schedule'
	var query1={"room":nombre_sala}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		if (resultado.length==0){
			exito()

		}else{
			var error="sala_con_horarios";
			fracaso(error);
		}
	});
}

//---------------
//----Comprobacion que la sala no tenga citas----------- (Borrar Sala)
var comprobar_citas_sala = function (nombre_sala,
				fracaso,exito){
	var collection='meeting'
	var query1={"sala":nombre_sala}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		if (resultado.length==0){
			exito()

		}else{
			var error="sala_con_citas";
			fracaso(error);
		}
	});
}
//---------------
//----Comprobacion que el horario no tenga citas----------- (Borrar Horario)
var comprobar_citas_horario = function (sala,begin,end,month,year,
				fracaso,exito){

	var hora_inicio=Math.floor(begin);
	var minutos_inicio= (begin - hora_inicio) * 100;
	var hora_fin=Math.floor(end)
	var minutos_fin= (end - hora_fin) * 100
	var f_begin=new Date(year, month -1, 1, hora_inicio, minutos_inicio, 0, 0);
	var f_end=new Date(year, month, 0, hora_fin, minutos_fin, 0, 0);
	f_begin=f_begin.toISOString();
	f_end=f_end.toISOString();

	var collection='meeting'
	var query1={"sala":sala, "begin" : {$gte: f_begin} , "end" : {$lte: f_end} };
	query_generica_busqueda (collection,query1,{}, function(resultado){
		//console.log(JSON.stringify(resultado));
		if (resultado.length==0){
			exito()

		}else{
			var error="horario_con_citas";
			fracaso(error);
		}
	}); 
}

//----Comprobacion de que el paciente exista----------- (Insertar cita)
var comprobar_paciente_existe = function (dni,
				fracaso,exito){
	var collection='user'
	var query1={"dni":dni,"patient":true}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		
		if (resultado.length==0){var error="patient_not_found";
			fracaso(error);
		}else{
			exito()
		}
	});
	
}
//---------------
//----Comprobacion de que el doctor exista----------- (Insertar cita)
var comprobar_doctor_existe = function (dni,
				fracaso,exito){
	var collection='user'
	var query1={"dni":dni,"doctor":true}
	query_generica_busqueda (collection,query1,{}, function(resultado){
		
		if (resultado.length==0){var error="doctor_not_found";
			fracaso(error);
		}else{
			exito()
		}
	});
	
}
//---------------
//----Comprobacion de que la sala exista----------- (Insertar cita)
var comprobar_sala_existe = function (sala,
				fracaso,exito){
	var collection='room'
	var query1={"name":sala}
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		
		if (resultado.length==0){var error="room_not_found";
			fracaso(error);
		}else{
			exito()
		}
	});
	
}
//---------------
//----Comprobacion que la cita no este dentro de otra cita ----------- (Insertar cita)
var comprobar_subcitas = function (sala,begin_cita,end_cita,
				fracaso,exito){
	var collection='meeting';
	var subquery1={"sala":sala, "begin" : {$lt: end_cita}};;
	var subquery2={"sala":sala, "end" :   {$gt: begin_cita} };;
	var query1={$and:[subquery1,subquery2]};
	
	query_generica_busqueda (collection,query1,{}, function(resultado){
		//console.log(JSON.stringify(resultado));
		if (resultado.length==0){
			exito()
		}else{
			var error="sub-cita";
			fracaso(error);			
		}
	}); 
}
//-----------------------
//----Comprobacion que la cita este en un horario ----------- (Insertar cita)
var comprobar_cita_en_horario = function (sala,begin_cita,end_cita,
				fracaso,exito){
	var f_begin=new Date(begin_cita);
	var f_end=new Date(end_cita);

	var month = f_begin.getMonth() + 1;
	var year  = f_begin.getFullYear();

	var hora_inicio=f_begin.getHours();
	var minutos_inicio= f_begin.getMinutes();
	var hora_fin=f_end.getHours();
	var minutos_fin= f_end.getMinutes();

	var begin=hora_inicio+(minutos_inicio / 100);
	var end=hora_fin+(minutos_fin / 100);;
	
	var collection='schedule'
	var query1={"room" : sala, "begin" : {$lte: begin},"end" : {$gte: end}, "month" : month.toString(), "year" : year.toString()};
	query_generica_busqueda (collection,query1,{}, function(resultado){
		//console.log(JSON.stringify(query1));
		if (resultado.length==0){
			var error="schedule_not_found";
			fracaso(error);
		}else{
			exito()
		}
	}); 
}
//-----------------------

//----Comprobacion que el begin y en sean validos (entre 0 y 23.59) y el mes y el año tambien ----------- (Insertar horario)
var comprobar_argumentos_validos = function (begin,end,month,year,
				fracaso,exito){
	begin=parseFloat(begin);
	end=parseFloat(end);
	month=parseInt(month);
	year=parseInt(year);
	b_horas=Math.floor(begin);
	b_minutos=(begin - b_horas)*100;
	e_horas=Math.floor(end);
	e_minutos=(end - e_horas)*100;
	var bien=true;

	bien = bien && (begin<end);
	bien = bien && (b_horas>=0) && (b_horas<=23);
	bien = bien && (e_horas>=0) && (e_horas<=23);
	bien = bien && (b_minutos>=0) && (b_minutos<=59);
	bien = bien && (e_minutos>=0) && (e_minutos<=59);
	bien = bien && (month>=1) && (month<=12);
	bien = bien && (year>=2000) && (year<=3000); //para comprobar que tenga 4 digitos

	if (bien){
		exito();
	}else{
		var error="parametros_incorrectos";
		fracaso(error);
	} 
}
//-----------------------
//###############################################


module.exports = {
	query_generica_busqueda : query_generica_busqueda,
	comprobar_medico_cabecera : comprobar_medico_cabecera,
	comprobar_horarios_medico : comprobar_horarios_medico,
	comprobar_citas_usuario : comprobar_citas_usuario,
	comprobar_pacientes_doctor : comprobar_pacientes_doctor,
	comprobar_horarios_sala : comprobar_horarios_sala,
	comprobar_citas_sala : comprobar_citas_sala,
	comprobar_citas_horario : comprobar_citas_horario,
	comprobar_paciente_existe : comprobar_paciente_existe,
	comprobar_doctor_existe : comprobar_doctor_existe,
	comprobar_sala_existe : comprobar_sala_existe,
	comprobar_subcitas : comprobar_subcitas,
	comprobar_cita_en_horario : comprobar_cita_en_horario,
	comprobar_argumentos_validos : comprobar_argumentos_validos
}
