<template>
    <div class="artivcle-preview">
        <transition name="fade" mode="out-in">
            <div v-for="item in list" v-if="list.length>0">
                <div class="atticle-title">{{item.title}}</div>
                <div style="color:#34495e" v-compiledMarkdown>{{item.articleContent}}</div>
                <div class="article-preview-footer">
                    <el-button type="primary" icon="edit" @click="modify(item._id)">不满意，点此修改</el-button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import marked from 'marked';
import highlight from 'highlight.js'
import '../assets/atom-one-light.css'
export default{
    data(){
        return{
            list: [],
        }
    },
    created () {
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        this.fetchData()
    },
    mounted: function(){
		marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code) {
                return highlight.highlightAuto(code).value;
            }
        });
    },
    methods: {
        fetchData: function(){
            var id = this.$route.params.id
            this.$http.get('/api/articleDetails/'+ id).then(
                respone => {
                    this.list.push(respone.data)
                },
                respone => console.log('错误'+respone)
            )
        },
        modify: function(id){
            this.$router.push({path: '/articleList/articleEdit', query: {id: id}})
        }
    },
    watch: {
        '$route': 'fetchData'
    },
    directives: {
        compiledMarkdown: {
            bind: function(el){
                el.innerHTML = marked(el.innerText)
            }
        }
    }
}
</script>

<style lang="scss">
.article-preview-footer {
    position: fixed;
    right: 20px;
    bottom: 30px;
}
.artivcle-preview {
    padding: 15px;
}
.atticle-title {
    font-size: 22px;
	cursor: pointer;
	border-left: 3px #a0a0a1 solid;
	padding-left: 10px;
	color: #2c3e50;
	font-weight: bold;
	margin-bottom: 10px;
}
</style>