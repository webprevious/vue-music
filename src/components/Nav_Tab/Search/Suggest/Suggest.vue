<template>
    <Scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <Loading v-show="hasMore" title=""></Loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore&&!result.length">
            <Noresult title="抱歉，暂无搜索结果"></Noresult>
        </div>
    </Scroll>
</template>

<script>
    import {getSearchResult} from 'api/search'
    import {createSong} from 'api/song'
    import Scroll from 'base/scroll/scroll'
    import Loading from 'base/loading/loading'
    import Singer from 'api/singers'
    import {mapMutations,mapActions} from 'vuex'
    import Noresult from 'base/no-result/no-result'
    export default{
        props: {
            query:{
                type:String,
                default:''
            },
            showSinger:{
                type:Boolean,
                default:true
            }
        },
        watch: {
            query(){
                this.search()
            }
        },
        methods: {
            search(){
                this.page = 1
                this.hasMore = true
                this.$refs.suggest.scrollTo(0,0)
                getSearchResult(this.query,this.page,this.showSinger).then(res=>{
                    if(res.code===0){
                        console.log(res)
                        this.result = this._processResult(res.data)
                        console.log(this.result)
                        this._checkMore(res.data)
                    }
                })
            },
            _processResult(data){
                let ret = []
                if(data.zhida&&data.zhida.singerid&&this.isFirst){
                    ret.push({...data.zhida,...{type:'singer'}})
                    this.isFirst = false
                }
                if(data.song){
                    ret = ret.concat(this._normalizeSongs(data.song.list))
                }
                return ret
            },
            _normalizeSongs(list){
                let ret = []
                list.forEach(musicData=>{
                    if(musicData.songid&&musicData.albummid){
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            },
            getIconCls(item){
                if(item.type==='singer'){
                    return 'iconfont icon-wode_1-copy'
                }else{
                    return 'iconfont icon-icondemofuzhifuzhi'
                }
            },
            getDisplayName(item){
                if(item.type==='singer'){
                    return item.singername
                }else{
                    return `${item.name}-${item.singer}`
                }
            },
            //监听到到scroll组件派发出来的滑到了底部的信息，然后进行加载第二页请求
            searchMore(){
                if(!this.searchMore){
                    return
                }
                this.page ++
                getSearchResult(this.query,this.page,this.showSinger).then(res=>{
                    if(res.code===0){
                        this.result = this.result.concat(this._processResult(res.data))
                        this._checkMore(res.data)
                    }
                })
            },
            //检查是否还有更多数据
            _checkMore(data){
                const song = data.song
                if(!song.list.length||(song.curnum+song.curpage*20)>song.totalnum){
                    this.hasMore = false
                }
            },
            selectItem(item){
                console.log(item)
                if(item.type=='singer'){
                    const singer = new Singer({
                        singer_id:item.singerid,
                        singer_name:item.singername,
                        singer_mid:item.singermid
                    })
                    this.$router.push({
                        path:`/search/${singer.singer_mid}`
                    })
                    this.set_singer(singer)
                }else{
                    this.insertSong(item)
                }
                //suggest组件不负责保存历史，保存历史是他父组件的工作
                this.$emit('select')
            },
            listScroll(){
                this.$emit('listScroll')
            },
            refresh(){
                this.$refs.suggest.refresh()
            },
            ...mapMutations(['set_singer']),
            ...mapActions(['insertSong'])
        },
        data () {
            return {
                page:1,
                result:[],
                pullup:true,
                beforeScroll:true,//监视搜索后的列表是否滚动作为参数传入scroll组件
                hasMore:true,//记录标明是否加载完毕，是否还有
                isFirst:true,//记录是不是第一次搜到歌手
            }
        },
        components: {
            Scroll,
            Loading,
            Noresult
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixins"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>