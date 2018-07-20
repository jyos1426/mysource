<%@ page contentType="text/html; charset=UTF-8"%>
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js">
	
</script>
<script>
	$(function() {
		var $header = $("header");
		var $menu_a = $header.find(".main_menu_ul a");

		$menu_a.on('click', function() {
			var url = $(this).attr("href");
			$.ajax({
				url : url,
				async : false,
				method: "post",
				success : function(responseData) {
					if (url == 'logout.do') {
						location.href = responseData.trim();
					} else if (url == 'index.jsp') {
						location.href = "index.jsp";
					} else {
						$parentObj = $("article");
						$parentObj.empty();
						$parentObj.html(responseData.trim());
					}
				}
			});
			return false;
		});
	});
</script>
<link rel="stylesheet" type="text/css" href="style/menu_navi.css">

<%
	session = request.getSession(); //session.getAttribute("loginInfo");
%>
<nav role='navigation'>
	<ul class="main_menu_ul">
		<li><a href="productlist.do">홈</a></li>
		<%
			if (session.getAttribute("loginInfo") == null) {
		%>
		<li><a href="signupform.jsp">가입</a></li>
		<li><a href="loginform.jsp">로그인</a></li>
		<%
			} else {
		%>
		<li><a href="logout.do">로그아웃</a></li>
		<%
			}
		%>
		<li><a style="pointer-events: none;" id="noclick_list" href="#">My</a>
			<ul>
			<%
			if (session.getAttribute("loginInfo") != null) {
			%>
				<li><a href="customerdetail.do">내 정보</a></li>
				<%
				}
			%>
				<li><a href="cartlist.do">장바구니</a></li>
				<li><a href="orderlist.do">주문목록</a></li>
			</ul></li>
		<li><a href="boardlist.do">문의사항</a>
	</ul>
</nav>
