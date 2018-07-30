var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var https = require('https');
var http = require('http');

var privateKey = fs.readFileSync('./config/sslConfig/private.pem', 'utf8');
var certificate = fs.readFileSync('./config/sslConfig/file.crt', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};

var app = express();

var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);
var SSLPORT = 18081;
var PORT = 18080;

httpsServer.listen(SSLPORT, function () {
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
httpServer.listen(PORT, function () {
  console.log('HTTP Server is running on: http://localhost:%s', PORT);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

/**
 * express 设置跨域
 */
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var usersRouter = require('./routes/users');
app.use('/users', usersRouter);
var baidu_ocr_general_Router = require('./routes/baidu_ocr_general');
app.use('/api/baidu_ocr_general', baidu_ocr_general_Router);
var baidu_ocr_general_Router = require('./routes/singleton_test');
app.use('/singleton_test', baidu_ocr_general_Router);
var uploadRouter = require('./routes/upload');
app.use('/api/upload', uploadRouter);
var uploadManyRouter = require('./routes/upload_many');
app.use('/api/uploadmany', uploadManyRouter);

var downloadFormExcelRouter = require('./routes/download_form_excel');
app.use('/api/downloadformexcel', downloadFormExcelRouter);
var downloadCardExcelRouter = require('./routes/download_card_excel');
app.use('/api/downloadcardexcel', downloadCardExcelRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
