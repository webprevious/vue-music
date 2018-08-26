<template>
    <div class="player" v-show="playList.length">
        <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="iconfont icon-fanhui"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdCls">
                                <img class="image" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines" @click="alert('1')">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine" class="text" :class="{'current':currentLineNum==index}" v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                            </div>
                        </div>
                    </Scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{formate(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <Progress :percent="percent" @percentChange="onProgressBarChange"></Progress>
                        </div>
                        <span class="time time-r">{{formate(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i class="iconfont" :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i class="iconfont icon-qianjin1" @click="prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i class="iconfont" @click="togglePlaying" :class="playicon"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i class="iconfont icon-qianjin" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i @click="toggleFavorite(currentSong)" class="iconfont" :class="getFavoriteIcon(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :class="cdCls" width="40" height="40" :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <ProgressCircle :radius="32" :percent="percent">
                        <i class="icon-mini" :class="miniPlayicon" @click.stop="togglePlaying"></i>
                    </ProgressCircle>
                </div>
                <div class="control" @click.stop="showPlayList">
                    <i class="iconfont icon-bofangliebiao"></i>
                </div>
            </div>
        </transition>
        <PlayList ref="playlist"></PlayList>
        <audio @ended="end" @timeupdate="updateTime" ref="myplay" :src="currentSong.url" @play="ready" @error="error"></audio>
    </div>
</template>

<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    import animations from 'create-keyframe-animation'
    import {prefixStyle} from '../../common/js/dom'
    // import {shuffle} from '../../common/js/utils'
    import Progress from '../../base/progress-bar/progress-bar'
    import Scroll from '../../base/scroll/scroll'
    import ProgressCircle from '../../base/progress-circle/progress-circle'
    import Lyric from 'lyric-parser'
    const transform = prefixStyle('transform')
    const transitionDuration = prefixStyle('transitionDuration')
    import PlayList from 'components/PlayList/PlayList'
    import {playerMixin} from 'common/js/mixin'
    
    export default{
        mixins:[playerMixin],
        computed:{
            percent(){
                return this.currentTime/this.currentSong.duration
            },
            disableCls(){
                return this.isready?'':'disable'
            },
            cdCls(){
                return this.playing?'play':'play pause'
            },
            playicon(){
                return this.playing?'icon-zanting':'icon-kaishi'
            },
            miniPlayicon(){
                return this.playing?'iconfont icon-zanting':'iconfont icon-kaishi'
            },
            ...mapGetters(['fullScreen','playing','currentIndex']) //,'currentSong','mode','sequenceList','playList'
        },
        created(){
            console.log(this.currentSong)
            this.touch = {}
        },
        methods:{
            end(){
                if(this.mode==1){
                    this.loop()
                }else{  
                    this.next()
                }
            },
            loop(){
                this.$refs.myplay.currentTime = 0
                this.$refs.myplay.play()
                if(this.currentLyric){
                    this.currentLyric.seek(0)
                }
            },
            ready(){
                this.isready = true
                //从歌曲播放开始记录播放历史列表
                this.savePlayHistroy(this.currentSong)
            },
            error(){
                //媒体加载失败，url无效
                this.isready = true
            },
            next(){
                if(!this.isready){
                    return
                }
                //处理歌曲播放列表只有一首歌曲时边界情况
                if(this.playList.length===1){
                    this.loop()
                    return
                }else{
                    let index = this.currentIndex + 1
                    if(index===this.playList.length){
                        index = 0
                    }
                    this.set_current_index(index)
                    if(!this.playing){
                        this.togglePlaying()
                    }
                }
                this.isready = false
            },
            prev(){
                if(!this.isready){
                    return
                }
                //处理歌曲播放列表只有一首歌曲时边界情况
                if(this.playList.length===1){
                    this.loop()
                    return
                }else{
                    let index = this.currentIndex - 1
                    console.log(index)
                    if(index===-1){
                        index = this.playList.length - 1
                    }
                    console.log(index)
                    this.set_current_index(index)
                    if(!this.playing){
                        this.togglePlaying()
                    }
                }
                this.isready = false
            },
            back(){
                this.set_full_screen(false)
                console.log("666")
            },
            open(){
                this.set_full_screen(true)
            },
            enter(el,done){
                const {x,y,scale} = this._getPosAndScale()
                let animation = {
                    0:{
                        transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60:{
                        transform:`translate3d(0,0,0) scale(1.1)`
                    },
                    100:{
                        transform:`translate3d(0,0,0) scale(1)`
                    }
                }
                animations.registerAnimation({
                    name:'move',
                    animation,
                    presets:{
                        duration:400,
                        easing:'linear'
                    }
                })
                animations.runAnimation(this.$refs.cdWrapper,'move',done)//done参数是个回调函数，执行完毕后会自动跳到afterEnter
            },
            afterEnter(){
                animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation = ''
            },
            leave(el,done){
                this.$refs.cdWrapper.style.transition = 'all 0.4s'
                const {x,y,scale} = this._getPosAndScale()
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
                this.$refs.cdWrapper.addEventListener('transitionend',done)//监听动画完成，执行回调函数done自动跳到afterLeave
            },
            afterLeave(){
                this.$refs.cdWrapper.style.transition = ''
                this.$refs.cdWrapper.style[transform] = ''
            },
            _getPosAndScale(){
                const targetWidth = 40
                const paddingLeft = 40
                const paddingBottom = 30
                const paddingTop = 80
                const width = window.innerWidth * 0.8
                const scale = targetWidth / width
                const x = -(window.innerWidth / 2 - paddingLeft)
                const y = window.innerHeight - paddingTop - width / 2 -paddingBottom
                return{
                    x,y,scale
                }
            },
            togglePlaying(){
                if(!this.isready){
                    return
                }
                this.set_playing_state(!this.playing)
                if(this.currentLyric){
                    this.currentLyric.togglePlay()
                }
            },
            updateTime(e){
                //播放器当前的播放时间
                this.currentTime = e.target.currentTime
            },
            formate(interval){
                interval = interval | 0 //或0相当于向下取整
                const minute = interval/60 | 0
                const second = this._pad(interval%60)
                return `${minute}:${second}` 
            },
            // changeMode(){
            //     // 播放模式，0顺序播放,1循环播放，2随机播放
            //     const mode = (this.mode+1)%3
            //     this.set_play_mode(mode)
            //     let list = null
            //     if(mode===2){
            //         list = shuffle(this.sequenceList)
            //     }else{
            //         list = this.sequenceList
            //     }
            //     this.resetCurrentIndex(list)
            //     this.set_playlist(list)
            // },
            // resetCurrentIndex(list){
            //     let index = list.findIndex(item=>{
            //         return item.id === this.currentSong.id
            //     })
            //     this.set_current_index(index)
            // },
            _pad(num,n=2){
                let len = num.toString().length
                while(len<n){
                    num = '0'+num
                    len++
                }
                return num
            },
            onProgressBarChange(percent){
                this.$refs.myplay.currentTime = this.currentSong.duration * percent
                if(!this.playing){
                    this.togglePlaying()
                }
                if(this.currentLyric){
                    this.currentLyric.seek(this.$refs.myplay.currentTime*1000)
                }
            },
            handleLyric({lineNum,txt}){
                this.currentLineNum = lineNum
                if(lineNum>5){
                    let lineEl = this.$refs.lyricLine[lineNum-5]
                    this.$refs.lyricList.scrollToElement(lineEl,1000)
                }else{
                    this.$refs.lyricList.scrollTo(0,0,1000)
                }
                this.playingLyric = txt
            },
            middleTouchStart(e){
                this.touch.initiated = true
                this.touch.startX = e.touches[0].pageX
                this.touch.startY = e.touches[0].pageY
            },
            middleTouchMove(e){
                if(!this.touch.initiated){
                    return
                }
                let deltaX = e.touches[0].pageX - this.touch.startX
                let deltaY = e.touches[0].pageY - this.touch.startY
                if(Math.abs(deltaY)>Math.abs(deltaX)){
                    return
                }
                const left = this.currentShow=='cd'?0:-window.innerWidth
                const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX))
                this.touch.percent = Math.abs(offsetWidth/window.innerWidth)
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = 0
                this.$refs.middleL.style.opacity = 1-this.touch.percent
                this.$refs.middleL.style[transitionDuration] = 0
            },
            middleTouchEnd(e){
                let offsetWidth
                let opacity
                if(this.currentShow==='cd'){
                    if(this.touch.percent>0.1){
                        offsetWidth = -window.innerWidth
                        opacity = 0
                        this.currentShow = 'lyric'
                    }else{
                        offsetWidth = 0
                        opacity = 1
                    }
                }else{
                    if(this.touch.percent<0.9){
                        offsetWidth = 0
                        this.currentShow = 'cd'
                        opacity = 1
                    }else{
                        offsetWidth = -window.innerWidth
                        opacity = 0
                    }
                }
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
                this.$refs.lyricList.$el.style[transitionDuration] = '400ms'
                this.$refs.middleL.style.opacity = opacity
                this.$refs.middleL.style[transitionDuration] = '400ms'
            },
            showPlayList(){
                this.$refs.playlist.show()
            },
            _getLyrics(){
                clearTimeout(this.timer)
                this.currentSong.getLyrics().then((res)=>{
                    // console.log(res)
                    // clearTimeout(this.timer)
                    //防止切换太快，歌词错乱对不上
                    if(this.currentSong.lyric !== res){
                        return
                    }

                    this.currentLyric = new Lyric(res,this.handleLyric)
                    if(this.playing){
                        this.currentLyric.play()
                    }
                    // console.log(this.currentLyric)
                }).catch(()=>{
                    this.currentLyric=null
                    this.playingLyric=''
                    this.currentLineNum=0
                })
            },
            ...mapMutations(['set_full_screen']), //,'set_playing_state','set_current_index','set_play_mode','set_playlist'
            ...mapActions(['savePlayHistroy'])
        },
        watch:{
            playList(newvalue){
                console.log(newvalue)
            },
            currentSong(newSong,oldSong){
                //当歌曲全部被删除，newSong会发生变化但是已经没有歌曲，就会undefined
                if(!newSong.id){
                    return
                }
                console.log(newSong)
                if(newSong.id===oldSong.id){
                    return
                }
                if(this.currentLyric){
                    this.currentLyric.stop()
                    this.currentTime = 0
                    this.playingLyric = ''
                    this.currentLineNum = 0
                }
                //使用nextTick如果浏览器切换到了后台他是不会继续js代码的
                //解决办法是换成setTimeout
                clearTimeout(this.timer)
                this.timer = setTimeout(()=>{
                    this.$refs.myplay.play()
                    this._getLyrics()
                },1000)
                // this.$nextTick(()=>{
                //     console.log('123')
                //     this.$refs.myplay.play()
                //     this._getLyrics()
                // })
            },
            playing(newValue){
                let audio = this.$refs.myplay
                this.$nextTick(()=>{
                    newValue?audio.play() : audio.pause()
                    this._getLyrics()
                })
            },
            
        },
        data () {
            return {
                isready:false,
                currentTime:0,
                currentLyric:null,
                currentLineNum:0,
                currentShow:'cd',
                playingLyric:''
            }
        },
        components: {
            Progress,
            ProgressCircle,
            Scroll,
            PlayList,
            
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixins"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: 160
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 500
          .icon-fanhui
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        z-index 600
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        z-index: 200
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-shoucang
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-zanting, .icon-kaishi, .icon-bofangliebiao
          /* z-index: 200 */
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>