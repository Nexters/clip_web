(function () {
    'use strict';

    function init() {
        $('#keyword_setting_btn').click(function() {
            $('#setting_modal').modal('show');
            initModal();
        });
    }

    function initModal() {
        new Taggle('keyword-box', {
            placeholder: '태그 입력',
            duplicateTagClass: 'bounce'
        });

        $('#modal_add_btn').click(function() {
            console.log("post");
            HttpUtil.postData('/feed/check', {feed: $('#modal_input_site').val()}, function(err, result) {
                if (err) return alert('등록할 수 없는 사이트입니다.(RSS를 지원하는 사이트만 추가 가능합니다.)');
                alert("추가되었습니다.");
                $('#modal_input_sitebox').append('<p>'+result+'</p>');
            });
        });
    }

    $(document).ready(function() {
        init();
    });
}());