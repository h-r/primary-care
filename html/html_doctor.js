var base_datos = require('./../db/db'); 
var funciones = require('./../funciones');
var tabla_calendario = require('./tabla_calendario');
var mas_funciones = require('./../mas_funciones');
var config = require('./../config');

//##################DOCTOR#############################
var cabecera_doctor= function (req,res,texto_anterior,callback)	{
	texto= '<header> 														\
	<nav class="navbar navbar-default navbar-inverse"> 										\
		<div class="container-fluid">												\
			<div class="navbar-header">											\
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-1">	\
					<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>	\
				</button>												\
				<a style="line-height: 35px;" href="#" class="navbar-brand">'+funciones.texto(req,res,'app_title')+'</a>\
			</div>														\
			<div class="collapse navbar-collapse" id="navbar-1">								\
				<ul class="nav navbar-nav">										\
					<li class="'+funciones.url_activa(req,res,'/doctor/my_count')+'">				\
						<a href="/doctor/my_count">'+funciones.texto(req,res,'my_count')+'</a>			\
					</li> 												\
					<li class="'+funciones.url_activa(req,res,'/doctor/meetings')+'">				\
						<a href="/doctor/meetings">'+funciones.texto(req,res,'citas');
						if (req.cookies.citas !== undefined){
						texto= texto + ' <spam class="badge">'+req.cookies.citas+'</spam>'; 
						}	
						texto= texto + '</a>									\
					</li>												\
					<li class="'+funciones.url_activa(req,res,'/doctor/conference_room')+'">			\
						<a href="/doctor/conference_room">'+funciones.texto(req,res,'conference_room')+'</a> 	\
					</li>												\
					<li><a href="/logout">'+funciones.texto(req,res,'logout')+'</a></li>				\
				</ul>													\
				<ul class="nav navbar-nav navbar-right">								\
					<li><a href="/idioma/es_Es"><img src="/img/es_Es.png" height="35"></a></li>			\
					<li><a href="/idioma/en_US"><img src="/img/en_Us.png" height="35"></a></li>			\
				</ul>													\
			</div>														\
		</div>															\
	</nav>																\
</header>';
	callback(texto_anterior+texto);
};

var editar_datos_propios_doctor = function (req,res,texto_anterior,
						dni,name,
						callback)	{ //app.get ('/doctor/my_count')

	texto= '														\
<div class="container">														\
 <div class="row">														\
  <div class="col-xs-12">													\
   <form action="#" method="post" class="form-horizontal">									\
	<div class="form-group">												\
             <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'dni')+':</label>			\
	     <div class="col-xs-12 col-sm-10 col-lg-8">										\
 		 <input class="form-control" type="text" name="dni" value="" placeholder="'+dni+'" disabled> 			\
	     </div>														\
	</div>															\
	<div class="form-group">												\
	     <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'nombre')+':</label> 			\
	     <div class="col-xs-12 col-sm-10 col-lg-8"> 									\
	  	 <input class="form-control" type="text" name="name" value="" placeholder="'+name+'" disabled>			\
	     </div>														\
	</div> 															\
	<div class="form-group">												\
  	     <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'password')+':</label>			\
	     <div class="col-xs-12 col-sm-10 col-lg-8"> 									\
	  	 <input class="form-control" type="password" name="pass" value="">						\
	     </div>														\
	</div> 															\
	<div class="form-group">												\
		<div class="col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
			<input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'actualizar')+'">		\
		</div> 														\
	</div> 															\
   </form> 															\
  </div>															\
 </div>																\
</div>';

callback(texto_anterior+texto);

};

//####################################################################
var tabla_citas_doctor = function (req,res,texto_anterior,
						lista_horarios,dni_doctor,lista_citas,day, month, year,
						callback)	{ //app.get ('/doctor/meetings')

	var hora_inicial = config.morning_begin;
	var hora_final = config.afternoon_end;
	var intervalo = config.duracion_consultas;

	var f_casilla = function (dia,hora_inicio,hora_fin){
		if (mas_funciones.casilla_esta_en_horario(lista_horarios,dia,hora_inicio,hora_fin)){
			cita=mas_funciones.cita_en_casilla (dni_doctor,lista_citas,dia,hora_inicio,hora_fin);	
			if (cita.length == 0){
			return '<td class="casilla-verde"></td>';
			}else {
			return '<td class="casilla-roja">'+cita[0]['patient']+" "+/*cita[0]['sala']+*/"</td>";
			}
			 
		}
		else{  return '<td></td>';
		}
	};

	var url='/doctor/meetings';
	var tabla_horario=tabla_calendario.tabla(day, month, year,hora_inicial,hora_final,intervalo,url,f_casilla);

	callback(texto_anterior+tabla_horario);
}
//##################FIN DOCTOR #######################################


module.exports = {
	cabecera_doctor : cabecera_doctor,
	editar_datos_propios_doctor : editar_datos_propios_doctor,
	tabla_citas_doctor : tabla_citas_doctor
}
