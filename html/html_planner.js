var base_datos = require('./../db'); 
var funciones = require('./../funciones');
var config = require('./../config');
var funciones_html = require('./funciones_html');
var mas_funciones = require('./../mas_funciones');

//##################PLANNER #######################################
var cabecera_planner= function (req,res,texto_anterior,callback)	{
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
					<li class="'+funciones.url_activa(req,res,'/planner/my_count')+'">				\
						<a href="/planner/my_count">'+funciones.texto(req,res,'my_count')+'</a>			\
					</li>												\
					<li class="'+funciones.url_activa(req,res,'/planner/meetings')+'">				\
						<a href="/planner/meetings">'+funciones.texto(req,res,'citas')+'</a>			\
					</li>\												\
					<li class="'+funciones.url_activa(req,res,'/planner/schedule')+'">				\
						<a href="/planner/schedule">'+funciones.texto(req,res,'schedule')+'</a>			\
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

var editar_datos_propios_planner = function (req,res,texto_anterior,
						dni,name,
						callback)	{ //app.get ('/planner/my_count')

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
	     <div class="col-xs-12 col-sm-10 col-lg-8">										\
	  	 <input class="form-control" type="text" name="name" value="" placeholder="'+name+'" disabled>			\
	     </div>														\
	</div> 															\
	<div class="form-group">												\
  	     <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'password')+':</label>			\
	     <div class="col-xs-12 col-sm-10 col-lg-8">										\
	  	 <input class="form-control" type="password" name="pass" value="">						\
	     </div>														\
	</div> 															\
	<div class="form-group">												\
		<div class="col-xs-2 col-xs-offset-0 col-sm-offset-2"> 								\
			<input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'actualizar')+'">		\
		</div> 														\
	</div> 															\
   </form> 															\
  </div>															\
 </div>																\
</div>';
	callback(texto_anterior+texto);

};

//##################### Planner Citas #################################
var html_citas_planner = function (req,res,texto_anterior,
						citas,
						callback){
//---------------
	var form_oculto_planner_citas = function (patient,doctor,begin,end,sala){
		texto= '<form action="#" method="post"> \
	  	<input type="hidden" name="patient" value="'+patient+'"> \
	 	<input type="hidden" name="doctor" value="'+doctor+'"> \
		<input type="hidden" name="begin" value="'+begin+'"> \
		<input type="hidden" name="end" value="'+end+'"> \
		<input type="hidden" name="sala" value="'+sala+'"> \
		<input type="hidden" name="action" value="borrar"> \
		<input class="btn btn-danger"type="submit" value="'+funciones.texto(req,res,'borrar')+'"> \
		</form> '; 
		return texto;
	}
//----------------
	var texto='														\
<div class="container">														\
 <div class="row">														\
  <div class="col-xs-12">													\
	<div class="table-responsive">												\
		<table class="table table-condensed gradient-style">								\
		<thead>														\
			<tr>													\
				<th scope="col">'+funciones.texto(req,res,'patient')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'doctor')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'begin')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'end')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'room')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'accion')+'</th> \
			</tr>													\
		</thead>													\
		 <tbody>';

	for(var i = 0; i < citas.length;i++){
		texto = texto +'<tr>\
    		<td>'+citas[i].patient+'</td> \
		<td>'+citas[i].doctor+'</td> \
		<td>'+mas_funciones.convertir_hora_zulu(citas[i].begin)+'</td> \
		<td>'+mas_funciones.convertir_hora_zulu(citas[i].end)+'</td> \
		<td>'+citas[i].sala+'</td> \
		<td>'+form_oculto_planner_citas(citas[i].patient,citas[i].doctor,citas[i].begin,citas[i].end,citas[i].sala)+'</td> \
		</tr>';
	} 
	//--
		
	//--
	texto = texto +'</tbody>													\
	    </table>														\
   </div>															\
  </div> 															\
 </div>																\
</div>';
	callback(texto_anterior+texto);
//------------
};

//##################### Planner Horarios #################################
var html_horarios_planner = function(req,res,texto_anterior,
						horarios,
						callback){


	var form_oculto_horarios = function (doctor,begin,end,room,month,year){
	texto= '<form action="#" method="post"> \
 	<input type="hidden" name="doctor" value="'+doctor+'"> \
	<input type="hidden" name="begin" value="'+begin+'"> \
	<input type="hidden" name="end" value="'+end+'"> \
	<input type="hidden" name="room" value="'+room+'"> \
 	<input type="hidden" name="month" value="'+month+'"> \
 	<input type="hidden" name="year" value="'+year+'"> \
	<input type="hidden" name="action" value="borrar"> \
	<input class="btn btn-danger" type="submit" value="'+funciones.texto(req,res,'borrar')+'"> \
	</form> '; 
	return texto;
	}
//---------------
	funciones_html.generar_combo_box_doctores (req,res,"Ninguno",function (combo_box_doctores){
	funciones_html.generar_combo_box_salas (req,res,function (combo_box_salas){
	funciones_html.generar_combo_box_meses (req,res,function (combo_box_meses){
	var texto='\
<div class="container">														\
 <div class="row">														\
  <div class="col-xs-12">													\
	<div class="table-responsive">												\
		<table class="table table-condensed gradient-style">								\
		<thead>														\
			<tr>													\
		    		<th scope="col">'+funciones.texto(req,res,'doctor')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'begin')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'end')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'room')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'month')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'year')+'</th> \
				<th scope="col">'+funciones.texto(req,res,'accion')+'</th> \
			</tr>													\
		</thead>													\
		 <tbody>';

	for(var i = 0; i < horarios.length;i++){
		texto = texto +'<tr>\
    		<td>'+horarios[i].doctor+'</td> \
		<td>'+mas_funciones.hora_decimal2hora_str(horarios[i].begin)+'</td> \
		<td>'+mas_funciones.hora_decimal2hora_str(horarios[i].end)+'</td> \
		<td>'+horarios[i].room+'</td> \
		<td>'+horarios[i].month+'</td> \
		<td>'+horarios[i].year+'</td> \
		<td>'+form_oculto_horarios(horarios[i].doctor,horarios[i].begin,horarios[i].end,horarios[i].room,horarios[i].month,horarios[i].year)+'</td> \
		</tr>';
	} 
	//--

		texto = texto +'<tr>\
		<form action="#" method="post">\
		<td>'+combo_box_doctores+'</td> \
		<td> <select class="form-control" name="horario">\
			<option value="morning" selected> '+funciones.texto(req,res,'morning')+' '+mas_funciones.hora_decimal2hora_str(config.morning_begin) +' - '+mas_funciones.hora_decimal2hora_str(config.morning_end)+'</option>\
			<option value="afternoon"> '+funciones.texto(req,res,'afternoon')+' '+mas_funciones.hora_decimal2hora_str(config.afternoon_begin) +' - '+mas_funciones.hora_decimal2hora_str(config.afternoon_end)+'</option>\
			</select>\
		</td> \
		<td> </td> \
		<td>'+combo_box_salas+'</td> \
		<td>'+combo_box_meses+'</td>';
		var d=new Date()
    		texto= texto +'<td><input class="form-control" type="text" name="year" value="'+d.getFullYear().toString()+'"></td> \
		<input type="hidden" name="action" value="insertar">\
		<td><input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'insertar')+'"></td> \
		</form>\
		</tr>';
	//--
	texto = texto +'</tbody>													\
	    </table>														\
   </div>															\
  </div> 															\
 </div>																\
</div>';
	callback(texto_anterior+texto);
//------------
	});});});
};

//##################FIN PLANNER #######################################



module.exports = {
	cabecera_planner : cabecera_planner,
	editar_datos_propios_planner : editar_datos_propios_planner,
	html_citas_planner : html_citas_planner,
	html_horarios_planner : html_horarios_planner
}
