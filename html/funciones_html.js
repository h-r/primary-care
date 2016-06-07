var base_datos = require('./../db');
var funciones = require('./../funciones');

//###############################################
var generar_combo_box_doctores= function(req,res,seleccionado,callback){  //funcion auxiliar
	//var lista=[{"dni":"33333333H","name":"Doctor1_actualizado"},{"dni":"44444444J","name":"Doctor2"}];
	//var seleccionado = "33333333H";	
	var generar_combo_box= function(lista,seleccionado) {

	//1111111111111111		    
	var selected='';
	var resultado='<select class="form-control" name="family_doctor">';

	if (seleccionado == "Ninguno"){selected='selected';}
	else{selected=''};

	resultado=resultado + '<option value="Ninguno" '+selected+'>'+funciones.texto(req,res,'ninguno')+'</option>';
	
	for(var i = 0; i < lista.length;i++){

		if (seleccionado == lista[i].dni){selected='selected';}
		else{selected=''};

		resultado=resultado + '<option value="'+lista[i].dni+'" '+selected+'>'+lista[i].dni+" : " +lista[i].name+'</option>';
	} 
	resultado=resultado + '</select>';

	return(resultado);
	//11111111111111111111
	};
	base_datos.buscar_doctores(function (result) {
	  html=generar_combo_box(result,seleccionado);
	  callback(html);
	});	
};
//###############################################

//###############################################
var generar_combo_box_generico= function(req,res,nombre,lista,callback){  
	// lista con elementos de 2 valores: un value y un text
	var resultado='<select class="form-control" name="'+nombre+'">';
	
	for(var i = 0; i < lista.length;i++){

		if (i == 0){selected='selected';}   //se selecciona el 1º elemento
		else{selected=''};

		resultado=resultado + '<option value="'+lista[i].value+'" '+selected+'>'+lista[i].text+'</option>';
	} 
	resultado=resultado + '</select>';

	callback(resultado);

};
//###############################################
var generar_combo_box_salas= function(req,res,callback){
	var collection = 'room';
	var query1={};
	var query2={"_id":0,"name":1}
	base_datos.query_generica_busqueda(collection,query1,query2,function (salas){
		var lista=[];
		for(var i = 0; i < salas.length;i++){
			lista.push({"value":salas[i].name,"text":salas[i].name});
		}
		//console.log(JSON.stringify(lista));
		generar_combo_box_generico(req,res,"room",lista,callback);
	});
}
//###############################################

var generar_combo_box_meses= function(req,res,callback){
	var lista=[];
	lista.push({"value": "1","text":"1 - "+funciones.texto(req,res,'enero')});
	lista.push({"value": "2","text":"2 - "+funciones.texto(req,res,'febrero')});
	lista.push({"value": "3","text":"3 - "+funciones.texto(req,res,'marzo')});
	lista.push({"value": "4","text":"4 - "+funciones.texto(req,res,'abril')});
	lista.push({"value": "5","text":"5 - "+funciones.texto(req,res,'mayo')});
	lista.push({"value": "6","text":"6 - "+funciones.texto(req,res,'junio')});
	lista.push({"value": "7","text":"7 - "+funciones.texto(req,res,'julio')});
	lista.push({"value": "8","text":"8 - "+funciones.texto(req,res,'agosto')});
	lista.push({"value": "9","text":"9 - "+funciones.texto(req,res,'septiembre')});
	lista.push({"value": "10","text":"10 - "+funciones.texto(req,res,'octubre')});
	lista.push({"value": "11","text":"11 - "+funciones.texto(req,res,'noviembre')});
	lista.push({"value": "12","text":"12 - "+funciones.texto(req,res,'diciembre')});
	generar_combo_box_generico(req,res,"month",lista,callback);
	
}
//###############################################


module.exports = {
	generar_combo_box_doctores : generar_combo_box_doctores,
	generar_combo_box_generico : generar_combo_box_generico,
	generar_combo_box_salas : generar_combo_box_salas,
	generar_combo_box_meses : generar_combo_box_meses
}
