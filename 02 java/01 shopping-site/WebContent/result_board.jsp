<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="b" value="${requestScope.result}"/>

{"no":${b.no},
"subject":"${b.subject}",
"password":"${b.password}",
"content":"${b.content}"
}