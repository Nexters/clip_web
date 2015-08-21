$('.sidebar-setting-icon').click(function() {
    $('#setting_modal').modal('show');
});


new Taggle('keyword-box', {
    placeholder: '태그 입력',
    duplicateTagClass: 'bounce'
    //tags: ['These', 'are', 'prefilled', 'tags']
});