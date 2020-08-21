$(function () {
    // 1.自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length >= 6) {
                return '昵称长度为1 ~ 6位之间!'
            }
        }
    })

    initUserInfo()
    var layer = layui.layer
    // 2.初始化用户的基本信息
    function initUserInfo() {

        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 3.重置表单的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
    // 4.监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新用户资料成功')
                // 调用父页面中的方法,重新渲染用户头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})