/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function () {
    //alert("hello"); 
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

});

function validate() {
    var apikey = $('#apikey').val();
//    console.log(apikey);
    if (apikey.length <= 0) {
        $('#errmsg').html("Api key connot be empty").css("color", "red").removeClass('hide');
    } else {
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://api.gupshup.io/sm/api/bot/list",
            "method": "GET",
            "headers": {
                "apikey": apikey,
                "cache-control": "no-cache",
            },
            "success": function (data) {
                console.log(data);
                document.cookie = "username="+apikey;
                window.location.href = "./public/html/botlist.html";
            },
            "error": function (err) {
                var res = JSON.parse(err.responseText);
                var errmsg = res["message"];
                $('#errmsg').html(errmsg).css("color", "red").removeClass('hide');
            }
        });

//        $.ajax(settings).done(function (response) {
//            console.log(response);
//        });
    }

}
