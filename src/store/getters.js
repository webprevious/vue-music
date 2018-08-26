//通常有些人喜欢从getters里面拿数据
export default{
    singer(state){
        return state.singer
    },
    fullScreen(state){
        return state.fullScreen
    },
    playList(state){
        return state.playList
    },
    playing(state){
        return state.playing
    },
    sequenceList(state){
        return state.sequenceList
    },
    mode(state){
        //播放模式，0顺序播放,1循环播放，2随机播放
        return state.mode
    },
    currentIndex(state){
        return state.currentIndex
    },
    currentSong(state){
        return state.playList[state.currentIndex] || {}
    },
    disc(state){
        return state.disc
    },
    topList(state){
        return state.topList
    },
    searchHistroy(state){
        return state.searchHistroy
    },
    playHistroy(state){
        return state.playHistroy
    },
    favoriteList(state){
        return state.favoriteList
    }
}