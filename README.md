# mysource
===

## 01 node
####01 webserver
웹서버만 개발
src/         폴더 내에 남긴 소스 위주

libs/code.js     에러 코드 정의로 클라이언트에서 구체적인 확인 가능
libs/db.js       읽기,쓰기 sqlite 에서 공통으로 사용하는 코드 모아둔 곳
libs/log.js      로그 관련 모듈화
libs/util.js     기타 소스에서 공통으로 사용하는 소스 모아두었으나, 타인이 개발한 소스는 지움
routes/db        mongodb,sqlite 조회 전용
routes/integrity 무결성 관련
routes/sensor    타 서버와 프록시로 통신하여 정보를 조회 - 세션 유지및 관리를 위해 afMap이라는 변수사용


####02 websystem
웹서버 일부 참여 및 계정관리 클라이언트부분 참여 (src/app/theme/pages/default/config/user/)
Angular 프레임워크 사용한 프론트엔드 개발

libs/            위와 동일하게 공통사용 라이브러리



####03 release_system
릴리즈된 GUI 패키지를 관리했던 웹 시스템입니다.

####04 license_system


####05 integrity_system


### 02 java


### 03 delphi
델파이 사용하여 유틸 개발