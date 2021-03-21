var mongoose 	= require('mongoose')
var Schema 		= mongoose.Schema
var ObjectId 	= Schema.ObjectId

var Transaksi = new Schema({
	kebutuhan : {type: String, required: true},
	biaya : {type: Number, required: true}
},{timestamps : true})

module.exports = mongoose.model('Transaksi', Transaksi);