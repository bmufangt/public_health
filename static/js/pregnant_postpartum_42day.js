$(function () {
    var area = $('#postpartum_42day');
    var toolbar = area.find('#toolbar');
    var form = area.find('#form');
    var table = area.find('#table');

    var btn_save = toolbar.find('#save').linkbutton({ iconCls: 'icon-save', plain: true });
    var btn_edit = toolbar.find('#edit').linkbutton({ iconCls: 'icon-edit', plain: true });
    var btn_print = toolbar.find('#print').linkbutton({ iconCls: 'icon-print', plain: true });

    btn_edit.linkbutton('disable');
    btn_print.bind('click', function () { table.find('#print_area').printThis(); });

    btn_save.bind('click', function () {
        form.form('submit', {
            url: '/pregnant/postpartum_42day_submit/', method: 'POST',
            onSubmit: function (param) {
                if (form.form('validate')) {
                    param.csrfmiddlewaretoken = $.cookie('csrftoken');
                    return true;
                } else {
                    return false;
                }
            },
            success: function (json_data) {
                var data = eval('(' + json_data + ')');
                if (data.success) {
                    /*
                    $.ajax({
                        url: '/pregnant/postpartum_42day_review/', method: 'POST',
                        data: {'resident_id': resident_id},
                        success: function (data) {
                            if (data.success) {
                                table.html(data.message);
                            }
                        }
                    });
                    */
                    table.panel('refresh');
                    $.messager.show({title: '提示', msg: '产后42天健康检查表保存成功', timeout: 1000});
                } else {
                    $.messager.alert('提示', '产后42天健康检查表表保存失败', 'info');
                }
            }
        });
    });

    /*
    $.ajax({
        url: '/pregnant/postpartum_42day_review/', method: 'POST',
        data: {'resident_id': resident_id},
        success: function (data) {
            if (data.success) {
                table.html(data.message);
                table.css('display', 'block');
                btn_save.linkbutton('disable');
                btn_edit.linkbutton('disable');
            } else {
                table.css('display', 'block');
                btn_edit.linkbutton('disable');
                btn_print.linkbutton('disable');
            }
        }
    });
    */
    table.panel({ href : '/pregnant/postpartum_42day_table/'})
});