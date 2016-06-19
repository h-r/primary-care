var base_datos = require('./../db/db'); 
var funciones = require('./../funciones');
var funciones_html = require('./funciones_html');

//################## ADMIN #######################################
var cabecera_admin= function (req,res,texto_anterior,callback)	{
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
					<li class="'+funciones.url_activa(req,res,'/admin/find_user')+'">				\
						<a href="/admin/find_user">'+funciones.texto(req,res,'find_user')+'</a>			\
					<li>';												
//			texto= texto + '<li class="'+funciones.url_activa(req,res,'/admin/list_users')+'">				\
//						<a href="/admin/list_users">Listar usuarios (temporal)</a>				\
//					<li>';												
			texto= texto + '<li class="'+funciones.url_activa(req,res,'/admin/insert_user')+'">				\
						<a href="/admin/insert_user">'+funciones.texto(req,res,'insert_user')+'</a>		\
					<li>';												
//			texto= texto + '<li class="'+funciones.url_activa(req,res,'/admin/edit_user')+'">				\
//						<a href="/admin/edit_user">'+funciones.texto(req,res,'edit_user')+'(temporal)</a>	\
//					<li>';												
			texto= texto + '<li class="'+funciones.url_activa(req,res,'/admin/rooms')+'">					\
						<a href="/admin/rooms">'+funciones.texto(req,res,'rooms')+'</a>				\
					</li>												\
					<li><a href="/logout">'+funciones.texto(req,res,'logout')+'</a><li>				\
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
//####################################

//####################################
var editar_usuario_admin = function (req,res,texto_anterior,operacion,
						dni,name,patient,admin,doctor,planner,family_doctor,
						callback)	{ //app.get ('/admin/edit_user') y /admin/insert_user' 
	//---

	funciones_html.generar_combo_box_doctores (req,res,family_doctor, function (combobox){
//--
  	
	 html = '															\
<div class="container">															\
 <div class="row">															\
  <div class="col-xs-12">														\
   <form action="#" method="post" class="form-horizontal">										\
	<div class="form-group">													\
             <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'dni')+':</label>				\
	     <div class="col-xs-12 col-sm-10 col-lg-8">';
		if (operacion=='update'){
	  		html = html + '<input class="form-control" type="text" name="dni_visible" value="" placeholder="'+dni+'" disabled>';
			html = html + '<input type="hidden" name="dni" value="'+dni+'">';
		}
		else{ //insert
			html = html +'<input class="form-control" type="text" name="dni" value="'+dni+'">';
		}							
html = html +'</div>															\
	</div>																\
	<div class="form-group">													\
	     <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'nombre')+':</label> 				\
	     <div class="col-xs-12 col-sm-10 col-lg-8"> 										\
	  	 <input class="form-control" type="text" name="name" value="'+name+'">							\
	     </div>															\
	</div>																\
	<div class="form-group">													\
  	     <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'password')+':</label>				\
	     <div class="col-xs-12 col-sm-10 col-lg-8"> 										\
	  	 <input class="form-control" type="password" name="pass" value="">							\
	     </div>															\
	</div> 																\
	<div class="form-group">													\
	     <div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	<label for="ch1">													\
		   <input id= "ch1" type="checkbox" name="patient" value="patient" '+patient+'>'+funciones.texto(req,res,"patient")+'	\
		</label>														\
	     </div> 															\
	</div>																\
	<div class="form-group">													\
	     <div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	<label for="ch2">													\
		   <input id= "ch2" type="checkbox" name="admin" value="admin" '+admin+'>'+funciones.texto(req,res,"admin")+'		\
		</label>														\
	     </div> 															\
	</div>																\
	<div class="form-group">													\
	     <div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	<label for="ch3">													\
		   <input id= "ch3" type="checkbox" name="doctor" value="doctor" '+doctor+'>'+funciones.texto(req,res,"doctor")+'	\
		</label>														\
	     </div> 															\
	</div>																\
	<div class="form-group">													\
	     <div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	<label for="ch4">													\
		   <input id= "ch4" type="checkbox" name="planner" value="planner" '+planner+'>'+funciones.texto(req,res,"planner")+'	\
		</label>														\
	     </div> 															\
	</div>																\
	<div class="form-group">													\
             <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'family_doctor')+':</label>			\
	     <div class="col-xs-12 col-sm-10 col-lg-8">											\
 		 '+combobox+' 														\
	     </div>															\
	</div>																\
	<div class="form-group">													\
		<div class="col-xs-2 col-xs-offset-0 col-sm-offset-2"> 									\
			<input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'submit')+'">			\
		</div> 															\
	</div>																\
   </form> 																\
  </div>																\
 </div>																	\
</div>';
	callback(texto_anterior+html);
	});
	//---

};

//#######################
var crear_html_admin_salas = function(req,res,texto_anterior,callback) {
	var html_salas = function(salas){

		var form_oculto_admin_salas = function (sala){
			texto= '<form action="#" method="post"> 								\
		  	<input type="hidden" name="sala" value="'+sala+'"> 							\
		 	<input type="hidden" name="action" value="borrar"> 							\
			<input class="btn btn-danger" type="submit" value="'+funciones.texto(req,res,"borrar")+'"> 		\
			</form> '; 
			return texto;
		}
	//---------------
		var texto='													\
<div class="container">														\
 <div class="row">														\
  <div class="col-xs-12 col-lg-offset-1 col-md-8">										\
	<div class="table-responsive">												\
		<table class="table table-condensed gradient-style">								\
		<thead>														\
			<tr>													\
	    		<th scope="col">'+funciones.texto(req,res,'room')+'</th> 						\
			<th scope="col">'+funciones.texto(req,res,'accion')+'</th> 						\
			</tr>													\
		</thead>													\
		 <tbody>';	
		for(var i = 0; i < salas.length;i++){
			texto = texto +'<tr>											\
	    		<td><b>'+salas[i].name+'</b></td> 									\
			<td>'+form_oculto_admin_salas(salas[i].name)+'</td> 							\
			</tr>';
		} 
		//--
			texto = texto +'<tr>											\
			<td><form action="#" method="post"> 									\
	    		<input class="form-control" type="text" name="sala" value=""></td> 					\
			<input type="hidden" name="action" value="insertar">							\
			<td><input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'insertar')+'"></td> 	\
			</form>													\
			</tr>';
		//--
texto = texto +'</tbody>													\
	    </table>														\
   </div>															\
  </div> 															\
 </div>																\
</div>';
		callback(texto_anterior + texto);
	//------------
	};	

	base_datos.buscar_salas(html_salas);
}
//###################################################################
var buscar_usuario = function (req,res,texto_anterior,
						//dni,name,patient,admin,doctor,planner,family_doctor,
						callback)	{ //app.get ('/admin/find_user')

	funciones_html.generar_combo_box_doctores (req,res,"Ninguno", function (combobox){
	 html = '															\
<div class="container">															\
 <div class="row">															\
  <div class="col-xs-12">														\
   <form action="#" method="post" class="form-horizontal">										\
	<div class="form-group">													\
             <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'dni')+':</label>				\
	     <div class="col-xs-12 col-sm-10 col-lg-8">											\
 		 <input class="form-control" type="text" name="dni" value="">				 				\
	     </div>															\
	</div>																\
	<div class="form-group">													\
             <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'nombre')+':</label>				\
	     <div class="col-xs-12 col-sm-10 col-lg-8">											\
 		 <input class="form-control" type="text" name="name" value=""> 								\
	     </div>															\
	</div>																\
	<div class="form-group">													\
		<div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	    	    <label for="ch1">												\
				<input id= "ch1" type="checkbox" name="patient" value="true">'+funciones.texto(req,res,"patient")+'	\
			    </label>													\
		</div> 															\
	</div>																\
	<div class="form-group">													\
		<div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	    	    <label for="ch2" >												\
				<input id= "ch2" type="checkbox" name="admin" value="true" >'+funciones.texto(req,res,"admin")+'	\
			    </label>													\
		</div> 															\
	</div>																\
	<div class="form-group">													\
		<div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	    	    <label for="ch3">												\
				<input id= "ch3" type="checkbox" name="doctor" value="true" >'+funciones.texto(req,res,"doctor")+'	\
			    </label>													\
		</div> 															\
	</div>																\
	<div class="form-group">													\
		<div class="checkbox col-xs-2 col-xs-offset-0 col-sm-offset-2">								\
	  	    	    <label for="ch4">												\
				<input id= "ch4" type="checkbox" name="planner" value="true" >'+funciones.texto(req,res,"planner")+'	\
			    </label>													\
		</div> 															\
	</div> 																\
	<div class="form-group">													\
             <label class="control-label col-xs-12 col-sm-2">'+funciones.texto(req,res,'family_doctor')+':</label>			\
	     <div class="col-xs-12 col-sm-10 col-lg-8">											\
 		 '+combobox+' 														\
	     </div>															\
	</div>																\
	<div class="form-group">													\
		<div class="col-xs-2 col-xs-offset-0 col-sm-offset-2"> 									\
			<input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,'buscar')+'">			\
		</div> 															\
	</div>																\
   </form> 																\
  </div>																\
 </div>																	\
</div>';
	callback(texto_anterior+html);
	});
}
	//---

var listar_usuarios = function(req,res,texto_anterior,
						dni,name,patient,admin,doctor,planner,family_doctor,
						callback) {
	var buscar_usuarios = function(dni,name,patient,admin,doctor,planner,family_doctor, f_exito){
		var query1={};
		if (dni!= ""     	& dni!= undefined           ){query1.dni=dni}
		if (name!= ""    	& name!= undefined          ){query1.name=name}
		if (patient!= "" 	& patient!= undefined       ){query1.patient=true}
		if (admin!= ""   	& admin!= undefined	    ){query1.admin=true}
		if (doctor!= ""  	& doctor!= undefined	    ){query1.doctor=true}
		if (planner!= "" 	& planner!= undefined	    ){query1.planner=true}
		if (family_doctor!= ""  & family_doctor!= undefined ){query1.family_doctor=family_doctor}
		
		var collection = 'user';
		
		var query2={"_id":0,"pass":0};
		base_datos.query_generica_busqueda(collection,query1,query2,f_exito);

	}
	var html_lista = function(lista_usuarios){

		var form_oculto_admin = function (dni,name,patient,admin,doctor,planner,family_doctor,accion){
			texto= '<form action="#" method="post"> \
		  	<input type="hidden" name="dni" value="'+dni+'"> \
			<input type="hidden" name="name" value="'+name+'"> \
			<input type="hidden" name="patient" value="'+patient+'"> \
			<input type="hidden" name="admin" value="'+admin+'"> \
			<input type="hidden" name="doctor" value="'+doctor+'"> \
			<input type="hidden" name="planner" value="'+planner+'"> \
			<input type="hidden" name="family_doctor" value="'+family_doctor+'"> \
		 	<input type="hidden" name="action" value="'+accion+'">';
			if (accion=="borrar") {
			texto= texto + '<input class="btn btn-danger" type="submit" value="'+funciones.texto(req,res,accion)+'">';
			}else { //actualizar
			texto= texto + '<input class="btn btn-primary" type="submit" value="'+funciones.texto(req,res,accion)+'">';
			}
			texto= texto + '</form> '; 
			return texto;
		}
	//---------------
		var texto='\
<div class="container">\
 <div class="row">															\
  <div class="col-xs-12 col-md-12">\
	<div class="table-responsive">\
		<table class="table table-condensed gradient-style">\
		<thead>														\
			<tr>\
			<th scope="col">'+funciones.texto(req,res,'dni')+'</th> \
			<th scope="col">'+funciones.texto(req,res,'nombre')+'</th> \
			<th scope="col">'+funciones.texto(req,res,'patient')+'</th> \
			<th scope="col">'+funciones.texto(req,res,'admin')+'</th> \
			<th scope="col">'+funciones.texto(req,res,'doctor')+'</th> \
			<th scope="col">'+funciones.texto(req,res,'planner')+'</th> \
			<th scope="col">'+funciones.texto(req,res,'family_doctor')+'</th> \
			<th scope="col"></th> \
			<th scope="col"></th> 				\
	    		</tr>													\
		</thead>													\
		 <tbody>';
			
	
		for(var i = 0; i < lista_usuarios.length;i++){
			texto = texto +'<tr>\
	    		<td>'+lista_usuarios[i].dni+'</td> \
			<td>'+lista_usuarios[i].name+'</td>';

			if (lista_usuarios[i].patient) {texto = texto +'<td><img src="/img/check.png" height="30px"></td>';}
			else{texto = texto +'<td><img src="/img/uncheck.png" height="30px"></td>';}

			if (lista_usuarios[i].admin) {texto = texto +'<td><img src="/img/check.png" height="30px"></td>';}
			else{texto = texto +'<td><img src="/img/uncheck.png" height="30px"></td>';}

			if (lista_usuarios[i].doctor) {texto = texto +'<td><img src="/img/check.png" height="30px"></td>';}
			else{texto = texto +'<td><img src="/img/uncheck.png" height="30px"></td>';}

			if (lista_usuarios[i].planner) {texto = texto +'<td><img src="/img/check.png" height="30px"></td>';}
			else{texto = texto +'<td><img src="/img/uncheck.png" height="30px"></td>';}

			var medico=lista_usuarios[i].family_doctor;
			if (lista_usuarios[i].family_doctor == "Ninguno"){
				medico=funciones.texto(req,res,'ninguno');
			}
			texto = texto +'<td>'+medico+'</td>';

			texto = texto +'<td>'+form_oculto_admin (lista_usuarios[i].dni, lista_usuarios[i].name, lista_usuarios[i].patient, lista_usuarios[i].admin, lista_usuarios[i].doctor, lista_usuarios[i].planner ,lista_usuarios[i].family_doctor ,"actualizar")+'</td> \
			<td>'+form_oculto_admin (lista_usuarios[i].dni, lista_usuarios[i].name, lista_usuarios[i].patient, lista_usuarios[i].admin, lista_usuarios[i].doctor, lista_usuarios[i].planner ,lista_usuarios[i].family_doctor ,"borrar")+'</td> \
			</tr>';
		} 
		//--
		//--
		texto = texto +'\
	</tbody>													\
    </table>														\
   </div>															\
  </div> 															\
 </div>																\
</div>';
		callback(texto_anterior + texto);
	//------------
	};	

	buscar_usuarios (dni,name,patient,admin,doctor,planner,family_doctor, html_lista);
}

//##################FIN ADMIN #######################################



module.exports = {
	cabecera_admin : cabecera_admin,
	editar_usuario_admin : editar_usuario_admin,
	crear_html_admin_salas : crear_html_admin_salas,
	buscar_usuario : buscar_usuario,
	listar_usuarios : listar_usuarios
	
}
