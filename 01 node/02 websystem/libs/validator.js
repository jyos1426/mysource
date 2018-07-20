var ip = require('ip');
var apis = require('./api');
var e = require('./error');
var sensor = require('./sensor');
var time = require('./time');
var db = require('./db');
var config = require('../config');
var path = require('path');
var async = require('async');
var fs = require('fs');
var regEx = require('./regEx');
var category = require('./category');
var ptl = require('../routes/policy/pt-editor/pt-editor-legacy');

//템플릿DB에서 지원하지 않는 Param값이 전달되었는지 확인
exports.isSupportedParams = (api, params, key, val, success, fail = detail) => {
  const columnList = Object.keys(params);
  
  var filterdColumns = columnList.filter((column) => {
    return (column != 'dataType') && (column != 'category_code') && (column != 'attack_code') && (column != 'template_id');
  });

  var invalidColumn = '';
  var res = filterdColumns.every((column) => {
    invalidColumn = column;
    return ptl.getLegacyColumnName(column, val != '65535') != '';
  });

  if (res) success();
  else {
    fail(`${invalidColumn} is not supported param.(not template column)`);
  }
};

//인터페이스 ID 체크
exports.interfaceValidate = (api, params, key, val, success, fail = detail) => {
  var res = true;
  const interfaceList = sensor.interfaceIDList();
  if (interfaceList.indexOf(val) < 0) res = false;

  if (res) success();
  else {
    fail(`id=${val} is invalid value. (${interfaceList})`);
  }
};

//IP 체크
exports.ipValidate = (api, params, key, val, success, fail = detail) => {
  var ipv = params['ipv'];
  if (!ipv) ipv = 4;
  var res = true;

  if (ipv == 4) {
    if (ip.isV4Format(val)) {
      res = regEx.execute('ipv4',val); //256, 257 체크안되서 정규식으로..
    } else {
      res = false;
    }
  } else {
    res = ip.isV6Format(val);
  }

  if (res) success();
  else {
    fail(val + ' is invalid value');
  }
};

//공격명 체크
exports.attackNameValidate = (api, params, key, val, success, fail = detail) => {
  var res = true;
  if (val.length < 3 || val.length > 63) res = false;
  if (res) success();
  else {
    fail(val + ' is invalid value. (attack_name must be between 3-63 characters)');
  }
};

//존재하는 파일명인지 체크
exports.existFileName = (api, params, key, val, success, fail = detail) => {
  switch (api.restAPI) {
    case '/api/policy/ippool/backup':
      var filePath = path.resolve(__dirname, '../backup/ippool/' + val);
      if (path.extname(filePath) != '.ipp') filePath += '.ipp';
      if (!fs.existsSync(filePath)) success();
      else    fail(val + ' is invalid value. (already exists)');
     
      break;
  }
}

//패턴 체크
exports.patternValidate = (api, params, key, val, success, fail = detail) => {
  var res = true;
  if (val.length < 3 || val.length > 127) res = false;
  if (res) success();
  else {
    fail(val + ' is invalid value. (pattern must be between 3-127 characters)');
  }
};

//공격인정횟수 체크
exports.attackRecogizeCountMinMax = (api, params, key, val, success, fail = detail) => {
  var res = true;
  var category = params['category_code'];
  var minVal, maxVal;
  
  //카테고리마다 사양 다름.
  switch (category) {
    case '1500': //사용자정의 패턴블럭
      minVal = 1;
      maxVal = 30000;
      break;
  }

  if (Number(val) < minVal || Number(val) > maxVal) res = false;

  if (res) success();
  else {
    fail(`attack_recognize_count(${val}) is invalid value. (${minVal}-${maxVal})`);
  }
};

//공격인정횟수가 차단인정횟수보다 큰지 체크
exports.attackRecogizeGreaterThanBlockRecognizeCount = (api, params, key, val, success, fail = detail) => {
  var res = true;
  //공격인정횟수는 차단인정횟수보다 같거나 작아야함.
  var block_recoginize_count = params['block_recoginize_count'];
  if (block_recoginize_count) {
    if (Number(block_recoginize_count) < Number(val)) {
      res = false;
    }
  }
 
  if (res) success();
  else {
    fail(`attack_recoginize_count(${val}) is invalid value. (Must be equal to or greater than 'block_recoginize_count' )`);
  }
};

//차단인정횟수 체크
exports.blockRecogizeCountMinMax = (api, params, key, val, success, fail = detail) => {
  var res = true;
  var category = params['category_code'];
  var minVal, maxVal;
  
  //카테고리마다 사양 다름.
  switch (category) {
    case '1500': //사용자정의 패턴블럭
      minVal = 1;
      maxVal = 30000;
      break;
  }

  if (Number(val) < minVal || Number(val) > maxVal) res = false;
  
  if (res) success();
  else {
    fail(`block_recoginize_count(${val}) is invalid value. (${minVal}-${maxVal})`);
  }
};

//차단인정횟수가 공격인정횟수보다 작은지 체크
exports.blockRecogizeLessThanAttackRecognizeCount = (api, params, key, val, success, fail = detail) => {
  var res = true;
  //공격인정횟수는 차단인정횟수보다 같거나 작아야함.
  var attack_recognize_count = params['attack_recognize_count'];
  if (attack_recognize_count) {
    if (Number(attack_recognize_count) > Number(val)) {
      res = false;
    }
  }
 
  if (res) success();
  else {
    fail(`block_recoginize_count(${val}) is invalid value. (Must be equal to or greater than 'attack_recognize_count' )`);
  }
};

//차단시간 체크
exports.blockTimeValidate = (api, params, key, val, success, fail = detail) => {
  var res = true;
  var category = params['category_code'];
  var minVal, maxVal;
  
  //카테고리마다 사양 다름.
  switch (category) {
    case '1500': //사용자정의 패턴블럭
      minVal = 0;
      maxVal = 32767;
      break;
  }

  if (Number(val) < minVal || Number(val) > maxVal) res = false;
  if (res) success();
  else {
    fail(val + ` is invalid value. (${minVal}-${maxVal})`);
  }
};

//RAW값 체크
exports.rawValidate = (api, params, key, val, success, fail = detail) => {
  var res = true;
  var category = params['category_code'];
  var supportedValues = ['0'];
  
  //카테고리마다 사양 다름.
  switch (category) {
    case '1500': //사용자정의 패턴블럭
      supportedValues.push('1');
      break;
  }

  if (supportedValues.indexOf(val) < 0) res = false;

  if (res) success();
  else {
    fail(`raw(${val}) is invalid value. (${supportedValues})`);
  }
};

//protocol값 체크
exports.protocolValidate = (api, params, key, val, success, fail = detail) => {
  var res = true;
  var category = params['category_code'];
  var supportedValues = [];
  
  //카테고리마다 사양 다름.
  switch (category) {
    case '1500': //사용자정의 패턴블럭
      supportedValues.push('6');
      supportedValues.push('17');
      supportedValues.push('1');
      break;
  }

  if (supportedValues.indexOf(val) < 0) res = false;

  if (res) success();
  else {
    fail(`protocol(${val}) is invalid value. (${supportedValues})`);
  }
};

//prefix 체크
exports.prefixValidate = (api, params, key, val, success, fail = detail) => {
  var ipv = params['ipv'];
  if (!ipv) ipv = 4;
  var res = true;

  if (isNaN(val)) res = false;
  else {
    if (ipv == 4) {
      // res = regexIPv4.test(val);
      res = regEx.execute('prefixV4',val);
    } else {
      // res = regexIPv6.test(val);
      res = regEx.execute('prefixV6',val);
    }
  }

  if (res) success();
  else {
    if (ipv == 4) fail(val + ' is invalid value (1-32)');
    else fail(val + ' is invalid value (1-128)');
  }
};

//존재하는 ApplicationID 인지 체크
exports.existApplicationID = (api, params, key, val, success, fail = detail) => {
  var dbPath = path.resolve(config.path.sniper + '/config/app_rec_ar_info.dbb');
  var sql = `SELECT * FROM ar_code where code=${val}`;
  db.select(dbPath, sql, (error, results) => {
    if (error) {
      fail('db internal error');
    } else {
      if (results['rows'].length == 0)
        fail(val + ' is a invalid application id');
      else success();
    }
  });
};

//날짜 체크
exports.dateValidate = (api, params, key, val, success, fail = detail) => {
  var from, to, cur;
  if (params['to']) to = params['to'];
  from = val;

  //현재시간
  cur = time.getCurrentUTCDate();

  //날짜형식인지 체크

  try {
    if (regEx.execute('date',from,'yyyymmddhhmmss')) {
      //현재시간보다 큰지
      // if (cur < from) {
      //   throw from + ' is invalid value (not a past date)';
      // }
    } else {
      throw from + ' is invalid value (yyyymmddhhnnss)';
    }

    if (to) {
      if (regEx.execute('date',to,'yyyymmddhhmmss')) {
        //현재시간보다 큰지
        // if (cur < to) {
        //   throw to + ' is invalid value (not a past date)';
        // }
        //시작날짜가 종료날짜보다 큰경우
        if (from > to) {
          throw from + ' is invalid value (greater than end date)';
        }
      } else {
        throw to + ' is invalid value (yyyymmddhhnnss)';
      }
    }
  } catch (e) {
    return fail(e);
  }

  success();
};

exports.lastdateValidate = (api, params, key, val, success, fail = detail) => {
  //날짜형식인지 체크
  try {
    if (!regEx.execute('date',val,'yyyymmddhhmm')) {
      throw val + ' is invalid last value ';
    }
  } catch (e) {
    return fail(e);
  }

  success();
};

exports.offsetValidate = (api, params, key, val, success, fail = detail) => {
  try {
    if (isNaN(val)) {
      throw val + ' is invalid offset value ';
    }
  } catch (e) {
    return fail(e);
  }

  success();
};

exports.check = (api, params, success, fail = err) => {
  //params 값 유효성 체크
  var keys = Object.keys(params);
  const isBodyParam = api.hasOwnProperty('body');
  var supportedKeys = isBodyParam ? Object.keys(api.body) : Object.keys(api.parameters);
  var asyncTasks = [];
  
  try {
    supportedKeys.forEach(key => {
      //필수파라미터 여부 체크
      const parameter = isBodyParam ? api.body[key] : api.parameters[key];
      if ( parameter.hasOwnProperty('required') && keys.indexOf(key) < 0 ) {
        throw e.detailError('003', key + ' parameter is required');
      }
    });

    keys.forEach(key => {
      var val = params[key];
      //필터 명 체크
      if (supportedKeys.indexOf(key) < 0) {
        throw e.detailError('004', key + ' is not supported parameter');
      }

      //필터 값 체크
      if ((val === '') || (val == undefined)) {
        throw e.detailError('003', key + ' has empty value');
      }

      //필터 값 체크
      const parameter = isBodyParam ? api.body[key] : api.parameters[key];
      
      if (parameter.validators) {
        parameter.validators.every( (v) => {
          switch (v.valueType) {
            case 'range':
              var valueList = v.value.split(',');
              var invalid = true;

              valueList.forEach(value => {
                if (value.indexOf('-') >= 0) {
                  var minVal = Number(value.split('-')[0]);
                  var maxVal = Number(value.split('-')[1]);
                } else {
                  var minVal = value;
                  var maxVal = value;
                }

                if (minVal <= val && maxVal >= val) {
                  invalid = false;
                }
              });

              if (invalid) {
                throw e.detailError('003', `${key}=${val} is out of range (${v.value})`);
                return false;
              }
              break;

            case 'validChar':
              if (v.value.indexOf(val) < 0) {
                throw e.detailError('003', `${key}=${val} is invalid value (${v.value})`);
                return false;
              }
              break;

            case 'function':
              //function 타입들은 async.series로 따로 체크
              //async function들은 try-catch문안에서 throw 되지 않는다.
              //throw 할때 target을 못찾아 에러 발생함.
              //2017/09/25 gusxodnjs

              asyncTasks.push(cb => {
                v.value(
                  api,
                  params,
                  key,
                  val,
                  success => {
                    cb();
                  },
                  detail => {
                    cb(detail);
                    return false;
                  }
                );
              });

              break;
          }
          return true;
        })
      }
    });
    
    // 필터 의존성 체크
    var dRes = null;
    var dError = {
      code: '',
      msg: ''
    };
    supportedKeys
      .filter(key => {
        const parameter = isBodyParam ? api.body[key] : api.parameters[key];
        return parameter.hasOwnProperty('dependencies');
      })
      .every(key => {
        const parameter = isBodyParam ? api.body[key] : api.parameters[key];
        let d = parameter['dependencies'];
        let dKeys = Object.keys(d);
        dRes = null;
        dError.code = '';
        dError.msg = '';

        dKeys.forEach(dKey => {
          if (keys.indexOf(key) >= 0) {
            if (keys.indexOf(dKey) >= 0) {
              let paramVal = params[dKey];

              if (typeof d[dKey] == 'function') {
                //dependencies값이 function인 경우에는 해당 function을 call한다.
                const func = d[dKey];
                async.series([ 
                  (cb) => { func((e, r) => { cb(e, r); }); }
                ], (e, r) => {
                  d[dKey] = r[0];
                  if (d[dKey].indexOf(paramVal) >= 0) {
                    dRes = (dRes === null) ? true : (dRes && true); 
                  }
                });
              } else {
                if (d[dKey].indexOf(paramVal) >= 0) {
                  dRes = (dRes === null) ? true : (dRes && true); 
                }
              }
            } else {
              dRes = (dRes === null) ? true : (dRes && true);
            }
          } else {
            if (keys.indexOf(dKey) >= 0) {
              let paramVal = params[dKey];

              if (typeof d[dKey] == 'function') {
                //dependencies값이 function인 경우에는 해당 function을 call한다.
                const func = d[dKey];
                async.series([ 
                  (cb) => { func((e, r) => { cb(e, r); }); }
                ], (e, r) => {
                  d[dKey] = r[0];
                  if (d[dKey].indexOf(paramVal) >= 0) {
                    dError.code = '003';
                    dError.msg = `If the value of ${dKey} is '${params[dKey]}', then '${key}' parameter be required`;
                    dRes = (dRes === null) ? false : (dRes || false); 
                  } else {
                    dRes = (dRes === null) ? true : (dRes || true);
                  }
                });
              } else {
                if (d[dKey].indexOf(paramVal) >= 0) {
                  dError.code = '003';
                  dError.msg = `If the value of ${dKey} is '${params[dKey]}', then '${key}' parameter be required`;
                  dRes = (dRes === null) ? false : (dRes || false); 
                } else {
                  dRes = (dRes === null) ? true : (dRes || true);
                }
              }
            } else {
              dError.code = '003';
              dError.msg = `If the value of [${dKey}] is '${params[dKey]}', then the '${key}' parameter is not required.`;
              // dError.msg = `${key} is not dependent when the value of ${dKey}=${params[dKey]} ( ${d[dKey]} )`;
              // [${dKey}]의 값이 '${params[dKey]}' 일 때 의존하는 [${key}]는 필요하지 않습니다.
              dRes = (dRes === null) ? false : (dRes || false); 
            }
          }
        });

        return dRes;
      });

    if (!dRes && dRes !== null) {
      throw e.detailError(dError.code, dError.msg);
    }

  } catch (detailError) {
    fail(e.json(detailError.message, detailError.detail));
    return;
  }

  //function 타입들 validation 체크
  if (asyncTasks.length > 0) {
    async.series(
      //비동기 작업함수들 순차적으로 실행
      asyncTasks,

      (err, results) => {
        if (err) fail(e.json('003', err));
        else success();
      }
    );
  } else {
    success();
  }
};

versionCompare = (v1, v2) => {
  //v1이 v2보다 크다. => result: 1
  //v2가 v1보다 크다. => result: -1
  //v1과 v2가 같다. => result: 0

  var arrV1 = v1.split('.');
  var arrV2 = v2.split('.');
  var res = 0;

  arrV1.every((v, i) => {
    if (arrV2.length < i + 1) arrV2.push('0');
    if (Number(v) != Number(arrV2[i])) {
      res = Number(v) > Number(arrV2[i]) ? 1 : -1;
      return false;
    } else {
      return true;
    }
  });

  return res;
};

exports.isSupported = api => {
  var engineVer = api['engine_ver'];
  var chr = engineVer.charAt(0);
  var ver = '';

  switch (chr) {
    case '^':
      ver = engineVer.split(chr)[1];
      return versionCompare(sensor.engineVersion(), ver, chr) >= 0;
      break;
    case '@':
      ver = engineVer.split(chr)[1];
      return versionCompare(sensor.engineVersion(), ver, chr) == 0;
      break;
    default:
      ver = engineVer;
      return versionCompare(sensor.engineVersion(), ver) >= 0;
  }
};

//존재하는 사용자인지 체크
exports.isExistUser = (api, params, key, val, success, fail = detail) => {  
  var query = `select * from user where id = '${val}'`;
	db.select(db.getUserDbPath(), query, function(error, results) {
		if (error) {
			fail('DB internal error');
		} else {
      if (api.method == 'GET') {
        if (results['rows'].length === 0) {
          fail('not exist user');
        } else {
          success();
        }  
      } else if (api.method == 'POST'){
        if (api.restAPI == '/api/config/users/access_address'){
          if (results['rows'].length > 0) {
            success();
          } else {
            fail('exist user');
          }
        } else {
          if (results['rows'].length === 0) {
            success();
          } else {
            fail('exist user');
          }
        }        
      } else {
        if (results['rows'].length > 0) {
          success();
        } else {
          fail('not exist user');
        }
      }
		}
	});
};

exports.userValidate = (api, params, key, val, success, fail = detail) => {  
  if(regEx.execute('id',val)){
    success();
  } else {
    fail(val + ' is invalid value(9 to 12 digits, / English, English + numbers)');
  }  
};

exports.passwordValidate = (api, params, key, val, success, fail = detail) => {
  if (regEx.execute('password',val)) {
    success();
  } else {
    fail(val + ' is invalid value(9 to 12 digits, / English + numbers + special characters)');
  }  
};

exports.emailValidate = (api, params, key, val, success, fail = detail) => {
  if (regEx.execute('email',val)) {
    success();
  } else {
    fail(val + ' is invalid value(9 to 12 digits, / English, English + numbers)');
  }
};

exports.phoneValidate = (api, params, key, val, success, fail = detail) => {
  if (regEx.execute('phone',val)) {
    success();
  } else {
    fail(val + ' is invalid value');
  }
};

exports.userIpValidate = (api, params, key, val, success, fail = detail) => {  
  var res = val.every((ip) => {
    return regEx.execute('ipv4',ip);
  });

  if ( res ) success();
  else fail(val + ' is invalid value'); 
};

//카테고리가 추가/수정/삭제를 수행할 수 있는 카테고리인지 확인
exports.chekEditableCategory = (api, params, key, val, success, fail = detail) => {

  var res = true;
  switch( params['dataType'] ) {
    case 'add':
    case 'del':
      res = !category.isDistributionCategory(val);
      break;
    default:
      res = true;
      break;
  }
  if (res) {
    success();
  } else {
    fail(`category_code ${val} is invalid value. (this category_code is not editable)`);
  }
};

//존재하는 공격코드 인지 확인
exports.isExistAttackCode = (api, params, key, val, success, fail = detail) => {
    //template 정책 추가일때는 의미없다.
    // if (params['template_id'] != '65535') {
    //   return success();
    // }
    const category_code = params['category_code'];
    const dbPath = category.getDBPath(category_code, params['template_id']);

    switch(category_code) {
      case '1':
      case '2':
      case '3':
      case '7':
        var sql = `SELECT * FROM master where category=${category_code} and code=${val}`;
        break;
      case '1100':
      case '1500':
        if (params['template_id'] != '65535') {
          var sql = `SELECT * FROM master where category=${params['category_code']} and code=${val}`;
        } else {
          var sql = `SELECT * FROM master where ndelete=0 and code=${val}`;
        }
        break;
    }

    db.select(dbPath, sql, (error, results) => {
      if (error) {
        fail('db internal error');
      } else {
        switch (api.restAPI) {
          case '/api/policy/pt-editor/rules': 
            if (params['dataType'] == 'add') {
              if (results['rows'].length == 0) {
                //없으면 성공
                success();
              } else {
                //있으면 에러
                fail(`attack_code ${val} is invalid value. (this attack_code already exists)`);
              }
            } else {
              if (results['rows'].length == 0) {
                //없으면 에러
                fail(`attack_code ${val} is invalid value. (this attack_code not found)`);
              } else {
                //있으면 성공
                success();
              }
            }
            break;
          default:
            // 
            break;
        }
      }
    });
};

//디폴트테이블에 존재하는 공격코드 인지 확인
exports.isExistAttackCodeInDefault = (api, params, key, val, success, fail = detail) => {

  if (params['dataType'] != 'add') {
    return success();
  }

  if (params['template_id'] == '65535') {
    return success();
  }

  const category_code = params['category_code'];
  const dbPath = category.getDBPath(category_code);

  switch(category_code) {
    case '1':
    case '2':
    case '3':
    case '7':
      var sql = `SELECT * FROM master where category=${category_code} and code=${val}`;
      break;
    case '1100':
    case '1500':
      var sql = `SELECT * FROM master where ndelete=0 and code=${val}`;
      break;
  }

  db.select(dbPath, sql, (error, results) => {
    if (error) {
      fail('db internal error');
    } else {
      switch (api.restAPI) {
        case '/api/policy/pt-editor/rules': 
          if (results['rows'].length == 0) {
            //없으면 에러
            fail(`attack_code ${val} is invalid value. (this attack_code not exist in default)`);
          } else {
            success();
            //있으면 성공
          }
          break;
        default:
          // 
          break;
      }
    }
  });
};

//존재하는 IPPool 그룹ID인지
exports.isExistIPPoolGroupID = (api, params, key, val, success, fail = detail) => {

  const dbPath = path.resolve(config.path.sniper + '/config/ippool_rule.dbb');
  var sql = `SELECT * FROM group_table WHERE g_id = ${val}`;

  db.select(dbPath, sql, (error, results) => {
    if (error) {
      fail('db internal error');
    } else {
      switch (api.restAPI) {
        case '/api/policy/ippool/groups':
          if (api.method == 'POST') {
          //있으면 에러
          if (results['rows'].length > 0) {
            fail(`g_id ${val} is invalid value. (this g_id already exists)`);
          } else {
            success();
          }
        } else {
          //없으면 에러
          if (results['rows'].length > 0) {
            success();
          } else {
            fail(`g_id ${val} is invalid value. (this g_id not found)`);
          }
        }
        break;

        case '/api/policy/ippool/objects':
          if (results['rows'].length > 0) {
            success();
          } else {
            fail(`g_id ${val} is invalid value. (this g_id not found)`);
          }
          break;
      }
      
    }
  });
};

//존재하는 IPPool ObjectID인지
exports.isExistIPPoolObjectID = (api, params, key, val, success, fail = detail) => {

  //65535객체는 원래 테이블에 존재하지 않는다.
  if (val == 65535) return success();

  const dbPath = path.resolve(config.path.sniper + '/config/ippool_rule.dbb');
  var sql = `SELECT * FROM object_table WHERE o_id = ${val}`;

  db.select(dbPath, sql, (error, results) => {
    if (error) {
      fail('db internal error');
    } else {
      if (api.method == 'POST') {
        //있으면 에러
        if (results['rows'].length > 0) {
          fail(`o_id ${val} is invalid value. (this o_id already exists)`);
        } else {
          success();
        }
      } else {
        //없으면 에러
        if (results['rows'].length > 0) {
          success();
        } else {
          fail(`o_id ${val} is invalid value. (this o_id not found)`);
        }
      }
    }
  });
};

//정책 템플릿 유효성 체크
exports.isExistTemplate = (api, params, key, val, success, fail = detail) => {
  var dbPath = path.resolve(config.path.sniper + '/config/ippool_rule.dbb');
  var sql = `SELECT * FROM rule_template_table WHERE v_id = ${val}`;
  db.select(dbPath, sql, (error, results) => {
    if (error) {
      fail('db internal error');
    } else {
      if (api.method == 'DELETE') {
        if (results['rows'].length == 0) {
          fail(`${key} ${val} is invalid value. (not found)`);
        } else {
          success();
        }
      } else {
        if (results['rows'].length == 0) {
          success();
        } else {
          fail(`${key} ${val} is invalid value.(already existed)`);
        }
      }
    }
  });
}

//template 유효성 체크
exports.templateValidate = (api, params, key, val, success, fail = detail) => {

  var dbPath = path.resolve(config.path.sniper + '/config/ippool_rule.dbb');
  var sql = `SELECT * FROM rule_template_table`;
  db.select(dbPath, sql, (error, results) => {
    if (error) {
      fail('db internal error');
    } else {
      var filteredResults = results['rows'].filter((row) => {
        return row['v_id'] == val;
      });

      //1. 존재하지 않는 템플릿ID 인지
      if (filteredResults.length == 0) {
        return fail(`${key} ${val} is invalid value. (this ${key} not found)`);
      }

      const flow = filteredResults[0]['v_type'];
      
      if (key == 'template_inbound') {
        //2. key에 해당하는 val이 맞는지
        //예) key가 inbound   => val은 inbound또는 allbound 정책
        //예) key가 outbound  => val은 outbound또는 allbound 정책    
        if (flow == 1) return fail(`${key} ${val} is invalid value. (${val} is not inbound or allbound template)`);

        var otherResults = results['rows'].filter((row) => {
          return row['v_id'] == params['template_outbound'];
        });

        //3. 추가 예외사항
        //예) 한쪽이 inbound또는 outbound인데 다른한쪽이 allbound 인경우 검사
        if ( (flow == 0 && otherResults[0]['v_type'] != 1) || 
             (flow == -1 && otherResults[0]['v_type'] != -1) ) {
          return fail(`${key} ${val} is invalid value. (template is inbound-outbound or allbound-allbound)`);
        }

      } else {
        if (flow == 0) return fail(`${key} ${val} is invalid value. (${val} is not outbound or allbound template)`);

        var otherResults = results['rows'].filter((row) => {
          return row['v_id'] == params['template_inbound'];
        });

        if ( (flow == 1 && otherResults[0]['v_type'] != 0) || 
             (flow == -1 && otherResults[0]['v_type'] != -1) ) {
          return fail(`${key} ${val} is invalid value. (template is inbound-outbound or allbound-allbound)`);
        }
      }
      success();
    }
  })
};

//noc 유효성 체크
exports.nocValidate = (api, params, key, val, success, fail = detail) => {
  if (val.hasOwnProperty('ips') && 
      val.hasOwnProperty('dns') &&
      val.hasOwnProperty('voip') &&
      val.hasOwnProperty('https') && 
      val.hasOwnProperty('regex') && 
      val.hasOwnProperty('ratelimit') &&
      val.hasOwnProperty('ddos') && 
      val.hasOwnProperty('reputation') &&
      val.hasOwnProperty('ar') &&
      val.hasOwnProperty('ur') &&
      val.hasOwnProperty('mr')) {

      if ((val['ips'].hasOwnProperty('fragment') &&
          val['ips'].hasOwnProperty('patternblock') &&
          val['ips'].hasOwnProperty('webcgi') &&
          val['ips'].hasOwnProperty('profile')) &&

          (val['ratelimit'].hasOwnProperty('static') &&
           val['ratelimit'].hasOwnProperty('dynamic')) &&

          (val['ddos'].hasOwnProperty('tcp') &&
           val['ddos'].hasOwnProperty('udp'))) {
        return success();
      } else {
        return fail(`${key} is invalid format.`);
      }
  } else {
    return fail(`${key} is invalid format.`);
  }
}

//networks 유효성 체크
exports.networksValidate = (api, params, key, val, success, fail = detail) => {

  if (!val.hasOwnProperty('ipv4') && !val.hasOwnProperty('ipv6')) return fail(`${key} is invalid format.`);

  if (val.hasOwnProperty('ipv4')) {
    var ipv4Networks = val['ipv4'];

    var res = ipv4Networks.every((network) => {
      var _res = true;
      const _ip = network.split('/')[0];
      const prefix = network.split('/')[1];

      if (ip.isV4Format(_ip)) {
        _res = regEx.execute('ipv4', _ip);
        if (_res) {
          _res = regEx.execute('prefixV4', prefix);
        }
      }
      return _res;
    });

    if (!res) return fail(`invalid value exist in ipv4 ${key}.`);
  }

  if (val.hasOwnProperty('ipv6')) {
   var ipv6Networks = val['ipv6']; 

   var res = ipv6Networks.every((network) => {
      var _res = true;
      const _ip = network.split('/')[0];
      const prefix = network.split('/')[1];

      _res = ip.isV6Format(_ip);
      if (_res) {
        _res = regEx.execute('prefixV6', prefix);
      }
      return _res;
   });

   if (!res) return fail(`invalid value exist in ipv6 ${key}.`);
  }
  
  success();
}