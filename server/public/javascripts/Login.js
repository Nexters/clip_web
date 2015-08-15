(function login() {
    function init() {
        $('#signin_btn').click(function() {
            var email = $('#input_email').val();
            var passwd = $('#pw').val();
            console.log(email);

            if(email==""){
                alert("이메일 주소를 입력하세요.");
                $('#input_email').focus();
                return false;
            }else if(passwd==""){
                alert("비밀번호를 입력하세요.");
                $('#pw').focus();
                return false;
            }else{
                var params = {'email': email, 'pw': passwd}
                HttpUtil.postData('/user/login', params, function(err, data) {
                    if(err != null){
                        alert("로그인이 실패했습니다.");
                        return false;
                    }
                    location.href="/home/" + data;
                    return false;
                });
                return false;
            }
        });
    }

    $(document).ready(function() {
        init();
    });


}());