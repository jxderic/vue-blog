<template>
    <div>
        <div class="article-list">
            <div class="article-instructions">
                <img src="../assets/article-title.png" height="20" width="20">
                <span>文章列表</span>
                <img src="../assets/add.png" height="17" width="17" @click="addArticle">
            </div>
            <ul v-articleListHeight>
                <li v-for="item in articleList">
                    <h3 :class="{'articlePreview-title-draft': item.state=='draft', 'articlePreview-title-publish': item.state=='publish'}" @click="articlePreview(item._id)">{{item.title}}</h3>
                    <p>
                        {{new Date(item.date).format('yyyy-MM-dd hh:mm:ss')}}
                        <span class="label-item">{{item.label}}</span>
                    </p>
                </li>
            </ul>
        </div>
        <div class="router-view">
            <transition name="fade" mode="out-in">
                <router-view @saveArticleInformation="refreshArticleList" @emitArticleLabelList="onArticleLabelLis"></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
export default{
    data(){
        return{
            articleList: []
        }
    },
    created: function(){
        var param = localStorage.getItem("labelTitle");
        if(param){
            localStorage.removeItem("labelTitle")
            this.$http.post('api/admin/articleList', {
                label: param
            }).then(
                response => {
                    this.articleList = response.data.reverse();
                },
                response => console.log(response)
            )
        }else{
            this.fetchData()
        }
    },
    mounted: function(){
        // 增加一个原型函数来指定为固定格式的时间，format参数为指定的时间格式
        Date.prototype.format = function(format){
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds()
            }
            if(/(y+)/.test(format)){
                // 一一替换，年份转换成想要的格式
                format = format.replace(RegExp.$1,(this.getFullYear() + "").substr(4-RegExp.$1.length));
            }
            // 同样替换其他
            for (var k in o){
                if (new RegExp("(" + k + ")").test(format)){
                    format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
    },
    methods: {
        fetchData: function(){
            this.$http.get('api/admin/articleList').then(
                response => this.articleList = response.data.reverse(),//最新的排前面
                response => console.log(response)
            )
        },
        // 文章编辑页路由
        addArticle: function(){
            this.$router.push('/articleList/articleEdit')
        },
        // 文章预览页
        articlePreview: function(id){
            this.$router.push('/articleList/articlePreview'+id+'')
        },
        // 接受ArticleEdit组件派发的事件去获取最新的文章列表
        refreshArticleList: function(){
            this.$http.get('api/admin/articleList').then(
                response => this.articleList = response.data.reverse(),
                response => console.log(response)
            )
        },
        onArticleLabelLis: function(title){
            console.log(title)
        }
    },
    watch: {
        '$route': 'fetchData'
    },
    // 自定义指令
    directives: {
        articleListHeight: {
            bind: function(el){
                var height = window.innerHeight - 80
                el.style.maxHeight = height + 'px'
            }
        }
    }
}
</script>

<style lang="scss">
.article-list {
    width: 230px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 90px;
    border-right: 1px solid #f1f1f1;
    z-index: 1;
    background-color: #fff;

    ul {
        overflow: auto;
        padding-left: 12px;
        padding-right: 12px;

        li {
            border-bottom: 1px solid #f1f1f1;
            padding: 5px 10px 5px 10px;

            h3 {
                width: 170px;
                padding: 5px 0 5px 0;
                display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
            }

            p {
                font-size: 12px;
                color: #b3bbbc;
            }
        }
    }
}
.article-instructions {
    height: 65px;
    line-height: 65px;
    padding-left: 20px;
    border-bottom: 1px solid #f1f1f1;
    color: #666;

    span {
        width: 150px;
        display: inline-block;
    }

    img {
        vertical-align:middle;
        cursor: pointer;
    }
}
.router-view {
    position: relative;
    height: 100%;
    margin-left: 321px;
}
.articlePreview-title-publish {
    color: #20a0ff;
}
.articlePreview-title-draft {
    color: #FF4949;
}
.label-item {
    border: 1px #ccc solid;
    border-radius: 5px;
    padding: 2px 4px;
}
</style>