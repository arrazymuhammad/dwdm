var mongoose 	= require('mongoose')
var Schema 		= mongoose.Schema
var ObjectId 	= Schema.ObjectId

var Tindakan = new Schema({
	waktu : Date,
	nama : String,
	biaya : Number
})

var RawatInap	= new Schema({
	pasien: {type: ObjectId, ref: 'Pasien',required: true},
	resepsionis: {type: ObjectId, ref: 'Resepsionis',required: true},
	kamar: {type: ObjectId, ref: 'Kamar',required: true},
	kedatangan: {type: Date, required: true},
	kepulangan: {type: Date, required: true},
	tindakan : [Tindakan]

},{collection: 'RawatInap'});

module.exports = mongoose.model('RawatInap', RawatInap);