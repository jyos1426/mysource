<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%> 
<!DOCTYPE html>
<title>result_board_detail.jsp</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>
$(function(){	
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
	
	var $parent = <%=request.getParameter("no")%>
	console.log($parent);	
	
	 $("#reply_div").click(function(){
		 $(".reply_tb").slideToggle("fast");
	 });	 
	 
	$reply_tr = $(".reply_tb tr");
	$reply_tr.click(function(){
		console.log("<%=request.getParameter("pageNum")%>");
		$.ajax({ url:'./boarddetail.do',
			method:'get',
			data: {"no":$(this).find("label").attr("value"),
				"pageNum":"<%=request.getParameter("pageNum")%>"
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
  .board_detail{ width:500px;margin:auto;}
  .content_tb {width:500px; border-collapse: collapse; margin-top:20px }
  .content_tb th { background-color:white; height:80px;text-align: center; }
  .content_tb td { text-align: center; height:30px} 
    
  #reply_div { border-bottom:1px solid #929292; border-top:1px solid #929292; color:black; width:500px; 
  				text-align:center; padding:2px 2px; background-color:#e1e1e1; font-size:13px; cursor:pointer}  
  #reply_div:hover{background-color:#cccccc;}
  .reply_tb {border-collapse: collapse; width:500px; border:none; }
  .reply_tb td,.reply_tb th{border-bottom:1px solid #eeeeee; padding:10px 10px; cursor:pointer}
  .reply_tb tr:hover { background-color:#eeeeee;}
</style>

<body>
	<div style="width:500px; margin:auto;">
	<jsp:include page="menu_board.jsp"></jsp:include>
	</div>
	<div class="board_detail">
	<c:set var="details" value="${requestScope.result}" ></c:set>
		
		<table class="content_tb" style="margin-bottom:10px">	
			<tr><th>${details[0].subject}</th></tr>			
			<tr><td style="border-bottom:1px solid lightgray;">no ${details[0].no}　|　 reply ${fn:length(details)-1} </td></tr>
			<tr><td colspan="4" style="height:200px;">${details[0].content}</td></tr>
		</table>
		
		<div id="reply_div"> <label> 관련 답글이 ${fn:length(details)-1}개 있습니다</label> </div>	
				
		<c:if test="${fn:length(details)>1}">
			<table class="reply_tb">
				<c:forEach var="reps" items="${details}" varStatus="status">		
					<c:if test="${status.index > 0}">						
					<tr>
						<th><label value="${reps.no}">${reps.no}</label></th>
						<td>${reps.subject}</td> 
					</tr> 	
					</c:if>
				</c:forEach>	
			</table>					
		</c:if>		
	</div>
	<div style="height:30px"></div>
	<div style="width:500px; margin:auto;">
	<jsp:include page="search_board.jsp"></jsp:include>
	</div>
</body>
