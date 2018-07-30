var express = require('express');
var router = express.Router();

var multer = require('../utils/multer_utils');
var upload = multer.array('file', 9);

/* GET home page. */
router.post('/', function(req, res, next) {
  upload(req, res, err=>{
      if(err) {
          res.send(err);
      }
      res.send(req.files)
  })
});

module.exports = router;