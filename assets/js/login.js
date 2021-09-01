$(function() {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击去登录
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    })

    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({

            url: '/api/reguser',
            method: 'POST',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！');
                $('#link_login').click();
            }
        })
    })

    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({

            url: '/api/login',
            method: 'POST',
            data: {
                username: $('#form_login [name=username]').val(),
                password: $('#form_login [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功');
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        })
    })

})