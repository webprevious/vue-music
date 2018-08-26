<template>
    <transition name="slide">
        <MusicList :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></MusicList>
    </transition>
</template>

<script>
    import MusicList from 'components/MusicList/MusicList'
    import {mapGetters} from 'vuex'
    import {createSong} from 'api/song'
    import {getToplistSongs} from 'api/rank'
    export default {
        components:{
            MusicList
        },
        computed: {
            title(){
                return this.topList.topTitle
            },
            bgImage(){
                if(this.songs.length){
                    return this.songs[0].image
                }
                return ''
            },
            ...mapGetters(['topList'])
        },
        data () {
            return {
                songs:[],
                rank:true
            }
        },
        methods: {
            _getToplistSongs(){
                if(!this.topList.id){
                    this.$router.back()
                    return
                }
                getToplistSongs(this.topList.id).then(res=>{
                    if(res.code===0){
                        console.log(res.songlist)
                        this.songs = this._normalizeSongs(res.songlist)
                        console.log(this.songs)
                    }
                })
            },
            _normalizeSongs(list){
                let ret = []
                list.forEach(item=>{
                    let musicData = item.data
                    if(musicData.songid&&musicData.albumid){
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        created () {
            this._getToplistSongs()
        }
    }
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
    .slide-enter-active,.slide-leave-active
        transition all 0.3s
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)
</style>