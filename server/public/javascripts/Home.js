(function () {

    var ITEM_PER_PAGE = 10;
    var pageNum = 0;
    var isCompleteLoading = false;

    function init() {
        initWookmark();
    }

    function getFeedBoxImageSrc(description) {
        var defaultImageSrc = '/images/card_no_image.png';
        if (!description) return defaultImageSrc;
        return $(description).find('img').first().attr('src') || defaultImageSrc;
    }

    function getFeedBoxHtml(feed) {
        var html =
            '<li>'+
                '<span class="clip-icon-circle">'+
                    '<img src="/images/clip_btn.png" align="center">'+
                '</span>'+
                '<div class="img-box">'+
                    '<img src="'+feed.image+'" align="middle">'+
                '</div>'+
                '<div class="title-box">'+
                    '<p>'+feed.title+'</p>'+
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