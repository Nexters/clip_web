
(function () {
    'use strict';

    function init() {


        //var hasBeenClicked = false;
        //
        //$('#board-setting-btn').click(function () {
        //    hasBeenClicked = true;
        //    console.log('click');
        //});
        //
        //if (hasBeenClicked) {
        //    // The link has been clicked.
        //    $('#board_delete_btn').show();
        //}
        //else {
        //    // The link has not been clicked.
        //    $('#board_delete_btn').hide();
        //
        //}

        $('#board-setting-btn').click(function () {
            if ( $('#board_delete_btn').css('display') == 'none'){
                $('#board_delete_btn').show();
            }
            else{
                $('#board_delete_btn').hide();
            }
        });




        new Taggle('keyword-box', {
            placeholder: '태그 입력',
            duplicateTagClass: 'bounce'
        });

        $('#keyword_setting_btn').click(function() {
            $('#setting_modal').modal('show');
            initModal();
        });


        //$('#board-setting-btn').click(function() {
        //   $('#board_delete_btn').show();
        //});

    }

    function initModal() {
        $('#modal_add_btn').unbind('click').click(function() {
            HttpUtil.postData('/feed/check', {feed: $('#modal_input_site').val()}, function(err, result) {
                if (err) return alert('등록할 수 없는 사이트입니다.(RSS를 지원하는 사이트만 추가 가능합니다.)');
                alert("추가되었습니다.");
                var button = $('<img/>', {
                    src: 'images/card_delete_icon.png',
                    class: 'site-delete-btn',
                    click: function() {
                        $(this).parent().remove();
                    }
                });
                var siteUrl = $('#modal_input_site').val();
                $('.site_list').append('<li>' + siteUrl + '</li>').children().last().append(button);
                $('#modal_input_site').val('');

            });
        });





        $('.site-delete-btn').click(function(){
            console.log('click');
            console.log($(this).parent);
        });

    }

    $(document).ready(function() {
        init();
    });
}());