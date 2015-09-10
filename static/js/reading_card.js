$(function () {
    var read = $('#read');
    var quit = $('#quit');

    //var panel = $('#reading_card');

    read.linkbutton({
        width: 150, height: 150
    });
    quit.linkbutton({
        width: 150, height: 150
    });

    quit.bind('click', function () {
        $.ajax({
            url: '/services/quit_card/', method: 'POST',
            success: function () {
                $.removeCookie('resident_id');
                $.removeCookie('resident_name');
                $.removeCookie('resident_ehr_no');
                //刷新页面
                $('#resident').html('无');
            }
        });
    });

    read.bind('click', function () {
        $.ajax({
            url: '/services/read_card/', method: 'POST',
            success: function (data) {
                $.cookie('resident_id', data.id);
                $.cookie('resident_name', data.name);
                $.cookie('resident_ehr_no', data.ehr_no);
                //刷新页面
                $('#resident').html(data.name);
                $('#nav_accordion').accordion('select', 0);
                var svc_nav = $('#svc_nav');
                var node = svc_nav.tree('find', 1);
                svc_nav.tree('select', node.target);
                $('#svc_area').panel({
                    href: node.url, fit: true, border: false
                });


            }
        });
    });
});