//此模块处理跟本地存储相关逻辑
//借用了一个第三方库ustbhuangyi/storage good-storage
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const HISTROY_PLAY_KEY = '__histroy_play__'
const HISTROY_PLAY_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200


function insertArray(arr,val,compare,maxLen){
    //compare函数就是比较新加的数据是否在之前的数组中
    const index = arr.findIndex(compare)

    // 如果是第一条数据,不做任何操作
    if(index===0){
        return
    }

    //如果是在中间的数据，删除它并且将新的插入到最开始位置
    if(index>0){
        arr.splice(index,1)
    }
    arr.unshift(val)

    //检查长度，如果长度大于规定长度，删除最后一个
    if(maxLen&&arr.length>maxLen){
        arr.pop()
    }
}

export function saveSearch(query){
    let searches = storage.get(SEARCH_KEY,[])

    //只允许最多存15条数据，最新数据都放到最前面，多余15条的删除
    //如果最新数据跟之前数据重复，把最新的数据放到最前面，旧的删除
    insertArray(searches,query,(item)=>{
        return item === query
    },SEARCH_MAX_LENGTH)

    storage.set(SEARCH_KEY,searches)

    return searches
}


//页面加载后将本地localStorage中数据同步到searchHistroy中
export function loadSearch(){
    return storage.get(SEARCH_KEY,[])
}

//删除历史
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

//保存历史播放歌曲
//存
export function saveHistroyPlay(song){
    //先读取出来
    let songs = storage.get(HISTROY_PLAY_KEY,[])

    //只允许最多存200条数据，最新数据都放到最前面，多余15条的删除
    //如果最新数据跟之前数据重复，把最新的数据放到最前面，旧的删除
    insertArray(songs,song,(item)=>{
        return item.id === song.id
    },HISTROY_PLAY_LENGTH)

    storage.set(HISTROY_PLAY_KEY,songs)

    return songs
}

//读
export function loadHistroyPlay(){
    return storage.get(HISTROY_PLAY_KEY,[])
}

//收藏相关
//存
export function saveFavorite(song){
    let songs = storage.get(FAVORITE_KEY,[])
    insertArray(songs,song,(item)=>{
        return song.id==item.id
    },FAVORITE_MAX_LENGTH)
    storage.set(FAVORITE_KEY,songs)
    return songs
}
// 删
export function deleteFavorite(song){
    let songs = storage.get(FAVORITE_KEY,[])
    deleteFromArray(songs,(item)=>{
        return song.id==item.id
    })
    storage.set(FAVORITE_KEY,songs)
    return songs
}
//读取
export function loadFavorite(){
    return storage.get(FAVORITE_KEY,[])
}