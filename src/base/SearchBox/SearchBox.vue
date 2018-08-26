<template>
    <div class="search-box">
        <i class="iconfont icon-search"></i>
        <input type="text" class="box" :placeholder="placeholder" v-model="query" ref="query">
        <i class="iconfont icon-x-copy" v-show="query" @click="clear"></i>
    </div>
</template>

<script>
    import {debounce} from 'common/js/utils'
    export default{
        props:{
            placeholder:{
                type:String,
                default:'搜索歌曲、歌手'
            }
        },
        data () {
            return {
                query:""
            }
        },
        methods: {
            clear(){
                this.query = ''
            },
            setQuery(query){
                this.query = query
            },
            blur(){
                this.$refs.query.blur()
            }
        },
        created () {
            //监视query变化，不使用watch，但跟watch功能一样
            //告诉外部我的query变了
            this.$watch('query',debounce((newQuery)=>{
                this.$emit('query',newQuery)
            },200))
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      outline none
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-x-copy
      font-size: 16px
      color: $color-background
</style>