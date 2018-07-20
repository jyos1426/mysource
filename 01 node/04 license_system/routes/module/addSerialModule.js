var ROOT_PATH = '/home1/seriallicense';
var commonModule = require(ROOT_PATH + '/routes/module/commonModule.js');
var execSync = require('child_process').execSync;
var fs = require('fs');
var LUS = require(ROOT_PATH + '/routes/model/lus.js');
var ONE = require(ROOT_PATH + '/routes/model/one.js');
var NGFW = require(ROOT_PATH + '/routes/model/ngfw.js');

module.exports.getLimitDate = function(flag, selectDate, plusOneMonth){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var limit_date;

    if(plusOneMonth == 1 ){
        date.setMonth(month +1);
        month = date.getMonth();
    }

    year = date.getFullYear();

    if(flag == 10){
        limit_date = '99991231';
    }else if(flag == 1){
        date.setFullYear(year +1);
        limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 2){
        date.setFullYear(year +2); limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 3){
        date.setFullYear(year +3); limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 4){
        date.setMonth(month +1); limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 0){
        if(selectDate.length != 8){
            return 0;
        }

        var yyyy = parseInt(selectDate.substring(0,4));
        var mm = parseInt(selectDate.substring(4,6)) -1;
        var dd = parseInt(selectDate.substring(6,8));
        date.setFullYear(yyyy);
        date.setMonth(mm);
        date.setDate(dd);

        limit_date = commonModule.getFormatDate(date).type1;
    }

    return limit_date;
}

module.exports.getLimitDate2 = function(_date, flag, selectDate, plusOneMonth){
    if(_date == undefined)
        var date = new Date();
    else
        var date = _date;

    var year = date.getFullYear();
    var month = date.getMonth();

    var limit_date;
    console.log(_date);
    console.log(date);
    if(plusOneMonth == 1 ){
        date.setMonth(month +1);
        month = date.getMonth();
    }

    if(flag == 10){
        limit_date = '99991231';
    }else if(flag == 1){
        date.setFullYear(year +1);
        limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 2){
        date.setFullYear(year +2); limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 3){
        date.setFullYear(year +3); limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 4){
        date.setMonth(month +1); limit_date = commonModule.getFormatDate(date).type1;
    }else if(flag == 0){
        limit_date = selectDate;
    }
    return limit_date;
}


module.exports.getSerialNextNum = function(nextNum, row){//시리얼 뒤에 붙일 숫자값 생성
    var temp;// = 199605;
    var temp_inc = 199605;

    for(var i=0; i<row.length-1; i++){
        if(nextNum.num >= 199605) break;

        temp = row[i].subser;

        if(temp != temp_inc)
            nextNum.num = temp_inc
        temp_inc++;
    }
}

module.exports.check_VPM = function(mac){
    mac += "0000";
    return mac;
}

module.exports.check = function(mac, vpmFlag){
    if(is_valid_mac(mac, vpmFlag)){
        return normalize_mac(mac);
    }
    else{
        return false;
    }
}

function is_valid_mac(mac, vpmFlag){
    var re;

    if(vpmFlag == 1){
        re = /^([a-fA-F0-9]{2}:){3}[a-fA-F0-9]{2}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{4}:){1}[a-fA-F0-9]{4}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{2}\-){3}[a-fA-F0-9]{2}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{4}\-){1}[a-fA-F0-9]{4}$/;
        if(re.test(mac)) return true;

        re = /^[a-fA-F0-9]{8}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{4}\.){1}[a-fA-F0-9]{4}$/;
        if(re.test(mac)) return true;

        return false;
    }else{
        re = /^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{4}:){2}[a-fA-F0-9]{4}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{2}\-){5}[a-fA-F0-9]{2}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{4}\-){2}[a-fA-F0-9]{4}$/;
        if(re.test(mac)) return true;

        re = /^[a-fA-F0-9]{12}$/;
        if(re.test(mac)) return true;

        re = /^([a-fA-F0-9]{4}\.){2}[a-fA-F0-9]{4}$/;
        if(re.test(mac)) return true;

        return false;
    }
}

function normalize_mac(mac_temp){
    mac_temp += '';
    var mac;
    mac = mac_temp.replace(/\./g, '');// a-a.b-b.c-c.d-d -> a-ab-bc-cd-d
    mac = mac.replace(/\-/g, ':');// a-ab-bc-cd-d -> a:ab:bc:cd:d
    mac = mac.replace(/\:/g, '');// a:ab:bc:cd:d -> aabcccdd
    mac = mac.toUpperCase();
    return mac;
}

module.exports.getLicense = function(serial, macvalid){
    var cmd =  'cd /home1/seriallicense/log/ ; ' + '/home1/seriallicense/util/license_key ' + serial + ' ' + macvalid+' ';
    console.log(cmd);
    execSync(cmd,{timeout: 30000, maxBuffer :200*1024 });
    return fs.readFileSync(ROOT_PATH + '/log/license_key.txt', 'utf8'); // //라이센스 가져오려면 동기식으로 읽어와야 함
}

module.exports.oneORlus = function(serial){
    var lus = new LUS.lus();
    var one = new ONE.one();
    var ngfw = new NGFW.ngfw();

    if(lus.match_lus_value(serial))
        return 1;
    else if(one.match_one_value(serial))
        return 2;
    else if(ngfw.match_ngfw_value(serial))
        return 3;
    else
        return 0
}

// module.exports.getFormatDate = function(date, type){
//     if(type ==1){
//         var year = date.getFullYear();//yyyy
//         var month = (1 + date.getMonth());//one
//         month = month >= 10 ? month : '0' + month;// month 두자리로 저장
//         var day = date.getDate();//d
//         day = day >= 10 ? day : '0' + day;//day 두자리로 저장
//         return  year + '' + month + '' + day;
//     }else{
//         var year = date.getFullYear();//yyyy
//         var month = (1 + date.getMonth());//M
//         month = month >= 10 ? month : '0' + month;// month 두자리로 저장
//         var day = date.getDate();//d
//         day = day >= 10 ? day : '0' + day;//day 두자리로 저장
//         var hour = date.getHours();
//         var minit = date.getMinutes();
//         var sec = date.getSeconds();
//         return  year + '/' + month + '/' + day +' ' +hour+':'+minit+':'+sec;
//     }
// }


//web버전 컬럼 길이가 초과됨 -> 일단 델파이용으로 사용
module.exports.version_info = function(serial){
    var ver_select = '';
    ////////////////////////////
    // ex)                    //
    // S CN SP C EX T 211261  //
    // 0 1  3  5 6  8         //
    ////////////////////////////

    if(serial.substring(5,6) =='S') ver_select =  'solaris';
    else if(serial.substring(5,6) =='L') ver_select = 'linux';
    else if(serial.substring(5,6) =='W') ver_select = 'window';
    else if(serial.substring(5,6) =='E') ver_select = 'sniper(AX)';
    else ver_select = 'sniper';
    ver_select = ver_select + '_';

    if((serial.substring(1,3) == 'KR') && (serial.substring(6,8) == 'HA')) ver_select += 'npk';
    else if ((serial.substring(1,3) != 'KR') && (serial.substring(6,8) == 'HA'))ver_select += 'npe';
    else if ((serial.substring(1,3) == 'US') && (serial.substring(6,8) == 'CR')) ver_select +='cro';
    else if ((serial.substring(1,3) == 'KR') && (serial.substring(6,8) == 'WI')) ver_select += 'kor';
    else if ((serial.substring(1,3) == 'KR') && (serial.substring(6,8) == 'KT')) ver_select += 'kor';
    else if ((serial.substring(1,3) == 'KR') && (serial.substring(6,8) == 'CO')) ver_select += 'kor';
    else if ((serial.substring(1,3) == 'KR') && (serial.substring(6,8) == 'SS')) ver_select += 'kor';
    else if ((serial.substring(1,3) == 'KR') && (serial.substring(6,8) == 'IG')) ver_select += 'kor';
    else if ((serial.substring(1,3) == 'JP') && (serial.substring(6,8) == 'WI')) ver_select += 'jpn';
    else if ((serial.substring(1,3) == 'JA') && (serial.substring(6,8) == 'WI')) ver_select += 'jpn';
    else if ((serial.substring(1,3) == 'US') && (serial.substring(6,8) == 'WI')) ver_select += 'eng';
    else if ((serial.substring(1,3) == 'TW') && (serial.substring(6,8) == 'WI')) ver_select += 'twn';
    else if ((serial.substring(1,3) == 'CN') && (serial.substring(6,8) == 'WI')) ver_select += 'chi';
    else if ((serial.substring(1,3) == 'TH') && (serial.substring(6,8) == 'WI')) ver_select += 'tha';
    else if ((serial.substring(1,3) == 'SG') && (serial.substring(6,8) == 'WI')) ver_select += 'sin';
    else if ((serial.substring(1,3) == 'MY') && (serial.substring(6,8) == 'WI')) ver_select += 'mal';
    else if ((serial.substring(1,3) == 'NZ') && (serial.substring(6,8) == 'WI')) ver_select += 'new';

    else if ((serial.substring(1,3) == 'JP') && (serial.substring(3,5) == 'SG')) ver_select += 'se';
    else if ((serial.substring(1,3) == 'JP') && (serial.substring(3,5) == 'XG')) ver_select += 'sg';
    else if ((serial.substring(1,3) == 'JA') && (serial.substring(3,5) == 'SG')) ver_select += 'se';
    else if ((serial.substring(1,3) == 'JA') && (serial.substring(3,5) == 'XG')) ver_select += 'sg';

    ver_select = ver_select + '_';

    //SNIPER IDS
    if (serial.substring(3,5) == 'SS') ver_select += 'ss';
    else if (serial.substring(3,5) == 'SP') ver_select += 'sp';
    else if (serial.substring(3,5) == 'SE') ver_select += 'se';
    else if (serial.substring(3,5) == 'SG') ver_select += 'sg';
    else if (serial.substring(3,5) == 'SI') ver_select += 'si';
    else if (serial.substring(3,5) == 'SU') ver_select += 'su';
    else if (serial.substring(3,5) == 'ST') ver_select += 'st';
    else if (serial.substring(3,5) == 'S1') ver_select += 's10';
    else if (serial.substring(3,5) == 'S2') ver_select += 's20';
    else if (serial.substring(3,5) == 'S4') ver_select += 's40';
    else if (serial.substring(3,5) == 'S5') ver_select += 's50';
    else if (serial.substring(3,5) == 'S6') ver_select += 's60';

    //SNIPER IPS
    else if (serial.substring(3,5) == 'PT') ver_select += 'pt';

    //SNIPER IPSA
    else if (serial.substring(3,5) == 'A1') ver_select += 'a10';
    else if (serial.substring(3,5) == 'A2') ver_select += 'a20';
    else if (serial.substring(3,5) == 'A4') ver_select += 'a40';

    //SNIPER IPS E/F
    else if (serial.substring(3,5) == 'E1') ver_select += 'e10';
    else if (serial.substring(3,5) == 'E2') ver_select += 'e20';
    else if (serial.substring(3,5) == 'E4') ver_select += 'e40';
    else if (serial.substring(3,5) == 'F4') ver_select += 'f40';
    else if (serial.substring(3,5) == 'E5') ver_select += 'ne5';

    //SNIPER ITMS, TSMA, u-TMS
    else if (serial.substring(3,5) == 'TE') ver_select += 'te';
    else if (serial.substring(3,5) == 'TW') ver_select += 'tw';
    else if (serial.substring(3,5) == 'TA') ver_select += 'ta';

    //SNIPER WAF
    else if (serial.substring(3,5) == 'WS') ver_select += 'ws';
    else if (serial.substring(3,5) == 'WP') ver_select += 'wp';
    else if (serial.substring(3,5) == 'WE') ver_select += 'we';
    else if (serial.substring(3,5) == 'WG') ver_select += 'wg';
    else if (serial.substring(3,5) == 'W5') ver_select += 'w5';

    //SNIPER DDX
    else if (serial.substring(3,5) == 'D1') ver_select += 'd1';
    else if (serial.substring(3,5) == 'DS') ver_select += 'ds';
    else if (serial.substring(3,5) == 'DP') ver_select += 'dp';
    else if (serial.substring(3,5) == 'D5') ver_select += 'd5';
    else if (serial.substring(3,5) == 'DT') ver_select += 'dt';

    //SNIPER DDX CENSOR
    else if (serial.substring(3,5) == 'CT') ver_select += 'ct';
    else if (serial.substring(3,5) == 'CP') ver_select += 'cp';

    //SNIPER IPS V
    else if (serial.substring(3,5) == 'V2') ver_select += 'v20';
    else if (serial.substring(3,5) == 'V4') ver_select += 'v40';
    else if (serial.substring(3,5) == 'V5') ver_select += 'v50';
    else if (serial.substring(3,5) == 'VT') ver_select += 'v10';

    //SNIPER VF
    else if (serial.substring(3,5) == 'I0') ver_select += 'i5';
    else if (serial.substring(3,5) == 'I1') ver_select += 'i15';
    else if (serial.substring(3,5) == 'I2') ver_select += 'i25';
    else if (serial.substring(3,5) == 'I4') ver_select += 'i45';

    //SNIPER BPS.APTX
    else if (serial.substring(3,5) == 'B1') ver_select += 'b10';
    else if (serial.substring(3,5) == 'B2') ver_select += 'b20';
    else if (serial.substring(3,5) == 'B4') ver_select += 'b40';
    else if (serial.substring(3,5) == 'B5') ver_select += 'b50';

    //SNIPER APTX
    else if (serial.substring(3,5) == 'BA') ver_select += 'ba';
    else if (serial.substring(3,5) == 'BB') ver_select += 'bb';
    else if (serial.substring(3,5) == 'BC') ver_select += 'bc';
    else if (serial.substring(3,5) == 'BD') ver_select += 'bd';
    else if (serial.substring(3,5) == 'BE') ver_select += 'be';

    //SNIPER AF
    else if (serial.substring(3,5) == 'UT') ver_select += 'ut';
    else if (serial.substring(3,5) == 'UH') ver_select += 'uh';
    else if (serial.substring(3,5) == 'U1') ver_select += 'u1';
    else if (serial.substring(3,5) == 'U2') ver_select += 'u2';
    else if (serial.substring(3,5) == 'U4') ver_select += 'u4';
    else if (serial.substring(3,5) == 'U5') ver_select += 'u5';


    ver_select  = ver_select.substring(0, 14); //ver 컬럼 길이 14 => 14길이로 자름


    return ver_select;
}