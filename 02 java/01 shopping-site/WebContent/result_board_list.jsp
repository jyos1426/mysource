<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<title>result_board_list.jsp</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>
$(function(){
	
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
		
	var $parent = 0;
	console.log($parent);
	
	$board_tr = $(".main_tr").add(".sub_tr");	
	$board_tr.click(function(){
		$.ajax({ url:'boarddetail.do',
			method:'get',
			data: {"no":$(this).find("label").attr("value"),
				"pageNum":$("#currentPage").attr("value")
				},
				success: function(responseData){				
				$parentObj.empty();
				var result = responseData.trim();
				$parentObj.html(result);
			},
			error:function(xhr, status,error){
				console.log(xhr.status);
			}
		});
		return false;	
		
	});
});

</script>

<style>
  #title_div{width:800px; border-top:1px solid lightgray; margin:auto; margin-top:90px;}
  #title_lab{font-size:60px; color:#abd0e1; font-style:italic;}   

  .board_tb {width:700px; border-collapse: collapse; margin:auto; margin-top:10px } 
  .board_tb th:first-child , .board_tb td:first-child { text-align: center; width:20%; }
  .board_tb th:nth-child(2) , .board_tb td:nth-child(2) { padding-left:50px;}
  .board_tb th {background-color: #abd0e1; color:#fff; border-bottom:1px solid lightgray;height:40px;} 
  .board_tb td, .board_tb th { height:40px;}
  .board_tb tr:hover{background-color:#cccccc; color:#fff;}
  
  .sub_tr { background-color:#f3f3f3; border-bottom:1px solid lightgray;cursor:pointer}
  .main_tr {  background-color:white; border-bottom:1px solid lightgray;cursor:pointer}
</style>

<div style="width:800px;margin:auto;">
	<label id="title_lab" style="position:absolute; top:170px;">QnA</label>
	<div style="position:absolute; right:250px;top:200px;">
	<jsp:include page="search_board.jsp"></jsp:include>
	</div>
</div>
<div id="title_div">
	<div style="width:700PX;margin:auto;margin-top:20px">
	<jsp:include page="menu_board.jsp"></jsp:include>	
	▶문의사항을 작성해 주세요</div>
	<div id="currentPage" value="${currentPage}"></div>

	<table class="board_tb">
		<tr> <th>No</th> <th>Subject</th> </tr>					
		<c:forEach var="b" items="${result}">
			<c:if test="${b.level == 1}">
				<tr class="main_tr">
					<td><label value="${b.no}">${b.no}</label></td> 
					<td>${b.subject}</td> 
				</tr> 
			</c:if>
			<c:if test="${b.level > 1}">
				<tr class="sub_tr">
					<td><label value="${b.no}">${b.no}</label></td> 
					<td>
						<c:forEach var="i" begin="2" end="${b.level}">
						&nbsp;&nbsp;&nbsp;&nbsp;</c:forEach>	
						ㄴRE: ${b.subject}
					</td> 
				</tr> 
			</c:if>
		</c:forEach>				
	</table>
	
	<jsp:include page="page_board.jsp"></jsp:include>	
</div>