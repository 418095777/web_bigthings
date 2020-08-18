$(function () {
    // 1.点击'去注册帐号',隐藏登录区域,显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 2. 点击'去登录',隐藏注册区域,显示登录区域
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 3.自定义验证规则
    // 从layui 中获取 form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [/^[\S]{6,16}$/, '密码必须6-16位,不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            var pwd = $('#inp').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })
    // 监听注册表单的提交时间
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        /*  $.post('http://ajax.frontend.itheima.net/api/reguser',
             { username: $('#nainp').val(), password: $('#inp').val() }, function (res) {
                 if (res.status !== 0) {
                     return console.log(res.message);
                 }
                 console.log('注册成功');
             }) */
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#nainp').val(),
                password: $('#inp').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);

                }
                layer.msg('注册成功,请登录');
                // 
                $('#link_login').click()
                $('#form_reg')[0].reset()
            }
        })
    })
    // 登录功能(给form标签绑定时间,button按钮触发提交 事件)
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登陆成功')
                // 登陆成功将得到的token字符串,保存到localStorage中
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})