$(function(){
    var svc_nav = $('#svc_nav');
    var doc_nav = $('#doc_nav');
    var accordion = $('#nav_accordion');

    $.removeCookie('resident_id');
    $.removeCookie('resident_name');
    $.removeCookie('resident_ehr_no');

    svc_nav.tree({
        url: '/services/svc_nav/', animate: true,
        onClick: function(node) {
            // 这里通过cookie控制能否打开服务链接
            if (node.classification == 'individual') {
                if ($.cookie('resident_id')){
                    if (node.url) {
                        $('#svc_area').panel({
                            href: node.url, fit: true, border: false
                        });
                    }
                }
            } else {
                if (node.url) {
                    $('#svc_area').panel({
                        href: node.url, fit: true, border: false
                    });
                }
            }
        }
    });

    doc_nav.tree({
        url: '/services/doc_nav/', animate: true,
        onClick: function(node) {
            if (node.url) {
                $('#svc_area').panel({
                    href: node.url, fit: true, border: false
                });
            }
        }
    });

    accordion.accordion({
        onSelect: function (title, index) {
            if (index == 1) {
                var node = doc_nav.tree('find', 5);
                svc_nav.tree('select', node.target);
                $('#svc_area').panel({
                    href: node.url, fit: true, border: false
                });
            }
        }
    });

    accordion.accordion('select', 1);

});