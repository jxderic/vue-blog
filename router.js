var express = require('express');
var router = express.Router();
var users = require('./user').items;
var db = require('./db');

var findUser = function(name,password){
    return users.find(function(item){
        return item.name === name && item.password === password;
    })
}

//登录接口
router.post('/api/login', function(req,res){
    var user = findUser(req.body.name, req.body.pwd);

    if(user){
        //清空所有session，重新初始化session
        req.session.regenerate(function(err){
            if(err){
                return res.json({code: 2, msg: '登录失败'});
            }
            req.session.userName = user.name;
            res.json({code: 0, msg: '登录成功'});
        });
    }else{
        res.json({code: 1, msg: '账号或密码错误'});
    }
})

//查询文章列表路由，用于博客后端管理系统，包含草稿和已发布文章数据
router.get('/api/admin/articleList', function(req,res){
    db.Article.find({}, function(err, docs){
        if(err){
            console.log('出错'+err);
            return
        }
        res.json(docs)
    })
})

//查询文章列表路由（根据标签返回对应的文章列表）
router.post('/api/admin/articleList', function(req,res){
    db.Article.find({label: req.body.label}, function(err,docs){
        if(err){
            console.log('出错'+err);
            return
        }
        res.json(docs)
    })
})

module.exports = router