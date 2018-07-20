<%@ page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
첫번째 JSP입니다.
<p>JSP페이지의 구성요소
	<ul>
		<li>html 요소</li>
		<li>jsp 요소
			<ol>
				<li>script 요소
					<ul>
						<li>scriptlet: 자바구문을 작성 - .java파일의 _jspService()내부에 포함될 구문
							<% int i = 10; %>
							<% out.print(i); %>
						</li>
						<li>expression : 출력- 
						.java파일의 _jspService()내부에 포함될 구문
						<%= i %>
						
						</li>
						<li>declaration : 인스턴스변수, 메소드 선언 - .java파일의 _jspService() 외부에 포함될 구문
						<%! int i; %>
						<%! void m(){} %>
						<br>
						지역변수: <%= i %>, 인스턴스변수: <%= this.i %>
						</li>
					</ul>
				</li>
				<li>directive 요소
					<ul>
						<li>page directive: .java 파일이 generated될 때 필요한 정보를 설정한다.<br>
							속성:  contentType - 응답형식지정,
                   				 import - 패키지 import,
                    			 buffer -응답출력스트림의 내부버퍼크기 설정: 기본 8kb,
                     			 isErrorPage - 예외처리 전용페이지임을 알림: 기본 false
                    			 errorPage - 현재페이지에서 예외가 발생하면 자동 forward될 페이지를 설정
                    			 ...
							<%@page import="java.util.Date" %>
							<%Date dt = new Date(); %>
						</li>
						<li>include directive : 페이지 포함
						</li>
						<li>taglib directive</li>
					</ul>
				</li>
				<li>action tag요소
					<ul>
						<li>standard tag
							<ul>
								<li>include tag: 페이지 포함</li>
								<li>forward tag: 페이지 이동- RequestDispatcher의 forward()</li>
								<li>useBean tag</li>
								<li>setProperty tag</li>
								<li>getProperty tag</li>
							</ul>
						</li>
						<li>custom tag</li>
					</ul>
				</li>				
				<li>implicit object - .java 파일 _jspService()내부에 미리 선언되어있는 매개변수, 지역변수
					<ul>
						<li>request</li>
						<li>response</li>
						<li>out : JspWriter</li>
						<li>page : Object</li>
						<li>pageContext : PageContext</li>
						<li>application : ServletContext</li>
						<li>session : HttpSession</li>
					</ul>
				</li>
				
			</ol>
		</li>
		<li></li>
	
	</ul>
</p>
</body>
</html>