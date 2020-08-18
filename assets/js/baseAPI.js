
var baseURL = 'http://ajax.frontend.itheima.net'

// 每次调用$.get()或$.post()或$.ajax()的时候(拦截ajax请求)
// 会先调用ajaxPrefilter这个函数
// 在这个函数中,可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前,同意拼接请求的根路径
    // 拼接对应的环境服务器地址
    options.url = baseURL + options.url
    // alert(options.url)
})