

(function () {
    'use strict';

    var userData;
    var newUserData = {};

    function login() {
        var email = $('#input_email').val();
        var passwd = $('#pw').val();

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
                location.href="/user";
                return false;
            });
            return false;
        }
    }


    function init() {

        <!-- modal 버튼 부분 -->
        $('#forgot_pw').click(function() {
            $('#pw_modal').modal('show');
            initModal();
        });

        $('#signin_btn').click(function() {
            login();
        });
        $('#input_email').keypress(function(e) {
           if (e.which === 13) {
               login();
           }
        });
        $('#pw').keypress(function(e) {
            if (e.which === 13) {
                login();
            }
        });

    }

    function initModal() {
        $.extend(true, newUserData, userData);

        $('#tem_pw_btn').click(function() {
            var email = $('#forgot_input').val();
            HttpUtil.putData('/user/passwd/'+email, {}, function (err) {
                console.log(err);
                if (err || null) return alert('저장 실패!');

                <!-- 공백(스페이스) 입력시  -->
                var blank_pattern = /[\s]/g;
                if( blank_pattern.test(email) == true){
                    alert(' 공백은 사용할 수 없습니다.');
                    return false;
                }
                <!-- 아무것도 입력하지 않았을때 -->
                if(email == "") return alert('이름을 입력해주세요.');

                alert('abc123 으로 변경했다잉');
                return true;

            });
        });
    }


    $(document).ready(function() {
        init();
    });
}());


