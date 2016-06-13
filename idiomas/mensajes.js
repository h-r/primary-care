//categorias de los mensajes (Exito,Fracaso,Informativo, ...) para el color de los alerts

var mensajes = {
	"user_pass_incorrect": 'Fracaso',
	"dni_inconsistente": 'Fracaso',
	'user_not_found': 'Fracaso',
	'user_updated': 'Exito',
	'user_inserted': 'Exito',
	'user_deleted': 'Exito',
	"doctor_not_found": "Fracaso", //para el medico de cabecera
	"doctor_con_horarios" : "Fracaso",
	"usuario_con_citas" : "Fracaso",
	"medico_con_pacientes" : "Fracaso",
	"more_one_result" : "Fracaso",
	"sala_con_horarios" : "Fracaso",
	"sala_con_citas" : "Fracaso",
	"horario_con_citas" : "Fracaso",
	"patient_not_found" : "Fracaso",
	"room_not_found" : "Fracaso",
	"schedule_not_found" : "Fracaso",
	"cita_reservada":"Exito",
	"sub-cita":"Fracaso",
	"parametros_incorrectos":"Fracaso",
	"usuario_sin_cita": "Fracaso", //para la sala de videoconferencia
	"user_found" : "Fracaso", //para insertar usuarios
	"room_found" : "Fracaso", //para insertar salas
	//--Mensajes Server cert
	"datos_erroneos":"Fracaso",
	"usuario_no_valido": "Fracaso",
	"no_certificado" : "Fracaso",
};

module.exports = {
	mensajes : mensajes
}
