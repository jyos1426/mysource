var category = require('./category');
var sensor = require('./sensor');
var validator = require('./validator');

//rest api 정리 파일
exports.apis = [
  {
    major: '정보',
    minor: '센서',
    name: '센서정보',
    restAPI: '/api/info',
    engine_ver: '^1.0.0',
    desc: '센서정보 조회 (<i>버전 / 라이선스 / 카드정보 / 사양정보(개수)</i>)',
    method: 'GET'
  },
  {
    major: '정보',
    minor: '서버시간',
    name: '서버시간정보',
    restAPI: '/api/info/time',
    engine_ver: '^3.0.0',
    desc: '서버시간 조회',
    method: 'GET'
  },
  {
    major: '정보',
    minor: '유저접속',
    name: '유저접속정보',
    restAPI: '/api/info/user',
    engine_ver: '^3.0.0',
    desc: '현재 접속 중인 유저 정보',
    method: 'GET'
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '계정 조회',
    restAPI: '/api/config/users',
    engine_ver: '^3.0.2',
    desc: '등록된 계정 조회',
    method: 'GET',
    parameters: {
      id: {
        desc: '관리자ID',
        validators: [
          {
            valueType: 'function',
            value: validator.isExistUser
           }
        ]
      }
    }
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '계정 확인',
    restAPI: '/api/config/users/check',
    engine_ver: '^3.0.2',
    desc: '등록된 계정이 유효한지 확인',
    method: 'GET',
    parameters: {
      id: {
        required: true,
        desc: '관리자ID',
        validators: [
          {
            valueType: 'function',
            value: validator.isExistUser
          }
        ]
      },
      password: {
        required: true,
        desc: '패스워드',
        validators: [
          {
            valueType: 'function',
            value: validator.passwordValidate
          }
        ]
      }
    }
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '관리자 IP 조회',
    restAPI: '/api/config/users/access_address',
    engine_ver: '^3.0.2',
    desc: '관리자 IP 조회',
    method: 'GET',
    parameters: {
      id: {
        required: true,
        desc: '관리자ID',
        validators: [
          {
            valueType: 'function',
            value: validator.isExistUser
          }
        ]
      }
    }
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '관리자 추가',
    restAPI: '/api/config/users',
    engine_ver: '^3.0.2',
    desc: '관리자 IP 추가',
    method: 'POST',
    body: {
      id: {
        required: true,
        desc: '관리자ID',
        validators: [
          {
            valueType: 'function',
            value: validator.userValidate
          },
          {
            valueType: 'function',
            value: validator.isExistUser
          }
        ]
      },
      password: {
        required: true,
        desc: '패스워드',
      },
      email: {
        desc: '관리자 이메일',
        validators: [
          {
            valueType: 'function',
            value: validator.emailValidate
          }
        ]
      },
      authority:{
        required: true,
        desc: '관리자 권한',
        validators: [
          {
            valueType: 'range',
            value: '1-2'
          }
        ]
      },
      password_limit: {
        desc: '관리자 비밀번호 사용기간',
        validators: [
          {
            valueType: 'range',
            value: '1-99'
          }
        ]
      },
      extension: {
        desc: '확장필드'
      },
      phone: {
        desc: '전화번호',
        validators: [
          {
            valueType: 'function',
            value: validator.phoneValidate
          }
        ]
      }
    }
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '관리자 IP 추가',
    restAPI: '/api/config/users/access_address',
    engine_ver: '^3.0.2',
    desc: '관리자 IP 추가',
    method: 'POST',
    body: {
      id: {
        required: true,
        desc: '관리자ID',
        validators: [
          {
            valueType: 'function',
            value: validator.isExistUser
          }
        ]
      },
      access_address: {
        required: true,
        desc: '관리자 IP',
        validators: [
          {
            valueType: 'function',
            value: validator.userIpValidate
          }
        ]
      },
    }
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '관리자 수정',
    restAPI: '/api/config/users',
    engine_ver: '^3.0.2',
    desc: '관리자 아이피 수정',
    method: 'PATCH',
    body: {
      id: {
        required: true,
        desc: '아이디',
        validators: [
          {
            valueType: 'function',
            value: validator.isExistUser
          }
        ]
      },
      password: {
        desc: '패스워드',
      },
      email: {
        desc: '관리자 이메일',
        validators: [
          {
            valueType: 'function',
            value: validator.emailValidate
          }
        ]
      },
      password_limit: {
        desc: '관리자 비밀번호 사용기간',
        validators: [
          {
            valueType: 'range',
            value: '1-99'
          }
        ]
      },
      phone: {
        desc: '전화번호',
        validators: [
          {
            valueType: 'function',
            value: validator.phoneValidate
          }
        ]
      },
      extension: {
        desc: '확장필드'
      },
    }
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '관리자 삭제',
    restAPI: '/api/config/users',
    engine_ver: '^3.0.2',
    desc: '관리자 삭제',
    method: 'DELETE',
    body: {
      id: {
        required: true,
        desc: '관리자ID',
        validators: [
          {
            valueType: 'function',
            value: validator.isExistUser
          }
        ]
      }
    }
  },
  {
    major: '관리',
    minor: '계정 관리',
    name: '관리자 IP 삭제',
    restAPI: '/api/config/users/access_address',
    engine_ver: '^3.0.2',
    desc: '관리자 IP 삭제',
    method: 'DELETE',
    body: {
      id: {
        required: true,
        desc: '관리자ID',
        validators: [
          {
            valueType: 'function',
            value: validator.isExistUser
          }
        ]
      },
      access_address: {
        required: true,
        desc: '관리자 IP',
        validators: [
          {
            valueType: 'function',
            value: validator.userIpValidate
          }
        ]
      },
    }
  },
];

exports.getObject = (restAPI, method) => {
  //restAPI 와 method가 일치하는 객체를 찾아서 리턴
  var results = this.apis.filter(obj => {
    //api에 {}로 정의된 경우는 url이 가변적인 경우로,
    //입력값이 subUrl에 key에 정의되어있는지 확인
    if (obj.restAPI.indexOf('/{') >= 0) {
      var urlKey = obj.restAPI.split('/{')[1].replace('}', '');
      var tmp = restAPI.split('/');
      var urlValue = tmp[tmp.length - 1];

      return obj.subUrl[urlKey].indexOf(urlValue) >= 0 && obj.method == method;
    } else {
      return obj.restAPI == restAPI && obj.method == method;
    }
  });
  return results[0];
};
