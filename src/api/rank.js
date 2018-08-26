import jsonp from '../common/js/jsonp.js'
import {commonParams,options} from './config.js'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

//根据排行id得到里面所有歌曲
export function getToplistSongs(id){
  const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=${id}&_=1534685813402`

  // const data = Object.assign({}, commonParams, {
  //   page: 'detail',
  //   type:'top',
  //   tpl:3,
  //   platform:'h5',
  //   needNewCode:1,
  //   topid:id,
  //   g_tk:5381,
  //   uin:0,
  //   format:'json'  
  // })

  return jsonp(url,{},options)
}