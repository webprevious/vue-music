var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()

var apiRoutes = express.Router()

//跨域代理
app.get('/api/getDiscList', function (req, res) {
var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
axios.get(url, {
    headers: {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
    },
    params: req.query
}).then((response) => {
    res.json(response.data)
}).catch((e) => {
    console.log(e)
})
})
  
//获取歌词api
app.get('/api/lyric', function (req, res) {
var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

axios.get(url, {
    headers: {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
    },
    params: req.query
}).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
    var reg = /^\w+\(({[^()]+})\)$/
    var matches = ret.match(reg)
    if (matches) {
        ret = JSON.parse(matches[1])
    }
    }
    res.json(ret)
}).catch((e) => {
    console.log(e)
})
})

// 获取歌单里面歌曲
app.get('/api/getDiscSongs', function (req, res) {
var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
axios.get(url, {
    headers: {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
    },
    params: req.query
}).then((response) => {
    res.json(response.data)
}).catch((e) => {
    console.log(e)
})
})

//获取搜索结果
app.get('/api/getSearch', function (req, res) {
var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
axios.get(url, {
    headers: {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
    },
    params: req.query
}).then((response) => {
    res.json(response.data)
}).catch((e) => {
    console.log(e)
})
})

app.use('/api', apiRoutes)//通过路由请求数据

app.use(express.static('./dist')) //静态资源

var port =  process.env.PORT || config.build.port

module.exports = app.listen(port,function(err){
    if(err){
        console.log(err)
        return
    }
    console.log('listening at http://localhost:'+port+'\n')
})