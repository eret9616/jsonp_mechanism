/*
手写一个JSONP（promise版）

JSONP原理：
利用js标签没有跨域限制的特性实现跨域请求 只支持GET


动态生成一个JavaScript标签，其src由接口url、请求参数、callback函数名拼接而成，

1.创建一个script标签，src是请求url+qs.stringify(data)+?callback=callbackFun
2.在window上创建一个callbackfun
3.拿到结果后将callbackfun删除掉，将script标签dom删除掉


当请求成功后，后台返回单的内容会解析成js，于是会开始执行，后台
服务端返回数据有特定格式要求：callback函数名+'('+JSON.stringify(返回数据)+')'

*/

const jsonp = function (url, data) {
    return new Promise((resolve, reject) => {

        debugger

        // 初始化url
        let dataString = url.indexOf('?') === -1 ? '?' : '&'
        let callbackName = `jsonpCB_${Date.now()}`

        debugger


        url += `${dataString}callback=${callbackName}`

        debugger

        // 有请求参数，依次添加到url
        if (data) {
            for (let k in data) {
                url += `&${k}=${data[k]}`
            }

            debugger

        }

        debugger


        let jsNode = document.createElement('script')
        jsNode.src = url

        debugger



        // 触发callback，触发后删除js标签和绑定在window上的callback
        window[callbackName] = result => {
            delete window[callbackName]
            document.body.removeChild(jsNode)
            if (result) {
                resolve(result)
            } else {
                reject('没有返回数据')
            }
        }


        debugger

        // js加载异常的情况 
        // jsNode.onerror = function...
        jsNode.addEventListener('error', () => {
            delete window[callbackName]
            document.body.removeChild(jsNode)
            reject('JavaScript资源加载失败')
        }, false)


        debugger



        // 添加js节点到document上时，开始请求
        document.body.appendChild(jsNode)

        debugger

    })
}

jsonp('http://192.168.0.103:8081/jsonp', { a: 1, b: 'heiheihei' })
    .then(result => { console.log(result) })
    .catch(err => { console.error(err) })