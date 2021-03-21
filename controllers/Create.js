var express = require('express');
var router = express.Router();
var list_tindakan = require('../data/list_tindakan.json')
var moment = require('moment')
var Pasien = require('../models/Pasien.js')
var Resepsionis = require('../models/Resepsionis.js')
var Kamar = require('../models/Kamar.js')
var RawatInap = require('../models/RawatInap.js')

const getRandom = max => Math.floor(Math.random()*max)+1
const randomPick = (items) => items[Math.floor(Math.random()*items.length)]
const randomMinMax = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;
const removePicked = (items, id) => items.filter(item => item._id != id)
const randomInDay = date => {
	date.setHours(randomMinMax(0,23), randomMinMax(0,59))
	return date
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

function createTindakan(tanggal){
	var list_resepsionis = []
	var list_kamar = []
	Resepsionis.find((err, list) => {
		list_resepsionis = list
	})
	cekPasienSembuh(tanggal, (list_kamar_kosong) => {
		max = randomMinMax(1,8)
		list_rawatan = []
		Kamar.find({status : "Tersedia"}, (err, data) => {
			list_kamar = data
		})
		Pasien.aggregate([
				{$match : {status : "Sehat"}},
				{$sample : { size : max}}
			],(err, data) => {
				for(let pas of data){
					resepsionis = randomPick(list_resepsionis)
					kamar = randomPick(list_kamar)
					if(!kamar) continue;
					list_kamar = removePicked(list_kamar, kamar._id) 
					jumlah_hari = getRandom(2,12)
					kedatangan = new Date(tanggal)
					kedatangan = randomInDay(kedatangan)
					kepulangan = new Date(tanggal).addDays(jumlah_hari)
					kepulangan = randomInDay(kepulangan)
					tindakan = getTindakan(kedatangan, kepulangan)
					RawatInap.create({
						kedatangan,
						kepulangan,
						pasien : pas._id,
						resepsionis : resepsionis._id,
						kamar : kamar._id,
						tindakan
					}, (err, rawat) => {
						list_rawatan.push(rawat)
					})
					kamar.status = "Terisi"
					kamar.save()
					pasien = Pasien.findById(pas._id, (err, item) => {
						item.status = "Sakit"
						item.save()
					})
				}
				let d = new Date(tanggal)
				d = d.addDays(1)

				nextUrl = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
				console.log("Create Tindakan Tanggal : "+tanggal)
				createTindakan(nextUrl)
			})
	})
}

function getTindakan(kedatangan, kepulangan){
	let maxDate = kepulangan.getTime()
	let minDate = kedatangan.getTime()
	let list = list_tindakan.sort( () => .5 - Math.random() );
	let maxTindakan = randomMinMax(3,15)
	let maxList = list.length
	let _list = []
	for(let i = 0; i <= maxTindakan; i++){
		let j = i
		j = j%maxList
		tindakan = {
			waktu : new Date(randomMinMax(minDate, maxDate)), 
			nama : list[j].nama, 
			biaya : randomMinMax(list[j].min, list[j].max)*1000
		}
		_list.push(tindakan)
	}
	return _list.sort((a,b)=>a.waktu.getTime()-b.waktu.getTime());
}

function cekPasienSembuh(tanggal, cb){
	var date = new Date(tanggal)
	var dateMin = new Date(tanggal).addDays(-1)
	RawatInap.find({
		kepulangan : {
			$lt : date,
			$gte : dateMin
		}
	})
	.populate('pasien', 'nama status')
	.populate('kamar', 'tipe ruang no status')
	.exec((err, data) => {
		const list_kamar = []
		for(let rawat of data){
			const {kamar, pasien} = rawat
			if(kamar.status == "Terisi"){
				kamar.status = "Tersedia"
				kamar.save()
				list_kamar.push(kamar)
			}
			if(pasien.status == "Sakit"){
				pasien.status = "Sehat"
				pasien.save()
			}
		}
		return cb(list_kamar)
	})
}	

module.exports = {
	run(req, res) {
		var tanggal = req.params.tanggal
		createTindakan(tanggal)
	},
	reset(req, res){
		Pasien.find({status:"Sakit"}, (err, list) => {
			list.forEach(pasien => {
				pasien.status = "Sehat"
				pasien.save()
			})
		})
		Kamar.find({status:"Terisi"}, (err, list) => {
			list.forEach(kamar => {
				kamar.status = "Tersedia"
				kamar.save()
			})
		})
		RawatInap.find({}, (err, list) => {
			list.forEach(kamar => {
				kamar.delete()
			})
		})
		res.send("Reset Data Success")
	}
}