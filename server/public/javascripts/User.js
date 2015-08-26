
(function () {
    'use strict';

    var userData, taggle;
    var newUserData = {};

    var button = $('<img/>', {
        src: '/images/card_delete_icon.png',
        class: 'site-delete-btn'
    });

    function init() {
        userData = g_data.user;

        taggle = new Taggle('keyword-box', {
            tags: userData.keywords,
            placeholder: '태그 입력',
            duplicateTagClass: 'bounce'
        });
        $('#board-setting-btn').click(function () {
            if ( $('.board_delete_btn').css('display') == 'none'){
                $('.board_delete_btn').show();
            }
            else{
                $('.board_delete_btn').hide();
            }
        });

        $('#keyword_setting_btn').click(function() {
            $('#setting_modal').modal('show');
            initModal();
        });

        $(".comment").click(function(){
            $(".myclip_title").text($(this).text());
        });


    }

    function initModalSiteItems() {
        $('.site_list').empty();
        for (var i=0; i<newUserData.feeds.length; i++) {
            $('.site_list').append('<li>' + newUserData.feeds[i] + '</li>');
        }
        $('.site_list > li').append(button);
    }


    function initModal() {
        $.extend(true, newUserData, userData);

        initModalSiteItems();

        $('#modal_add_btn').unbind('click').click(function() {
            HttpUtil.postData('/feed/check', {feed: $('#modal_input_site').val()}, function(err, result) {
                if (err) return alert('등록할 수 없는 사이트입니다.(RSS를 지원하는 사이트만 추가 가능합니다.)');
                alert("추가되었습니다.");
                newUserData.feeds.push(result);
                initModalSiteItems();
                $('#modal_input_site').val('');
            });
        });


        $('.site-delete-btn').unbind('click').click(function() {
            var feedIndex = newUserData.feeds.indexOf($(this).parent().text());
            newUserData.feeds.splice(feedIndex, 1);
            $(this).parent().remove();
            console.log(newUserData.feeds);
        });

        $('#modal_key_btn').unbind('click').click(function() {
            newUserData.keywords = taggle.getTagValues();
            HttpUtil.putData('/user/id/'+newUserData._id, {feeds: newUserData.feeds, keywords: newUserData.keywords}, function(err, result) {
                if (err) return alert(err);
                alert("등록되었습니다.");
                location.reload(true);
            });
        });
    }

    $(document).ready(function() {
        init();
    });
}());


$('.sidebar-setting-icon').click(function() {
    $('#profile_modal').modal('show');
    //initModal();
});