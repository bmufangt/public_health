$(function() {
    var selected_row = undefined;
    var act_type1 = [{'value': 0, 'text': '全部'}, {'value': 1, 'text': '宣传栏'}, {'value': 2, 'text': '宣传栏更新'},
                     {'value': 3, 'text': '宣传册'},{'value': 4, 'text': '宣传单'}, {'value': 5, 'text': '宣传折页'},
                     {'value': 6, 'text': '资料架'},{'value': 7, 'text': '宣传栏维护'}, {'value': 8, 'text': '音像资料'},
                     {'value': 9, 'text': '公众健康咨询活动'},{'value': 10, 'text': '健康知识讲座'},
                     {'value': 11, 'text': '健康教育网站'}];
    var act_type2 = [{'value': 0, 'text': ''}, {'value': 1, 'text': '宣传栏'}, {'value': 2, 'text': '宣传栏更新'},
                     {'value': 3, 'text': '宣传册'},{'value': 4, 'text': '宣传单'}, {'value': 5, 'text': '宣传折页'},
                     {'value': 6, 'text': '资料架'},{'value': 7, 'text': '宣传栏维护'}, {'value': 8, 'text': '音像资料'},
                     {'value': 9, 'text': '公众健康咨询活动'},{'value': 10, 'text': '健康知识讲座'},
                     {'value': 11, 'text': '健康教育网站'}];

    var toolbar = $('#activity_toolbar');

    var btn_add = toolbar.find('#add').linkbutton({ iconCls: 'icon-add', plain: true });
    var btn_edit = toolbar.find('#edit').linkbutton({ iconCls: 'icon-edit', plain: true });
    var btn_rm = toolbar.find('#remove').linkbutton({ iconCls: 'icon-remove', plain: true });
    var btn_save = toolbar.find('#save').linkbutton({ iconCls: 'icon-save', plain: true });
    var btn_undo = toolbar.find('#undo').linkbutton({ iconCls: 'icon-undo', plain: true });
    btn_save.hide(); btn_undo.hide(); btn_edit.hide();
    btn_rm.hide(); btn_save.hide(); btn_undo.hide();

    var table = $('#act_tbl');
    table.find('#act_time').datetimebox({ required: true, showSeconds: false });
    table.find('#scene').textbox({ width: 250, required: true });
    table.find('#act_type').combobox({
        valueField: 'text', textField: 'text',
        data: act_type2, required: true
    });
    table.find('#subject').textbox({ width: 300, required: true });
    table.find('#organizer').textbox({ width: 200, required: true });
    table.find('#crowd_type').textbox({ width: 150, required: true });
    table.find('#crowd_num').numberbox({ width: 80, required: true });
    table.find('#material_type').textbox({ width: 150, required: true });
    table.find('#material_num').numberbox({ width: 80, required: true });
    table.find('#photo').filebox({ buttonText: '选择附件'});

    var form = $('#act_tbl_form').form();

    btn_add.bind('click', function () {
        table.dialog({
            title: '健康教育活动记录表',
            width: 800, height: 400, cache: true, modal: true, resizable: true,
            buttons: [{
                text: '提交', iconCls: 'icon-ok',
                handler: function () {
                    form.form('submit', {
                        url: '/education/activity_table/',
                        onSubmit: function(param) {
                            param.csrfmiddlewaretoken = $.cookie('csrftoken');
                            if (table.find('#content').val() == '') {
                                $.messager.alert('输入不完整', '请输入健康教育的活动内容！', 'warning');
                                return false;
                            }
                            if (table.find('#summary').val() == '') {
                                $.messager.alert('输入不完整', '请输入健康教育的活动总结评价！', 'warning');
                                return false;
                            }
                            return $(this).form('validate');
                        },
                        success: function(data) {
                            //将返回的json类型转化为JS对象
                            var data_obj = eval('(' + data + ')');
                            if (data_obj.success) {
                                $.messager.show({
                                    title: '提示', msg: data_obj.message,
                                    timeout: 1500, showType: null
                                });
                                form.form('reset');
                                table.dialog('close');
                                datagrid.datagrid('reload');
                            }
                        }
                    });
                }
            },{
                text: '取消', iconCls: 'icon-cancel', handler: function () {
                    table.dialog('close');
                }
            }],
            onClose: function () {
                $(this).form('clear');
            },
            onOpen: function () {
                $(this).css('display', 'block');
                $(this).dialog('center');
            }
        })
    });

    btn_rm.bind('click', function () {
    });

    btn_save.bind('click', function () {
    });

    btn_undo.bind('click', function () {
    });

    toolbar.find('#begin_date').datebox({
        width: 100, editable: false, formatter: myformatter, parser :myparser
    });
    toolbar.find('#begin_date').datebox('setValue', newYearDay(new Date()));
    toolbar.find('#end_date').datebox({
        width: 100, editable: false, formatter: myformatter, parser :myparser
    });
    toolbar.find('#end_date').datebox('setValue', myformatter(new Date()));
    toolbar.find('#act_type').combobox({
        width: 120, valueField: 'value', textField: 'text',
        data: act_type1,
        onLoadSuccess: function() {
            $(this).combobox('setValue', 0)
        }

    });

    var btn_query = toolbar.find('#btn_query').linkbutton({
        iconCls: 'icon-glyphicons-28-search',
        plain: true
    });
    btn_query.bind('click', function() {
        datagrid.datagrid('load');
    });

    var review = $('#review').dialog({
         title: '健康教育活动记录表',
         width: 800, height: 400, cache: true, modal: true, resizable: true, closed: true,
         buttons: [{
             text: '关闭', iconCls: 'icon-ok', handler: function () {
                 review.dialog('close');
             }
         }]
    });

    var datagrid = $('#activity_dg').datagrid({
        title: '健康教育活动登记', url: '/education/activity_list/',
        toolbar: '#activity_toolbar', autoRowHeight: false, nowrap: false,
        rownumbers: true, singleSelect: true, fitColumns: true, pagination: true,
        pageList: [10, 15, 20, 25, 30, 40, 50], pageSize: 15,
        columns: [[
            { field: 'id', title: '编号', hidden: true },
            { field: 'act_time', title: '时间', width: 10 },
            { field: 'scene', title: '地点', width: 10 },
            { field: 'act_type', title: '形式', width: 10 },
            { field: 'subject', title: '主题', width: 20 },
            { field: 'submit_time', title: '提交时间', width: 10 }
        ]],
        onBeforeLoad: function(param) {
            /*
            param.begin_date = toolbar.find('#begin_date').datebox('getValue');
            param.end_date = toolbar.find('#end_date').datebox('getValue');
            param.reporter = toolbar.find('#reporter').textbox('getValue');
            */
        },
        onClickRow: function (index, row) {
            if (selected_row == row) {
                datagrid.datagrid('unselectRow', index);
                selected_row = undefined;
            } else {
                selected_row = datagrid.datagrid('getSelected');
            }
        },
        onDblClickRow: function (index, row) {
            $.ajax({
                url: '/education/activity_review/', method: 'POST',
                data: {'id': row['id']},
                success: function (data) {
                    review.html(data);
                    review.css('display', 'block');
                    review.dialog('open');
                    review.dialog('center');
                }
            })
        },
        onAfterEdit: function() {
            /*
            $('#save, #undo').hide();
            var inserted_row = $(this).datagrid('getChanges', 'inserted');
            var updated_row = $(this).datagrid('getChanges', 'updated');

            if (inserted_row.length > 0) {
                $.ajax({
                    url: '/supervision/info_report_add/', method: 'POST',
                    data: inserted_row[0],
                    success: function() {
                        datagrid.datagrid('load');
                        datagrid.datagrid('unselectAll');
                        $.messager.show({ title: '提示', timeout: 1000, msg: '卫生监督协管信息报告登记成功！'});
                    }
                });
            }
            if (updated_row.length > 0) {
                $.ajax({
                    url: '/supervision/info_report_update/', method: 'POST',
                    data: updated_row[0],
                    success: function () {
                        datagrid.datagrid('load');
                        datagrid.datagrid('unselectAll');
                        $.messager.show({ title: '提示', timeout: 1000, msg: '卫生监督协管信息报告登记更新成功！' });
                    }
                });
            }
            edit_row = undefined;
            selected_row = undefined;
            btn_add.linkbutton('enable');
            btn_edit.linkbutton('enable');
            btn_rm.linkbutton('enable');
            */
        }
    });

});