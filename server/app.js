// 2019/4/14
/*
* 引用
* */
const express = require('express'); // express
const mongoose = require('mongoose'); // mongoose
var bodyParser = require('body-parser'); // 获取body-parser模块（解析请求后，解析值放入req.body属性中）

const app = express(); // 创建app

app.use(bodyParser.json({'limit': '10240kb'}));

// 设置跨域请求
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); // 解决跨域请求node无法操作cookie存入Application的cookies库
    res.header("X-Powered-By", ' 3.2.1');
    if (req.method == "OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
    else
        next();
});

/*
* 连接Market数据库
* */
mongoose.connect('mongodb://localhost:27017/WeatherReport', { useNewUrlParser: true }, function (err) {
    if(err) {
        console.log('MongoDB connection failed!',err);
    }else{
        console.log('MongoDB connection success!');
    }
});

/*
* 导入自定义路由
* */
const RMusers = require('./routeModels/RMusers') // 引入RMusers（操作用户）模块

/*
 *通过app调用express的各种方法
 * */
// 主页（未使用）
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// 操作用户模块
app.use('/rm_users', RMusers); // 在routeModels-RMusers.js中

app.listen(3000, () => {
    console.log('Server is running')
})