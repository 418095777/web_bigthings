$(function () {
    // 1.定义校验规则
    var form = layui.form
    form.verify({
        // 1.1密码
        pwd: [/^[\S]{6,12}$/, '密码必须6~12位,且不能出现空格'],
        // 1.2新旧密码不重复
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        // 1.3两次新密码必须相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                $('.layui-form')[0].reset()
            }
        })
    })
})