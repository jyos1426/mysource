//에러코드 정의
const ERROR_CODE = [
  {
    code: '000',
    message: 'success', //성공
    statusCode: '200'
  },
  {
    code: '1001',
    message: 'not defined api', //정의되지 않은 rest-api 요청
    statusCode: '200'
  },
  {
    code: '1002',
    message: 'legacy request error', //legacy proxy 통신 에러
    statusCode: '200'
  },
  {
    code: '1003',
    message: 'invalid parameter value', //파라미터 유효성 체크 에러
    statusCode: '200'
  },
  {
    code: '1004',
    message: 'not defined parameter', //정의되지 않은 파라미터
    statusCode: '200'
  },
  {
    code: '1005',
    message: 'db handler execute error', //sqlite3 핸들링 에러
    statusCode: '200'
  },
  {
    code: '1006',
    message: 'not found database path or invalid sql',
    statusCode: '200'
  },
  {
    code: '1007',
    message: 'unsupported api request',
    statusCode: '200'
  },
  {
    code: '1008',
    message: 'login required',
    statusCode: '200'
  },
  {
    code: '1009',
    message: 'not found log context',
    statusCode: '200'
  },
  {
    code: '1010',
    message: 'invalid body data(json parse fail)',
    statusCode: '200'
  },
  {
    code: '1011',
    message: 'password is incorrect',
    statusCode: '200'
  },
  {
    code: '1012',
    message: 'policy apply fail',
    statusCode: '200'
  },
  {
    code: '1013',
    message: 'not found filename',
    statusCode: '200'
  },
  {
    code: '1014',
    message: 'not exist log file',
    statusCode: '200'
  },
  {
    code: '1015',
    message: 'log file read fail',
    statusCode: '200'
  },
  {
    code: '1016',
    message: 'this rest api is not available',
    statusCode: '200'
  },
  {
    code: '1017',
    message: 'shell is already running',
    statusCode: '200'
  },
  {
    code: '1018',
    message: 'audit code is not matched',
    statusCode: '200'
  },
  {
    code: '1019',
    message: 'authentication fail',
    statusCode: '200'
  },
  {
   code: '1100',
   message: 'mongo query invalid',
   statusCode: '200'
  },
  {
   code: '1101',
   message: 'mongo error',
   statusCode: '200'
 },
 {
  code: '1200',
  message: 'connect error',
  statusCode: '200'
 },
 {
  code: '1201',
  message: 'sensor login error',
  statusCode: '200'
 },
 {
  code: '1300',
  message: 'invalid http method',
  statusCode: '405'
 },
 {
   code: '1999',
   message: 'unknown error',
   statusCode: '200'
 }
];

exports.status = (errorCode) => {
  var res;
  ERROR_CODE.forEach((item) => {
    if (item['code'] == errorCode) {
      res = item['statusCode'];
    }
  });

  if (!res) {
    console.error('not found httpCode');
    res = 500;
  }
  return res;
};

//에러코드를 가지고 JSON포맷의 에러응답객체를 생성하여 반환
exports.json = (errorCode, detail) => {
  var filters = ERROR_CODE.filter((item) => {
    return item['code'] == errorCode;
  });

  if (filters) {
    if (detail) {
      return new Object({
        code: errorCode,
        message: filters[0]['message'],
        detail: detail
      });
    } else
      return new Object({
        code: errorCode,
        message: filters[0]['message']
      });
  }
};
