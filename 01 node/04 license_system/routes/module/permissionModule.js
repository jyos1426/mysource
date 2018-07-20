var ROOT_PATH = '/home1/seriallicense';

//수정 국가 권한 확인
exports.checkPermission = function( serial, user){

    // 관리자 계정일 때
    if(user.permission == '0'){
        return true;
    }
    console.log(user);
    console.log(serial);

    var result = false;

    //해당 시리얼에 유저의 권한이 있는지 확인
    var nation_code = serial.slice(1,3);

    if(nation_code == 'KR')
        result = user.kr =='1';
    else if(nation_code == 'JP')
        result =  user.jp =='1';
    else if(nation_code == 'US')
        result =  user.us =='1';
    else if(nation_code == 'CN')
        result =  user.cn =='1';
    else if(nation_code == 'TW')
        result =  user.tw =='1';
    else if(nation_code == 'TH')
        result =  user.th =='1';
    else if(nation_code == 'SG')
        result =  user.sg =='1';
    else if(nation_code == 'MY')
        result =  user.my =='1';
    else if(nation_code == 'NZ')
        result =  user.nz =='1';

    return result;
}

//수정 국가 권한 확인 (list)
exports.checkPermissions = function( serials , user){

    // 관리자 계정일 때
    if(user.permission == '0'){
        return true;
    }
    var result = true;

    //해당 시리얼들에 유저의 권한이 있는지 확인
    for(var i = 0 ; i < serials.length; i++){
        var nation_code = serials[i].ser.slice(1,3);

        if(nation_code == 'KR')
            result = user.kr =='1';
        else if(nation_code == 'JP')
            result =  user.jp =='1';
        else if(nation_code == 'US')
            result =  user.us =='1';
        else if(nation_code == 'CN')
            result =  user.cn =='1';
        else if(nation_code == 'TW')
            result =  user.tw =='1';
        else if(nation_code == 'TH')
            result =  user.th =='1';
        else if(nation_code == 'SG')
            result =  user.sg =='1';
        else if(nation_code == 'MY')
            result =  user.my =='1';
        else if(nation_code == 'NZ')
            result =  user.nz =='1';
        else result = false;

        if( result == false ) return false;
    }
    return result;
}

// //수정 국가 권한 확인
// exports.checkPermission = function( serial, nation_permission){
// 	var sql = `
// 		SELECT kr, jp, en
// 		FROM admin
// 		WHERE id = ?
// 		`;
// 	var data = [id];

// 	conn_obj.conn.getConnection(function(err, connection){
// 		connection.query(sql, data, function(err, rows, fields){
// 			if(err){
// 				connection.release();
// 				console.log(err);
// 				return {
// 					result:'err',
// 					data : false
// 				};
// 			}
// 			connection.release();

// 			var result = false;
// 			//해당 시리얼에 유저의 권한이 있는지 확인
// 			var nation_code = serial.slice(1,3);
// 			// if(nation_code == 'KR') result = rows.kr =='1';
// 			// if(nation_code == 'JP') result =  rows.jp =='1';
// 			// if(nation_code == 'EN') result =  rows.en =='1';
// 			// return {
// 			// 	result:'success',
// 			// 	data : result
// 			// };
// 			return rows;
// 		});
// 	});
// }