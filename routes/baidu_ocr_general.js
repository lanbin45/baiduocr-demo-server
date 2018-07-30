var express = require('express');
var router = express.Router();
var baidu_ocr = require('../utils/baidu_ocr_utils');
var {
  Baidu_ocr_Config
} = require('../config/config');

/* GET users listing. */
router.post('/', function(req, res, next) {
  baidu_ocr.common_ocr(req.body.picType, req.body.imageUrl, req.body.requestId, {})
    .then(data => {
      console.log(data);
      res.json(data);
    })
});

module.exports = router;