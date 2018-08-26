<template>
    <div id="app">
        <TopHead></TopHead>
        <NavTab></NavTab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <Player></Player>        
    </div>
</template>

<script>
    import TopHead from './components/TopHead/TopHead.vue'
    import NavTab from './components/Nav_Tab/Nav_Tab.vue'
    import Player from './components/Player/Player.vue'
    export default{
        components:{
            TopHead,
            NavTab,
            Player
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    
</style>