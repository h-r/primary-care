// Constantes de configuracion
//###############################################

// horario para la planificacion (mañana y tarde)
// hora de inicio por la mañana
var morning_begin=8;
//---------------------
// hora de fin por la mañana
var morning_end=15;
//---------------------
// hora de inicio por la tarde
var afternoon_begin=15;
//---------------------
// hora de fin por la tarde
var afternoon_end=23.40;
//---------------------
// duracion_consultas (en minutos)
var duracion_consultas=20;

//###############################################
var url_bd = 'mongodb://localhost:27017/primarycare';

var puerto_serv_cert = 8002;
var puerto_serv_http = 5000;
var puerto_serv_https = 3004;

var certificado_web_key='./cert/sever-key.pem'; //clave de la aplicacion web
var certificado_web_crt='./cert/server-crt.pem'; //certificado de la aplicacion web
var certificado_server_key='./cert/sever-key.pem'; //clave de el servidor de certificacion
var certificado_server_crt='./cert/server-crt.pem'; //certificado de el servidor de certificacion
var certificado_server_ca='./cert/CA/ca-crt.pem'; //autoridad certificadora de el servidor de certificacion
var certificado_server_passphrase='pass'; //frase de paso del certificado de el servidor de certificacion 

var salt='SuperSecretKey'; // salt para el cifrado de la contraseña en BD

module.exports = {
	morning_begin : morning_begin,
	morning_end : morning_end,
	afternoon_begin : afternoon_begin,
	afternoon_end : afternoon_end,
	duracion_consultas : duracion_consultas,
	url_bd : url_bd,
	puerto_serv_cert : puerto_serv_cert,
	puerto_serv_http : puerto_serv_http,
	puerto_serv_https : puerto_serv_https,

	certificado_web_key : certificado_web_key,
	certificado_web_crt : certificado_web_crt,
	certificado_server_key : certificado_server_key,
	certificado_server_crt : certificado_server_crt,
	certificado_server_ca : certificado_server_ca,
	certificado_server_passphrase : certificado_server_passphrase,
	salt : salt

}


