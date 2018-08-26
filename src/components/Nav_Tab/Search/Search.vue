<template>
    <div class="search">
        <div class="search-box-wrapper">
            <SearchBox ref="searchBox" @query="queryChange"></SearchBox>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <Scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistroy.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="clearAllHistroy">
                                <i class="iconfont icon-lajitong"></i>
                            </span>
                        </h1>
                        <SearchHistroyList :searches="searchHistroy" @delete="deleteOne" @select="selectItem"></SearchHistroyList>
                    </div>
                    <Confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></Confirm>
                </div>
            </Scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <Suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></Suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import SearchBox from 'base/SearchBox/SearchBox'
    import Suggest from 'components/Nav_Tab/Search/Suggest/Suggest'
    import {getHotKey} from 'api/search'
    import {mapActions,mapGetters} from 'vuex'
    import SearchHistroyList from 'base/search-list/search-list'
    import Scroll from 'base/scroll/scroll'
    import {playlistMixin,searchMixin} from 'common/js/mixin'
    import Confirm from 'base/confirm/confirm'
    export default{
        mixins:[playlistMixin,searchMixin],
        data(){
            return {
                hotKey:[],
                // query:'',
                // refreshDelay:20
            }
        },
        components: {
            SearchBox,
            Suggest,
            SearchHistroyList,
            Scroll,
            Confirm
        },
        methods: {
            handlePlaylist(playlist){
                const bottom = playlist.length>0?'60px':''
                this.$refs.searchResult.style.bottom = bottom
                this.$refs.suggest.refresh()

                this.$refs.shortcutWrapper.style.bottom = bottom
                this.$refs.shortcut.refresh()
            },
            _getHotKey(){
                getHotKey().then(res=>{
                    if(res.code===0){
                        console.log(res.data.hotkey)
                        this.hotKey = res.data.hotkey.slice(0,10)
                    }
                })
            },
            // addQuery(keyWord){
            //     this.$refs.searchBox.setQuery(keyWord)
            // },
            // queryChange(query){
            //     this.query = query
            // },
            // //让input失去焦点，这样键盘就会消失
            // blurInput(){
            //     this.$refs.searchBox.blur()
            // },
            // saveSearch(){
            //     this.saveSearchHistroy(this.query)
            // },
            clearAllHistroy(){
                this.$refs.confirm.show()
            },
            confirmClear(){
                this.deleteAllHistroys()
            },
            deleteOne(item){
                this.deleteOneHistroy(item)
            },
            selectItem(item){
                console.log(item)
                this.$refs.searchBox.setQuery(item)
            },
            ...mapActions(['deleteAllHistroys']) //'deleteOneHistroy','saveSearchHistroy',
        },
        created () {
            this._getHotKey()
        },
        computed: {
            shortcut() {
                return this.hotKey.concat(this.searchHistory)
            },
            // ...mapGetters(['searchHistroy'])
        },
        watch: {
            query(newQuery) {
                if (!newQuery) {
                setTimeout(() => {
                    this.$refs.shortcut.refresh()
                }, 20)
                }
            }
        },
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixins"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-lajitong
                font-size: $font-size-medium-x
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>