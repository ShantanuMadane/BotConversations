var cookie = document.cookie;
var apikey = cookie.split('=')[1];
var channel = getUrlParameter('ch');
var sender = getUrlParameter('sen');
var unm = getUrlParameter('un');
var start = getUrlParameter('str');
var end = getUrlParameter('end');
var botname = getUrlParameter('bot');
$(function () {
    if (cookie != '') {
        console.log("COOKIE");
        console.log(cookie);
        var url = "https://api.gupshup.io/analytics/bot/" + botname + "/callbacklogs?start=" + start + "&end=" + end;
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "apikey": apikey,
                "cache-control": "no-cache",
            },
            "success": function (data) {
                //console.log(data);
                conversationobject.findConvData(data, function (data) {
                    if (data) {
                        //  console.log(data);
                        conversationobject.printconversation(data, function (data) {
                            if (data) {
                                // console.log("FINAL DATA");
                                //console.log(data);
                                $('.chatconvtab').html(data);
                            }
                        });
                    }
                });
            }

        });
    } else {
        console.log("IN ELSE");
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location = "../../index.html";
    }
    $('#logout').on('click', function () {
        //document.cookie=""; 
        console.log("In LOGOUT");
        document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        //$.cookie("username", null);
        //document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        //console.log(document.cookie);
        window.location = "../../index.html";
    });
});
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
;
var conversationobject = {
    findConvData: function (data, callback) {
        var mainobj = {};
        mainobj.result = [];
        var data = JSON.parse(data);
        // console.log(data);
        for (var i = 1; i < data.length; i++) {
            if (data[i][5] == sender) {
                if (data[i][0] == channel) {
                    if (data[i][4] == unm) {
                        if (start < data[i][1] < end) {
                            mainobj.result.push(data[i]);
                        }
                    }
                }
            }

        }
        return callback(mainobj);
    },
    printconversation: function (data, callback) {
        //console.log(data);
        //console.log(typeof data );
        //var data = JSON.parse(data);
        //console.log(data.result.length);
        var $html = '';
        $html += '<ul class="chat">';
        conversationobject.buildconversation($html, data, function ($html) {
            if ($html)
                $html += '</ul>';
            return callback($html);
        });
        // console.log($html);



    },
    buildconversation: function ($html, data, callback) {
        for (var i = 0; i < data.result.length; i++) {
             console.log(data.result[1]);
            var flag = 0;
            $html += '<li class="left clearfix"><span class="chat-img pull-left">';
            $html += '<img src="http://placehold.it/50/55C1E7/fff&amp;text=U" alt="User Avatar" class="img-circle">';
            $html += '</span>';
            $html += '<div class="chat-body clearfix">';
            $html += '<div class="header">';
            $html += '<strong class="primary-font">' + data.result[i][4] + '</strong> <small class="pull-right text-muted">';
            $html += '<span class="glyphicon glyphicon-time"></span></small>';
            $html += '</div>';
            $html += '<p class="bubble">';
            $html += data.result[i][2];
            $html += '</p>';
            $html += '</div>';
            $html += '</li>';
            $html += '<li class="right clearfix"><span class="chat-img pull-right">';
            $html += '<img src="http://placehold.it/50/FA6F57/fff&amp;text=ME" alt="User Avatar" class="img-circle">';
            $html += '</span>';
            $html += '<div class="chat-body clearfix">';
            $html += '<div class="header">';
            $html += '<small class=" text-muted"><span class="glyphicon glyphicon-time"></span></small>';
            $html += '<strong class="pull-right primary-font"></strong>';
            $html += '</div>';
           
            try {
                var res = JSON.parse(data.result[i][3]);
            } catch (e) {
                var res = data.result[i][3];
            }
            //console.log(res);
            if (typeof res == "object") {
                if (res.type == "image") {
                    // console.log(res);
                    //console.log("image:"+res.originalUrl);
                    $html += "<img class='pull-right' style='width:10%;height:10%' src='" + res.originalUrl + "'>";
                    flag = 1;
                } else if (res.type == "audio") {
                    $html += '<audio controls >';
                    $html += '<source src = "' + res.url + '" type = "audio/mpeg" >';
                    $html += '</audio>';
                } else if (res.type == "video") {
                    $html += '<video width="20%" height="20%" controls>';
                    $html += '<source src="' + res.url + '" type="video/mp4">';
                    $html += '</video>';

                } else if (res.type == "poll") {
                    //console.log(res);
                    $html += '<div class="col-md-2 pull-right" style="background-color:#E3E0DE;padding:5px;margin-bottom:0px">';
                    $html += '<ul class="list-group" style="margin-bottom:0px">';
                    $html += '<li class="list-group-item">' + res.question + '</li>';
                    $html += '<li class="list-group-item">yes</li>';
                    $html += '<li class="list-group-item">no</li>';
                    $html += '</ul>';
                    $html += '</div>';
                    flag = 1;
                } else if (res.type == "survey") {
                    //console.log(res);
                    $html += '<div class="col-md-4 pull-right bubble2" style="padding:5px;margin-bottom:0px;margin-right:10px">';
                    $html += '<ul class="list-group" style="margin-bottom:0px">';
                    $html += '<li class="list-group-item">' + res.question + '</li>';
                    for (var k = 0; k < res.options.length; k++) {
                        $html += '<li class="list-group-item">' + res.options[k] + '</li>';
                    }
                    $html += '</ul>';
                    $html += '</div>';
                    flag = 1;
                } else if (res.type == "catalogue") {
                   // console.log("catalogue");
                    flag=1;
                    $html+='<div class="row">';
                    for(var k=0;k<res.items.length; k++){
                        $html+='<div class="col-md-2 pull-right" style="background-color:#E3E0DE;padding:5px;margin-bottom:0px;margin-right:10px">';
                        $html+='<ul class="list-group" style="margin-bottom:0px;text-align:center">';
                        $html+='<li class="list-group-item">'+res.items[k].title+'</li>';
                        $html+='<li class="list-group-item"><button type="button" class="btn btn-primary btn-sm">'+res.items[k].options[0].title+'</button></li>';
                        try{
                            if(res.items[k].options[1].title){
                                 $html+='<li class="list-group-item"><button type="button" class="btn btn-primary btn-sm">'+res.items[k].options[1].title+'</button></li>';
                            }
                            else if(res.items[k].options[2].title){
                                 $html+='<li class="list-group-item"><button type="button" class="btn btn-primary btn-sm">'+res.items[k].options[2].title+'</button></li>';
                            }
                        }
                        catch(e){
                            
                        }
                         
                        $html+='</ul>';
                        $html+='</div>';
                    }
                  
                    $html+='</div>'        
//                    $html += '<div class="col-md-2 cattab">';
//                    $html += '<table class="table table-bordered" style="padding:1px">';
//                    $html += '<thead>';
//                    $html += '<tr>';
//                    $html += '<th>Title</th>';
//                    $html += '<th>Button 1</th>';
//                    $html += '<th>Button 2</th>';
//                    $html += '<th>Button 3</th>';
//                    $html += '</tr>';
//                    for (var k = 0; k < res.items.length; k++) {
//                        $html += '<tr>';
//                        $html += '<td>' + res.items[k].title + '</td>';
//                        $html += '<td>' + res.items[k].options[0].title + '</td>';
//                        try {
//                            $html += '<td>' + res.items[k].options[1].title + '</td>';
//                        } catch (e) {
//                            $html += '<td></td>';
//                        }
//                        try {
//                            $html += '<td>' + res.items[k].options[2].title + '</td>';
//                        } catch (e) {
//                            $html += '<td></td>';
//                        }
//                        $html += '</tr>';
//                    }
//                    $html += '</thead>';
//                    $html += '</table>';
//                    $html += '</div>';
                } else {
                    flag = 1;
                    $html += data.result[i][3];
                }

            }
            if (flag == 0){
                 $html += '<p class="bubble2 pull-right">';
                $html += data.result[i][3];
                $html += '</p>';
            }
            
            $html += '</div>';
            $html += ' </li>';
        }
        return callback($html);
    }
};