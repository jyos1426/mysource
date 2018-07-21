# mysource


## 01 node

- 01 webserver
웹서버만 개발
src/         폴더 내에 남긴 소스 위주

libs/code.js     에러 코드 정의로 클라이언트에서 구체적인 확인 가능
libs/db.js       읽기,쓰기 sqlite 에서 공통으로 사용하는 코드 모아둔 곳
libs/log.js      로그 관련 모듈화
libs/util.js     기타 소스에서 공통으로 사용하는 소스 모아두었으나, 타인이 개발한 소스는 지움
routes/db        mongodb,sqlite 조회 전용
routes/integrity 무결성 관련
routes/sensor    타 서버와 프록시로 통신하여 정보를 조회 - 세션 유지및 관리를 위해 afMap이라는 변수사용

- 02 websystem 
서브파트 웹서버 및 클라이언트 일부 참여
Angular 프레임워크 사용하여 프론트엔드 개발

libs/                      위와 동일하게 공통사용 라이브러리
libs/api.js                서비스에서 사용되는 api 정리및 validation 체크 및 다큐먼트 페이지 구현(src/app/docs/) 
routes/etc/login-router.js 암호화를 사용한 로그인              
src/app/theme/pages/default/config/user/ 계정관리 클라이언트 파트 참여


#### 03 release_system
릴리즈된 GUI 패키지를 관리했던 웹 시스템 유지보수
session을 redis로 저장하여 사용

#### 04 license_system
시리얼과 라이선스를 발급해주는 웹서비스 

routes/makeCer.js           인증서 발급 모듈을 사용하여 발급 및 다운로드 제공하는 api
syncDB/                     DB 동기화 파이썬 모듈


#### 05 integrity_system


### 02 java


### 03 delphi
델파이 사용하여 간단한 유틸 개발 (업무 외)

- 02 BulkEditUserInfo
센서의 user 정보를 일괄 수정하는 유틸

- 03 SnortSeperation
Snort 룰에서 패턴블럭으로 분리할 수 있는 패턴을 분리하는 유틸
