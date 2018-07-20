<%@page import="com.my.vo.RepBoard"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<title>form_boardwrite.jsp</title>

<style>
  .write_div{width:510px; margin:auto;position:relative;} 
  .write_tb {width:510px; border-collapse: collapse; margin-top:20px }
  .write_tb td{ border-bottom:1px solid lightgray; } 
  input {width:500px; height:40px; border:none;}
  input[type=submit]{height:50px; width:200px; border:none; background-color:#e3e3e3; color:#fff; cursor:pointer}
  input[type=submit]{
	  position:absolute;
	  left:50%;
	  transform: translateX(-50%);
	  -webkit-transform: translateX(-50%);
	}
  textarea{width:500px; border:none;}
</style>

<script>
$(function(){	
	$form = $("form");
	var $password =  $("input[name=password]");
	var $subject =  $("input[name=subject]");
	var $parent =  $("input[name=parent]");
	var $content = $("textarea[name=content]");
	var $url = "boardwrite.do";
	var $submitbtn = $("form input[type=submit]");
	
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
	
	/* modify flag */
	$flag = "등록";
	if("modify"=="<%=request.getParameter("flag")%>"){
		$url = "boardmodify.do";
		$flag = "수정";
		console.log("<%=request.getParameter("pwd")%>");
		$password.attr("value","<%=request.getParameter("pwd")%>");
		$parent.attr("value","<%=request.getParameter("no")%>");
		$subject.attr("value","<%=request.getParameter("subject")%>");
		$content.text("<%=request.getParameter("content")%>");
		
		$submitbtn.attr("value","수정하기");
	}
	
	$subject.add($password).bind('input',function(){
		if($subject.val().length>8){
			$("#write_alert").text("제목이 너무 깁니다");
		}else if($password.val().length>5){
			$("#write_alert").text("비밀번호가 너무 깁니다");
		}else{
			$("#write_alert").text("");
		}
	});
	
	$content.add($password).add($subject).bind('input',function(){
		if($content.val()!=""  && $subject.val()!=""
				&& $password.val()!=""){
			$("#write_alert2").text("44:상운오빠 31:은지언니 43:건아오빠 17:하라 지켜봅니다ㅎㅅㅎ");
		}else{
			$("#write_alert2").text("");
		}
		if($content.val().length >80  || $subject.val().length>8||
				$password.val().length>5){		
			$submitbtn.css("background-color","#e3e3e3");
			$submitbtn.attr('disabled',true);    
		}else{
			$submitbtn.css("background-color","#abd0e1");
			$submitbtn.attr('disabled',false);  
		}
	});
	
	$form.submit(function(e){		
		var $data = $form.serialize() + '&ip=' + "<%=request.getRemoteAddr()%>";
		console.log($content.val());
		$.ajax({ url: $url,
				method:"post",
				data: $data,
				success: function(responseData){
					var result = responseData.trim();
					alert("글이 "+$flag+"되었습니다");
					$parentObj.empty();
					$parentObj.html(result);
				},
				error: function(xhr,status,erro){
					console.log("error:"+status+","+error);
				}
		});	
		return false;
	});
});
</script>

<body>
	<form>
<div class="write_div">
	<table class="write_tb" style="margin-bottom:10px">
		<tr><td>
		<input type="hidden" name="parent" value=<%=request.getParameter("parent")%>>
		<input type="password" name="password" maxlength="5" placeholder="Password" required></td></tr>			
		<tr><td>
			<div id="write_alert" style="color:#abd0e1; font-size:13px;"> </div>
			<input type="text" name="subject" maxlength="20" placeholder="Subject" required>
		</td></tr>
		<tr><td colspan="4" style="height:200px;">
			<div id="write_alert2" style="color:#abd0e1; font-size:13px;"> </div>
			<textarea name="content" rows="10" placeholder="Content" required></textarea></td></tr>		
	</table>
</div>
<div class="write_div"><input type="submit" value="글쓰기"></div>
	</form>
</body>