import Vue from 'vue'
import VueRouter from 'vue-router'

//引入组件
// import Rank from '../components/Nav_Tab/Rank/Rank.vue'
// import Search from '../components/Nav_Tab/Search/Search.vue'
// import Recommend from '../components/Nav_Tab/Recommend/Recommend.vue'
// import Singer from '../components/Nav_Tab/Singer/Singer.vue'
// import Singer_detail from '../components/Nav_Tab/Singer/Singer_detail/Singer_detail.vue'
// import Disc from 'components/Nav_Tab/Recommend/Disc/Disc.vue'
// import ToplistDetail from 'components/Nav_Tab/Rank/ToplistDetail/ToplistDetail.vue'
// import User from 'components/TopHead/UserCenter/UserCenter'

//按需加载，路由懒加载
const Search = ()=>import('components/Nav_Tab/Search/Search.vue')
const Rank = ()=>import('components/Nav_Tab/Rank/Rank.vue')
const Recommend = ()=>import('components/Nav_Tab/Recommend/Recommend.vue')
const Singer = ()=>import('components/Nav_Tab/Singer/Singer.vue')
const Singer_detail = ()=>import('components/Nav_Tab/Singer/Singer_detail/Singer_detail.vue')
const Disc = ()=>import('components/Nav_Tab/Recommend/Disc/Disc.vue')
const ToplistDetail = ()=>import('components/Nav_Tab/Rank/ToplistDetail/ToplistDetail.vue')
const User = ()=>import('components/TopHead/UserCenter/UserCenter')

Vue.use(VueRouter)

export default new VueRouter({
    routes:[
        {
            path:'/rank',
            component:Rank,
            children:[
                {
                    path:'/rank/:id',
                    component:ToplistDetail
                }
            ]
        },
        {
            path:'/recommend',
            component:Recommend,
            children:[
                {
                    path:'/recommend/:id',
                    component:Disc
                }
            ]
        },
        {
            path:'/search',
            component:Search,
            children:[
                {
                    path:':id',
                    component:Singer_detail
                }
            ]
        },
        {
            path:'/singer',
            component:Singer,
            children:[
                {
                    path:'/singer/:id',
                    component:Singer_detail
                }
            ]
        },
        {
            path:'/',
            redirect:'/recommend'
        },
        {
            path:'/user',
            component:User
        }
    ]
})