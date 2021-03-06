$(function () {
    var toolbar = $('#toolbar');
    var table = $('#psy_info_table');
    var form = $('#psy_info_form');

    var btn_save = toolbar.find('#save').linkbutton({ iconCls: 'icon-save', plain: true });
    var btn_print = toolbar.find('#print').linkbutton({ iconCls: 'icon-print', plain: true });

    btn_print.bind('click', function () {
        if ($(this).linkbutton('options').disabled == false) {
            table.find('.print_area').printThis();
        }
    });

    btn_save.bind('click', function () {
        if ($(this).linkbutton('options').disabled == false) {
            form.form('submit', {
                url: '/psychiatric/personal_info_submit/', method: 'POST',
                onSubmit: function (param) {
                    if (!form.find('input[name=assent]').is(":checked")) {
                        $.messager.alert('提示', '请选是否同意参加管理', 'info');
                        return false;
                    }
                    if (!form.find('input[name=symptom]').is(":checked")) {
                        $.messager.alert('提示', '请选择既往主要症状', 'info');
                        return false;
                    }
                    if (!form.find('input[name=cure_outpatient]').is(":checked")) {
                        $.messager.alert('提示', '请选择既往治疗情况（门诊）', 'info');
                        return false;
                    }
                    if (!form.find('input[name=cure_effect]').is(":checked")) {
                        $.messager.alert('提示', '请选择最近一次治疗效果', 'info');
                        return false;
                    }
                    if (!form.find('input[name=lock]').is(":checked")) {
                        $.messager.alert('提示', '请选择关锁情况', 'info');
                        return false;
                    }
                    if (!form.find('input[name=economy]').is(":checked")) {
                        $.messager.alert('提示', '请选择经济情况况', 'info');
                        return false;
                    }

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
                        table.panel({
                            href: '/psychiatric/personal_info_table/',
                            onLoad: function () {
                                if (form.find('input[name=fill_table_date]').length == 0) {
                                    btn_save.linkbutton('disable');
                                    btn_print.linkbutton('enable')
                                } else {
                                    btn_save.linkbutton('enable');
                                    btn_print.linkbutton('disable');
                                }
                            }
                        });
                        $.messager.show({title: '提示', msg: '重性精神疾病患者个人信息补充表保存成功', timeout: 2000});
                    } else {
                        $.messager.alert('提示', '重性精神疾病患者个人信息补充表保存失败', 'info');
                    }
                }
            });
        }
    });
    table.panel({
        href: '/psychiatric/personal_info_table/',
        onLoad: function () {
            if (form.find('input[name=fill_table_date]').length == 0) {
                btn_save.linkbutton('disable');
            } else {
                btn_print.linkbutton('disable');
            }
        }
    })
});