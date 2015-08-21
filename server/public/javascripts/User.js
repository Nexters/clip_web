(function () {
    'use strict';

    function init() {
        $('.sidebar-setting-icon').click(function() {
            $('#setting_modal').modal('show');
            initModal();
        });
    }

    function initModal() {
        new Taggle('keyword-box', {
            placeholder: '태그 입력',
            duplicateTagClass: 'bounce'
        });
    }

    $(document).ready(function() {
        init();
    });
}());