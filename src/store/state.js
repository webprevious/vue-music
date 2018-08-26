import {loadSearch,loadHistroyPlay,loadFavorite} from 'common/js/cache'

export default {
    singer:{},
    playing:false,//控制播放和暂停
    fullScreen:false,//控制是否全屏或者缩小
    playList:[],//当前播放列表
    sequenceList:[],//原始播放列表
    mode:0,//播放模式，0顺序播放,1循环播放，2随机播放
    currentIndex:-1,//当前播放的索引，当前播放的歌曲可以计算出来
    disc:{},//歌单
    topList:{},//排行
    searchHistroy:loadSearch(),//搜索历史
    playHistroy:loadHistroyPlay(),//历史播放列表
    favoriteList:loadFavorite(),//收藏列表
}