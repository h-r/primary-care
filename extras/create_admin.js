var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var base_datos = require('./../db');
var config = require('./../config');
var url = config.url_bd;


MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var user={};
	user.dni= "12345678Z";
	user.name = "Admin";
	var cipher_pass= base_datos.cifrar_password("pass1",user.dni);
	user.pass = cipher_pass;
	user.patient = false;
	user.admin = true;
	user.doctor = false;
	user.planner = false;
	user.family_doctor= "Ninguno";

	db.collection('user').insert(user);
	db.close();
}); 
