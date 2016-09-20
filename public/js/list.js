/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var cookie = document.cookie;
var apikey = cookie.split('=')[1];
$(function () {

    console.log("Cookie:" + document.cookie);

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://api.gupshup.io/sm/api/bot/list",
        "method": "GET",
        "headers": {
            "apikey": apikey,
            "cache-control": "no-cache",
            "cache":false,
        },
        "success": function (data) {
           // console.log(data);
            listObject.generateListTable(data, function (data) {
                $('input[name="daterange"]').daterangepicker({
                    locale: {
                        format: 'YYYY/MM/DD'
                    },
                    startDate: '2016/07/01',
                    endDate: '2016/12/31'
                });
            });

        }

    });


});

$('body').on("click", ".viewUsers", function () {
    $this = $(this);
    var daterange = '';
    var botname = '';
    $this.parent().parent().find("input").each(function () {
        daterange = $(this).val();
    });
    var botname = $(this).parents().parents('tr:first').find('td:first').text();

    var datearr = daterange.split("-");
    var datearr0 = datearr[0].split("/");
    var datearr1 = datearr[1].split("/");
    var startdate = datearr0[0] + "-" + datearr0[1] + "-" + datearr0[2];
    var enddate = datearr1[0] + "-" + datearr1[1] + "-" + datearr1[2];
    var epochstart = new Date(startdate).valueOf();
    var epochend = new Date(enddate).valueOf() - 1;
   // console.log(epochstart);
    //console.log(epochend);
    window.location.href = "./userdetails.html?start="+epochstart+"&end="+epochend+"&name="+botname;

});
var getUrlParameter = function getUrlParameter(sParam) {
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
var listObject = {
    generateListTable: function (data, callback) {
       // console.log(data);
        var $html = '';
        $html += ' <table class="table table-bordered botlisttab">';
        $html += '<thead>';
        $html += '<tr>';
        $html += '<th><label>Bot Name</label></th>';
        $html += '<th class="center-align"><label>View Details From-To</label></th>';
        $html += '<th class="center-align"><label>View User Details</label></th>';
        $html += '</tr>';
        $html += '</thead>';
        $html += '<tbody>';
        for (var i = 0; i < data.length; i++) {
            $html += '<tr>';
            $html += '<td class="bot-desc left-align">' + data[i].name + '</td>';
            $html += '<td class="manage center-align"><input type="text"  class="daterange" name="daterange" readonly/></td>';
            $html += '<td class="center-align"><button type="button" class="btn btn-success btn-sm convbtn viewUsers">View</button></td>'
            $html += '</tr>';
        }
        $html += '</tbody>';
        $html += '</table>';
        $('.tabdiv').html($html);
        return callback(1);
    }
};

