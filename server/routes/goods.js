var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// 链接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue_shop_lesson');
mongoose.connection.on('connected',function () {
  console.log('MongoDB connected success.')
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
