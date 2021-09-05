$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable();

    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }

                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
                randerpage(res.total);
            }
        })
    }
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        q.cate_id = cate_id;
        q.state = state;

        initTable();
    })

    //分页
    function randerpage(total) {
        laypage.render({
            elem: 'pagebox', //注意，这里的 test1 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'pre', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump的方式有两种一种是点击页码第二种是调用randerpage
            jump: function(obj, first) {

                q.pagenum = obj.curr;

                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }

            }
        });

    }

    //通过代理的形式给删除按钮添加事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {

            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {

                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功');
                    //当数据删除完之后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余的数据，则让页码值减一
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })

})