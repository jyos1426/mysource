/**
 * Bootstrap-table-formatter
 */

function trans_value(value, type, unit) {
    var str = (value * 1) + "";
    value = str.replace(",", "") * 1;

    var res = "";

    if (!is_numeric(value)) {
        return false;
    }
    if (type == null) {
        type = 0;
    }
    if (unit == null) {
        unit = "";
    }

    if (type == 0) {
        if (value > Math.pow(10, 12)) {
            res = (value / Math.pow(10, 12)).toFixed(1) + "조";
        } else if (value > Math.pow(10, 8)) {
            res = (value / Math.pow(10, 8)).toFixed(1) + "억";
        } else if (value > Math.pow(10, 4)) {
            res = (value / Math.pow(10, 4)).toFixed(1) + "만";
        } else if (value > Math.pow(10, 3)) {
            res = (value / Math.pow(10, 3)).toFixed(1) + "천";
        } else {
            res = value.toFixed(0);
        }
    } else if (type == 1) {
        if (value > Math.pow(10, 24)) {
            res = (value / Math.pow(10, 24)).toFixed(1) + "Y";
        } else if (value > Math.pow(10, 21)) {
            res = (value / Math.pow(10, 21)).toFixed(1) + "Z";
        } else if (value > Math.pow(10, 18)) {
            res = (value / Math.pow(10, 18)).toFixed(1) + "E";
        } else if (value > Math.pow(10, 15)) {
            res = (value / Math.pow(10, 15)).toFixed(1) + "P";
        } else if (value > Math.pow(10, 12)) {
            res = (value / Math.pow(10, 12)).toFixed(1) + "T";
        } else if (value > Math.pow(10, 9)) {
            res = (value / Math.pow(10, 9)).toFixed(1) + "G";
        } else if (value > Math.pow(10, 6)) {
            res = (value / Math.pow(10, 6)).toFixed(1) + "M";
        } else if (value > Math.pow(10, 3)) {
            res = (value / Math.pow(10, 3)).toFixed(1) + "K";
        } else {
            res = value.toFixed(0);
        }
    } else if (type == 2) {
        if (value > Math.pow(1024, 8)) {
            res = (value / Math.pow(1024, 8)).toFixed(1) + "Y";
        } else if (value > Math.pow(1024, 7)) {
            res = (value / Math.pow(1024, 7)).toFixed(1) + "Z";
        } else if (value > Math.pow(1024, 6)) {
            res = (value / Math.pow(1024, 6)).toFixed(1) + "E";
        } else if (value > Math.pow(1024, 5)) {
            res = (value / Math.pow(1024, 5)).toFixed(1) + "P";
        } else if (value > Math.pow(1024, 4)) {
            res = (value / Math.pow(1024, 4)).toFixed(1) + "T";
        } else if (value > Math.pow(1024, 3)) {
            res = (value / Math.pow(1024, 3)).toFixed(1) + "G";
        } else if (value > Math.pow(1024, 2)) {
            res = (value / Math.pow(1024, 2)).toFixed(1) + "M";
        } else if (value > Math.pow(1024, 1)) {
            res = (value / Math.pow(1024, 1)).toFixed(1) + "K";
        } else {
            res = value.toFixed(0);
        }
    }
    return res + unit;
}

function isset(value) {
    if (typeof value !== 'undefined' && value) return true;
    else false;
}

function is_numeric(mixed_var) {
    var whitespace =
        " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
        1)) && mixed_var !== '' && !isNaN(mixed_var);
}

// ============================================================================

function fAccountAuth(value, row, index) {
    // console.log("fAccountAuthfAccountAuthfAccountAuthfAccountAuth");
    // console.log(value);
    var auth = parseInt(value);
    var res = "";

    switch (auth) {
        case 0:
            res = "<span class='label label-default' title='최고관리자'>최고관리자</span>";
            break;
        case 1:
            res = "<span class='label label-success' title='관리자'>관리자</span>";
            break;
        case 2:
            res = "<span class='label label-success' title='사용자'>사용자</span>";
            break;
        default:
            res = "<span class='label label-default' title='알수없음'>알수없음</span>";
            break;
    }
    return res;
}

function fAccountEtc(value, row) {
    return "<button class='btn btn-xs btn-default' onclick='ShowDetailUserInfo(\"" + row.id + "\");'>상세보기</button>";
}

function fCSRSubject(value) {
    var res = "";
    switch (value) {
        case "CN":
            res = "Common Name (CN)";
            break;
        case "OU":
            res = "Organizational Unit (OU)";
            break;
        case "O":
            res = "Organization (O)";
            break;
        case "DC":
            res = "Domain Component (DC)";
            break;
        case "L":
            res = "Locality (L)";
            break;
        case "ST":
            res = "State (ST)"
            break;
        case "C":
            res = "Country (C)";
            break;
        default:
            res = value;
            break;
    }

    return res;
}

// ============================================================================
// 발급 인증서 관리 날짜 변경


function IssueDate(value, row) {

    //console.log(value);
    //var cbTime = value.substring(value.length , value.length-6);
    var issueDate = moment(value, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss');
    //var issueTime = moment(cbTime, 'HHmmss').format('HH:mm:ss');
    //console.log(issueDate);
    //console.log(cbTime);
    //console.log(issueTime);
    //console.log(today.format());
    //var issueDate = moment().format('YYYY[-]MM[-]DD');
    return issueDate;
}

function fIssueCertPath(value, row) {
    //console.log(value);
    var certpath = "";

    // console.log('value:', value)

    if (value != null) {
        var issuecertpath = value.split("/");
        certpath = issuecertpath.pop();
        //console.log(certpath);
    } else {
        certpath = "";
    }

    return certpath;
}


function fIssueEtc(value, row) {
    //console.log(row.ctime);
    // console.log("<button class='btn btn-xs btn-default' onclick='ShowDetailIssueInfo(\"" + row.ctime + "\", " + row.top_node_code + " , " + row.sub_node_code + ", " + row.device_code + ");'>상세보기</button>");

    // var a = 1;
    // var b = 2;
    // var c = "test";
    // console.log(a,b,c);
    // alert ("(" a + ", " + b + ", " + c + ")");
    // console.log("테스트 화면1: a, b, c");
    // console.log("테스트 화면2 ('a', 'b', 'c')");
    // console.log("테스트 화면3: (" + a + ", " + b + ", " + c + ")");

    var res = "";

    if (row.cert_serial != null && row.cert_serial.length > 0) {
        // var keys = {
        // 	ctime: row.ctime,
        // 	top_node_code: row.top_node_code,
        // 	sub_node_code: row.sub_node_code,
        // 	device_code: row.device_code,
        // 	organize_name: row.organize_name
        // };
        // var cert_serial = encodeURIComponent(JSON.stringify(keys));

        // console.log("cert_serial");
        // console.log(cert_serial);
        var cert_serial = row.cert_serial || value;

        // return "<button class='btn btn-xs btn-default' onclick='ShowDetailIssueInfo(\"" + row.ctime + "\", \"" + row.top_node_code + "\" , \"" + row.sub_node_code + "\", \"" + row.device_code + "\", \"" + row.cert_path + "\");'>상세보기</button>";
        res = "<button class='btn btn-xs btn-default' onclick='ShowDetailCertInfo(\"" + cert_serial + "\");' title='인증서 상세보기' alt='상세보기'>상세보기</button>";
    }

    return res;
}

function fCertDownload(value, row) {
    // var keys = {
    // 	ctime: row.ctime,
    // 	top_node_code: row.top_node_code,
    // 	sub_node_code: row.sub_node_code,
    // 	device_code: row.device_code,
    // 	organize_name: row.organize_name
    // };
    // var cert_serial = encodeURIComponent(JSON.stringify(keys));

    var cert_serial = row.cert_serial || value;

    return "<a href='/api/cbib/cert_issue_list/download/" + cert_serial + "' class='btn btn-xs btn-default' title='인증서 다운로드' alt='다운로드'><i class='fa fa-download'></i></a>";
}

// function remoteDataEtc(value, row){
// 	return "<button class='btn btn-xs btn-default' onclick='ShowDetailRemoteTableInfo(\"" + row.ctime + "\", \"" + row.top_node_code + "\" , \"" + row.sub_node_code + "\", \"" + row.device_code + "\", \"" + row.cert_path + "\");'>상세보기</button>";
// }


function fRemoteDataSf(value, row, index) {
    var sf = parseInt(value);
    var sfc = "";

    switch (sf) {
        case 0:
            sfc = "<span class='label label-danger'><i class='fa fa-times-circle'> 실패</i></span>";
            break;
        case 1:
            sfc = "<span class='label label-success'><i class='fa fa-check-circle'> 성공</i></span>";
            break;
        default:
            sfc = "<span class='label label-default' title='알수없음'>알수없음</span>";
            break;
    }

    return sfc;
}

function fAuditResult(value, row, index) {
    var sf = parseInt(value);
    var sfc = "";

    switch ( parseInt(sf) ) {
        case 0:
            sfc = "<span class='label label-danger'><i class='fa fa-times-circle'> 실패</i></span>";
            break;
        case 1:
        case 2:
        case 3:
            sfc = "<span class='label label-success'><i class='fa fa-check-circle'> 성공</i></span>";
            break;
        default:
            sfc = "<span class='label label-default' title='알수없음'>알수없음</span>";
            break;
    }

    return sfc;
}

function fDate(value) {
    var res = "";
    var date = moment(value, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss');

    res = "<span data-toggle='tooltip' data-container='body' title='" + date + "' style='cursor:default;'>" + date.substr(0, 11) + "</span>";

    return res;
}

function fTime(value) {
    var res = "";
    var date = moment(value, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss');

    res = "<span data-toggle='tooltip' data-container='body' title='" + date + "' style='cursor:default;'>" + date.substr(11) + "</span>";

    return res;
}

function fDatetime(value) {
    var res = "";
    var date = moment(value, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss');

    res = "<span style='cursor:default;'>" + date + "</span>";

    return res;
}

function fLoginIDCheck(value, row, index) {
    var loginid = (document.querySelector('#inputUserID').value) ? document.querySelector('#inputUserID').value : null;

    console.log(loginid)

    if (loginid && loginid == row.id) {
        return {
            disabled: true
        };
    } else {
        return value;
    }
}

function fTextElipse40(value, row, index) {
    var res = "";
    if (value.length > 60) {
        res = "<span title='" + value + "'>" + value.substr(0, 40) + "...</span>";
    } else {
        res = value;
    }

    return res;
}

function fTextElipse60(value, row, index) {
    var res = "";
    if (value.length > 60) {
        res = "<span title='" + value + "'>" + value.substr(0, 60) + "...</span>";
    } else {
        res = value;
    }

    return res;
}

function fDeviceCode(value) {
    return value.toString();
}

function fTimeline(value) {
    var res = ""
    var date = moment(value, 'YYYYMMDDHHmmss');

    res = "<span data-toggle='tooltip' data-container='body' data-placement='left' title='" + date.format('YYYY-MM-DD HH:mm:ss') + "' style='cursor:default;'>" + date.fromNow() + "</span>";

    return res;
}

function fFile(value) {
    var res = "";

    res = "<span data-toggle='tooltip' data-container='body' title='" + value + "' style='cursor:default;'>" + value.substr(0, 7) + "...</span>";

    return res;
}

function fVerifyCertification(value) {
    var res = '';

    switch (value) {
        case 'V':
            res = '<span class="label label-success" style="color:#fff;"><i class="fa fa-check-circle-o" style="color:#fff;"></i> Verified</span>';
            //background-color:#19A05F;
            break;
        case 'E':
            res = '<span class="label label-warning" style="color:#fff;"><i class="fa fa-exclamation-triangle" style="color:#fff;"></i> Expired</span>';
            break;
        case 'R':
            res = '<span class="label label-danger" style="color:#fff;"><i class="fa fa-trash-o" style="color:#fff;"></i> Revoked</span>';
            break;
        default:
            res = '<span class="label label-default" style="color:#fff;"><i class="fa fa-question-circle-o" style="color:#fff;"></i> Unknown</span>';
    }

    return res;
}

function fCertRevoke(value, row) {
    var cert_serial = row.cert_serial || value;

    return '<a href="javascript:;" class="btn btn-xs btn-default" title="인증서 폐기" alt="폐기" onClick="RevokeCertificate(\'' + cert_serial + '\');"><i class="fa fa-trash"></i></a>';
}


function fTestIsDetected_ing(value, row, index) {
    var sf = parseInt(value);
    var sfc = "";
    if( row.select_value == 1 ){
        sfc = "<span class='label label-default' style='background:#f39c12;'><i class='fa fa-times-circle' style='color:white'> 베이스</i></span>";
    }else if (typeof sf == 'number' && sf == 0) {
        sfc = "<span class='label label-danger'><i class='fa fa-times-circle' style='white'> 미탐지</i></span>";
    }else if (typeof sf == 'number' && sf > 0) {
        sfc = "<span class='label label-success' style='background:#00a65a'><i class='fa fa-circle-o'> 탐지</i></span>";
    }else{    
        sfc = "-";    
    }

    return sfc;
}

function fTestIsDetected_result(value, row, index) {
    var sf = parseInt(value);
    var sfc = "";

    if ( sf == 0 ) {
        sfc = "<span class='label label-danger'><i class='fa fa-times-circle'> 미탐지</i></span>";
    }else if ( sf > 0 ) {
        sfc = "<span class='label label-success' style='background:#00a65a'><i class='fa fa-circle-o'> 탐지</i></span>";
    }else{        
        sfc = "<span class='label label-default' style='background:#f39c12;'><i class='fa fa-times-circle' style='color:white'> 베이스</i></span>";
    }
    return sfc;
}


function floadResult(value, row, index) {
    var sfc = "";

    if (value == 'null' || row.code == 0 ) {
        sfc= "-";
    }else if ( value == 0 ) {
        sfc = "<span class='label label-success' style='background:#00a65a'><i class='fa fa-circle-o'> 정상</i></span>";
    }else{        
        sfc = "<span class='label label-danger'><i class='fa fa-times-circle'> 비정상</i></span>";
    }
    return sfc;
}

function floadCodeStandard(value, row, index) {
    var sfc = '';
    
    if ( value == 0 ) {
        sfc = "<span data-toggle='tooltip' data-placement='right' title='부하 결과의 기준입니다.' style='cursor:default'>[기준]<span>";
    }else{        
        sfc = value;
    }
    return sfc;
}


function fLogInclude_1(value, row, index) {
    var include = parseInt(value);
    var detect = parseInt(row.detect);
    var status = "";

    if(detect > 0 ){    
        switch (include) {
            case 1:
                status = "<span class='label label-success'><i class='fa fa-toggle-on'> 포함</i></span>";
                break;
            default:
                status = "<span class='label label-danger'><i class='fa fa-toggle-off'> 미포함</i></span>";
                break;
        }    
    }else{
        status = "-";
    }

    return status;
}

function fDetectCode(value, row, index) {
    var sf = parseInt(value);
    var sfc = "";

    if ( !isNaN(sf) || value.includes(',') ) {
        sfc = value;        
    }else{
        sfc = "-";
    }

    return sfc;
}

function fSensorConnect(value, row) {
    if(row.status == 0){
        return "<button class='btn btn-xs btn-danger' onclick='connectBtnClick(\"" + encodeURIComponent(JSON.stringify(row)) + "\");'>연결하기</button>";       
    }else{
        return "<button class='btn btn-xs btn-success' onclick='connectBtnClick(\"" + encodeURIComponent(JSON.stringify(row)) + "\");'>연결 중</button>";
    }
 }

function fSensorEdit(value, row) {
    return "<button class='btn btn-xs btn-default' onclick='ShowDutInfo(\"" + encodeURIComponent(JSON.stringify(row)) + "\");'>상세보기</button>";
}

function fSensorDelete(value, row) {
    return "<button class='btn btn-xs btn-default' onclick='SensorDelete(\"" + row.ip + "\");'> <i class='fa fa-trash'></i> </button>";
}

function fSensorStatus(value, row, index) {
    var sf = parseInt(value);
    var status = "";
    switch (sf) {
        case 0:
            status = "<span class='label label-danger'><i class='fa fa-times-circle'> 비활성화</i></span>";
            break;
        case 1:
            status = "<span class='label label-success'><i class='fa fa-check-circle'> 활성화</i></span>";
            break;
        default:
            status = "";
            break;
    }
    return status;
}

function fPcapDelete(value, row) {
    return "<button class='btn btn-xs btn-default' onclick='deletePcap(\"" + encodeURIComponent(JSON.stringify(row)) + "\");'> <i class='fa fa-trash'></i> </button>";
}

function fPcapDownload(value, row) {
    return "<button class='btn btn-xs btn-default' onclick='PcapDownload(\"" + row.filename + "\");'> <i class='fa fa-download'></i> </button>";
}

function fConvertCategory(value) {
    var res = "";
    switch (value) {
        case "0":
            res = "전체";
            break;
        case '1100':
            res = '패턴블럭';
            break;
        case '1300':
            res = 'Web CGI';
            break;
        case '1301':
            res = 'WEBCGI (사용자정의)';
            break;
        case '1500':
            res = '패턴블럭 (사용자정의)';
            break;
        case '2400':
            res = 'RegEx';
            break;
        case '2401':
            res = 'RegEx (사용자정의)';
        break;
        case '2402':
            res = 'RegEx (배포룰)';
            break;
        default:
        res = value;
        break;
    }

    return res;
}

function fConvertDetectTest(value) {
    var res = "";
    switch (value) {
        case "1":
            res = "탐지 검증 테스트";
            break;
        case '2':
            res = '부하 검증 테스트';
            break;
    }

    return res;
}

function fConvertDetectType(value) {
    var res = "";
    switch (value) {
        case "1":
            res = "그룹 테스트";
            break;
        case '2':
            res = '유닛 테스트';
            break;
    }
    return res;
}

function fConvertDetectBacktraffic(value) {
    if (value == '0') {
        return '미사용';
    }else{
        return '사용';
    }
}

function fConvertNull(value) {
    if (value == 'null') {
        return '-';
    }else{
        return value;
    }
}

function fPassword(value) {
    var res = "";
    for( var i = 0; i < value.length; i++){
        res += "*";
    }
    return res;
}

function fTestApplyButton(value, row, index) {
    var strHTML = '';
    if( value == 1 ){
        strHTML += "<button type='button' class='btn btn-primary btn-sm' onclick='setRetest("
                                        +"\"" + row.test_code + "\"" 
                                        + ",\""+row.category  + "\"" 
                                        + "," + row.backtraffic  
                                        + "," + row.interval 
                                        + ",\""+ row.type + "\"" 
                                        + ",\""+ row.backtraffic_dir  + "\"" 
                                        +");'><i class='fa fa-share' aria-hidden='true'> 재적용</i></button>";
    }else{
        strHTML += "<button type='button' class='btn btn-default btn-sm' disabled ><i class='fa fa-share' aria-hidden='true'> 재적용</i></button>";
    }
    return strHTML;
}

function commboFormatter(value, row, index) {
    var sel_0, sel_1, sel_2 = '';
    var strHTML= '';

    if(row.select_value == '1'){
        strHTML += "<select class=\"selDetect btn btn-warning btn-xs dropdown-toggle selectpicker\" onchange=\"onselectChange(this," + index + ");\" data-style=\"btn-primary\">";
        sel_1 = 'selected = true'
    }else if(row.select_value == '2'){
        strHTML += "<select class=\"selDetect btn btn-primary btn-xs dropdown-toggle selectpicker\" onchange=\"onselectChange(this," + index + ");\" data-style=\"btn-primary\">";
        sel_2 = 'selected = true'
    }else{
        strHTML += "<select class=\"selDetect btn btn-danger btn-xs dropdown-toggle selectpicker\" onchange=\"onselectChange(this," + index + ");\" data-style=\"btn-primary\">";
        sel_0 = 'selected = true'
    }

    strHTML += "<option value=\"0\" " + sel_0 + ">None</option>";
    strHTML += "<option value=\"1\" " + sel_1 + ">Base</option>";
    strHTML += "<option value=\"2\" " + sel_2 + ">Select</option>";
    strHTML += "</select>";

    var valReturn = strHTML;
    return valReturn;
}

function fPcapSelect(value, row, index) {  
    
    if(row.select_value == 2){
        var strHTML = "<button type='button' class='btn btn-default btn-xs'"+
                        "onclick='showPcapModal(\"MODAL_DETECT\"," + index +");'"+              
                        "data-toggle='tooltip' data-placement='bottom' title='선택하지 않으면 자동으로 매칭됩니다.'>pcap 선택"+      
                        "</button>";
    }else{
        var strHTML = "<button type='button' class='btn btn-default btn-xs'"+
                        "onclick='showPcapModal(\"MODAL_DETECT\"," + index +");'"+              
                        "data-toggle='tooltip' data-placement='bottom' title='선택하지 않으면 자동으로 매칭됩니다.' disabled>pcap 선택"+      
                        "</button>";
    }
    return strHTML;
}

function fPositionConverter(value, row, index) {
    var position = parseInt(value);
    var status = "";
    switch (position) {
        case 2:
            status = "<span class='label label-success'> select</i></span>";
            break;
        case 1:
            status = "<span class='label label-default' style='background:#f39c12; color:white' > base</i></span>";
            break;
        case 0:
            status = "<span class='label label-danger'> none</i></span>";
            break;
    }
    return status;
}

function fLogInclude(value, row, index) {
    var sf = parseInt(value);
    var status = "";
    switch (sf) {
        case 1:
            status = "<span class='label label-success'><i class='fa fa-toggle-on'> 포함</i></span>";
            break;
        default:
            status = "<span class='label label-danger'><i class='fa fa-toggle-off'> 미포함</i></span>";
            break;
    }

    return status;
}

function fTestCodeLink(value, row, index){

    var str = "";
    str += '<a href="javascript:DetailTestInfo(\''+encodeURIComponent(value)+'\')">'+value+'</a>';
    return str;

}
function fDetailRuleLink(value, row, index){
    var str = "";
    str += '<a href="javascript:detailRuleInfo(\''+index+'\')">'+value+'</a>';
    return str;

}

function fPpsConverter(value){
    var $len = 0;
    var pps = parseInt(value);    
    if( pps >= 1000 * 1000 * 1000 * 1000){ // T
        var Tpps = pps / (1000 * 1000 * 1000 * 1000);
        return Tpps.toFixed($len) + ' Tpps';

    }else if( pps >= 1000 * 1000 * 1000){ // G
        var Gpps = pps / (1000 * 1000 * 1000);
        return Gpps.toFixed($len) + ' Gpps';

    }else if( pps >= 1000 * 1000 ){ // M
        var Mpps = pps / (1000 * 1000);
        return Mpps.toFixed($len) + ' Mpps';

    }else if( pps >= 1000  ){  //k
        var Kpps = pps / 1000;
        return Kpps.toFixed($len) + ' Kpps';

    }else if( pps < 1000 ){ //1000미만 pps
        return pps + ' pps';
    }
}
function fBpsConverter(value){
    var $len = 0;   
    var bps = parseInt(value);  
    if( bps >= 1000 * 1000 * 1000 * 1000){ // T
        var Tbps = bps / (1000 * 1000 * 1000 * 1000);
        return Tbps.toFixed($len) + ' Tbps';

    }else if( bps >= 1000 * 1000 * 1000){ // G
        var Gbps = bps / (1000 * 1000 * 1000);
        return Gbps.toFixed($len) + ' Gbps';

    }else if( bps >= 1000 * 1000 ){ // M
        var Mbps = bps / (1000 * 1000);
        return Mbps.toFixed($len) + ' Mbps';

    }else if( bps >= 1000  ){  //k
        var kbps = bps / 1000;
        return kbps.toFixed($len) + ' Kbps';

    }else if( bps < 1000 ){ //1000미만 bps
        return bps + ' bps';
    }                    
}

function fConsistencyResult(value) {
    var sfc = "";
    if (value == 'null') {
        sfc= "-";
    }else if ( value == 1 ) {
        sfc = "<span class='label label-success' style='background:#00a65a'><i class='fa fa-circle-o'> 정상</i></span>";
    }else{        
        sfc = "<span class='label label-danger'><i class='fa fa-times-circle'> 비정상</i></span>";
    }
    return sfc;
}

function fAutoNumber(value, row, index) {
    return index + 1;
}
