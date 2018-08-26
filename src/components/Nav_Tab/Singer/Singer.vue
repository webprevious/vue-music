<template>
    <div class="singer" ref="singer">
        <div class="listview" ref="list">
            <ul ref="singerslist">
                <li class="list-group" v-for="(item,index) in singers" ref="listGroup">
                    <h2 class="list-group-title">{{item.letter}}</h2>
                    <ul ref="count">
                        <li class="list-group-item" v-for="(items,index) in item.data" @click="selectSinger(items)">
                            <img v-lazy="items.singer_pic" class="avatar">
                            <span class="name">{{items.singer_name}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
                <ul>
                    <li v-for="(item,index) in shortcutList" class="item" :index="index" :class="{current:index==newIndex}">
                        {{item}}
                    </li>
                </ul>
            </div>
            <div class="list-fixed" v-show="fixTitle" ref="fixed">
                <h1 class="fixed-title">{{fixTitle}}</h1>
            </div>
            <div class="loading-container" v-show="!singers.length">
                <Loading></Loading>
            </div>
        </div>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    var pinyin = require("pinyin")
    import {getSingerList} from '../../../api/singers'
    import {ERR_OK} from '../../../api/config'
    import BScroll from 'better-scroll'
    import {attr} from '../../../common/js/dom.js'
    import Loading from '../../../base/loading/loading.vue'
    import {mapMutations} from 'vuex'
    import {playlistMixin} from 'common/js/mixin'

    export default{
        mixins: [playlistMixin],
        data(){
            return {
                singers:[],
                tops:[],
                scrollY:0,
                touchIndex:0,
                newIndex:0,
                scrollYY:0,
                diff:-1
            }
        },
        created(){
            this._getSingerList()
        },
        methods:{
            _getSingerList(){
                getSingerList().then(res=>{
                    var temp;
                    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
                    var result = []
                    if(res.code===ERR_OK){
                        for(let i=0;i<letters.length;i++){
                            temp = {letter:letters[i],data:[]}
                            result.push(temp)
                        }
                        // console.log(result)
                        // console.log(res.singerList.data.singerlist)
                        let arr = res.singerList.data.singerlist
                        arr.forEach((item,index)=>{
                            for(let i=0;i<result.length;i++){
                                let test = pinyin(item.singer_name,{
                                    style: pinyin.STYLE_FIRST_LETTER,
                                    heteronym: false
                                }).toString().slice(0,1).toUpperCase()
                                if(test==result[i].letter){
                                    result[i].data.push(item)
                                }
                            }
                        })
                        console.log(result)
                        this.singers = result
                    }
                })
            },
            onShortcutTouchStart(e){
                // console.log(attr(e.target,'index'))
                let currentIndex = attr(e.target,'index')
                if(!currentIndex && currentIndex !=0){
                    return
                }
                this.touchY1 = e.touches[0].pageY
                this.touchIndex = currentIndex
                this.newIndex = currentIndex
                this.bs.scrollToElement(this.$refs.listGroup[currentIndex],0)
                
            },
            onShortcutTouchMove(e){
                this.touchY2 = e.touches[0].pageY
                let delta = (this.touchY2 - this.touchY1) / 18 | 0 //通过高度差确定滑动了几个字母，18是每个字母高度
                let currentIndex = parseInt(this.touchIndex) + delta
                if(currentIndex<0){
                    currentIndex = 0
                }else if(currentIndex>25){
                    currentIndex = 25
                }
                this.newIndex = currentIndex
                // console.log(currentIndex)
                this.bs.scrollToElement(this.$refs.listGroup[currentIndex],0)
            },
            getTops(){
                let tops = []
                let top = 0
                const lis = this.$refs.singerslist.getElementsByClassName('list-group')
                Array.prototype.slice.call(lis).forEach(li=>{
                    top += li.clientHeight
                    tops.push(top)
                })
                // console.log(tops)
                this.tops = tops
            },
            selectSinger(singer){
                console.log(singer)
                this.$router.push({
                    path:`/singer/${singer.singer_id}`
                })
                this.set_singer(singer)
            },
            //处理bottom
            handlePlaylist(playlist){
                const bottom = playlist.length>0?'60px':''
                this.$refs.singer.style.bottom = bottom
                if(this.bs){
                    this.bs.refresh()
                }
            },
            ...mapMutations(['set_singer'])
        },
        watch:{
            singers(value){
                this.$nextTick(()=>{
                    if(!this.bs){
                        this.bs = new BScroll('.listview',{
                            click:true,
                            probeType:3
                        })
                        this.getTops()
                        this.bs.on('scroll',({x,y})=>{
                            // console.log(x,y)
                            this.scrollYY = y
                            this.scrollY = Math.abs(y)
                            // console.log(this.currentIndexc)
                            this.newIndex = this.currentIndexc+1
                        })
                        this.bs.on('scrollEnd',({x,y})=>{
                            // console.log(x,y)
                            this.scrollYY = y
                            this.scrollY = Math.abs(y)
                            // console.log(this.currentIndexc)
                            this.newIndex = this.currentIndexc+1
                        }) 
                    }else{
                        this.bs.refresh()
                    }
                })
            },
            scrollYY(value){
                if (value > 0) {
                    this.newIndex = 0
                    return
                }
                for(let i = 0;i<this.tops.length-1;i++){
                    let h1 = this.tops[i]
                    let h2 = this.tops[i+1]
                    if(-value>0 && -value<h1){
                        this.newIndex = i
                        this.diff = h1+value
                        return
                    }
                    if(-value>h1 && -value<h2){
                        this.newIndex = i + 1
                        this.diff = h2+value
                        return
                    }
                }
                // this.newIndex = this.tops.length-2
            },
            diff(newVal){
                let fixedTop = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
                if (this.fixedTop === fixedTop) {
                return
                }
                this.fixedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            },
        },
        computed:{
            shortcutList(){
                return this.singers.map((group)=>{
                    return group.letter.substr(0,1)
                })
            },
            currentIndexc:{
                get(){
                        const {scrollY,tops} = this
                        const index = tops.findIndex((top,index)=>{
                            return scrollY >= top && scrollY < tops[index + 1]
                        })
                        return index
                    }
            },
            fixTitle:{
                // console.log(this.newIndex)
                // console.log(this.singers)
                // console.log(this.scrollYY)
               get(){
                    if(this.scrollYY>0){
                        return
                    }
                    if(this.singers.length){
                        // console.log(this.singers[this.newIndex].letter)
                        return this.singers[this.newIndex].letter
                    }
               },
               set(value){
                   return value
               }

            }
        },
        components:{
            Loading
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 48%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
  .slide-enter-active,.slide-leave-active
    transition all 0.3s
  .slide-enter,.slide-leave-to
    transform translate3d(100%,0,0)
</style>
