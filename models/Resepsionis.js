var mongoose 	= require('mongoose')
var Schema 		= mongoose.Schema;

var Resepsionis	= new Schema({
	nama: {type: String, required: true},
},{collection: 'Resepsionis'});

module.exports = mongoose.model('Resepsionis', Resepsionis);