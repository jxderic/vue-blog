import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'
import articleList from './component/ArticleList.vue'
import articleEdit from './component/ArticleEdit.vue'
import articleLabel from './component/ArticleLabel.vue'
import personalCenter from './component/PersonalCenter.vue'
import articlePreview from './component/ArticlePreview.vue'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.prototype.$http = axios

const router = new VueRouter({
  routes: [
    {path: '/', component: personalCenter},
    {path: '/articleList', component: articleList,
      children: [
        {path: 'articleEdit', component: articleEdit},
        {path: 'articlePreview:id', component: articlePreview}
      ]
    },
    {path: '/articleLabel', component: articleLabel},
    {path: '/personalCenter', component: personalCenter}
  ]
})

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
