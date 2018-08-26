import jsonp from '../common/js/jsonp.js'
import {commonParams,options} from './config.js'

export function getSingerList() {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?callback=getUCGI1113598034848069&g_tk=5381&jsonpCallback=getUCGI1113598034848069&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A10000%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22area%22%3A-100%2C%22sex%22%3A-100%2C%22genre%22%3A-100%2C%22index%22%3A-100%2C%22sin%22%3A0%2C%22cur_page%22%3A1%7D%7D%7D'
  
    const data = {}
  
    return jsonp(url, data, {})
  }

export function getSingerDetail(singerId){
  const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=5381&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&singermid=${singerId}&order=listen&begin=0&num=100&songstatus=1`

  const data = {}

  return jsonp(url,data,options)
}


//歌手类
export default class Singer {
  constructor({singer_id, singer_name,singer_mid}) {
    this.singer_mid = singer_mid
    this.singer_id = singer_id
    this.singer_name = singer_name
    this.singer_pic = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer_mid}.jpg?max_age=2592000`
  }
}