
$('.board_clip_btn_bg').click(function() {
    $('#setting_modal').modal('show');
});
//사이트 추가
$('#modal_add_btn').click(function(){
    var input = $('#modal_input_site').val();
    if(input==""){
        alert("사이트를 입력해주세요!");
        $('#modal_input_site').focus();
        return falcse;
    }

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
/*
 * 사이트 삭제 */

$('.site-delete-btn').click(function(){
    console.log('click');
    console.log($(this).parent);
});

/*
$('.site-delete-btn').unbind('click').click(function() {
    $('.site_list').remove();
    $('#feed_list_panel').find('li[datbggb a-id='+feedId+']').children('.clip-icon-circle').removeClass('on');
});
*/