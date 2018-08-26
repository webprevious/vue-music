<template>
    <div class="recommend" ref="content">
        <div class="recommend-content">
            <div id="sliders">
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(slider,index) in sliders" :key="index">
                            <a :href="slider.linkUrl">
                                <img :src="slider.picUrl" alt="" class="slider-img">
                            </a>
                        </div>
                    </div>
                    <!-- 如果需要分页器 -->
                    <div class="swiper-pagination"></div>
                </div>
            </div>
            <div class="wrapper" ref="wrapper">
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul class="musiclist">
                        <li v-for="item in musicLists" class="item" @click="selectItem(item)">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.imgurl">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="loading-container" v-show="!musicLists.length">
                    <Loading></Loading>
                </div>
            </div>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {getRecommend,getMusicList} from '../../../api/recommend'
    import {ERR_OK} from '../../../api/config'
    import Swiper from 'swiper'
    import 'swiper/dist/css/swiper.min.css'
    import BScroll from 'better-scroll'
    import Loading from '../../../base/loading/loading.vue'
    import {playlistMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'
    export default{
        mixins: [playlistMixin],
        created(){
            this._getRecommend()
            this._getMusicList()  
        },
        mounted(){

        },
        methods:{
            _getRecommend(){
                getRecommend().then((res)=>{
                    if(res.code===ERR_OK){
                        console.log(res.data.slider)
                        this.sliders = res.data.slider
                    }
                })
            },
            _getMusicList(){
                getMusicList().then((res)=>{
                    console.log(res)
                    this.musicLists = res.data.list
                    console.log(this.musicLists)
                }).catch((err)=>{
                    console.log(err)
                })
            },
            //处理bottom
            handlePlaylist(playlist){
                const bottom = playlist.length>0?'60px':''
                this.$refs.content.style.bottom = bottom
                if(this.scroll){
                    this.scroll.refresh()
                }
            },
            //跳转歌单详情
            selectItem(item){
                console.log(item)
                this.$router.push({path:'/recommend/'+item.dissid})
                this.set_disc(item)
            },
            ...mapMutations(['set_disc'])
        },
        data(){
            return{
                sliders:[],
                musicLists:[]
            }
        },
        watch:{
            sliders(value){
                this.$nextTick(()=>{
                    new Swiper('.swiper-container',{
                        loop:true,
                        pagination:{
                            el:".swiper-pagination"
                        },
                        autoplay:true
                    })
                })
            },
            musicLists(value){
                console.log(value)
                this.$nextTick(()=>{
                   if(!this.scroll){
                       this.scroll = new BScroll('.wrapper',{
                           click:true
                       })
                   }else if(!this.refs.wrapper){
                       return
                   }else{
                        this.scroll.refresh()
                   }
                })
            }
        },
        components:{
            Loading
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
  .slider-img
    width 100%
    height 100%
  .wrapper{
      height: 74%
      width 100%
  }
</style>