$(function () {
    initCate()
    var form = layui.form
    var layer = layui.layer
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 调用模版引擎,渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $("#coverFile").click()
    })

    // 监听coverFile的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        if (file == undefined) {
            return
        }
        // 根据文件,创建对应的url地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域   
            .attr('src', newImgURL)  // 重新设置图片路径   
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 设置状态
    var state = '已发布'
    // 为存为草稿按钮,绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 为表单绑定submit提交事件
    $("#form-pub").on('submit', function (e) {
        // 1.阻止表单默认行为
        e.preventDefault()
        // 2.基于form表单,快速创建一个FormData对象
        var fd = new FormData(this)
        // 3.将文章的发布状态,存到fd中
        fd.append('state', state)
        // 4.将封面裁剪过后的图片,输出位一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象,存储到fd中
                fd.append('cover_img', blob)
                publishArticle(fd)
            })

    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意:如果向服务器提交的是FormData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('添加文章成功')
                location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                })
            }
        })
    }

})