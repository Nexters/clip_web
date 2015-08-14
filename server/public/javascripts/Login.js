(function login() {
    function init() {
        $('#signin_btn').click(function() {
            console.log($('#input_email').val());

            if($('#input_email').val()==""){
                alert("이메일 주소를 입력하세요.");
                $('.id').focus();
                return false;
            }else if($('.pw').val()==""){
                alert("비밀번호를 입력하세요.");
                $('.pw').focus();
                return false;
            }else{
                alert("로그인 했습니다.");
            }
        });
    }

    $(document).ready(function() {
        init();
    });


}());

