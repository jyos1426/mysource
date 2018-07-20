<%@ page contentType="text/html; charset=UTF-8"%>
<!DOCTYPE html>

<title>search.jsp</title>
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
	$("option[value=<%=item%>]").attr("selected","true");
	<%-- $("input[name=searchValue]").val('<%=value%>'); --%>
	$("input[name=searchValue]").val('${param.searchValue}');
	$("input[type=button]").click(function(){
		$.ajax({ 
			url:"productlist.do",
			method:"post",
			data: $("form").serialize(),
			success: function(responseData){
					var $parentObj = $("article");
					if($parentObj.length == 0){
						$parentObj = $("body");
					}
					$parentObj.empty();
					$parentObj.html(responseData.trim());	
				},
			error: function(xhr,status,erro){
						console.log(erro);
				}
		});	
		return false;		
	});
});
</script>


<style>
	input[type=button] { height:25px; margin-top:3px; border:0px; width:80px; border-radius:5px; 
	background-color:#343434; color:white;cursor:pointer}
</style>
  <form>
    <select style="height:30px;" name="searchItem">
      <option value="no" selected="selected">번호로 검색</option>
      <option value="name">내용으로 검색</option>
    </select>
    <input type="search" name="searchValue" style="height:30px">
    <input type="button" value="검색" style="height:30px">
  </form>
