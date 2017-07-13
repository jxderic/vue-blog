<template>
    <div>
        <div id="container" v-comment:id="ArticlesId"></div>
    </div>
</template>

<script>
import Gitment from '../assets/gitment/gitment.js'
import '../assets/gitment/default.css'
export default {
    props: ['ArticlesId'],
    data () {
        return {
            
        }
    },
    mounted () {
        
    },
    directives: {
        comment: {
            bind: function(el, binding){
                const myTheme = {
                    render(state, instance) {
                        const container = document.createElement('div')
                        container.lang = "en-US"
                        container.className = 'gitment-container gitment-root-container'
                        container.appendChild(instance.renderEditor(state, instance))
                        container.appendChild(instance.renderComments(state, instance))
                        return container
                    },
                }
                var gitment = new Gitment({
                    id: binding.value,
                    owner: 'jxderic',
                    repo: 'vue-blog',
                    oauth: {
                        client_id: '5d814bb124c004d61fa0',
                        client_secret: 'e9126f74f8b22f9e0ce86bf1816dc2c5b526bbb8',
                    },
                    theme: myTheme
                })
                gitment.render(el)

            }
        }
    }
}
</script>

<style scoped>
</style>