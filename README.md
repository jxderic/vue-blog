## 项目的整体架构
![blog](https://lh3.googleusercontent.com/-MSpKi3Nv-L0/WWcwEwEePrI/AAAAAAAAAEQ/b_RphXryb6AZUFpIXIWkgo0hLkjeO_CBgCHMYCw/I/blog.jpeg)
## server部分
服务端部分采用**express**作为开发框架，提供api接口服务给前端调用，后端不做页面模板的渲染和路由的导航工作，这部分工作都由前端**vue**来处理，所以该博客实现了前后端分离，以**RESTful api**来通信的单页面应用。数据库使用**mongodb**，用**mongoose**来对mongodb进行操作，mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具。
## client部分
分为两部分，front（前端展示页面）和admin（后台管理系统），前者就是通过取数据库的数据来进行渲染，因为文章的内容保存的是**markdown**格式的，我用了**marked**这个库进行解析，代码的语法高亮用了**highlight**配置。博客的评论系统本来想用多说的，之前自己的github.io的静态博客是采用多说的，但多说6月1号关闭服务了，通过搜索发现一个基于GitHub issues开发的一个评论系统，[gitment](https://github.com/imsun/gitment)。
admin通过判断是否有session来判断是否登录了后台管理系统。博客的管理后台，可以管理前端展示页面的文章列表的发布与编辑等，后台的 markdown 文章编辑器用了simplemde，支持多种快捷键。 技术框架方面采用了 vue 和 vue 的周边生态相关的库，也就是我们常说的 vue 全家桶了。然后用 webpack 作为静态资源的打包与发布工具， webpack-dev-server 做开发调试的服务器并做开发时跨域问题的反向代理工作，这部分后面细说。
## 问题与难点
跨域的解决方法有很多种，比如 jsonp (只支持get请求)，cors。
这里直接用了 webpack-dev-server 给我们提供的proxy模块，配置如下

```
devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: [{
            // 前端ajax请求的接口有带上下文为/api都代理到node的9000端口
            context: ['/api'],
            target: 'http://localhost:9000',
            changeOrigin: true,
            secure: false
    }]
}
```
## 本地查看方法
```
git clone https://github.com/jxderic/vue-blog.git
cd vue-blog
npm install
node app.js
localhost:7000
localhost:7000/admin
```
## License
[MIT](https://opensource.org/licenses/mit-license.php)



