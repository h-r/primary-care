
//###############################################
var dni_valido= function (dni)	{

	if (dni.length == 9) {
		var numero=dni.substring(0, 8);
		var letra=dni.substring(8, 9).toUpperCase();
	
		d= {0: 'T', 1: 'R', 2: 'W', 3: 'A', 4: 'G', 5: 'M', 6: 'Y', 7: 'F', 8: 'P', 9: 'D', 10: 'X', 11: 'B', 12: 'N', 13: 'J', 14: 'Z', 15: 'S', 16: 'Q', 17: 'V', 18: 'H', 19: 'L', 20: 'C', 21: 'K', 22: 'E'};
		var n=parseInt(numero);
		return (d[n % 23]==letra);
		}
	else{
		return false;
	}

};
//###############################################
//Casilla de calendario en horario
var casilla_esta_en_horario= function (lista_horarios,dia,hora_inicio,hora_fin) {
		/*base_datos.buscar_horarios_doctor('11111111H',function(lista_horarios){
		var dia=new Date();
		var hora_inicio=9;
		var hora_fin=9.20;
		*/
		var lo_esta=false;
		for(var i=0; i < lista_horarios.length;i++){
			var e= lista_horarios[i];
			if (e["year"]==dia.getFullYear() & e["month"]==(dia.getMonth()+1) & (e["begin"])<= hora_inicio & (e["end"])>= hora_fin)
			{lo_esta=true;};
	
		};
		return lo_esta;

}
//###############################################
//Cita en casilla de calendario
var cita_en_casilla= function (doctor,lista_citas,dia,hora_inicio,hora_fin) {
		/*var dia=new Date();
		var hora_inicio=9;
		var hora_fin=9.20;
		*/

		var cita=-1; //indice de la cita que coincide con la casilla de tiempo (si no hay ninguna = -1)
		for(var i=0; i < lista_citas.length;i++){
			var temp=true;
			var e= lista_citas[i];
			var begin=new Date (e["begin"]);
			var end=new Date (e["end"]);

			temp= temp & (begin.getDate()==(dia.getDate()));
			temp= temp & (begin.getFullYear()==dia.getFullYear());
			temp= temp & (begin.getMonth()==(dia.getMonth()));
			var hora_inicial_cita= begin.getHours() + (begin.getMinutes() /100); 
			var hora_final_cita= end.getHours() + (end.getMinutes() /100);

			temp= temp & (hora_inicial_cita >= hora_inicio);
			temp= temp & (hora_final_cita <= hora_fin);
			temp= temp & (e["doctor"]==doctor);

			if (temp) {cita=i};
	
		};
		if (cita==-1) {return []}
		else { return [lista_citas[cita]]};

}

var convertir_hora_zulu = function (hora_zulu){  //2016-06-02T17:20:00.000Z por algun motivo da 2 horas menos
	var result = hora_zulu.split('T');
	if (result.length>1){
		var dia=result[0];
		var hora_array=result[1].split(':');
		var hora = (parseInt(hora_array[0]) + 2)+ ":" + hora_array[1] + ":00"; //los segundos se ignoran  
		return (dia+" "+hora)
	}
	else{ return hora_zulu}

}

var date2str = function (date){
	return date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();
}

var hora_decimal2hora_str = function (hora){ //pasar del float 14.5 al str 14:50
	var h=Math.floor(hora);
	var m=Math.round((hora - h)*100);
	var str_m = m.toString();
	if (m < 10) {str_m="0"+str_m;}
	return h+":"+str_m;
}


//###############################################
module.exports = {
	dni_valido : dni_valido,
	casilla_esta_en_horario : casilla_esta_en_horario,
	cita_en_casilla : cita_en_casilla,
	convertir_hora_zulu : convertir_hora_zulu,
	date2str : date2str,
	hora_decimal2hora_str : hora_decimal2hora_str
}
