// 2019/4/20
const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    userName: {type: String, required: true}, // 用户名
    password: {type: String, default: '000000'}, // 密码
    identity: {type: String, required: true}, // 用户身份
    userImage: {type: String, default: ''}, // 用户头像
    userSex: {type: String, default: '男'}, // 用户性别
    myCity: {type: Array, default: []}, // 用户城市列表
    exist: {type: Boolean, default: true}, // 是否存在
    meta: {
        createAt: {type: Date, default: Date.now()},
        updateAt: {type: Date, default: Date.now()}
    }
})

//.pre表示每次存储数据之前先调用这个方法
UsersSchema.pre('save', function (next) {
    let nowTime = new Date(); // 获取时间（格林尼治时间）
    console.log(nowTime, new Date(nowTime).getTime());
    let ChinaTime = new Date(nowTime).getTime() - nowTime.getTimezoneOffset() * 60 * 1000; // 将当前时间转换为时间戳并减去当前地区时差
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = ChinaTime;
    } else {
        this.meta.updateAt = ChinaTime;
    }
    next(); //往下执行
});

// 静态方法
UsersSchema.statics = {
    /*
    * 增
    * */
    addUser: function (data, callbackFn) { // 添加用户
        console.log('模式内置静态方法---添加用户');
        console.log(data)
        return this
            .create({
                userName: data.userName, // 用户名
                password: data.password, // 密码
                identity: data.identity, // 用户身份
                userImage: data.userImage, // 用户头像
                userSex: data.userSex, // 用户性别
                myCity: data.myCity, // 用户城市列表
                exist: data.exist //是否存在（删除时使用）
            }, callbackFn)
    },

    // 彻底删除某一条进货信息
    removeUser: function (data, callbackFn) {
        console.log('模式内置静态方法---通过_id删除单个用户');
        return data
            .remove(callbackFn)
    },

    // 修改单个用户信息
    updateUserMsg: function (_id, data, callbackFn) { // 修改单个用户信息
        console.log('模式内置静态方法---修改单个用户信息', data);
        return this
            .update({_id: _id}, {$set: data}, {multi: false}, callbackFn)
    },

    // 查询一个（用户登录）
    findOneUser: function (data, cb) {
        console.log('findOneUser', data);
        return this
            .findOne(data)
            .exec(cb)
    }
}

module.exports = UsersSchema

