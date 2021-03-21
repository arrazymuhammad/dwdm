var express = require('express');
var router = express.Router();
var Api = require('../controllers/Api')

router.get("/pasien-tahun/:tahun", Api.PasienTahun)
router.get("/tindakan-tahun/:tahun", Api.TindakanTahun)
router.get("/pasien-bulan/:bulan", Api.PasienBulan)
router.get("/tindakan-bulan/:bulan", Api.TindakanBulan)

module.exports = router 