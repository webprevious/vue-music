import jsonp from '../common/js/jsonp.js'
import {commonParams,options} from './config.js'
import axios from 'axios'

export function getHotKey(){
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

    const data = Object.assign({},commonParams,{
        g_tk:5381,
        format:'json',
        platform:'h5',
        needNewCode:1
    })

    return jsonp(url,data,options)
}

export function getSearchResult(keyWord,page,catzd){
    const url = '/api/getSearch'

    const data = Object.assign({}, commonParams, {
        g_tk:5381,
        uin:0,
        platform: 'h5',
        hostUin: 0,
        needNewCode: 1,
        w:keyWord,
        zhidaqu:1,
        catZhida:catzd?1:0,
        t: 0,
        flag:1,
        ie:'utf-8',
        sem:1,
        aggr:0,
        prepage:20,
        n:20,
        p:page,
        remoteplace: 'txt.mqq.all',
        format: 'json'
    }) 

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}