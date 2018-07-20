<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<title>page_board.jsp</title>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>
$(function(){
	
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
	
 	$("#paging>#thisDiv>a").click(function(e){
		$.ajax({ 
			url:"./boardlist.do",
			method:"get",
			data:{"pageNum":$(this).attr("value")},
			success: function(responseData){
					$parentObj.empty();
					$parentObj.html(responseData.trim());	
				},
			error: function(xhr,status,erro){
						console.log(erro);
				}
		});	
		return false;
	});
	
	//아직 DOM트리에 구성되지 않았지만 동적으로 추가될 객체에 대한 이벤트 핸들러 작성가능	
});

</script>

<meta charset="UTF-8">

<style>
	div#paging{
	  position:relative;
	  margin-top:15px;
	}
	
	div#thisDiv{
	  position:absolute;
	  left:50%;
	  transform: translateX(-50%);
	  -webkit-transform: translateX(-50%);
	}
</style>
<body>
	<div id="paging">
		<div id="thisDiv">
		<c:if test="${count > 0}">
		   <c:set var="pageCount" value="${count / pageSize + ( count % pageSize == 0 ? 0 : 1)}"/>
		   <c:set var="startPage" value="${pageGroupSize*(numPageGroup-1)+1}"/>
		   <c:set var="endPage" value="${startPage + pageGroupSize-1}"/>
		   
		   <c:if test="${endPage > pageCount}" >
		     <c:set var="endPage" value="${pageCount}" />
		   </c:if>
		          
		   <c:if test="${numPageGroup > 1}">
		        <a href="#" value="${(numPageGroup-2)*pageGroupSize+1}">[이전]</a>
		   </c:if>
		
		    <c:forEach var="i" begin="${startPage}" end="${endPage}">
		       <a href="#" value="${i}">
		        <c:if test="${currentPage == i}">
		        </c:if>
		        [${i}]
		       </a>
		   </c:forEach>
		   
		   <c:if test="${numPageGroup < pageGroupCount}">
		        <a href="#" value="${numPageGroup*pageGroupSize+1}">[다음]</a>
		   </c:if>
		</c:if>
		</div>
	</div>
</body>