<%@ page contentType="text/html; charset=UTF-8"%>
<% String contextPath = request.getContextPath();%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<meta charset="UTF-8">
<title>loginform.jsp</title>

<script 
	src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js">
</script>
<script type="text/javascript">
$(function(){
	$form = $("form");
	<%-- <c:if test="${!empty cookie.savedId.value}">
		$("input[name=id]").val("${cookie.savedId.value}");
		$("input[name=id_save]").attr("checked","checked");
	</c:if> --%>
	
	//서버단에서 말고 client단에서만 활용
	var itemValue = localStorage.getItem("savedId");
	if(itemValue != null){
		$("input[name=id]").val(itemValue);
		$("input[name=id_save]").attr("checked","checked");
	}
	
	$form.submit(function(e){
		var url="login.do";
		$id = $("input[name=id]").val();
		$pwd = $("input[name=pwd]").val();
		$id_save = $("input[name=id_save]");
		
		if( $id_save.prop("checked") == true){			
			localStorage.setItem("savedId",$id);	
		}else{
			localStorage.removeItem("savedId");
		}
		
		$.ajax({url: url,
		        	method: "POST",
					async:false,
		        	data: $form.serialize(),  //{ "id":$id, "pwd":$pwd },
		        	//query string 만들기 귀찮으니까 data property 사용가능
					success: function(responseData){						
							if(responseData=="1"){
								location.href= "<%=request.getContextPath()%>"; //'/web12';	//index.jsp
							}
							else if(responseData =="-1")
								alert("로그인 실패");
							else alert(data);						
						},
				error: function(xhr,status,error){
						console.log("error:"+status+","+error);
						}
		});
		return false;	//얘를 안하면 기본이벤트가 자동처리됨
	});
});
</script>
<style>
  #title_div{width:800px; border-top:1px solid lightgray; margin:auto; margin-top:90px;} 
   #title_lab{font-size:60px; color:#abd0e1; font-style:italic;} 
  
  #login_div {width:300px; margin:auto;  margin-top:50px;}
  input:not(#id_save){width:300px; height:40px; border-bottom:1px solid lightgray; border-top:none; border-left:none; border-right:none;}
  input[type=submit]{border:none; background-color:#abd0e1; border-radius:8px; color:#fff; margin-top:20px; cursor:pointer}
</style>

<div style="width:800px;margin:auto;">
	<label id="title_lab" style="position:absolute; top:170px;">Login</label>
</div>
<div id="title_div">
	<div id="login_div">
		<form style="margin-top:20px;">
			<input type="Text" name="id" placeholder="아이디" required><br>
			<input type="password" name="pwd" placeholder="비밀번호" required> <br><br>
			<input type="checkbox" id="id_save" name="id_save" value="save"> <label style="font-size:13px">아이디저장</label>
			<input type="submit" value="Login">	
		</form>
	</div> 
</div>
