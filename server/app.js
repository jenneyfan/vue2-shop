var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));     //  日志
app.use(express.json());    // 解析JSON数据
app.use(express.urlencoded({ extended: false }));  // URL编码
app.use(cookieParser());        // 解析cookie请求
app.use(express.static(path.join(__dirname, 'public')));    // 设置静态资源路径

// CORS配置，服务器端跨域
app.all('*',function (req,res,next) {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','Origin, X-Request-Width, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods','PUT, POST, GET, DELETE, OPTIONS');
  res.header('X-Powered-By','3.2.1');
  res.header('Content-Type','application/json;chartset=utf-8');
  next();
});

app.use('/', indexRouter);
app.use('/goods', goodsRouter);

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
