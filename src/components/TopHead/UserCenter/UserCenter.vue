<template>
    <transition name="slide">
        <div class="user-center">
            <div class="back" @click="$router.back()">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <div class="switches-wrapper">
                <Switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></Switches>
            </div>
            <div ref="playBtn" class="play-btn" @click="random">
                <i class="iconfont icon-bofang"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <Scroll ref="favoritelist" v-if="currentIndex==0" :data="favoriteList" class="list-scroll">
                    <div class="list-inner">
                        <SongList :songs="favoriteList" @select="selectSong"></SongList>
                    </div>
                </Scroll>
                <Scroll ref="histroylist" v-if="currentIndex==1" class="list-scroll" :data="playHistroy">
                    <div class="list-inner">
                        <SongList :songs="playHistroy" @select="selectSong"></SongList>
                    </div>
                </Scroll>
            </div>
            <div class="no-result-wrapper" v-show="noResult">
                <Noresult :title="noResultDesc"></Noresult>
            </div>
        </div>
    </transition>
</template>

<script>
    import Switches from 'base/Switches/Switches'
    import {mapGetters,mapActions} from 'vuex'
    import Scroll from 'base/scroll/scroll'
    import SongList from 'base/SongList/SongList'
    import Song from 'api/song'
    import {playlistMixin} from 'common/js/mixin'
    import Noresult from 'base/no-result/no-result'
    export default{
        mixins: [playlistMixin],
        components: {
            Switches,
            Scroll,
            SongList,
            Noresult
        },
        data () {
            return {
                currentIndex:0,
                switches:[
                    {name:'我喜欢的'},
                    {name:'最近听的'}
                ]
            }
        },
        methods: {
            switchItem(index){
                this.currentIndex = index
            },
            selectSong(song){
                this.insertSong(new Song(song))
            },
            random(){
                // 随机播放可能是随机播放我喜欢的或者播放历史中歌曲
                let list = this.currentIndex==0?this.favoriteList:this.playHistroy
                
                if(list.length==0){
                    return
                }
                //数据都是从本地获取，不是真正的song实例
                list = list.map((song)=>{
                    return new Song(song)
                })

                this.randomPlay({list})
            },
            handlePlaylist(playlist){
                const bottom = playlist.length>0?'60px':''
                this.$refs.listWrapper.style.bottom = bottom
                this.$refs.favoritelist && this.$refs.favoritelist.refresh()
                this.$refs.histroylist && this.$refs.histroylist.refresh()
            },
            ...mapActions(['insertSong','randomPlay'])
        },
        computed: {
            noResult(){
                if(this.currentIndex===0){
                    return !this.favoriteList.length
                }else{
                    return !this.playHistroy.length
                }
            },
            noResultDesc(){
                if(this.currentIndex===0){
                    return '暂无收藏歌曲'
                }else{
                    return '你还没有听过歌曲'
                }
            },
            ...mapGetters(['favoriteList','playHistroy'])
        }
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-fanhui
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>