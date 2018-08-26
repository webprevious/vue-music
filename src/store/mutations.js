import {SET_SINGER,SET_PLAYING_STATE,SET_FULL_SCREEN,SET_PLAYLIST,SET_SEQUENCE_LIST,SET_PLAY_MODE,SET_CURRENT_INDEX, SET_DISC, SET_TOPLIST, SET_SEARCHHISTROY, SET_PLAYHISTROY, SET_FAVORITELIST} from './mutation-types'

export default{
    [SET_SINGER](state,singer){
        state.singer = singer
    },
    [SET_PLAYING_STATE](state,flag){
        state.playing = flag
    },
    [SET_FULL_SCREEN](state,flag){
        state.fullScreen = flag
    },
    [SET_PLAYLIST](state,list){
        state.playList = list
    },
    [SET_SEQUENCE_LIST](state,list){
        state.sequenceList = list
    },
    [SET_PLAY_MODE](state,mode){
        state.mode = mode
    },
    [SET_CURRENT_INDEX](state,index){
        state.currentIndex = index
    },
    [SET_DISC](state,disc){
        state.disc = disc
    },
    [SET_TOPLIST](state,topList){
        state.topList = topList
    },
    [SET_SEARCHHISTROY](state,searchHistroy){
        state.searchHistroy = searchHistroy
    },
    [SET_PLAYHISTROY](state,playHistroy){
        state.playHistroy = playHistroy
    },
    [SET_FAVORITELIST](state,favoriteList){
        state.favoriteList = favoriteList
    },
}