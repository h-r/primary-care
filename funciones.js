var base_datos = require('./db');
var es_ES= require('./idiomas/es_ES');
var en_US= require('./idiomas/en_US');


//###############################################
var autenticado_con_cookies = function (req,res,role,
							funcion_exito) {
	//Aprobechamos para la comprobacion de idioma
	var idioma = req.cookies.idioma;
	if (idioma === undefined){
		res.cookie('idioma','es_ES');
	};
	//-------------
	

	var dni = req.cookies.dni;
	var pass = req.cookies.pass;
	//var role = req.cookies.role; no lo cogemos en las cookies y lo comprobamos por parametro para poder forzar una comprobacion especifica
	if (role === ""){var rol = req.cookies.role;} //solo lo cogemos en las cookies si el otro no esta definido, para una autencticacion generica.
	else{rol=role};
	//----------------------------
	if (dni === undefined || pass === undefined){
		res.redirect('/');}
	else {
	//------------------
	var f_fracaso = function(){
		res.redirect('/');}
		//------------------
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	//Aprobechamos para la gestion de citas (para el badge con la informacion)
	var f_exito = function(){

	    switch (rol) {
		case "patient":
			base_datos.citas_futuras_paciente (dni,function(lista_citas){
			req.cookies.citas = JSON.stringify(lista_citas.length);  // se hace en req para que el cambio sea instantaneo
			funcion_exito();
			});
	  		break;
		case "doctor":
	  		base_datos.citas_futuras_doctor (dni,function(lista_citas){
			req.cookies.citas = JSON.stringify(lista_citas.length); // se hace en req para que el cambio sea instantaneo
			funcion_exito();
			});
	  		break;
		default:
	   		funcion_exito();
	  	break;
	  	}

	}	
	//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	base_datos.comprobar_dni_pass_role(dni,pass,rol,f_exito,f_fracaso);	
	};
};


//###############################################
var texto = function (req,res,text) {  // para gestionar los idiomas
	var idioma = req.cookies.idioma;
	if (idioma === undefined){
		idioma = 'es_ES';
	};
	switch (idioma) {
		case "es_ES":
			return es_ES.textos[text]; 
			break;
		case "en_US":
			return en_US.textos[text];
			break;
		default:
			return es_ES.textos[text]; 
			break;		    
	}
};
 
//###############################################
var url_activa = function (req,res,url) { //para la barra de navegacion
	var parte1= req.url.substring(0,url.length);
	var parte2= req.url.substring(url.length); //de ahi en adelante
	if (parte1 == url){   //buscamos url en req.url para evitar tener que poner la fecha en /patient/meetings/day/month/year 
		if ((parte2=="") || (parte2.substring(0,1)=="/"))
			{return "active"}
		else {return ""}
	}else { return ""}
}

//###############################################
module.exports = {
	autenticado_con_cookies : autenticado_con_cookies,
	texto : texto,
	url_activa : url_activa
}
