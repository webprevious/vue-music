<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i @click="changeMode" class="iconfont" :class="iconMode"></i>
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click="showConfirm"><i class="iconfont icon-lajitong"></i></span>
                    </h1>
                </div>
                <Scroll :refreshDelay="refreshDelay" class="list-content" :data="sequenceList" ref="listContent">
                    <transition-group name="list" tag="ul">
                        <li :key="item.id" ref="listItem" class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like">
                                <i class="iconfont" :class="getFavoriteIcon(item)" @click.stop="toggleFavorite(item)"></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <i class="iconfont icon-cha"></i>
                            </span>
                        </li>
                    </transition-group>
                    <!-- transition-group是vue提供的列表动画，要求是每个li需要加个独一无二的区别标志key -->
                </Scroll>
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <i class="iconfont icon-jia"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <Confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></Confirm>
            <AddSong ref="addSong"></AddSong>
        </div>
    </transition>
</template>

<script>
    import Scroll from 'base/scroll/scroll'
    import {mapActions} from 'vuex'
    import Confirm from 'base/confirm/confirm'
    import {playerMixin} from 'common/js/mixin'
    import AddSong from 'components/AddSong/AddSong'
    export default{
        mixins:[playerMixin],
        components: {
            Scroll,
            Confirm,
            AddSong
        },
        data () {
            return {
                showFlag:false,//控制整个playlist是否显示或者隐藏
                refreshDelay:100,//外部控制scroll组件刷新时间差默认不传是20,因为scroll里面有transition动画是大于20毫秒，20毫秒是动画还未展示完毕就刷新达不到效果
            }
        },
        methods: {
            addSong(){
                this.$refs.addSong.show()
            },
            show(){
                this.showFlag = true
                setTimeout(()=>{
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                },20)
            },
            hide(){
                this.showFlag = false
            },
            getCurrentIcon(item){
                if(this.currentSong.id==item.id){
                    return 'iconfont icon-dangqianweizhi-copy'
                }
                return ''
            },
            selectItem(item,index){
                //如果播放 模式是随机播放
                if(this.mode==2){
                    index = this.playList.findIndex((song)=>{
                        return song.id == item.id
                    })
                }

                //如果播放模式是顺序播放或者单曲循环
                this.set_current_index(index)
                this.set_playing_state(true)
            },
            scrollToCurrent(current){
                const index = this.sequenceList.findIndex((song)=>{
                    return current.id == song.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
            },
            deleteOne(item){
                this.deleteSong(item)
                if(!this.playList.length){
                    this.hide()
                }
            },
            showConfirm(){
                this.$refs.confirm.show()
            },
            confirmClear(){
                //监听点击确定清空按钮，调用action
                this.deleteSongList()
                this.hide()
            },
            // ...mapMutations(['set_current_index','set_playing_state']),
            ...mapActions(['deleteSong','deleteSongList'])
        },
        computed: {
            modeText(){
                return this.mode==0?'顺序播放':this.mode==1? '单曲循环':'随机播放'
            }
            // ...mapGetters(['sequenceList','currentSong','mode','playList'])
        },
        watch: {
            currentSong(newSong,oldSong){
                if(!this.showFlag||newSong.id==oldSong.id){
                    return
                }
                setTimeout(()=>{
                    this.scrollToCurrent(newSong)
                },20)
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixins"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .iconfont
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-lajitong
              font-size: $font-size-medium-x
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-medium
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-shoucang
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-medium
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-jia
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>