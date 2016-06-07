var base_datos = require('./db'); 
var funciones = require('./funciones');
var h_planner = require('./html/html_planner');
var h_admin = require('./html/html_admin');
var h_doctor = require('./html/html_doctor');
var h_patient = require('./html/html_patient');
var tabla_calendario = require('./html/tabla_calendario');
var tipos_mensajes = require('./idiomas/mensajes');
var config = require('./config');

//############## ROUTES #################################
var cabecera_html= function (req,res,callback)	{
	texto='<html><head>';
	texto= texto + '<meta charset="UTF-8">\
		<title>'+funciones.texto(req,res,'app_title')+'</title>\
		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">\
		<link rel="stylesheet" href="/css/bootstrap.min.css">\
		<link rel="stylesheet" href="/css/tablas.css">\
		<link rel="stylesheet" href="/css/estilos.css">';
	//texto= texto + '<link rel="stylesheet" href="/css/tablas_cabecera_fija.css">';
	texto= texto + '</head><body>';
	callback(texto);
};

var cabecera_basica= function (req,res,texto_anterior,callback)	{ //sin login
	texto= '<header> 														\
	<nav class="navbar navbar-default navbar-inverse"> 										\
		<div class="container-fluid">												\
			<div class="navbar-header">											\
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-1">	\
					<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>	\
				</button>												\
				<a style="line-height: 35px;" href="#" class="navbar-brand">'+funciones.texto(req,res,'app_title')+'<a>	\
			</div>														\
			<div class="collapse navbar-collapse" id="navbar-1">								\
				<ul class="nav navbar-nav navbar-right">								\
					<li><a href="#"></a></li>									\
					<li><a href="/idioma/es_Es"><img src="/img/es_Es.png" height="35"></a></li>			\
					<li><a href="/idioma/en_US"><img src="/img/en_Us.png" height="35"></a></li>			\
				</ul>													\
			</div>														\
		</div>															\
	</nav>																\
</header>';

	callback(texto_anterior+texto);
};

var cuerpo_login = function (req,res,texto_anterior,callback)	{ //app.get ('/')
	
	texto='																\
<div class="container">															\
 <div class="row">															\
  <div class="col-xs-12 col-sm-9 col-md-10">												\
	   <form action="#" method="post" class="form-horizontal">									\
		<div class="form-group">												\
	             <label class="control-label col-xs-12 col-sm-3">'+funciones.texto(req,res,'dni')+':</label>			\
		     <div class="col-xs-12 col-sm-6 col-md-7">										\
	 		 <input class="form-control" type="text" name="dni" value=""> 							\
		     </div>														\
		</div>															\
		<div class="form-group">												\
  	    	     <label class="control-label col-xs-12 col-sm-3">'+funciones.texto(req,res,'password')+':</label>			\
		     <div class="col-xs-12 col-sm-6 col-md-7">										\
	 	 	<input class="form-control" type="password" name="pass" value="">						\
	 	     </div>														\
		</div> 															\
		<div class="radio">													\
  	    	    <label for="rad1" class="col-xs-2 col-xs-offset-0 col-sm-offset-3">							\
			<input id= "rad1" type="radio" name="role" value="patient" checked>'+funciones.texto(req,res,"patient")+'	\
		    </label>														\
		</div>															\
		<div class="radio">													\
  	    	    <label for="rad2" class="col-xs-2 col-xs-offset-0 col-sm-offset-3">							\
			<input id= "rad2" type="radio" name="role" value="admin">'+funciones.texto(req,res,"admin")+'			\
		    </label>														\
		</div> 															\
		<div class="radio">													\
  	    	    <label for="rad3" class="col-xs-2 col-xs-offset-0 col-sm-offset-3">							\
			<input id= "rad3" type="radio" name="role" value="doctor">'+funciones.texto(req,res,"doctor")+'			\
		    </label>														\
		</div> 															\
		<div class="radio">													\
  	    	    <label for="rad4" class="col-xs-2 col-xs-offset-0 col-sm-offset-3">							\
			<input id= "rad4" type="radio" name="role" value="planner">'+funciones.texto(req,res,"planner")+'		\
		    </label>														\
		</div> 															\
		<br>															\
		<div class="form-group">												\
		   <div class="col-xs-2 col-xs-offset-0 col-sm-offset-3"> 								\
			<input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'login')+'">			\
		   </div> 														\
		</div> 															\
		</form> 														\
  </div> 																\
  <div class="col-xs-12 col-sm-3 col-md-2">												\
		<div class="btn-group-vertical">											\
		<a class="btn btn-primary" href="https://'+config.ip_servidor+":"+config.puerto_serv_cert.toString()+'/admin"> 		\
 			'+funciones.texto(req,res,"certificado_admin")+'</a>								\
		<a class="btn btn-primary" href="https://'+config.ip_servidor+":"+config.puerto_serv_cert.toString()+'/patient">	\
 			'+funciones.texto(req,res,"certificado_patient")+'</a>								\
		<a class="btn btn-primary" href="https://'+config.ip_servidor+":"+config.puerto_serv_cert.toString()+'/doctor"> 	\
 			'+funciones.texto(req,res,"certificado_doctor")+'</a>								\
		<a class="btn btn-primary" href="https://'+config.ip_servidor+":"+config.puerto_serv_cert.toString()+'/planner">	\
 			'+funciones.texto(req,res,"certificado_planner")+'</a>								\
		</div>															\
  </div> 																\
 </div>																	\
</div>'; 
	callback(texto_anterior+texto);
};

var mensajes_y_pie_pagina = function (req,res,texto_anterior,callback)	{  
	var texto="";
	//PARA_LOS_MENSAJES
	var mensaje = req.cookies.mensaje; //cookie para los alerts
	  if (!(mensaje === undefined)){
		//--- Para los colores del alert -------
		var color="panel-primary";
		switch (tipos_mensajes.mensajes[mensaje]) {
		  case "Exito":
		  	color="panel-primary"; break;
		  case "Fracaso":
		  	color="panel-danger"; break;
		  }
		//--- Fin para los colores del alert -------
		texto=texto + '';
		texto=texto + '<div class="modal fade" id="ventana1" role="dialog">						\
	<div class="modal-dialog">												\
		<div class="modal-content '+color+'">									\
			<div class="modal-header panel-heading"> <!-- Es necesario panel-heading para los colores  -->		\
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>	\
				<h3 class="modal-title">'+funciones.texto(req,res,mensaje)+'</h3>				\
			</div>													\
		</div>														\
	</div>															\
				</div>';

				//'<script>alert("'+funciones.texto(req,res,mensaje)+'")</script>';
		res.clearCookie('mensaje');
		};
	//----FIN PARA_LOS_MENSAJES
	texto=texto + '<script src="/js/jquery.js"></script>';
	texto=texto + '<script src="/js/bootstrap.min.js"></script>';
	//PARA_LOS_MENSAJES
	if (!(mensaje === undefined)){
	texto=texto + '<script>\
		$(document).ready(function (){\
			$("#ventana1").modal(); });\
		</script>';
	}
	//----FIN PARA_LOS_MENSAJES
	texto=texto + '</body></html>';
	callback(texto_anterior+texto);
};
//##################FIN ROUTES#############################

//################HTML Video conferencia EasyRTC ########################################
var html_videoconferencia_easyrtc = function (req,res,texto_anterior,callback)	{
	var texto = '<script src="/socket.io/socket.io.js"></script>								\
        <script type="text/javascript" src="/easyrtc/easyrtc.js"></script>							\
        <script type="text/javascript" src="/videoconferencia.js"></script>							\
																\
	<div id="container">													\
            <div class="container" id="demoContainer">									\
               <div class="row" id="videos">										\
		   <div class="col-lg-6 col-md-6 col-sm-6 hidden-xs" style="float:left; overflow:hidden;">		\
                        <video width="99%" autoplay="autoplay" class="easyrtcMirror" id="selfVideo" muted="muted" volume="0" style=" border-radius : 3em;"></video>	\
		   </div>													\
                   <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="float:left; overflow:hidden;">		\
                        <video width="99%" autoplay="autoplay" id="callerVideo" style =" border-radius : 3em;"></video>		\
                   </div>													\
               </div>														\
            </div>														\
        </div>															\
	<br style="clear:both;" />												\
	<div style="display: none;" id="token_propio">aaaaa<div>';
	callback(texto_anterior+texto);
};
//######################################################################################

module.exports = {
	cabecera_html : cabecera_html,
	cabecera_basica : cabecera_basica, //Sin login
	cuerpo_login : cuerpo_login, //app.get ('/')
	mensajes_y_pie_pagina : mensajes_y_pie_pagina,
	cabecera_pacientes : h_patient.cabecera_pacientes,
	editar_datos_propios_paciente : h_patient.editar_datos_propios_paciente, //app.get ('/patient/my_count')
	tabla_citas_paciente : h_patient.tabla_citas_paciente, //app.get ('/patient/meeting')
	lista_citas_paciente : h_patient.lista_citas_paciente, //app.get ('/patient/meetings_list')
	cabecera_doctor : h_doctor.cabecera_doctor,
	editar_datos_propios_doctor : h_doctor.editar_datos_propios_doctor, //app.get ('/doctor/my_count')
	tabla_citas_doctor : h_doctor.tabla_citas_doctor, //app.get ('/doctor/meeting')
	cabecera_planner : h_planner.cabecera_planner,
	editar_datos_propios_planner : h_planner.editar_datos_propios_planner, //app.get ('/planner/my_count')
	html_citas_planner : h_planner.html_citas_planner, //app.get ('/planner/meetings')
	html_horarios_planner : h_planner.html_horarios_planner, //app.get ('/planner/schedules')
	cabecera_admin : h_admin.cabecera_admin,
	editar_usuario_admin : h_admin.editar_usuario_admin, //app.get ('/admin/edit_user')
	buscar_usuario : h_admin.buscar_usuario,
	listar_usuarios : h_admin.listar_usuarios,
	crear_html_admin_salas : h_admin.crear_html_admin_salas, //app.get ('/admin/rooms')
	"tabla_calendario" : tabla_calendario.tabla,
	html_videoconferencia_easyrtc : html_videoconferencia_easyrtc
}
