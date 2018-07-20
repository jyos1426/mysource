<%@ page contentType="text/html; charset=UTF-8"%>
<% String contextPath = request.getContextPath();%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<contentType="text/html; charset=UTF-8">
<!DOCTYPE html>
<title>signupform_web16.html</title>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>
$(function(){	
	$form = $("form");
	var $id =  $("input[name=id]");
	var $name =  $("input[name=name]");
	var $pwd = $("input[name=pwd]")
	var $pwd1 =  $("input[name=pwd1]");
	
	var $chk_lab = $("#idchk");
	var $chk2_lab = $("#pwdchk");
	var $idchk_btn = $("#idchk_btn");		
	var $signupBtn = $("input[type=submit]");
	
	$id.focus(function(){
		$signupBtn.css("background-color","lightgray");
		$signupBtn.attr("disabled",true);
		$idchk_btn.css("background-color","#343434");
	});
		
	$idchk_btn.click(function(e){
		$.ajax({ url: "dubchkid.do",
			method:"post",
			data: { "id":$id.val()},
			success: function(responseData){
				console.log(responseData);
				if(responseData == "1"){
					$chk_lab.html("가입할 수 있는 아이디입니다.");
					$chk_lab.css("color","#343434");
					$signupBtn.css("background-color","#abd0e1");
					$signupBtn.attr('disabled',false); 
					$idchk_btn.css("background-color","lightgray");
				}else{
					$chk_lab.html("중복된 아이디가 있습니다.");
					$chk_lab.css("color","#abd0e1");
					$id.focus().val();
				}
			},
			error: function(xhr,status,erro){
				console.log("error:"+status+","+error);
			}
		});			
	});
	
	$pwd1.add($pwd).bind('input', function(){
		if(	$pwd.val() != $pwd1.val()){	
			$chk2_lab.text("불일치");
			$chk2_lab.css("color","#abd0e1");
		}else{			
			$chk2_lab.text("일치");
			$chk2_lab.css("color","#343434");
		}	
	});
	$form.submit(function(){
		return false;
	});
	$signupBtn.click(function(e){	
		$form.attr("action","signup.do");
		var $action = $form.attr("action");
		var $data = $form.serialize();
		
		if(	$pwd.val() != $pwd1.val()){
			alert("비밀번호가 일치하지 않습니다.");
			$pwd.focus().val();
			e.preventDefault();
			return false;
		}	 
		
		$.ajax({ url: $action,
				method:"post",
				data: $data,
				success: function(responseData){
					console.log(responseData);
					var result = responseData.trim();
					if(result == '1'){alert("가입을 완료했습니다.");
						location.href= "<%=request.getContextPath()%>";
					}else{
						alert(result);
					}
				},
				error: function(xhr,status,erro){
					console.log("error:"+status+","+error);
				}
		});	
		return false;
	});
});
</script>

<style>
 	#title_div{width:800px; border-top:1px solid lightgray; margin:auto; margin-top:90px;}
	#title_lab{font-size:60px; color:#abd0e1; font-style:italic;} 	
	
 	#signup_div {width:310px; margin:auto; margin-top:50px;} 	
  	input{width:300px; height:40px; border-bottom:1px solid lightgray; border-top:none; border-left:none; border-right:none;}
  	input[name=id]{ display:inline-block; width:200px;}
	#idchk,#pwdchk{font-size:13px; color:#abd0e1; }
	#pwdchk{left:250px; bottom:30px;}	
	button { width:95px; height:30px; border:none; border-radius:5px; color:white; cursor:pointer}
  	input[type=submit]{border:none; background-color:#abd0e1; border-radius:8px; color:#fff; margin-top:10px; cursor:pointer;}
</style>

<body>
<div style="width:800px;margin:auto;">
	<label id="title_lab" style="position:absolute; top:170px;">Signup</label>
</div>
<div id="title_div">
	<div id="signup_div">
		<form style="margin-top:20px;">	
			<input type="Text" name="id" placeholder="아이디" required>  <button id="idchk_btn">중복확인</button>
			<label id="idchk">아이디 중복확인을 해주세요</label>
			<input type="text" name="name" placeholder="이름" required><br>
			<input type="password" name="pwd" placeholder="비밀번호" required>  <br>
			<input type="password" name="pwd1"  placeholder="비밀번호 확인" required> 
			<label id="pwdchk" style="position:relative;"></label>
			<div class="zip"></div>
			<input type="submit" value="SignUp">	
		</form>
	</div> 
</div>
</body>