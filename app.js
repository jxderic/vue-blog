var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');//进行post参数解析
var router = require('./router');
var compression = require('compression');//compress all requests 
var session = require('express-session');
var app = express();

var resolve = file => path.resolve(__dirname, file);
app.use(compression());//压缩请求
app.use('/dist', express.static(resolve('./dist')));//设置静态文件存储文件夹

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'recommend 128 bytes random string',
    cookie: { maxAge: 20 * 60 * 1000 }, //单位是毫秒
    resave: false, // 如果来了一个新的请求，不管原来在不在，重新存储一个
    saveUninitialized: false // 存储一些未初始化的session
}));

app.use(router);

//后台管理页面 判断是否已经登录，登录就进入管理页面，没登录就在登录页面
app.get('/admin', function(req, res) {
    var isLogined = req.session.userName;
    if(isLogined){
        console.log('已登录')
        var html = fs.readFileSync(resolve('../admin/admin.html'), 'utf-8');
    }else{
        console.log('未登录')
        var html = fs.readFileSync(resolve('../admin/login.html'), 'utf-8');
    }
    res.send(html);
})

// 博客首页
app.get('*', function(req, res) {
    var html = fs.readFileSync(resolve('../client/index.html'), 'utf-8');
    res.send(html)
});

app.listen(process.env.PORT || 7000, function() {
    console.log("应用实例，访问地址为 localhost:7000")
});