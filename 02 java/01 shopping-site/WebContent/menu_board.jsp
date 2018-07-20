	<%@ page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>

<title>search_board.jsp</title>

<% 	String item = request.getParameter("searchItem");
	if(item==null){
		item= "no";
	}
	String value = request.getParameter("searchValue"); 
	if(value==null){
		value= "";
	}
%>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"> </script>
<script>
$(function(){	
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
	
	if(<%=request.getParameter("no")%> > 0){
		$("div>button[name=reply]").show();
		$("div>button[name=modify]").show();
		$("div>button[name=delete]").show();
		$("div>button[name=list]").show();
	}
	
	$("div>button[name=write]").click(function(){
		var url = "form_boardwrite.jsp";
		$.ajax({
			url: url,
			method:"post",
			data: {"parent":"0"},
			success:function(responseData){
				$("article").empty();
				$("article").html(responseData.trim());	
			}		
		});	
		return false;
	}); 
	
	$("div>button[name=reply]").click(function(){
		var url = "form_boardwrite.jsp";
		$.ajax({
			url: url,
			method:"post",
			data: {"parent":"<%=request.getParameter("no")%>"},
			success:function(responseData){
				$("article").empty();
				$("article").html(responseData.trim());	
			}		
		});	
		return false;
	}); 
	
	$("div>button[name=list]").click(function(){
		var url = "boardlist.do";
		console.log("<%=request.getParameter("pageNum")%>");
		$.ajax({
			url: url,
			method:"post",
			data: {"parent":"<%=request.getParameter("no")%>",
				"pageNum":"<%=request.getParameter("pageNum")%>"},
			success:function(responseData){
				$("article").empty();
				$("article").html(responseData.trim());	
			}		
		});	
		return false;
	}); 	

	<%--Check Password--%>
	$flag = "";
	$("div>button[name=modify],div>button[name=delete]").click(function(){
		$("#chkpass").show();
		$flag = $(this).attr("name");
	}); 
	
	$pwd_input=$("input[name=pwd]");
	$pwd_btn=$("div>form>button[name=submit]");
	$pwd_input.bind('input',function(){
		if($pwd_input.val()!=""){
			$pwd_btn.css("background-color","#343434");
		}else{
			$pwd_btn.css("background-color","#e3e3e3");
		}
	});
	
	<%--Check Password Submit--%>	
	$pwd_btn.click(function(){
		var url = "checkpassword.do";
		$.ajax({
			url: url,
			method:"post",
			data: {"pwd":$("input[name=pwd]").val(),
				"no":"<%=request.getParameter("no")%>"
				},
			success:function(responseData){
				if(responseData =="1"){
					if($flag=="modify"){
						var url = "boardget.do";			
						$.ajax({
							url: url,
							method:"post",
							data: {"no":"<%=request.getParameter("no")%>"},
							success:function(responseData){								
								var result = responseData.trim();
								var jsonObj= JSON.parse(result);
								var url = "form_boardwrite.jsp";		
								console.log(jsonObj.no+","+jsonObj.subject+","+jsonObj.password);									
								$.ajax({
									url: url,
									method:"post",
									data: {
										"flag":"modify",
										"pwd":jsonObj.password,
										"no":jsonObj.no,
										"subject":jsonObj.subject,
										"content":jsonObj.content
										},
									success:function(responseData){
										$parentObj.empty();
										$parentObj.html(responseData);
									}
								});
							}
						});	
					}else if($flag=="delete"){
						console.log($flag);							
						var url = "boarddelete.do";	
						$.ajax({
							url: url,
							method:"post",
							data: {"no":<%=request.getParameter("no")%>},
							success:function(responseData){		
								if(responseData=="-1"){
									alert("답글이 있어 글이 삭제될 수 없습니다.");
								}
								$.ajax({
									url:"boardlist.do",
									method:"post",
									success:function(responseData){
										$parentObj.empty();
										$parentObj.html(responseData);
									}
								});
							}		
						});	 
					}	 	
				}else if(responseData =="-1"){
					alert("비밀번호가 일치하지 않음");
				}
			}//success end	
		});	
		return false;
	});	
});
</script>
<style>
	button { height:25px; margin-top:3px; border:0px; width:80px; border-radius:5px; color:white;cursor:pointer}
	button[name=list] {background-color:#343434;}
	button[name=submit] {background-color:#e3e3e3; width:100px}
	div>button:hover {background-color:#343434;}
</style>
<div style="width:500px;">
  	 <button name="list" hidden="true">이전목록</button>
  	 <button name="write">글쓰기</button>
  	 <button name="reply" hidden="true">답글쓰기</button>
  	 <button name="modify" hidden="true">수정하기</button>
  	 <button name="delete" hidden="true">삭제하기</button>
</div>

<div id="chkpass" style="margin:auto; width:500px;" hidden="true" >		
	<form>		
	<input type="password" name="pwd" required> <button name="submit">비밀번호 확인</button>
	</form>		
</div>
