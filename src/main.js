import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import './common/stylus/index.styl'

import VueLazyLoad from 'vue-lazyload'
import loading from './common/images/loading.png'
Vue.use(VueLazyLoad,{
    loading
})


new Vue({
    el:'#app',
    router,
    store,
    render:h=>h(App)
})