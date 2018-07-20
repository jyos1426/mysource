<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page errorPage="err.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

<%
for(int i=1; i<100000; i++){	
%><span><%=i %></span>	
<%
}
%>

//c:\\a.txt파일읽기
<%@page import="java.io.FileInputStream" %>
<%@ page buffer="5000kb" %>
<%
FileInputStream fis = null;
fis = new FileInputStream("c:\\a.txt");	
%>
</body>
</html>