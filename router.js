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

// 查询文章列表路由 用于博客前端展示数据不包含草稿内容
router.get('/api/articleList', function(req, res){
    db.Article.find({state: "publish"}, function(err, docs){
        if (err) {
            console.log('出错'+ err);
            return
        }
        res.json(docs)
    })
})
// 按标签ID查询文章列表路由 用于博客前端展示数据不包含草稿内容
router.post('/api/articleList', function(req, res){
    db.TagList.find({_id: req.body.tagId}, function(err, docs){
        if (err) {
            res.status(500).send();
            return
        }
        db.Article.find({label: docs[0].tagName,state: "publish"}, function(err, docs){
            if (err) {
                res.status(500).send();
                return
            }
            res.json(docs)
        })
    })
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

//查询文章详情路由
router.get('/api/articleDetails/:id', function(req, res){
    db.Article.findOne({_id: req.params.id}, function(err, docs){
        if (err) {
            return
        }
        res.send(docs)
    })
})

router.post('/api/articleDetails', function(req,res){
    db.Article.findOne({_id: req.body.id}, function(err,docs){
        if(err){
            return
        }
        res.send(docs)
    })
})

//查询文章标签路由
router.get('/api/getArticleLabel', function(req, res){
    db.TagList.find({}, function(err, docs){
        if (err)return;
        res.json(docs)
    })
})

//更新文章标签路由
router.post('/api/updateLabel', function(req,res){
    db.TagList.find({tagName:req.body.label}, function(err,docs){
        if(err){
            return
        }
        if(req.body.change == 'del'){
            docs[0].tagNumber--;
        }
        if(req.body.change == 'inc'){
            docs[0].tagNumber++;
        }
        db.TagList(docs[0]).save(function(err){
            if (err){
                res.status(500).send();
                return
            }
            res.send()
        })
    })
})
//文章标签保存路由
router.post('/api/saveArticleLabel', function(req,res){
    db.TagList.find({}, function(err,docs){
        if(err){
            return;
        }
        var isExist = false;
        docs.forEach(function(item){
            if(item.tagName == req.body.tagList.tagName){
                isExist = true;
            }
        })
        if(isExist){
            res.json({error: true, msg: '标签已存在'})
        }else{
            new db.TagList(req.body.tagList).save(function(error){
                if(error){
                    res.send('保存失败');
                    return;
                }
                res.send()
            })
        }
    })
})

// 删除文章
router.post('/api/delect/article', function(req,res){
    db.Article.remove({_id: req.body._id}, function(err,docs){
        if(err){
            res.status(500).send();
            return;
        }
        res.send()
    })
})

// 文章更新路由
router.post('/api/updateArticle', function(req, res){
    db.Article.find({_id: req.body.obj._id}, function(err, docs){
        if(err){
            return
        }
        docs[0].title = req.body.obj.title
        docs[0].articleContent = req.body.obj.articleContent
        // 不更新文章更改时间
        docs[0].date = docs[0].date
        docs[0].state = req.body.obj.state
        docs[0].label = req.body.obj.label
        db.Article(docs[0]).save(function(err){
            if (err){
                res.status(500).send();
                return
            }
            res.send()
        })
    })
})

// 文章保存路由
router.post('/api/saveArticle', function(req,res){
    new db.Article(req.body.articleInformation).save(function(err){
        if(err){
            res.status(500).send();
            return;
        }
        if(req.body.articleInformation.state != 'draft') {
            db.Article.find({label: req.body.articleInformation.label},function(err,ArticleList){
                if(err){
                    return;
                }
                db.TagList.find({tagName: req.body.articleInformation.label}, function(err,docs){
                    if(docs.length>0){
                        docs[0].tagNumber = ArticleList.length;
                        db.TagList(docs[0]).save(function(err){})
                    }
                })
            })
        }
        res.send()
    })
})

// 博客信息路由
router.post('/api/save/personalInformation', function(req, res){
    db.PersonalInformation.find({}, function(err, docs){
        if (err) {
            res.status(500).send();
            return
        }
        if(docs.length>0){
            docs[0].name = req.body.form.name
            docs[0].individualitySignature = req.body.form.individualitySignature
            docs[0].introduce = req.body.form.introduce
            db.PersonalInformation(docs[0]).save(function(err){
                if (err) {
                    res.status(500).send();
                    return
                }
                res.send();
            })
        } else {
            new db.PersonalInformation(req.body.form).save(function(err){
                if (err){
                    res.status(500).send();
                    return
                }
                res.send();
            })
        }
    })
})

router.get('/api/personalInformation', function(req, res){
    db.PersonalInformation.find({}, function(err, docs){
        if (err) {
            res.status(500).send();
            return
        }
        res.json(docs)
    })
})

module.exports = router