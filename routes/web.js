var express = require('express');
var router = express.Router();
var Dashboard = require('../controllers/Dashboard')
var Create = require('../controllers/Create')


router.get("/", Dashboard.index)
router.get("/create-data/:tanggal", Create.run)
router.get("/reset", Create.reset)

module.exports = router 