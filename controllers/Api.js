var RawatInap = require('../models/RawatInap.js')

module.exports = {
	TindakanTahun(req, res){
		const {tahun} = req.params
		RawatInap.aggregate([
		    {
		        '$unwind': '$tindakan'
		    }, {
		        '$project': {
		            'pasien': '$pasien', 
		            '_id': {
		                'date': {
		                    '$dayOfMonth': '$tindakan.waktu'
		                }, 
		                'year': {
		                    '$year': '$tindakan.waktu'
		                }, 
		                'month': {
		                    '$month': '$tindakan.waktu'
		                }
		            }, 
		            'biaya_tindakan': '$tindakan.biaya'
		        }
		    }, {
				$match: {
					'_id.year': parseInt(tahun)
				}
			}, {
		        '$group': {
		            '_id': {
		                'year': '$_id.year', 
		                'month': '$_id.month'
		            }, 
		            'total_biaya': {
		                '$sum': '$biaya_tindakan'
		            }
		        }
		    }, {
		        '$addFields': {
		            'month': {
		                '$concat': [
		                    {
		                        '$toString': '$_id.year'
		                    }, '-', {
		                        '$toString': '$_id.month'
		                    }
		                ]
		            }
		        }
		    }, {
		        '$sort': {
		            '_id': 1
		        }
		    }
		], (err, data) => {
			res.send({data, tahun})
		})
	},

	PasienTahun(req, res) {
		const {tahun} = req.params
		RawatInap.aggregate([
			{
				"$unwind": "$tindakan"
			},
			{
				"$project": {
					"_id": {
						"year": {
							"$year": "$tindakan.waktu"
						},
						"month": {
							"$month": "$tindakan.waktu"
						}
					},
					"pasien": "$pasien"
				}
			},
			{
				"$match": {
					"_id.year": parseInt(tahun)
				}
			},
			{
				"$group": {
					"_id": "$_id",
					"pasien": {
						"$addToSet": "$pasien"
					}
				}
			},
			{
				"$project": {
					"pasien": {
						"$size": "$pasien"
					}
				}
			},
			{
				"$addFields": {
					"month": {
						"$concat": [
							{
								"$toString": "$_id.year"
							},
							"-",
							{
								"$toString": "$_id.month"
							}
						]
					}
				}
			},
			{
				"$sort": {
					"_id": 1
				}
			}
		], (err, data) => {
			res.send({data, tahun})
		})
	},
	TindakanBulan(req, res){
		const {bulan} = req.params
		RawatInap.aggregate([{
			'$unwind': '$tindakan'
		}, {
			'$project': {
				'pasien': '$pasien',
				'_id': {
					'date': {
						'$dayOfMonth': '$tindakan.waktu'
					},
					'year': {
						'$year': '$tindakan.waktu'
					},
					'month': {
						'$month': '$tindakan.waktu'
					}
				},
				'biaya_tindakan': '$tindakan.biaya'
			}
		}, {
			$match: {
				'_id.year': 2021,
				'_id.month': parseInt(bulan)
			}
		}, {
			'$group': {
				'_id': {
					'year': '$_id.year',
					'month': '$_id.month',
					'date': '$_id.date'
				},
				'total_biaya': {
					'$sum': '$biaya_tindakan'
				}
			}
		}, {
			'$addFields' : {
				 year : {$toDate : {$concat : [
				   {$toString : "$_id.year"},"-",
				   {$toString : "$_id.month"},"-",
				   {$toString : "$_id.date"}
				   ]}}
				}
		},{
			'$project' : {
				'date' : '$year',
				'total_biaya' : '$total_biaya'
			}
		}, {
			'$sort': {
				'_id': 1
			}
		}
		], (err, data) => {
			res.send({data, bulan})
		})
	},
	PasienBulan(req, res){
		const {bulan} = req.params
		RawatInap.aggregate([
			{"$unwind":"$tindakan"},
			{"$project":{
					"_id":{ 
						"date":{ "$dayOfMonth":"$tindakan.waktu"},
						"year":{ "$year":"$tindakan.waktu"},
						"month":{"$month":"$tindakan.waktu"}
					},
					"pasien":"$pasien"
				}
			},
			{
				"$match":{
					"_id.year":2021,
					"_id.month":parseInt(bulan)
				}
			},
			{
				"$group":{
					"_id":"$_id",
					"pasien":{
						"$addToSet":"$pasien"
					}
				}
			},
			{
				"$project":{
					"pasien":{
						"$size":"$pasien"
					}
				}
			},
			{
				"$addFields":{
					"date":{
						"$concat":[
							{
								"$toString":"$_id.year"
							},
							"-",
							{
								"$toString":"$_id.month"
							},
							"-",
							{
								"$toString":"$_id.date"
							}
						]
					}
				}
			},
			{
				"$sort":{
					"_id":1
				}
			}
		], (err, data) => {
			res.send({data, bulan})
		})
	}, 

}
