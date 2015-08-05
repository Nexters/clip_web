(function main() {
    function init() {
        HttpUtil.getData("/data/test",{aa:"aa"},function(err, data) {
           console.log(data);
        });
    }

    $(document).ready(function() {
        init();
    });
}());