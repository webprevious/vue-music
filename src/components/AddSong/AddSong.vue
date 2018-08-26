<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="tip-title">添加歌曲到列表</h1>
                <div class="close" @click="hide"> 
                    <i class="iconfont icon-cha"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <SearchBox placeholder="搜索歌曲" @query="queryChange" ref="searchBox"></SearchBox>
            </div>
            <div class="shortcut" v-show="!query">
                <Switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></Switches>
                <div class="list-wrapper">
                    <Scroll ref="songlist" v-if="currentIndex==0" :data="playHistroy" class="list-scroll">
                        <div class="list-inner">
                            <SongList :songs="playHistroy" @select="selectSong"></SongList>
                        </div>
                    </Scroll>
                    <Scroll :refreshDelay="refreshDelay" ref="histroylist" v-if="currentIndex==1" class="list-scroll" :data="searchHistroy">
                        <div class="list-inner">
                            <SearchHistroyList @delete="deleteOneHistroy" @select="selectItem" :searches="searchHistroy"></SearchHistroyList>
                        </div>
                    </Scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <Suggest @listScroll="blurInput" :query="query" :showSinger="showSinger" @select="selectSuggest"></Suggest>
            </div>
            <TopTip ref="toptip">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">1首歌曲已经添加到播放队列</span>
                </div>
            </TopTip>
        </div>
    </transition>
</template>

<script>
    import SearchBox from 'base/SearchBox/SearchBox'
    import Suggest from 'components/Nav_Tab/Search/Suggest/Suggest'
    import {searchMixin} from 'common/js/mixin'
    import Switches from 'base/Switches/Switches'
    import Scroll from 'base/scroll/scroll'
    import {mapGetters,mapActions} from 'vuex'
    import SongList from 'base/SongList/SongList'
    import Song from 'api/song'
    import SearchHistroyList from 'base/search-list/search-list'
    import TopTip from 'base/TopTip/TopTip'
    export default{
        mixins:[searchMixin],
        data () {
            return {
                showFlag:false,
                // query:'',
                showSinger:false,
                currentIndex:0,
                switches:[
                    {name:'最近播放'},
                    {name:'搜索历史'}
                ]
            }
        },
        methods: {
            selectItem(item){
                this.addQuery(item)
            },
            show(){
                this.showFlag = true
                setTimeout(()=>{
                    if(this.currentIndex==0){
                        this.$refs.songlist.refresh()
                    }else{
                        this.$refs.histroylist.refresh()
                    }
                })
            },
            hide(){
                this.showFlag = false
            },
            selectSuggest(){
                //记录搜索结果保存到搜索历史
                //使用的是mixin里面的方法
                this.saveSearch()
                this.showTip()
            },
            switchItem(index){
                this.currentIndex = index
            },
            selectSong(song,index){
                if(index!=0){
                    //因为此处的song是histroyPlay里面读取，他是存在本地缓存的，不是真正的对象实例
                    //需要将他转换成对象实例，new一下song类，引入song对象进行实例化
                    this.insertSong(new Song(song))
                    this.showTip()
                }
            },
            showTip(){
                this.$refs.toptip.show()
            },
            ...mapActions(['insertSong'])
        },
        components: {
            SearchBox,
            Suggest,
            Switches,
            Scroll,
            SongList,
            SearchHistroyList,
            TopTip
        },
        computed: {
            ...mapGetters(['playHistroy'])
        }
    }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixins"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-cha
          display: block
          padding: 12px
          font-size: 28px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: $font-size-large
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>