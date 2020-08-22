$(function () {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        var timer = new Date(date)
        var y = parZero(timer.getFullYear())
        var m = parZero(timer.getMonth() + 1)
        var d = parZero(timer.getDate())
        var hh = parZero(timer.getHours())
        var mm = parZero(timer.getMinutes())
        var ss = parZero(timer.getSeconds())
        // console.log(y);
        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
    }
    function parZero(t) {
        return t > 9 ? t : '0' + t
    }


    // 定义一个查询的参数对象,将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,      //页码值
        pagesize: 2,	//每页显示多少条数据
        cate_id: '',	//文章分类的 Id
        state: '',	//文章的状态，可选值有：已发布、草稿
    }
    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页的方法
                renderPage(res.total)
                // console.log(res);
            }
        })
    }
    // 初始化文章分类的方法
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 调用模版引擎 渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()

            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件,重新渲染筛选数据
        initTable()
    })
    var laypage = layui.laypage;
    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum,    //  设置默认被选中的分页
            // 分页模块设置,显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            /* 
            分页发生切换的时候,就会触发jump回调
            触发jump的方式有两种:
            1.点击页码的时候,就会触发jump
            2.只要调用了 laypage.render()方法,就会触发jump回调
            */
            jump: function (obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的q 获取,并渲染表格
                if (!first) {
                    initTable()
                }
            }

        });
    }
    // 通过代理的形式,为删除按钮绑定点击事件
    var layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        var del = $('.btn-delete').length
        var Id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layer.msg('ok')
                    // 当数据删除完成后,需要判断当前这一页中,是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值-1 之后
                    // 再重新调用initTable 方法
                    if (del == 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initTable()
                }
            });
            layer.close(index);
        });
    })
})