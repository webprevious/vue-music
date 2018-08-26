<template>
  <MusicList :songs="songs" :title="title" :bgImage="bgImage"></MusicList>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from '../../../../api/singers'
  import {createSong} from '../../../../api/song'
  import MusicList from '../../../MusicList/MusicList.vue'
  export default{
    computed:{
      title(){
        return this.singer.singer_name
      },
      bgImage(){
        return this.singer.singer_pic
      },
      ...mapGetters(['singer'])
    },
    created(){
      console.log(this.singer)
      this._getDetail()
    },
    methods:{
      _getDetail(){
        if(!this.singer.singer_mid){
          this.$router.push({path:'/singer'})
          return
        }
        getSingerDetail(this.singer.singer_mid).then(res=>{
          if(res.code===0){
            console.log(res.data.list)
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list){
        let ret = []
        list.forEach(item=>{
          let {musicData} = item
          if(musicData.songid && musicData.albummid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    data(){
      return{
        songs:[]
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../../../common/stylus/variable'
    
</style>

