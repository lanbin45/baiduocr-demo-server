var express = require('express');
var router = express.Router();
var baidu_ocr = require('../utils/baidu_ocr_utils');
var {
  Baidu_ocr_Config
} = require('../config/config');

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req)
  baidu_ocr.common_ocr(req.body.picType, req.body.imageUrl, {})
    .then(data => {
      console.log(data);
      res.json(data);
    })
});

module.exports = router;