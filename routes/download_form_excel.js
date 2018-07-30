var express = require('express');
var router = express.Router();
var request = require('request')
var fs = require('fs')
var nodeMailer  = require('nodemailer');

var mailTransporter = nodeMailer.createTransport({
    host: 'smtp.163.com',
    secureConnection: true, // 使用SSL方式，防止信息被窃取
    port: 465,
    auth: {
        user: 'lanbin_blue@163.com',
        pass: 'xtl19930213' // 使用时必须提供明文密码
    }
});


/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.body.fileUrl)
  var fileUrl = req.body.fileUrl;
  var email = req.body.email;
  var urlArrays = fileUrl.split('?')[0].split('/')
  var fileName = urlArrays[urlArrays.length - 1]
  downloadFile(fileUrl, `./attachment/${fileName}`, (err, data) => {
      console.log(err)
      if (err) {
          res.send(err)
      } else {
          var options = {
            from: '"兰斌" <lanbin_blue@163.com>',
            to: email,
            subject: '文字识别结果测试邮件',
            text: '文字识别结果附件发送测试',
            attachments : 
                [
                    {
                        filename: fileName,            // 改成你的附件名
                        path: `./attachment/${fileName}`,  // 改成你的附件路径
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
      }
  })
});

function downloadFile(uri,filename,callback){
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback); 
}

module.exports = router;