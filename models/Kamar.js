var mongoose 	= require('mongoose')
var Schema 		= mongoose.Schema;

var Kamar	= new Schema({
	tipe: {type: String, required: true},
	ruang: String,
	no: Number,
	status: {type: String, required: true},
	biaya: {type: Number, required: true}
},{collection: 'Kamar'});

module.exports = mongoose.model('Kamar', Kamar);