<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
   
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="UTF-8">
<title>session.jsp</title>
</head>
<body>
<%--
	HttpSession s = request.getSession();
--%>
 SESSION ID: <%= session.getId()%><br>
   	IS NEW : <%= session.isNew()%><br>
   최종 사용시간: <%= new Date(session.getLastAccessedTime()) %><br>
   <% session.setMaxInactiveInterval(5); %><br>
   <% session.invalidate(); %><br>
</body>
</html>