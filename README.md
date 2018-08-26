# vue_music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 解决移动端点击300毫秒延迟 因为全局都需要使用到此插件，需要在在mainj.js注册并执行相应方法
    npm install fastclick --save
    import fastclick from 'fastclick'
    fastclick.attach(document.body)

# fastclick插件衍生出来的，比如某些地方你是需要点击的，但是因为fastclick的影响，如果点不动，那就需要加一个class类needsclick，fastclick就不会去拦截，这个是better-scroll和fastclick冲突造成的

# 让默认的babel支持跟深入的api转换 babel默认只会转换新的语法，而一些新的api比如promise generator proxy set map symbol等是不会进行转换的
    解决办法是
    安装引入更深入支持babel-polyfill
    npm install babel-polyfill --save
    因为这个插件是全部页面都需要的转码插件，因此最好在main.js中最开头引入,他只是一个普通js处理文件，引入即可使用
    import 'babel-polyfill'

# jsonp可以跨域抓取服务器数据
    npm install jsonp --save
    然后封装一个自己的jsonp函数，安装的jsonp向外提供的也是一个jsonp请求函数但是我们需要按自己的需要进行参数拼接，所以需要封装一个适合自己的函数，普通的jsonp请求也是不会去验证请求的，但是有些接口他是会去验证的，如果有验证，那么我们就需要去绕过验证，使用服务端进行代理发请求,因此需要配置webpack.dev.conf.js中的DevServer加上一个before方法
    跨域还有一个是代理所有的域名地址，比如localhost:8080发送ajax访问localhost:4000/users接口发送ajax请求的url如果不通过服务器代理那么访问的是localhost:8080/user此代理跨域在config/index.js中的ProxyTable中配置反写

    还有一种跨域解决方案就是后台接口在开发的时候就允许所有访问，允许跨域访问，这样可以接受来自任何一个地方的访问，安全性极低，

# better-scroll页面滚动原理：父容器固定高度或者宽度，子容器有子元素自动撑大宽高，当子容器高度大于父容器高度，自动就可以滑动
    技巧：有些元素先出来跟后出来是有区别的，如果better-scroll在计算的时候没发现该元素标签，这个元素标签的高度或者宽度就不会计算到better-scroll中，better-scroll中显示的数据就会出现无法正常全部显示，因此better-scroll给实例提供了一个this.bs.refresh()方法用于刷新重新计算宽高,比如图片在加载的时候还未加载完成，better-scroll就初始化完成了，并没有计算图片高度，因此可以给图片加一个load事件，加载完成触发事件回调函数执行this.bs.refresh()进行重新计算宽高

#提高用户体验
    在数据还未加载的时候，应该提示正在加载中，有了数据后再展示，可以单独开发一下正在加载组件