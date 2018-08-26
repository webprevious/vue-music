import {SET_SINGER,SET_PLAYING_STATE,SET_FULL_SCREEN,SET_PLAYLIST,SET_SEQUENCE_LIST,SET_PLAY_MODE,SET_CURRENT_INDEX, SET_SEARCHHISTROY, SET_PLAYHISTROY, SET_FAVORITELIST} from './mutation-types'
import {shuffle} from '../common/js/utils'
import {saveSearch,clearSearch,deleteSearch,saveHistroyPlay,saveFavorite,deleteFavorite} from '../common/js/cache'

function findIndex(list,song){
    return list.findIndex(item=>{
        return item.id===song.id
    })
}

export default{
    selectPlay({commit,state},{list,index}){
        commit(SET_SEQUENCE_LIST,list)
        //根据播放模式不同进行不同的list处理
        if(state.mode ===2){
            let randomList = shuffle(list)
            commit(SET_PLAYLIST,randomList)
            index = findIndex(randomList,list[index])
        }else{
            commit(SET_PLAYLIST,list)
        }             
        commit(SET_CURRENT_INDEX,index)
        commit(SET_FULL_SCREEN,true)
        commit(SET_PLAYING_STATE,true)
    },
    randomPlay({commit},{list}){
        commit(SET_PLAY_MODE,2)
        commit(SET_SEQUENCE_LIST,list)
        let randomList = shuffle(list)
        commit(SET_PLAYLIST,randomList)
        commit(SET_CURRENT_INDEX,0)
        commit(SET_FULL_SCREEN,true)
        commit(SET_PLAYING_STATE,true)
    },
    //当在搜索页面搜索歌曲点击播放时，需要把点击的这首歌曲添加到播放列表playList中
    //如果当前播放列表有这首歌曲，还要把之前的删了，currentIndex也会改变
    insertSong({commit,state},song){
        //vue中建议不要在除了mutations之外的地方修改数据，会警告，解决办法copy一个副本进行操作
        let playList = state.playList.slice()
        let sequenceList = state.sequenceList.slice()
        let currentIndex = state.currentIndex
        //记录当前歌曲
        let currentSong = playList[currentIndex]

        //判断当前列表是否有这首歌曲，并返回索引
        let fpIndex = findIndex(playList,song)

        //因为是插入歌曲所以索引+1
        currentIndex++
        // 插入歌曲到当前索引位置
        playList.splice(currentIndex,0,song)

        // 已经有这首歌，那就要把找到的这首歌删了
        if(fpIndex>-1){
            //如果当前插入的索引大于之前的列表中的索引
            if(currentIndex>fpIndex){
                playList.splice(fpIndex,1)
                currentIndex--
            }else{
                playList.splice(fpIndex+1,1)
            }
        }

        //当前歌曲在原始播放列表sequenceList中的位置索引
        let seqCurrentIndex = findIndex(sequenceList,currentSong)+1

        // 检查之前的原始播放列表是否有这首歌曲
        let fsIndex = findIndex(sequenceList,song)

        sequenceList.splice(seqCurrentIndex,0,song)

        if(fsIndex>-1){
            //如果当前插入的索引大于之前的列表中的索引
            if(seqCurrentIndex>fsIndex){
                sequenceList.splice(fsIndex,1)
            }else{
                sequenceList.splice(fsIndex+1,1)
            }
        }

        commit(SET_PLAYLIST,playList)
        commit(SET_SEQUENCE_LIST,sequenceList)
        commit(SET_CURRENT_INDEX,currentIndex)
        commit(SET_FULL_SCREEN,true)
        commit(SET_PLAYING_STATE,true)
    },

    //保存历史搜索，并且共享到其他组件，还需要保存到本地localStorage刷新不丢失
    saveSearchHistroy({commit},query){
        commit(SET_SEARCHHISTROY,saveSearch(query))
    },
    //删除歌曲,单曲删除
    deleteSong({commit,state},song){
        //获取当前信息
        let playList = state.playList.slice()
        let sequenceList = state.sequenceList.slice()
        let currentIndex = state.currentIndex

        let pIndex = findIndex(playList,song)
        playList.splice(pIndex,1)
        let sIndex = findIndex(sequenceList,song)
        sequenceList.splice(sIndex,1)

        if(currentIndex>pIndex||currentIndex===playList.length){
            currentIndex--
        }
        commit(SET_PLAYLIST,playList)
        commit(SET_SEQUENCE_LIST,sequenceList)
        commit(SET_CURRENT_INDEX,currentIndex)
        
        if(!playList.length){
            commit(SET_PLAYING_STATE,false)
        }else{
            commit(SET_PLAYING_STATE,true)
        }
    },
    //删除所有歌曲，相当初始化，全部置空
    deleteSongList({commit}){
        commit(SET_PLAYLIST,[])
        commit(SET_SEQUENCE_LIST,[])
        commit(SET_CURRENT_INDEX,-1)
        commit(SET_PLAYING_STATE,false)
    },
    //删除所有搜索历史
    deleteAllHistroys({commit}){
        commit(SET_SEARCHHISTROY,clearSearch())
    },
    //删除单条记录
    deleteOneHistroy({commit},query){
        commit(SET_SEARCHHISTROY,deleteSearch(query))
    },
    //保存播放历史列表歌曲
    savePlayHistroy({commit},song){
        //因为歌曲还需要保存到本地，去cache中注册一个key
        commit(SET_PLAYHISTROY,saveHistroyPlay(song))
    },
    //保存收藏
    saveFavoriteList({commit},song){
        commit(SET_FAVORITELIST,saveFavorite(song))
    },
    //删除收藏
    deleteFavoriteList({commit},song){
        commit(SET_FAVORITELIST,deleteFavorite(song))
    }
}