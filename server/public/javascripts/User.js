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


        <!-- 프로필 이름,이메일 설정 부분 -->
        $('#profile_name_input').val(userData.name);
        $('.my_email').append('<li>'+userData.email+'<li>');
        <!-- modal 버튼 부분 -->
        $('#keyword_setting_btn').click(function() {
            $('#setting_modal').modal('show');
            initModal();
        });

        <!-- 보드 타이틀 부분 -->
        $(".board").click(function(){
            $(".myclip_title").text($(this).data('title'));
        });

        <!-- 보드 관리  삭제버튼 show hide 부분-->
        $('.board-setting-btn').click(function () {

            if ( $('.board_delete_btn').css('display') == 'none'){
                $(this).text("종료하기");
                $('.board_delete_btn').show();
            }
            else{
                $('.board_delete_btn').hide();
                $(this).text("보드관리");
           }
        });


        $(".myclip-bar-title-box").click(function(){
            location.reload(true);
        });

            <!-- 보드 삭제 버튼 부분 -->
        $(".board_delete_btn").click(function(){
            var boardId = $(this).parent().parent().data('id');
            console.log(boardId);
            if(confirm("정말 삭제하시겠습니까?")){
                console.log("삭제됨");
                var params = {};
                HttpUtil.deleteData('/clip/delete/id/'+boardId, params, function(err, data) {
                    if(err != null){
                        alert(data);
                        return false;
                    }
                    location.reload(true);
                    return false;
                });
            }
            else{
                console.log("삭제되지않음");
                return false;
            }
        });


        $('.sidebar-setting-icon').click(function() {
            $('#profile_modal').modal('show');
            initUserSettingModal();
        });
    }

    function initModalSiteItems() {
        $('.site_list').empty();
        for (var i=0; i<newUserData.feeds.length; i++) {
            $('.site_list').append('<li>' + newUserData.feeds[i] + '</li>');
        }
        $('.site_list > li').append(button);
    }

    //로그아웃
    function initUserSettingModal() {

        $('#logout_btn').click(function() {
            HttpUtil.postData('/user/logout', {}, function (err) {
                if (err || null) return alert('로그아웃 실패!');
                alert("로그아웃 되었습니다!");
                location.href = "/signin";
            });
        });

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

