<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%> 

<!DOCTYPE html>
<title>result_orderlist</title>

<style>
  #title_div{ width:800px; border-bottom:1px solid lightgray; margin:auto; padding-top:10px;}
  #title_txt{font-size:60px; color:#abd0e1; font-style:italic; font-weight:200;}  
  #order_div{width:700px; margin:auto;}
  
  .order_tb {width:700px; border-collapse: collapse; margin:auto; margin-top:50px }  
  .order_tb td,.order_tb th{ text-align: center; height:70px; border-bottom:1px solid lightgray;}  
  .order_tb td { color:#474747; text-size:10px;}  
  .order_tb th {background-color: #abd0e1; color:#fff;height:70px; }
</style>


<div id="title_div">
	<h3 id="title_txt">Order</h3>
</div>
<div id="order_div">
	<c:choose>	
	<c:when test="${empty result}">
		<h3>주문목록이 비었습니다</h3>
	</c:when>

	<c:otherwise>
		<c:set var="order" value="${result}"/>			
		<table class="order_tb">
			<tr> <th>주문번호</th> <th>주문일자</th> <th>상품번호</th> <th>상품명</th> <th>상품가격</th> <th>수량</th> <th>금액</th> </tr>
			<c:forEach var="in" items="${result}">
				<c:set var="cnt" value="0"/>
				<tr>	
					<td rowspan="${fn:length(in.lines)}">${in.info_no}</td>  <td rowspan= "${fn:length(in.lines)}">${in.info_date}</td> 		
							
					<c:forEach var="l" items="${in.lines}">	
						<c:set var="p" value="${l.line_p}"/>	
						<c:if test="${cnt}!=0">		<tr>	</c:if>			
							<td>${p.no}</td> <td>${p.name}</td> <td>${p.price}</td> 
							<td>${l.line_quantity}</td> <td>${l.line_quantity*p.price}</td>
						
						<c:set var="cnt" value="${cnt+1}" />
							</tr>	
					</c:forEach>		
			</c:forEach>
		</table>
	</c:otherwise>		
	</c:choose>
</div>

<%-- 
<table class="tb_product" style="margin:auto;">
<tr> <th>주문번호</th> <th>주문일자</th> <th>상품번호</th> <th>상품명</th> <th>상품가격</th> <th>수량</th> <th>금액</th> </tr>
	
<c:forEach var="in" items="${result}">
	<c:set var="cnt" value="0"/>
	<tr>	
		<td rowspan="${fn:length(in.lines)}">${in.info_no}</td>  <td rowspan= "${fn:length(in.lines)}">${in.info_date}</td> 		
				
		<c:forEach var="l" items="${in.lines}">	
			<c:set var="p" value="${l.line_p}"/>	
			<c:if test="${cnt}!=0">		<tr>	</c:if>			
				<td>${p.no}</td> <td>${p.name}</td> <td>${p.price}</td> 
				<td>${l.line_quantity}</td> <td>${l.line_quantity*p.price}</td>
			
			<c:set var="cnt" value="${cnt+1}" />
				</tr>	
		</c:forEach>		
</c:forEach>

</table>

 --%>