var request = require('request');
var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var {
    Baidu_ocr_Config
} = require('../config/config');
// var ImageUtils = require('../utils/image_utils')

const AccessTokenUrl = 'https://aip.baidubce.com/oauth/2.0/token?';
const Basic_Url = 'https://aip.baidubce.com/rest/2.0/ocr/v1';
const Form_Base_Url = 'https://aip.baidubce.com/rest/2.0/solution/v1'
/* const General_Basic_Url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic';
const Accurate_Basic_Url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic'; */
class BaiduOCR {
    constructor(options) {
        this.AppID = options.AppID;
        this.API_Key = options.API_Key;
        this.Secret_Key = options.Secret_Key;
        this.access_token = {};
        this.start_request_access_token = new Date().getTime();
    }

    getAccessToken() {
        return new Promise((resolve, reject) => {
            if (this.access_token.access_token && this.checkAccessTokenState(this.access_token)) {
                // checkTokenState(this.access_token)
                return resolve(this.access_token);
            } else {
                const param = qs.stringify({
                    'grant_type': 'client_credentials',
                    'client_id': this.API_Key,
                    'client_secret': this.Secret_Key
                });

                var config = {
                    url: AccessTokenUrl + param
                }

                request(config, (err, res, body) => {
                    if (err) return reject(err);
                    this.start_request_access_token = new Date().getTime(); // Access Token 有效期为一个月，需要记录获取时间check Access Token
                    this.access_token = JSON.parse(body);
                    return resolve(this.access_token);
                })
            }
        })
    }

    
    checkAccessTokenState(access_token) {
        if(!access_token.access_token || !access_token.expires_in) {
            return false
        }
        var currentTimeInMs = new Date().getTime();
        /* 当前时间距access token获取时间小于expire 时间， 误差设置为10s */
        if(currentTimeInMs - this.start_request_access_token <= access_token.expires_in - 10000 ) {
            return true
        }
        
        return false
    }
    
    common_ocr(type, imagePath, requestId, customOptions) {
        // imagePath = path.join(process.cwd(), './testdata/cgp_zh.png');
        var requestBaseUrl = ''
        switch(type){
            case 'form_ocr_request':
                requestBaseUrl = Form_Base_Url;
                break;
            case 'form_ocr_get_request_result':
                requestBaseUrl = Form_Base_Url;
                break;
            default:
                requestBaseUrl = Basic_Url;
        }
        var General_Basic_Url = `${requestBaseUrl}/${Baidu_ocr_Config.Ocr_Type[type]}`;
        if(imagePath){
            var imageBuf = fs.readFileSync(imagePath);
            var params = 'image=' + encodeURIComponent(imageBuf.toString('base64')) + qs.stringify(customOptions);
        } else {
            var params = 'request_id=' + requestId;
        }
        
        var header = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        return new Promise((resolve, reject) =>{
            this.getAccessToken().then(access_token => {
                var config = {
                    url: `${General_Basic_Url}?access_token=${access_token.access_token}`,
                    headers: header,
                    method: 'POST',
                    body: params
                }
                return request.post(config, (err, res, body) => {
                    if(err) return reject(err)
                    return resolve(body)
                })
            })
        })
    }
    
    /* general_basic(imagePath, options) {
        if (!imagePath) return;
        
        imagePath = path.join(process.cwd(), './testdata/cgp_zh.png');
        var imageBuf = fs.readFileSync(imagePath);
        this.getAccessToken().then(access_token => {
            console.log(`${General_Basic_Url}?access_token=${access_token.access_token}`)
            var config = {
                url: `${General_Basic_Url}?access_token=${access_token.access_token}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                body:'image=' + encodeURIComponent(imageBuf.toString('base64'))
            }
            request.post(config, (err, res, body) => {
                console.log(body)
            })
        })
    }
    
    accurate_basic(imagePath, options) {
        if (!imagePath) return;
        
        imagePath = path.join(process.cwd(), './testdata/xtl_zh.png');
        var imageBuf = fs.readFileSync(imagePath);
        this.getAccessToken().then(access_token => {
            console.log(`${Accurate_Basic_Url}?access_token=${access_token.access_token}`)
            var config = {
                url: `${Accurate_Basic_Url}?access_token=${access_token.access_token}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                body:'image=' + encodeURIComponent(imageBuf.toString('base64'))
            }
            request.post(config, (err, res, body) => {
                console.log(body)
            })
        })
    } */
}

// getAccessTokenByHttp() {
//     const param = qs.stringify({
//         'grant_type': 'client_credentials',
//         'client_id': this.API_Key,
//         'client_secret': this.Secret_Key
//     });

//     var config = {
//         url: AccessTokenUrl + param
//     }

//     request(config, (err, res, body) => {
//         if (err) throw reject(err);
//         this.start_request_access_token = new Date().getTime(); // Access Token 有效期为一个月，需要记录获取时间check Access Token
//         this.access_token = JSON.parse(body);
//         return resolve(this.access_token);
//     })
// }
/* 単例？ */
var baidu_ocr = new BaiduOCR(Baidu_ocr_Config);

module.exports = baidu_ocr;