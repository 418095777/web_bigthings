
var baseURL = 'http://ajax.frontend.itheima.net'

// 每次调用$.get()或$.post()或$.ajax()的时候(拦截ajax请求)
// 会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {

    // 在发起真正的ajax请求之前,同意拼接请求的根路径
    // 1.拼接对应的环境服务器地址
    options.url = baseURL + options.url
    // alert(options.url)
    // 2.对需要权限的接口配置头信息
    // 必须以my开头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 3.拦截所有响应,判断身份认证信息
    options.complete = function (res) {
        // console.log(res.responseJSON);
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            // 1.清空token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'
        }
    }

})