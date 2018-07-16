var config = {
    development: {},
    production: {},
    Baidu_ocr_Config: {
        AppID: "11518496",
        API_Key: "IDyhtItpbj0QhmqDb8wc7CIa",
        Secret_Key:　"hIS0oOmYUlVQpy27B6yL2XZNYsr8trpj",
        Ocr_Type: {
            general_basic: 'general_basic',     // 通用文字识别
            accurate_basic: 'accurate_basic',   // 通用文字识别（高精度版）
            general: 'general',                 // 通用文字识别（含位置信息版）
            accurate: 'accurate',               // 通用文字识别（含位置信息、高精度版）
            webimage: 'webimage',               // 网络图片文字识别
            idcard: 'idcard',                   // 身份证识别
            bankcard: 'bankcard',               // 银行卡识别
            driving_license: 'driving_license', // 驾驶证识别
            vehicle_license: 'vehicle_license', // 行驶证识别
            license_plate: 'license_plate',     // 车牌识别
            business_license: 'business_license',// 营业执照识别
            passport: 'passport',               // 护照识别
            business_card: 'business_card',     // 名片识别
            form_ocr_request: 'form_ocr/request',// 表格文字识别
            form_ocr_get_request_result: 'form_ocr/get_request_result',// 获取表格识别结果
            receipt: 'receipt',                 // 通用票据识别
            qrcode: 'qrcode'                    // 二维码识别
        }
    }
}

module.exports = config;