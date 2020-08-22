$(function () {
    var layer = layui.layer
    var form = layui.form
    getArtList()
    // 获取文章分类的列表
    function getArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加按钮绑定点击事件
    var indexStr = null
    $('#btnAdd').on('click', function () {
        indexStr = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        })
    })
    // 通过代理的形式,为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                getArtList()
                layer.msg('添加分类成功!')
                // 根据索引,关闭弹出层
                layer.close(indexStr)
            }
        })
    })

    // 通过代理的形式,为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        })
        // 获取id,发送ajax获取数据,渲染到页面
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式,为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新文章成功')
                layer.close(indexEdit)
                getArtList()
            }
        })
    })

    // 通过代理的形式,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        // console.log(Id);
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    layer.close(index)
                    getArtList()
                }
            })
        });
    })
})