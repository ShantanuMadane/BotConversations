/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var cookie = document.cookie;
    var apikey = cookie.split('=')[1];
    var botname = getUrlParameter('name');
    var start = getUrlParameter('start');
    var end = getUrlParameter('end');
$(function () {
    
    var url = "https://api.gupshup.io/analytics/bot/" + botname + "/userdetails?start=" + start + "&end=" + end;
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
           // console.log(data);
            userlistobject.generateUserListTable(data, function (data) {
                if (data) {
                   // console.log("CALL ANOTHER PAGE");
                }
            });


        }

    });
});
$('body').on("click", ".viewconv", function () {
 //console.log($(this).parents().parents('tr:first').find('td:nth-child(2)').text());
 var channel=$(this).parents().parents('tr:first').find('td:nth-child(1)').text();
 var uname=$(this).parents().parents('tr:first').find('td:nth-child(2)').text();
 var sender=$(this).parents().parents('tr:first').find('td:nth-child(3)').text();
 var epoch=$(this).parents().parents('tr:first').find('td:nth-child(4)').data('epoch');
  console.log(channel + uname + sender + epoch);
  //document.cookie = "username="+apikey;+";"+"channel="+channel+"uname="+uname+";"+"epoch="+epoch+";"+"sender="+sender;
  console.log(document.cookie);
  window.location.href = "./user-bot-conversations.html?ch="+channel+"&sen="+sender+"&un="+uname+"&str="+start+"&end="+end+"&bot="+botname+"&epoch="+epoch;
  
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
};
var userlistobject = {
    generateUserListTable: function (data, callback) {
        var $html = '';
      //  console.log(typeof data);
        var data = JSON.parse(data);
//        console.log(data);
//        console.log(data[0][0]);
        $html += '<table class="table table-bordered userlisttab">';
        $html += '<thead>';
        $html += '<tr>';
        $html += '<th>' + data[0][0] + '</th>';
        $html += '<th>' + data[0][1] + '</th>';
        $html += '<th>' + data[0][2] + '</th>';
        $html += '<th>' + data[0][3] + '</th>';
        $html += '<th>View Conversation</th>';
        $html += '</tr>';
        $html += '</thead>';
        $html += '<tbody>';
        if (data.length > 1) {
            for (var i = 1; i < data.length; i++) {
                $html += '<tr>';
                $html += '<td class="bot-desc">' + data[i][0] + '</td>';
                $html += '<td>' + data[i][1] + '</td>';
                $html += '<td>' + data[i][2] + '</td>';
                var newdate=new Date(data[i][3]);
                $html += '<td data-epoch="'+data[i][3]+'">' +newdate.getFullYear()+"/"+ newdate.getMonth()+"/"+newdate.getDate() + '</td>';
                $html += '<td class="center-align"><button type="button" class="btn btn-success btn-sm convbtn viewconv">View</button></td>';
                $html += '</tr>';
            }
        } else {
            $html += '<tr>';
            $html += '<td clospan=5>No Data Found</td>';
            $html += '</tr>';
        }
        $html += '</tbody>';
        $html += '</table>';
        $('.usertab').html($html);
        return callback(1);
    }

};