<template>
    <transition name="slide">
        <MusicList :title="title" :bgImage="bgImage" :songs="songs"></MusicList>
    </transition>
</template>

<script>
    import MusicList from 'components/MusicList/MusicList'
    import {mapGetters} from 'vuex'
    import {getDiscSongs,createSong} from 'api/song'
    export default {
        created () {
            this._getDiscSongs()
        },
        methods: {
            _getDiscSongs(){
                if(!this.disc.dissid){
                    this.$router.back()
                    return
                }
                getDiscSongs(this.disc.dissid).then(res=>{
                    if(res.code===0){
                        console.log(res)
                        this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                        console.log(this.songs)
                    }
                })
            },
            _normalizeSongs(list){
                let ret = []
                console.log('1')
                list.forEach((musicData)=>{
                    if(musicData.songid&&musicData.albumid){
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }  
        },
        components:{
            MusicList
        },
        computed: {
            title(){
                return this.disc.dissname
            },
            bgImage(){
                return this.disc.imgurl
            },
            ...mapGetters(['disc'])
        },
        data(){
            return {
                songs:[]
            }
        }
    }
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
    .slide-enter-active,.slide-leave-active
        transition all 0.3s
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)
</style>