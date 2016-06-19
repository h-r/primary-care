var base_datos = require('./../db/db'); 
var funciones = require('./../funciones');
var tabla_calendario = require('./tabla_calendario');
var mas_funciones = require('./../mas_funciones');
var config = require('./../config');

//##################PATIENT #######################################
var cabecera_pacientes= function (req,res,texto_anterior,callback)	{
	texto= '															\
<header> 																\
  <nav class="navbar navbar-default navbar-inverse"> 											\
	<div class="container-fluid">													\
		<div class="navbar-header">												\
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-1">	\
					<span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>	\
				</button>												\
				<a style="line-height: 35px;" href="#" class="navbar-brand">'+funciones.texto(req,res,'app_title')+'</a>\
		</div>															\
		<div class="collapse navbar-collapse" id="navbar-1">									\
		    <ul class="nav navbar-nav">												\
			<li class="'+funciones.url_activa(req,res,'/patient/my_count')+'"> 						\
				 <a href="/patient/my_count">'+funciones.texto(req,res,'my_count')+'</a> 				\
 			</li>														\
			<li class="'+funciones.url_activa(req,res,'/patient/meetings_list')+'">						\
				<a href="/patient/meetings_list">'+funciones.texto(req,res,'citas');			
						if (req.cookies.citas !== undefined){							
						texto= texto + ' <spam class="badge">'+req.cookies.citas+'</spam>'; 			
						}	
						texto= texto + '</a> 									\
			</li>														\
			<li class="'+funciones.url_activa(req,res,'/patient/meetings')+'"> 						\
				<a href="/patient/meetings">'+funciones.texto(req,res,'pedir_cita')+'</a> 				\
			</li>														\
			<li class="'+funciones.url_activa(req,res,'/patient/conference_room')+'"> 					\
				<a href="/patient/conference_room">'+funciones.texto(req,res,'conference_room')+'</a>			\
			</li>														\
			<li><a href="/logout">'+funciones.texto(req,res,'logout')+'</a></li>						\
		    </ul>														\
		    <ul class="nav navbar-nav navbar-right">										\
			<li><a href="/idioma/es_Es"><img src="/img/es_Es.png" height="35"></a></li>					\
			<li><a href="/idioma/en_US"><img src="/img/en_Us.png" height="35"></a></li>					\
		    </ul>														\
		</div>															\
	</div>																\
  </nav>																\
</header>';
	callback(texto_anterior+texto);
};

var editar_datos_propios_paciente = function (req,res,texto_anterior,
						dni,name,family_doctor,
						callback)	{ //app.get ('/patient/my_count')
	
	texto= '														\
<div class="container">														\
 <div class="row">														\
  <div class="col-xs-12">													\
   <form action="#" method="post" class="form-horizontal">									\
	<div class="form-group">												\
             <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'dni')+':</label>			\
	     <div class="col-xs-12 col-sm-10 col-lg-8"> 									\
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
	     <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'family_doctor')+':</label> 		\
	     <div class="col-xs-12 col-sm-10 col-lg-8"> 									\
	  	 <input class="form-control" type="text" name="family_doctor" value="" placeholder="'+family_doctor+'" disabled>\
	     </div> 														\
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
//######################################################### 
var tabla_citas_paciente = function (req,res,texto_anterior,  //Tabla de pedir cita
						day, month, year,lista_horarios,dni_doctor,lista_citas,dni_paciente,
						callback)	{ //app.get ('/patient/meetings')

	var hora_inicial = config.morning_begin;
	var hora_final = config.afternoon_end;
	var intervalo = config.duracion_consultas;

	var f_casilla = function (dia,hora_inicio,hora_fin){
	//----
		var form_oculto_cita = function (patient,doctor,dia,hora_inicio,hora_fin){
			texto= '<form action="#" method="post"> \
  			<input type="hidden" name="patient" value="'+patient+'"> \
 			<input type="hidden" name="doctor" value="'+doctor+'"> \
			<input type="hidden" name="dia" value="'+dia+'"> \
			<input type="hidden" name="hora_inicio" value="'+hora_inicio+'"> \
			<input type="hidden" name="hora_fin" value="'+hora_fin+'"> \
			<input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'pedir_cita')+'"> \
			</form> '; 
			return texto;
		}
	//---
		if (mas_funciones.casilla_esta_en_horario(lista_horarios,dia,hora_inicio,hora_fin)){
			cita=mas_funciones.cita_en_casilla (dni_doctor,lista_citas,dia,hora_inicio,hora_fin);	
			if (cita.length == 0){

				//para que las citas no sean del pasado
				var hora_cita= Math.floor (hora_fin);
				var minutos_cita = (hora_fin - hora_cita) *100;
				var fecha_cita = new Date(dia.toISOString());
				fecha_cita.setHours(hora_cita);
				fecha_cita.setMinutes(minutos_cita);
				fecha_cita.setSeconds(0);
				var ahora=new Date(); 
				if (fecha_cita.toISOString() >= ahora.toISOString()){
					return "<td>"+form_oculto_cita (dni_paciente,dni_doctor,dia,hora_inicio,hora_fin)+"</td>";
				} else {return "<td></td>"}
				//---------
			}else {
				if (cita[0]['patient']== dni_paciente){return '<td>'+cita[0]['patient']+" "+cita[0]['sala']+"</td>";}
				else {return "<td></td>"}//+funciones.texto(req,res,'ocupado')+"</td>"}
			}
			 
		}
		else{  return "<td></td>";
		}
	};

	var url='/patient/meetings';
	var tabla_horario=tabla_calendario.tabla(day, month, year,hora_inicial,hora_final,intervalo,url,f_casilla);

	callback(texto_anterior+tabla_horario);
}
//############### LISTA DE CITAS ##########################################
var lista_citas_paciente = function (req,res,texto_anterior,citas,callback){ //app.get ('/patient/meetings_list')
//---------------
	var form_oculto_planner_citas = function (patient,doctor,begin,end,sala){
		texto= '<form action="#" method="post"> \
	  	<input type="hidden" name="patient" value="'+patient+'"> \
	 	<input type="hidden" name="doctor" value="'+doctor+'"> \
		<input type="hidden" name="begin" value="'+begin+'"> \
		<input type="hidden" name="end" value="'+end+'"> \
		<input type="hidden" name="sala" value="'+sala+'"> \
		<input type="hidden" name="action" value="borrar"> \
		<input class="btn btn-danger" type="submit" value="'+funciones.texto(req,res,'borrar')+'"> \
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
				<th scope="col"></th> \
			</tr>													\
		</thead>													\
		 <tbody>';

	
	for(var i = 0; i < citas.length;i++){
		texto = texto +'<tr> \
		<td>'+citas[i].patient+'</td> \
		<td>'+citas[i].doctor+'</td> \
		<td>'+mas_funciones.convertir_hora_zulu(citas[i].begin)+'</td> \
		<td>'+mas_funciones.convertir_hora_zulu(citas[i].end)+'</td> \
		<td>'+citas[i].sala+'</td> \
		<td>'+form_oculto_planner_citas(citas[i].patient,citas[i].doctor,citas[i].begin,citas[i].end,citas[i].sala)+'</td> \
		</tr>';
	} 
	//--
		
texto = texto +'</tbody>													\
	    </table>														\
   </div>															\
  </div> 															\
 </div>																\
</div>';


	callback(texto_anterior+texto);
};
//#########################################################

module.exports = {
	cabecera_pacientes : cabecera_pacientes,
	editar_datos_propios_paciente : editar_datos_propios_paciente,
	tabla_citas_paciente : tabla_citas_paciente, //pedir citas
	lista_citas_paciente : lista_citas_paciente // lista citas

}
