/**
 * Created by jiyeon on 15. 8. 14..
 */





jQuery(function(){

    $(document).ready(function()
    {
        $("#input_name").keyup(function(event){
            if (!(event.keyCode >=37 && event.keyCode<=40)) {
                var inputVal = $(this).val();
                $(this).val(inputVal.replace(/[^a-z0-9]/gi,''));
            }
        });
    });

    $("#signup_btn").click(function(){
        var minLength = 6;
        var $textarea = $('#input_password1');
        var hasError = false;
        var nameval = $("#input_name").val();
        var emailval = $("#input_email1").val();
        var passwordVal = $("#input_password1").val();
        var checkVal = $("#input_conpass").val();

        $(".error").hide();

        if(nameval ==''){
            alert("Name을 입력하세요");
            $("#input_name").focus();

        }
        if($textarea.val().length < minLength) {
            alert('비밀번호를 6자 이상으로 입력해 주세요.');
            return false;
        }
        if (passwordVal != checkVal ) {
            $("#input_conpass").after(function() {
                alert('비밀번호가 다릅니다.');
                $("#input_conpass").focus();
            });
            hasError = true;
        }

        else if(emailval ==''){
            alert('Email을 입력하세요');
            $("#input_email1").focus();


        }

        else if (passwordVal == '') {
            $("#input_password1").after(function() {
                alert('Passwords를 입력하세요');
                $("#input_conpass").focus();

            });
            hasError = true;
        }
        else if (checkVal == '') {
            $("#input_conpass").after(function() {
            alert('비밀번호를 입력해주세요');
            $("#input_conpass").focus();
        });
            hasError = true;
        }

        if(hasError == true) {return false;}
    });
});



    //$(document).ready(function(){
    //    $("#signup_btn").click(function(){
    //        $("#input_email1").hide("fast");
    //    });
    //});

