(function () {
    var ITEM_PER_PAGE = 10;
    var pageNum = 0;
    var isCompleteLoading = false;
    var clips = [];

    function init() {
        initWookmark();
    }

    function bindEvent() {
        $('#board_add_btn').unbind('click').click(function() {
            var clipTitle = $('#board_title_input').val();
            if (!clipTitle) return alert("클립보드 제목을 입력해주세요!");
            HttpUtil.postData('/clip/save', {title: clipTitle}, function(err, allClips) {
                if (err) return alert(err);
                var html = '';
                clips = allClips;
                for (var i=0; i<allClips.length; i++) {
                    if (clipTitle === allClips[i].title) {
                        html += '<option selected>'+allClips[i].title+'</option>';
                    } else {
                        html += '<option>'+allClips[i].title+'</option>';
                    }
                }
                $('#board_title_select').empty();
                $('#board_title_select').append(html);
            });
        });

        $('#feed_list_panel > li > .clip-icon-circle').unbind('click').click(function() {
            var $feedItem = $(this).parent();
            var feed = { id: $feedItem.data('id') };
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                $('#sidebar_clip_list').find('li[data-id='+feed.id+']').remove();
            } else {
                $(this).addClass('on');
                feed.title = $feedItem.find('.title-txt').text();
                feed.src = $feedItem.find('.title-img').attr('src');
                $('#sidebar_clip_list').append(getSmallFeedBoxHtml(feed));
                bindBoardEvent();
            }
        });

        $('#board_clip_btn').unbind('click').click(function() {
           // TODO: 서버에 클립 리퀘스트 요청
        });
    }

    /**
     * 보드 아이템 관련 이벤트 바인딩
     */
    function bindBoardEvent() {
        $('#sidebar_clip_list .card-delete-btn').unbind('click').click(function() {
            var $boardItem = $(this).parent().parent();
            var feedId = $boardItem.data('id');
            $boardItem.remove();
            $('#feed_list_panel').find('li[data-id='+feedId+']').children('.clip-icon-circle').removeClass('on');
        });
    }

    function getFeedBoxImageSrc(description) {
        var defaultImageSrc = '/images/card_no_image.png';
        if (!description) return defaultImageSrc;
        return $(description).find('img').first().attr('src') || defaultImageSrc;
    }

    function getFeedBoxHtml(feed) {
        var html =
            '<li data-id="'+feed._id+'">'+
                '<span class="clip-icon-circle">'+
                    '<img src="/images/clip_btn.png" align="center">'+
                '</span>'+
                '<div class="img-box">'+
                    '<img class="title-img" src="'+feed.image+'" align="middle">'+
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

    function getSmallFeedBoxHtml(feed) {
        var html =
            '<li data-id="'+feed.id+'">'+
                '<div class="img-wrapper">'+
                    '<img class="card-delete-btn" src="/images/card_delete_icon.png">'+
                    '<img class="card-image" src="'+feed.src+'">'+
                    '<span class="title-wrapper">'+
                        '<p>'+feed.title+'</p>'+
                    '</span>'+
                '</div>'+
            '</li>';
        return html;
    }

    function initWookmark() {
        var handler = null,
            isLoading = false,
            apiURL = 'http://www.wookmark.com/api/json/popular',
            container = '#feed_list_panel',
            $loaderCircle = $('#loaderCircle'),
            wookmark = undefined,
            options = {
                offset: 12, // Optional, the distance between grid items
                itemWidth: 251 // Optional, the width of a grid item
            };
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
            isLoading = true;
            $loaderCircle.show();

            HttpUtil.getData('/feed/user/id/55b4a8955c91698d7c449146', params, function(err, data) {
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
            var length = feedData.length;
            var html = '';
            var i;

            if (length === 0) {
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
        $(document).bind('scroll', onScroll);
        // Load first data from the API.
        loadData();
    }


    $(document).ready(function() {
        init();
    });
}());