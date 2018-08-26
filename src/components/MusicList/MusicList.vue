<template>
    <div class="music-list">
        <div class="back">
            <i class="iconfont icon-fanhui" @click="$router.back()"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div class="play" v-show="songs.length" ref="playBtn" @click="random">
                    <i class="iconfont icon-bofang"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <Scroll class="list" ref="list" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll">
            <div class="song-list-wrapper">
                <SongList :songs="songs" @select="selectItem" :rank="rank"></SongList>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <Loading></Loading>
            </div>
        </Scroll>
    </div>
</template>

<script>
    import Scroll from '../../base/scroll/scroll'
    import SongList from '../../base/SongList/SongList'
    import Loading from '../../base/loading/loading'
    import {mapActions} from 'vuex'
    import {playlistMixin} from 'common/js/mixin'
    export default{
        mixins:[playlistMixin],
        props:{
            bgImage:{
                type:String,
                default:''
            },
            songs:{
                type:Array,
                default:[]
            },
            title:{
                type:String,
                default:''
            },
            rank:{
                type:Boolean,
                default:false
            }
        },
        computed:{
            bgStyle(){
                return `background:url(${this.bgImage});background-size:100%;`
            }
        },
        components:{
            Scroll,
            SongList,
            Loading
        },
        mounted(){
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight + 40
            this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
        },
        created(){
            this.probeType = 3
            this.listenScroll = true
        },
        methods:{
            scroll(pos){
                this.scrollY = pos.y
            },
            selectItem(item,index){
                //设置当前的playlist和sequence
                //根据点击的index设置currentIndex
                //设置是否开始播放
                //展示mini播放或者全屏播放
                //根据以上操作比较多，所以写一个action比较方便
                this.selectPlay({
                    list:this.songs,
                    index:index
                })
                // item.getLyrics()
            },
            random(){
                console.log("999")
                this.randomPlay({
                    list:this.songs
                })
            },
            handlePlaylist(playlist){
                const bottom = playlist.length>0?'60px':''
                this.$refs.list.$el.style.bottom = bottom
                this.$refs.list.refresh()
            },
            ...mapActions(['selectPlay','randomPlay'])
        },
        data(){
            return {
                scrollY:0
            }
        },
        watch:{
            scrollY(newY){
                let translateY = Math.max(this.minTranslateY,newY)
                let zIndex = 0
                let scale = 1
                let blur = 0
                this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
                this.$refs.layer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
                const percent = Math.abs(newY / this.imageHeight)
                if(newY>0){
                    scale = 1 + percent
                    zIndex = 10
                }else{
                    blur = Math.min(20*percent,20)
                }
                this.$refs.filter.style['backdrop-filter'] = `blue(${blur})px`
                this.$refs.filter.style['backdrop-filter'] = `blue(${blur})px`
                if(newY<this.minTranslateY){
                    zIndex = 10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = '40px'
                    this.$refs.playBtn.style.display = 'none'
                }else{
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playBtn.style.display = ''
                }
                this.$refs.bgImage.style.zIndex = zIndex
                this.$refs.bgImage.style['transform'] = `scale(${scale})`
                this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixins"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-fanhui
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: white
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-bofang
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>