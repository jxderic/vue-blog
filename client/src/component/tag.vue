<template>
    <div id="tag">
        <h3>标签</h3>
        <div v-for="item in tagList">{{item.tagName}}</div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tagList: [],
        }
    },
    mounted () {
        this.$http.get('/api/getArticleLabel').then(
            res => {
                this.tagList = res.data
            },
            res => {

            }
        )
    },
    methods: {
        
    }
}
</script>

<style scoped>
#tag {
    text-align: center;
    padding: 0 1rem;
}tag
#tag h3{
    font-size: 1.3rem;
    padding: 1rem 2rem;
    border-bottom: 1px dashed #DDD;
}
#tag div {
    float: left;
    padding: 0.5rem 2rem;
    border: 1px #32D3C3 solid;
    border-radius: 5px;
    margin: 0.5rem 0.2rem;
    color: #32D3C3;
}
@media screen and (max-width: 768px){ 
    #tag h3{
        font-size: 1.3rem;
        padding: 1rem 2rem;
        border-bottom: 1px dashed #DDD;
    }
}
@media screen and (min-width: 768px){ 
    #tag h3{
        font-size: 1.3rem;
        padding: 1rem 2rem;
        border-bottom: 1px dashed #DDD;
        margin-bottom: 0.5rem;
    }
}
</style>