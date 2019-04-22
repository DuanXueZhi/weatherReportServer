// 2019/4/20
const express = require('express')
const router = express.Router()

/*
* 引入模型
* */
const Users = require('../models/users')

/*
* 该路由使用的中间件
* */
// 通用
router.use(function timeLog(req, res, next) {
    console.log('/-------------------------RMusers(对用户操作模块)---------------------------/', Date.now());
    next();
});

/*
* 路由
* */

// 添加用户
router.post('/add_user', (req, res) => {
    console.log('添加用户', req.body)
    let userData = req.body.data.user
    Users.findOneUser({userName: userData.userName}, (err, data) => {
        if (err) {
            return res.json({code: -2, msg: '数据库错误'})
        } else if (data === null){
            Users.addUser(userData, (err1) => {
                if (err1) {
                    return res.json({code: -1, msg: '用户存储错误'})
                } else {
                    return res.json({code: 0, msg: '用户注册成功'})
                }
            })
        } else {
            return res.json({code: -3, msg: '用户已存在'})
        }
    })
})

// 删除用户
router.delete('/delete_user', (req, res) => {
    let userId = req.query.userId
    // 应该先查询一下
    Users.findById({_id: userId}, (err, data) => {
        if (err) {
            return res.json({code: -1, msg: '删除用户-查询出错'})
        } else {
            Users.removeUser(data, (err1, doc) => {
                if (err1) {
                    console.log('删除出错', err1);
                    return res.json({code: -2, msg: '删除用户出错'})
                } else {
                    console.log('删除' + userId + '成功', doc);
                    return res.json({code: 0, msg: '删除用户成功', data: doc})
                }
            })
        }
    })
})

// 修改
router.post('/user_update', (req, res) => {
    console.log('修改')
    let id = req.body.data.id
    let userData = req.body.data.user
    console.log(id, userData)
    Users.updateUserMsg(id, userData, (err, data) => {
        if (err) {
            return res.json({code: -2, msg: '数据库错误'})
        }
    })
})

// 查询用户（所有/逐个）
router.post('/user_findOrList', (req, res) => {
    console.log('查询用户（所有/逐个）')
    let userData = req.body.data.user
    if (userData.userName) {
        // 查询单个用户
        Users.findOneUser({userName: userData.userName}, (err, data) => {
            if (err) {
                return res.json({code: -1, msg: '查询出错'})
            } else if (data !== '') {
                return res.json({code: 0, msg: '查询成功', data: data})
            } else {
                return res.json({code: -3, msg: '用户不存在'})
            }
        })
    } else {
        // 查询所有用户admin
        Users.find((err, data) => {
            return res.json({code: 0, msg: '查询成功', data: data})
        })
    }
})

// 登录
router.post('/user_login', (req, res) => {
    console.log('登录', req.body)
    let userData = req.body.data.user
    Users.findOneUser({userName: userData.userName}, (err, data) => {
        if (err) {
            return res.json({code: -1, msg: '查询出错'})
        } else {
            if (data !== null) {
                if (data.password === userData.password) {
                    return res.json({code: 0, msg: '登录成功', data})
                } else {
                    return res.json({code: -2, msg: '用户名或密码错误'})
                }
            } else {
                return res.json({code: -3, msg: '用户不存在'})
            }
        }
    })
})

module.exports = router