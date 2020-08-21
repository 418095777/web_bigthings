$(function () {
    // 调用getUserInfo()获取用户基本信息
    getUserInfo()
    var layer = layui.layer
    $('#btnOut').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1.清空token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index);
        })
    })
})
// 获取用户信息(封装到入口函数的外面)
// 原因:后面其他的的页面要调用
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // header就是请求头配置对象
        headers: {
            // 重新登录,因为token超过12小时了
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        complete: function (res) {
            // 在complete回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 1.强制清空token
                localStorage.removeItem('token')
                // 2.强制跳转到登录页面
                location.href = '/login.html'
            }
        }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎　' + name)
    // 3.按需渲染头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}