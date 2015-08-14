(function login() {
    function init() {
        $('#signin_btn').click(function() {
            console.log($('#input_email').val());
            alert("sing in");
        });
    }

    $(document).ready(function() {
        init();
    });
}());