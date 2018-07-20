<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<!-- 객체내의 인스턴스 변수로 선언됨 -->
	<%! int sum =0; %>
	<%! int cnt =0; %>
	<% String scoreValue = request.getParameter("score");
	 sum += Integer.parseInt(scoreValue);
	 cnt++;%>
	선택한 별점은 <%=scoreValue %>점입니다<br>
	전체 합은 <%=sum %>점입니다<br>
	총 참여자 수는 <%=cnt %>입니다<br>
	전체 평점은 <%=sum/(double)cnt %>점입니다
</body>
</html>