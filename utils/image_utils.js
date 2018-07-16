var fs = require('fs');
var ImageUtils = {
    base64_encode: function(file) {
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }
}
module.exports = ImageUtils;