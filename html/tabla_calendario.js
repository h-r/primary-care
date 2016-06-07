var config = require('./../config');
var mas_funciones = require('./../mas_funciones');

//###############################################
var pasar_a_horas = function (minutos){
		var h= Math.floor(minutos/60)
		var m = minutos % 60;
		return (h + (m/100))
	};

var pasar_a_minutos = function (horas_minutos){
		var h=Math.floor(horas_minutos);
		var m=Math.round((horas_minutos-h)*100);
		return (h*60) + m;
	};

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
var horas= function (hora_inicial,hora_final,intervalo) {

//considerando las horas como un numero decimal (eje 18.30)
	var inicial= pasar_a_minutos(hora_inicial);
	var lista=[];
	var final= pasar_a_minutos(hora_final);
	while(inicial < final){
		lista.push(pasar_a_horas(inicial));
		inicial = inicial + intervalo;	
	}	
	lista.push(pasar_a_horas(final));

	return lista;
}

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

var tabla= function (day, month, year,hora_inicial,hora_final,intervalo,url,
								funcion_casilla) {
//## la funcion_casilla es una funcion que recibe (dia,hora_inicio,hora_fin) (date,float,float) y devuelve un string del tipo
// <td>lo que sea </td>

	var d = new Date(year, month, day, 1, 1, 1, 1);
	var d_week=d.getDay();
	var d0 = new Date(year, month, day-d_week, 1, 1, 1, 1); //para sacar el domingo anterior al dia actual
	//var inicial=d0.getDate();
	var lista_dias=[d0];

	for(var i=1; i < 7;i++){
		var a=lista_dias[i-1];
		d0 = new Date(a.getFullYear(), a.getMonth(), a.getDate()+1, 1, 1, 1, 1);
		lista_dias.push(d0);
	};


	var lista_horas= horas(hora_inicial,hora_final,intervalo);

	var d = lista_dias[0];
	var day = d.getDate();
	var month = d.getMonth();  
	var year = d.getFullYear();
	var fecha_anterior= new Date(year, month, day - 1, 1, 1, 1, 1);
	var fecha_siguiente= new Date(year, month, day + 7, 1, 1, 1, 1);
	day = fecha_anterior.getDate();
	month = fecha_anterior.getMonth() + 1;  
	year = fecha_anterior.getFullYear();
	var enlace_anterior="<a href='"+url+"/"+day+"/"+month+"/"+year+"'><<</a>";
	day = fecha_siguiente.getDate();
	month = fecha_siguiente.getMonth() + 1;  
	year = fecha_siguiente.getFullYear();
	var enlace_siguiente="<a href='"+url+"/"+day+"/"+month+"/"+year+"'>>></a>";
	//####################

	var texto='														\
<div class="container-fluid">														\
	<div class="table-responsive">												\
		<table class="table table-condensed gradient-style">								\
		<thead>														\
			<tr class="row">												\
				<th class="col-xs-1" scope="col">'+enlace_anterior+'</th>							\
				<th class="col-xs-1" scope="col"></th>';

    	for(var i=0; i < 7;i++){
		texto= texto +'<th class="col-xs-1" scope="col">'+mas_funciones.date2str(lista_dias[i])+'</th>'
		};

	    var texto= texto +' <th class="col-xs-1" scope="col">'+enlace_siguiente+'</th>							\
			</tr>													\
		</thead>													\
		 <tbody>';

//---------
	for(var i=0; i< lista_horas.length -1;i++){
	var hora_f = lista_horas[i+1];
	texto= texto +'<tr class="row" ><td></td><td>'+lista_horas[i].toFixed(2)+" - "+hora_f.toFixed(2)+"</td>";

	//~~Para las casillas centrales~~~
		for(var j=0; j < 7;j++){
			var hora_fin = pasar_a_horas(pasar_a_minutos(hora_final)+intervalo);
			if  (i < (lista_horas.length -1)){ //si no es la ultima hora
			hora_fin = lista_horas[i+1];
			};

		var dia=lista_dias[j];
		var hora_inicio=lista_horas[i];

		
		texto= texto + funcion_casilla (dia,hora_inicio,hora_fin);
	
	}
	//~~~~~
	
	texto= texto +"<td></td></tr>";
	};

	texto= texto +"</tbody>													\
	    </table>														\
   </div>															\
</div>";
	return texto;
};



//###############################################


module.exports = {
	tabla : tabla
}
