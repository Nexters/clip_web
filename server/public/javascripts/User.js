



(function () {
    'use strict';

    var userData, taggle;
    var newUserData = {};
    var ITEM_PER_PAGE = 20;
    var keyword = 'All';
    var clipId = null;
    var pageNum = 0;
    var isCompleteLoading = false;
    var isLoading = false;
    var container = '#feed_list_panel';
    var $loaderCircle = $('#loaderCircle');
    var wookmark = undefined;
    var options = {
        offset: 12, // Optional, the distance between grid items
        itemWidth: 251 // Optional, the width of a grid item
    };


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

        <!-- 보드 타이틀 부분 -->
        $(".board").click(function(){
            $(".myclip_title").text($(this).data('title'));
            $('.myclip_title').attr('data-id');
            clearBoardList();
            clipId = $(this).data('id');
            $('#board_feed_list_container').removeClass('hide');
            initWookmark();
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

        <!-- modal 버튼 부분 -->
        $('#keyword_setting_btn').click(function() {
            $('#setting_modal').modal('show');
            initModal();
        });

        $('.sidebar-setting-icon').click(function() {
            $('#profile_modal').modal('show');
            initUserSettingModal();
        });

        if (userData.feeds.length === 0) {
            alert("등록된 사이트가 없습니다. 키워드 관리로 이동합니다.");
            $('#keyword_setting_btn').trigger('click');
        }
        if (userData.feeds.length > 0 && userData.keywords.length === 0) {
            alert("등록된 키워드가 없습니다. 키워드 관리로 이동합니다.");
            $('#keyword_setting_btn').trigger('click');
        }
    }

    function initModalSiteItems() {
        $('.site_list').empty();
        $.unique($('.site_list'));
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
                initModal();
                $('#modal_input_site').val('');
            });
        });


        $('.site-delete-btn').unbind('click').click(function() {
            var feedIndex = newUserData.feeds.indexOf($(this).parent().text());
            newUserData.feeds.splice(feedIndex, 1);
            $(this).parent().remove();
            console.log(newUserData.feeds);
            console.log('성공');
        });

        $('#modal_key_btn').unbind('click').click(function() {
            newUserData.keywords = taggle.getTagValues();
            HttpUtil.putData('/user/id/'+newUserData._id, {feeds: newUserData.feeds, keywords: newUserData.keywords},
                function(err, result) {
                if (err) return alert(err);
                alert("등록되었습니다.");
                location.reload(true);
            });
        });
    }


    //프로필 설정 모달
    function initUserSettingModal() {

        $('#logout_btn').click(function() {
            HttpUtil.postData('/user/logout', {}, function (err) {
                if (err || null) return alert('로그아웃 실패!');
                alert("로그아웃 되었습니다!");
                location.href = "/signin";
            });
        });


        $('#fileupload').fileupload({
            dataType: 'json',
            done: function (e, data) {
                var result = data.result;
                var image = result.data;
                $('.profile-image-box').attr('src', image);
                $('#fileupload').attr('value',image);
                console.log(image);
            }
        });

        <!-- 프로필 이름 설정 부분 -->
        $('#profile_name_input').val(userData.name);
        $(document).ready(function() {

            $("#profile_name_input").keyup(function(event){
                if (!(event.keyCode >=37 && event.keyCode<=40)) {
                    var inputVal = $(this).val();
                    $(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
                }
                
            });
        });

        $('#change_pw_input').val(userData.pw);
        $('#change_pw_confirm').val(userData.pw);
        <!-- 저장하기 버튼 -->
        $('#modal_save_btn').click(function() {
            var minLength = 6;
            var $textarea = $('#change_pw_input');
            var userId = userData._id;
            var params = {
                name: $('#profile_name_input').val() ,
                pw : $('#change_pw_input').val(),
                profileUrl: $('#fileupload').attr('value')
            };
            var name = $('#profile_name_input').val();
            var passwordVal = $('#change_pw_input').val();
            var checkVal = $('#change_pw_confirm').val();
            var hasError = false;
            var image = $('#fileupload').val();
            //HttpUtil.putData('/upload/'+image, params, function (err) {
            //    if (err) return alert('사진 변경 실패');
            //});



            HttpUtil.putData('/user/id/'+userId, params, function (err) {
                if (err || null) return alert('저장 실패!');

                <!-- 공백(스페이스) 입력시  -->
                var blank_pattern = /[\s]/g;
                if( blank_pattern.test(name) == true){
                    alert(' 공백은 사용할 수 없습니다.');
                    return false;
                }
                <!-- 아무것도 입력하지 않았을때 -->
                if(name == "") return alert('이름을 입력해주세요.');

                if($textarea.val().length < minLength) {
                    alert('비밀번호를 6자 이상으로 입력해 주세요.');
                    return false;
                }

                if(checkVal.length < minLength) {
                    alert('비밀번호를 6자 이상으로 입력해 주세요.');
                    return false;
                }

                if (passwordVal != checkVal ) {
                    $("#change_pw_input").after(function() {
                        alert('비밀번호가 다릅니다.');
                        $("#change_pw_input").focus();
                        return false;
                    });
                    hasError = true;
                }
                else{
                    alert("저장되었습니다.");
                    location.href = "/user";
                    return true;
                }
            });
        });

    }




    function initWookmark() {
        /**
         * When scrolled all the way to the bottom, add more tiles.
         */
        function onScroll(event) {
            // Only check when we're not still waiting for data.
            if(!isLoading) {
                // Check if we're within 100 pixels of the bottom edge of the broser window.
                var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);
                if (closeToBottom) {
                    loadData();
                }
            }
        }
        /**
         * Refreshes the layout after all images have loaded
         */
        function applyLayout() {
            imagesLoaded(container, function () {
                if (wookmark === undefined) {
                    wookmark = new Wookmark(container, options);
                } else {
                    wookmark.initItems();
                    wookmark.layout(true);
                }
                $loaderCircle.hide();
            });

        }

        /**
         * Loads data from the API.
         */
        function loadData() {
            if (isCompleteLoading) return;
            var params = {
                pageNum: pageNum,
                perPage: ITEM_PER_PAGE
            };
            if (keyword !== 'All') {
                params.keyword = keyword;
            }
            if (clipId !== null) {
                params.clipId = clipId;
            }
            isLoading = true;
            $loaderCircle.show();

            HttpUtil.getData('/feed/user', params, function(err, data) {
                onLoadData(data);
                bindEvent();
            });
        }

        /**
         * Receives data from the API, creates HTML for images and updates the layout
         */
        function onLoadData(feedData) {
            isLoading = false;
            // Increment pageNum index for future calls.
            pageNum++;
            var length = feedData && feedData.length;
            var html = '';
            var i;

            if (!length) {
                isCompleteLoading = true;
                $loaderCircle.hide();
                return;
            }

            // Create HTML for the images.
            for(i=0; i<length; i++) {
                feedData[i].image = getFeedBoxImageSrc(feedData[i].description);
                html += getFeedBoxHtml(feedData[i]);
            }

            // Add image HTML to the pageNum.
            $(container).append(html);
            // Apply layout.
            applyLayout();
        }

        // Capture scroll event.
        $(document).unbind('scroll').bind('scroll', onScroll);
        // Load first data from the API.
        loadData();
    }

    function bindEvent() {
        $('#feed_list_panel > li > .clip-icon-circle').unbind('click').click(function() {
            var $feedItem = $(this).parent();
            var feed = { feed: $feedItem.data('id') };

            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                $('#sidebar_clip_list').find('li[data-id='+feed.id+']').remove();
            } else {
                $(this).addClass('on');
                feed.title = $feedItem.find('.title-txt').text();
                feed.src = $feedItem.find('.title-img').attr('src');
                $('#sidebar_clip_list').append(getSmallFeedBoxHtml(feed));
            }
            return false;
        });
    }


    function getFeedBoxImageSrc(description) {
        var defaultImageSrc = '/images/card_no_image.png';
        if (!description) return defaultImageSrc;
        return $(description).find('img').first().attr('src') || defaultImageSrc;
    }

    function getFeedBoxHtml(feed) {
        var html =
            '<li data-id="'+feed._id+'" data-link="'+feed.link+'">'+
            '<span class="clip-icon-circle on">'+
            '<img src="/images/clip_btn.png" align="center">'+
            '</span>'+
            '<div class="img-box">'+
            '<img class="title-img" src="'+feed.image+'" align="middle" onError="this.src='+"\'/images/card_no_image.png\'"+'">'+
            '</div>'+
            '<div class="title-box">'+
            '<p class="title-txt">'+feed.title+'</p>'+
            '</div>'+
            '<div class="keyword-box">'+
            '<div class="keyword">'+
            '<img src="/images/card_keyword_icon.png">'+
            '<span>'+feed.keywordString+
            '</span>'+
            '</div>'+
            '<div class="clip">';
        if (feed.isCliped) {
            html += '<img src="/images/card_clip_icon.png" align="middle">';
        }
        html += '</div>'+
            '</div>'+
            '</li>';
        return html;
    }


    function resetWookmark() {
        pageNum = 0;
        isCompleteLoading = false;
        isLoading = false;
        $(container).empty();
        initWookmark();
    }

    function clearBoardList() {
        $('.boards > .board').remove();
    }

    $(document).ready(function() {
        init();
    });
}());

