var express = require('express');
var ctrl = require('../controllers');

var router = express.Router();

router.route('/addKioskSetting').post(ctrl.appSetting.addKioskSetting);
module.exports = router;