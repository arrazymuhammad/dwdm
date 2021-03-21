var mongoose 	= require('mongoose')
var Schema 		= mongoose.Schema
var ObjectId 	= Schema.ObjectId

var Pasien	= new Schema({
	nama: {type: String, required: true},
	jenis_kelamin: {type: String, required: true},
	tanggal_lahir: {type: Date},
	status: String
},{collection: 'Pasien'});

module.exports = mongoose.model('Pasien', Pasien);