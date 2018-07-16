var express = require('express');
var router = express.Router();
var baidu_ocr = require('../utils/baidu_ocr_utils')

/* GET users listing. */
router.get('/', function(req, res, next) {
  baidu_ocr.getAccessToken()
});

module.exports = router;