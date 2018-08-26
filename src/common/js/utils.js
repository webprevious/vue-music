function getRandInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

export function shuffle(arr){
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandInt(0,i)
        let temp = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = temp
    }
    return _arr
}


//某些函数不想它多次执行，要对他进行节流，比如搜索框里面内容改变就发请求，这样比较浪费

export function debounce(fn,delay){
    let timer
    return function (...args){
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fn.apply(this,args)
        },delay)
    }
}