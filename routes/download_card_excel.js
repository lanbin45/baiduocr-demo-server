var express = require('express');
var router = express.Router();
var fs = require('fs');
var Json2csvParser = require('json2csv').Parser;
var nodeMailer  = require('nodemailer');

var mailTransporter = nodeMailer.createTransport({
    host: 'smtp.163.com',
    secureConnection: true, // 使用SSL方式，防止信息被窃取
    port: 465,
    auth: {
        user: 'alphatest@163.com',
        pass: 'alpha@B1008' // 使用时必须提供明文密码
    }
});

const JsonFileds = [
    'NAME',
    'ADDR',
    'MOBILE',
    'TEL',
    'FAX',
    'PC',
    'URL'
]
const transformOpts = { highWaterMark: 16384, encoding: 'GBK' }
const json2csvParser = new Json2csvParser({ fields: JsonFileds }, transformOpts);

/* GET home page. */
router.post('/', function(req, res, next) {
  var data = JSON.parse(req.body.excelData);
  var email = req.body.email;
  var csv = json2csvParser.parse(data);
  var fileName = new Date().getTime()
  var pathName = `./attachment/${fileName}.csv`
  console.log(csv)
  var msExcelBuffer = Buffer.concat([
    new Buffer('\xEF\xBB\xBF', 'binary'),
    new Buffer(csv)
  ]);
  fs.writeFile(pathName, msExcelBuffer, function(err) {
    if(err) {
        res.send(err);
    }  
    console.log(pathName)
    var options = {
        from: '"alpha_test" <alphatest@163.com>',
        to: email,
        subject: '文字识别结果测试邮件',
        text: '文字识别结果附件发送测试',
        attachments : 
            [
                {
                    filename: `${fileName}.csv`,            // 改成你的附件名
                    path: pathName,  // 改成你的附件路径
                    // cid : '00000001'                 // cid可被邮件使用
                }
            ]
      }
      mailTransporter.sendMail(options, (err, msg) => {
        if(err) {
            console.log(msg)
            res.send(err)
        } else {
            console.log(msg)
            res.send(msg)
        }
      })
  });
});

module.exports = router;