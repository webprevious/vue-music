import {commonParams} from './config'
import axios from 'axios'
import {Base64} from 'js-base64'

export default class Song{
    constructor({id,mid,singer,name,album,duration,image,url}){
        this.id = id
        this.mid = mid
        this.singer =singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    getLyrics(){
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve,reject)=>{
            getLyric(this.mid).then(res=>{
                if(res.retcode==0){
                    this.lyric = Base64.decode(res.lyric)
                    // console.log(this.lyric)
                    resolve(this.lyric)
                }else{
                    reject('no lyric')
                }
            })
        })
        
    }
}

export function createSong(musicData){
    return new Song({
        id:musicData.songid,
        mid:musicData.songmid,
        singer:filterSinger(musicData.singer),
        name:musicData.songname,
        album:musicData.albumname,
        duration:musicData.interval,
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg`,
        url:`http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
    })
}

function filterSinger(singer){
    let ret = []
    if(!singer){
        return ""
    }
    singer.forEach(item=>{
        ret.push(item.name)
    })
    return ret.join('/')
}

function getLyric(mid){
    const url = '/api/lyric'

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    }) 

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


export function getDiscSongs(discid){
    const url = '/api/getDiscSongs'

    const data = Object.assign({}, commonParams, {
        type:1,
        json:1,
        onlysong:0,
        disstid:discid,
        utf8:1,
        g_tk:5381,
        loginUin:0,
        hostUin:0,
        platform: 'yqq',
        needNewCode: 0,
        format: 'json'
    }) 

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


