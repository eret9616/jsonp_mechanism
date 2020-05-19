// 简单版示范原理

/*
    后端返回的内容应该是 
    JSONPFUN('xxxxxx')

    最后在前端浏览器内执行到window的JSONPFUN方法后就拿到了结果
*/

let my_jsonp = function (url, data) {


    return new Promise((resolve, reject) => {

        // 1.拼接出完整的url地址 （这里不考虑url中有？的情况，直接拼入了? # 如果有的话，要处理&）
        url += '?callback=JSONPFUN'

        if (data) {
            const query = qs.stringify(data)
            url += '?' + query
        }

        let script = document.createElement('script')
        script.src = url


        window.JSONPFUN = function (result) {

            resolve(result) // 这个就是结果

            free()
        }



        script.onerror = function (e) {
            reject('加载失败' + e)
            free()
        }


        function free() {
            document.body.removeChild(script)
            delete window[JSONPFUN]
        }

    })

}