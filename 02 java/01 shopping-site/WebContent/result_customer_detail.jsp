<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="details" value="${requestScope.result}" ></c:set>

<!DOCTYPE html>
<title>result_customer_detail.jsp</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>
$(function(){	
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
	
	$("input[type=button]").on("click",function(){
		$id = $("#td_id").text();
		$name = $("input[name=name]").val();
		$pwd = $("input[type=password]").val();
		
		$data="id="+$id+"&pwd="+$pwd+"&name="+$name;
		console.log($data);
		if($(this).attr("id")=="mod_btn"){
			$url="customermodify.do";
			$.ajax({ url: $url,
				method:"post",
				data: $data,
				success: function(responseData){
					var result = responseData.trim();
					$parentObj.empty();
					$parentObj.html(result);
				},
				error: function(xhr,status,erro){
					console.log("error:"+status+","+error);
				}
			});	
		}
		if($(this).attr("id")=="del_btn"){
			$url="customerdelete.do";
			$.ajax({ url: $url,
				method:"post",
				data: $data,
				success: function(responseData){
					location.href = responseData.trim();
					/* var result = responseData.trim();
					$parentObj.empty();
					$parentObj.html(result); */
				},
				error: function(xhr,status,erro){
					console.log("error:"+status+","+error);
				}
			});	
		}
		return false;			
	});	
});
</script>
<style>
  #title_div{width:800px; border-top:1px solid lightgray; margin:auto; margin-top:90px;}
  #title_lab{font-size:60px; color:#abd0e1; font-style:italic;}   

  .board_tb {width:500px; border-collapse: collapse; margin:auto; margin-top:50px }  
  .board_tb th:first-child , .board_tb td:first-child { text-align: center; width:30%; }
  .board_tb th:nth-child(2) , .board_tb td:nth-child(2) { padding-left:50px;}
  .board_tb th {background-color: #abd0e1; color:#fff; border-bottom:1px solid lightgray;height:40px;} 
  .board_tb td, .board_tb th { height:40px;}
  	input{width:200px; height:40px; border-bottom:1px solid lightgray; border-top:none; border-left:none; border-right:none;}
	input[type=button] { height:25px; margin-top:3px; border:0px; width:80px; border-radius:5px; 
	background-color:#343434; color:white;cursor:pointer}
</style>


<div style="width:800px;margin:auto;">
	<label id="title_lab" style="position:absolute; top:170px;">My Detail</label>
</div>
<div id="title_div">	
	<form>
		<table class="board_tb">		
			<tr> <th>아이디</th> <td id="td_id" style="cursor:default;">${details.id}</td> </tr>		
			<tr> <th>이름</th> <td> <input type="text" name="name" value=${details.name} required></td> </tr>	
			<tr> <th>비밀번호</th> <td> <input type="password" name="pwd" value=${details.password} required></td> </tr>		
			<tr> <td></td><td> <input type="button" id ="mod_btn" value="수정" style="height:30px">
				<input type="button" id ="del_btn" value="삭제" style="height:30px"> </td> 
			</tr>							
		</table>	
	</form>	
</div>