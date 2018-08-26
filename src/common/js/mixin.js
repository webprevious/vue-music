//在vue开发中，如果多个组件都需要使用到相同的逻辑，可以把他们写到一起，
//不仅可以复用还可以共享当前信息，
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {shuffle} from 'common/js/utils'

export const playlistMixin = {
    computed: {
        ...mapGetters(['playList'])
    },
    mounted () {
        this.handlePlaylist(this.playList)
    },
    activated () {
        this.handlePlaylist(this.playList)
    },
    watch: {
        playList(newValue){
            this.handlePlaylist(newValue)
        }
    },
    methods: {
        //当有播放列表时要处理bottom
        handlePlaylist(){
            throw new Error('component must implement hanlePlaylist methods')
        }
    }
}

export const playerMixin = {
    computed: {
        iconMode(){
            return this.mode===0?'icon-ttpodicon-copy':this.mode===1?'icon-danquxunhuanbofang':'icon-icon7'
        },
        ...mapGetters(['sequenceList','currentSong','mode','playList','favoriteList'])
    },
    methods: {
        changeMode(){
            // 播放模式，0顺序播放,1循环播放，2随机播放
            const mode = (this.mode+1)%3
            this.set_play_mode(mode)
            let list = null
            if(mode===2){
                list = shuffle(this.sequenceList)
            }else{
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.set_playlist(list)
        },
        resetCurrentIndex(list){
            let index = list.findIndex(item=>{
                return item.id === this.currentSong.id
            })
            this.set_current_index(index)
        },
        getFavoriteIcon(song){
            if(this.isFavorite(song)){
                return 'icon-shoucang'
            }
            return 'icon-shoucang-not'
        },
        toggleFavorite(song){
            if(this.isFavorite(song)){
                this.deleteFavoriteList(song)
            }else{
                this.saveFavoriteList(song)
            }
        },
        isFavorite(song){
            const index = this.favoriteList.findIndex((item)=>{
                return item.id==song.id
            })
            return index>-1
        },
        ...mapActions(['saveFavoriteList','deleteFavoriteList']),
        ...mapMutations(['set_playing_state','set_current_index','set_play_mode','set_playlist'])
    }
}

export const searchMixin = {
    data () {
        return {
            query:'',
            refreshDelay:100
        }
    },
    computed: {
        ...mapGetters(['searchHistroy'])
    },
    methods: {
        //让input失去焦点，这样键盘就会消失
        blurInput(){
            this.$refs.searchBox.blur()
        },
        saveSearch(){
            this.saveSearchHistroy(this.query)
        },
        queryChange(query){
            this.query = query
        },
        addQuery(keyWord){
            this.$refs.searchBox.setQuery(keyWord)
        },
        ...mapActions(['saveSearchHistroy','deleteOneHistroy'])
    }
} 

