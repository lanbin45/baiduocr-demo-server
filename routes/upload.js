var express = require('express');
var router = express.Router();

var multer = require('../utils/multer_utils');
var upload = multer.single('file');

/* GET home page. */
router.post('/', function(req, res, next) {
  upload(req, res, err=>{
      if(err) {
          res.send(err);
      }
      res.send(req.file)
  })
});

module.exports = router;