// winsdow onload

var certticker = null;

$modal_account_info = $('#modal_account_info');

$(function(){
    /*
     * sidemenu active 적용 스크립트
     */
    // sidemenu - depth 1
    var pathname = '/' + document.location.pathname.split('/')[1];
    // console.log(pathname);
    $('ul.sidebar-menu > li > a[href="' + pathname + '"]').parent().addClass('active');

    // sidemenu - depth 2
    if(document.location.pathname.split('/').length > 2) {
        var pathname2 = pathname + '/' + document.location.pathname.split('/')[2];
        $('ul.sidebar-menu > li > a[href="' + pathname2 + '"]').parent().addClass('active');
        $('ul.treeview-menu > li > a[href="' + pathname2 + '"]').parent().addClass('active');
    }


    /*
     * mk.hbs test jstree render
     */
    // $('#mk').jstree({
    //     'core': {
    //         'themes': {
    //             'name': 'proton',
    //             'responsive': true
    //         }
    //     }
    // });

    /*
     * Header RankUp
     */
    CertTickerStart();

    // $("select").select2();

    $modal_account_info.find('form').submit(SubmitAccountMyInfo);
});

// moment.updateLocale('en', {
//     relativeTime : {
//         future: "in %s",
//         past:   "%s ago",
//         s:  "seconds",
//         m:  "a minute",
//         mm: "%d minutes",
//         h:  "an hour",
//         hh: "%d hours",
//         d:  "a day",
//         dd: "%d days",
//         M:  "a month",
//         MM: "%d months",
//         y:  "a year",
//         yy: "%d years"
//     }
// });

// KRankUp
// (function($) {
//     var default, private, public, data;

//     default = {
//         height: '50px',
//         icon: 'fa fa-share-square',
//         intervalTime: 2000
//     };

//     private = {

//     };

//     public = {
//         init: function() {

//         },
//         start: function() {

//         },
//         stop: function() {

//         },
//     };

//     return $.fn.KRankUp = function(method) {
//         if(public[method]) {
//             return public[method].apply(this, Array.prototype.slice.call(arguments, 1));
//         }

//         if(typeof method === "object" || !method) {
//             return public.init.apply(this, arguments);
//         }

//         return $.error('error: ' + method);
//     }
// })(jQuery);

// Header Certificate Update Ticker
function CertTickerStart() {
    $('.k-rankup').append('<span class="k-rankup-list" style="border:1px white solid;"><i class="k-rankup-icon fa fa-share-square" style="font-size:22px;"></i> <span class="k-rankup-text"><b></b></span> <small class="hidden-xs"><i class="fa fa-clock-o"></i> <span class="k-rankup-time"></span></small></span>');

    var data = [
        {
            name:"IPS v8.0 (NA3140B16921-001)",
            time: '2016-09-27 14:19:00',
            fail: 0,
        }, {
            name:"DDX v6.5 (NA3140B16921-123)",
            time: '2016-09-27 14:20:00',
            fail: 1,
        }, {
            name:"APTX v4.5 (NA3140B16921-001)",
            time: '2016-09-27 14:21:00',
            fail: 0,
        },
    ];
    var idx = 0;

    var $el = $('.k-rankup .k-rankup-list');

    $el.find('.k-rankup-icon').css({color:(data[0].fail == 0 ? '#FF856D' : '#19A05F')});
    $el.find('.k-rankup-text b').text(data[0].name);
    $el.find('.k-rankup-time').text(data[0].time.substr(11,5));

    certticker = setInterval(function() {
        $el.hide("slide", { direction: "up" }, 500, function(){
            if(idx+1 < data.length){
                idx++;
            } else {
                idx = 0;
            }

            $el.find('.k-rankup-icon').css({color:(data[idx].fail == 0 ? '#FF856D' : '#19A05F')});
            $el.find('.k-rankup-text b').text(data[idx].name);
            $el.find('.k-rankup-time').text(data[idx].time.substr(11,5));
            $el.find('.k-rankup-time').attr('title', data[idx].time);

            $el.show("slide", { direction: "down" }, 500);
        });
    },5000);
}

function CertTickerStop() {
    clearInterval(certticker);
}

function ShowDetailRequest() {
    swal("상세보기", "상세보기 페이지 입니다", "success")
}

function DoLogout() {
    $.ajax({
        url: '/logout',
        method: 'GET',
        success: function(data){
            var msg = "로그아웃이 정상적으로 처리되었습니다.";
            if(typeof swal !== 'undefined'){
                swal("완료", msg, "success").then(function(){
                    window.location.href = "/login";
                });
            } else {
                alert(msg);
                window.location.href = "/login";
            }
        },
        error: function(request,status,error) {
            var msg = "code:"+request.status+"\n"+"error:"+error+"\n"+request.responseText;
            console.log(msg);
            if(typeof swal !== 'undefined'){
                swal("Error", msg, "error");
            } else {
                alert(msg);
            }
            msg = null;
        },
    });
}

// ============================================================================

// ============================================================================

/**
 * Utilities
 */
function MakeToken(i, p){
    var token = CryptoJS.SHA256(i+p).toString(CryptoJS.enc.Hex);
    return token;
}

// ============================================================================

/**
 * Modal - My account setting
 */

/**
 * [ShowDetailMyInfo description] : Popup detail info at My account
 * @param {[string]} id [user id] ex) 'admin'
 */
function ShowDetailMyInfo(id){
    var param = {
        id: id
    };

    $.ajax({
        url: "/api/settings/account",
        method: "get",
        data: param,
        dataType: "json",
        success: function(xhr){
            var data = xhr;

            if(data.length > 0){
                var user = data[0];

                // data map
                $modal_account_info.find('#inputID').empty().data('id', user.id).text(user.id);
                $modal_account_info.find('#inputAuth').empty().append(fAccountAuth(user.authority));
                $modal_account_info.find('#inputName').val(user.name);

                $modal_account_info.find('#inputPassword').val('')
                $modal_account_info.find('#inputNewPassword').val('')
                $modal_account_info.find('#inputConfirm').val('')

                $modal_account_info.find('#inputAccessIP').val(user.access_address);
                $modal_account_info.find('#inputEmail').val(user.email);
                $modal_account_info.find('#inputDept').val(user.dept);
                $modal_account_info.find('#inputPhone').val(user.phone);

                // show modal
                $modal_account_info.modal();
            } else {
                swal("Error", "데이터를 찾을 수가 없습니다. 현상이 반복되면 관리자에게 문의해주세요", "error")
            }
        },
        error: function(request,status,error) {
            var msg = "code:"+request.status+"\n"+"error:"+error+"\n"+request.responseText;
            console.log(msg);
            if(typeof swal !== 'undefined'){
                swal("Error", msg, "error");
            } else {
                alert(msg);
            }
            msg = null;
        },
    });
}

/**
 * [SubmitAccountMyInfo description] : Update changing info to My Account
 */
function SubmitAccountMyInfo(){

    var id = $modal_account_info.find('#inputID').data('id');
    var name = $modal_account_info.find('#inputName').val();
    var password = $modal_account_info.find('#inputPassword').val();
    var confirm = $modal_account_info.find('#inputConfirm').val();
    var accessip = $modal_account_info.find('#inputAccessIP').val();
    var email = $modal_account_info.find('#inputEmail').val();
    var dept = $modal_account_info.find('#inputDept').val();
    var phone = $modal_account_info.find('#inputPhone').val();

    var param = {
        id: id,
        name: name,
        password: ((password.length > 0) ? MakeToken(id, password) : null),
        access_address: accessip,
        email: email,
        dept: dept,
        phone: phone
    };

    $.ajax({
        url: "/api/settings/account",
        method: "post",
        data: param,
        dataType: "json",
        success: function(xhr){
            $modal_account_info.find('.close').trigger('click');

            var msg = "정상적으로 입력하신 내용이 적용되었습니다.";
            if(typeof swal !== 'undefined'){
                swal('완료', msg, 'success').then(function(){
                    window.location.reload(true);
                });
            } else {
                alert(msg);
                window.location.reload(true);
            }
        },
        error: function(request,status,error) {
            var msg = "code:"+request.status+"\n"+"error:"+error+"\n"+request.responseText;
            console.log(msg);
            if(typeof swal !== 'undefined'){
                swal("Error", msg, "error");
            } else {
                alert(msg);
            }
            msg = null;
        },
    });
}

function ShowDetailCertInfo(cert_serial){
    $.ajax({
        url: '/api/cbib/cert_issue_list/' + cert_serial,
        method: 'get',
        dataType: 'json',
        success: function(xhr){
            var data = xhr.data;
            var cert = xhr.cert;

            $modal_issue_publish.find('#btnCertDownload').attr("href", "/api/cbib/cert_issue_list/download/" + cert_serial);

            // console.log(cert)
            $modal_issue_publish.find('#issue_certpath').empty().append(fIssueCertPath(data.cert_path));

            var dataInfo = [{
                kind: "발급일자",
                value: fDatetime(data.ctime)
            }, {
                kind: "인증서 일련번호",
                value: data.cert_serial
            }, {
                kind: "그룹명",
                value: data.top_node_name
            }, {
                kind: "객체명",
                value: data.sub_node_name
            }, {
                kind: "기관",
                value: data.organize_name
            }, {
                kind: "장비코드",
                value: data.device_code
            }, {
                kind: "MAC 주소",
                value: data.ether_addr
            }, {
                kind: "장비 IP",
                value: data.device_ip
            }, {
                kind: "유효성 체크",
                value: fVerifyCertification(data.DB_type)
            }]
            $('#tblInfo').bootstrapTable('load', dataInfo);

            // $modal_issue_publish.find('#issue_ctime').empty().append(data.ctime);
            // $modal_issue_publish.find('#issue_serial').empty().append(data.cert_serial);
            // $modal_issue_publish.find('#issue_tnc').empty().append(data.top_node_code);
            // $modal_issue_publish.find('#issue_snc').empty().append(data.sub_node_code);
            // $modal_issue_publish.find('#issue_on').empty().append(data.organize_name);

            // $modal_issue_publish.find('#issue_dc').empty().append(data.device_code);
            // $modal_issue_publish.find('#issue_ether_addr').empty().append(data.ether_addr);
            // $modal_issue_publish.find('#issue_device_ip').empty().append(data.device_ip);

            var dataSubject = [{
                kind: "Common Name (CN)",
                value: cert.subjects.CN
            }, {
                kind: "Organizational Unit (OU)",
                value: cert.subjects.OU
            }, {
                kind: "Organizaion (O)",
                value: cert.subjects.O
            }, {
                kind: "Domain Component (DC)",
                value: cert.subjects.DC_0
            }, {
                kind : "Domain Component (DC)",
                value: cert.subjects.DC_1
            }, {
                kind: "Locality (L)",
                value: cert.subjects.L
            }, {
                kind: "State (ST)",
                value: cert.subjects.ST
            }, {
                kind: "Country (C)",
                value: cert.subjects.C
            }];
            $('#tblSubjects').bootstrapTable('load', dataSubject);

            var dataProperties = [{
                kind: "Issuer",
                value: cert.properties.issuer
            }, {
                kind: "Subject",
                value: cert.properties.subject
            }, {
                kind: "ValidFrom",
                value: cert.properties.startdate
            }, {
                kind: "ValidTo",
                value: cert.properties.enddate
            }, {
                kind: "Serial Number",
                value: cert.properties.serial
            }, {
                kind: "Key Size",
                value: cert.properties.keysize
            }, {
                kind: "FingerPrint (SHA-1)",
                value: cert.properties.sha1
            }, {
                kind: "FingerPrint (MD5)",
                value: cert.properties.md5
            }];
            $('#tblProperties').bootstrapTable('load', dataProperties);

            $modal_issue_publish.find('#cert_detail').empty().append(cert.detail);



            $modal_issue_publish.modal();
        },
        error: function(request,status,error) {
            var msg = "code:"+request.status+"\n"+"error:"+error+"\n"+request.responseText;
            console.log(msg);
            if(typeof swal !== 'undefined'){
                swal("Error", msg, "error");
            } else {
                alert(msg);
            }
            msg = null;
        },
    });
}

function RevokeCertificate(cert_serial)
{
    $.ajax({
        url: '/api/cbib/cert_issue_list/revoke/' + cert_serial,
        method: 'put',
        dataType: 'json',
        success: function(xhr){
            console.log(xhr);
        },
        error: function(request,status,error) {
            var msg = "code:"+request.status+"\n"+"error:"+error+"\n"+request.responseText;
            console.log(msg);
            if(typeof swal !== 'undefined'){
                swal("Error", msg, "error");
            } else {
                alert(msg);
            }
            msg = null;
        },
    });
}
