<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html>
<title>result_cartlist.jsp</title>
<script>
$(function(){
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
	
	$parentObj.on("click","input[type=button]",function(){
		$.ajax({
			url:"addorder.do",
			method:"post",
			async:false,
			success:function(responseData){
				$parentObj.empty();
				$parentObj.html(responseData);				
			},
			error: function(xhr,status,erro){
				console.log("error:"+status+","+error);
			}
		});
		return false;
	});
	
	$("img").click(function(){
		$.ajax({ url:'productdetail.do',
			method:'post',
			data: 'no='+$(this).attr("value"),
				success: function(responseData){
				
				$parentObj.empty();
				var result = responseData.trim();
				var jsonObj= JSON.parse(result);
				console.log(jsonObj.no+","+jsonObj.name+","+jsonObj.price);
				
				var $data='';
				var $detail_no = jsonObj.no;
				var $detail_name = jsonObj.name;
				var $detail_price = jsonObj.price;
				
				$data ='<style>'+					
					'#title_div{width:800px; border-top:1px solid lightgray; margin:auto; margin-top:90px;}'+
				 	'#prod_div {width:500px; margin:auto; margin-top:50px;}'+
				 	
					'.detail{width:500px; height:200px; border:none; border-collapse: collapse; margin:auto; text-align:center;}'+
			    	'.detail th{width:100px; border:none; text-align:right;}'+
				    '.detail td{border:none;}'+		    
					'label{font-size:60px; color:#abd0e1; font-style:italic;} '+
					
				    '#detail_img_td {width:300px;height:200px;padding-right:100px}'+
				 	'img{ width:100%;height:100%; border-radius:50%; opacity:0.5;}'+
				 	'img:hover{ opacity:1; }'+

				    '#btcart{width:120px; height:40px; background-color:#abd0e1; border:none; border-radius:10px;color:white;}'+		
				 	
					'</style>'+
					'<div style="width:800px;margin:auto;">'+
					'<label style="position:absolute; top:170px;">Product Detail</label>'+
					'</div>'+
					
					'<div id="title_div">'+
						'<div id="prod_div">'+
						'<table class="detail">'+
						'<tr> <td id="detail_img_td" rowspan="5"><img src="./images/'+$detail_no+'.jpg"></img></td>'+
						'<th>상품번호</th> <td id="no">'+$detail_no+'</td> </tr>'+
						'<tr> <th>이름</th> <td id="name">'+$detail_name+'</td> </tr>'+
						'<tr>  <th>상품가격</th> <td id="price">'+$detail_price+'</td> </tr>'+
						'<tr> <th>수량</th> <td> <input type="number" min="1" value="1" name="quantity" style="width:50px" value="1"> </td> </tr>'+
						'<tr> <td colspan="2"> <input type="button" style="width:200px" id="btcart" value="장바구니에 넣기" > </td> </tr>'+
						'</table>'+		
						'</div>'+
					'</div>'	
				$parentObj.html($data);
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
  #title_div{ width:800px; border-bottom:1px solid lightgray; margin:auto; padding-top:10px;}
  #title_txt{font-size:60px; color:#abd0e1; font-style:italic; font-weight:200;}  
  #cart_div{width:700px; margin:auto;}
  
  .cart_tb {width:700px; border-collapse: collapse; margin:auto; margin-top:50px }  
  .cart_tb td,.board_tb th{ text-align: center; height:70px; border-bottom:1px solid lightgray;}  
  .cart_tb td { color:#474747; text-size:10px;}  
  .cart_tb th {background-color: #abd0e1; color:#fff;height:70px; }
  input[type=button] { height:30px; margin-top:3px; border:0px; width:80px; border-radius:5px; 
	background-color:#343434; color:white;cursor:pointer}
  img{ height:100%; width:60px; border-radius:50%; cursor:pointer;}
</style>


<div id="title_div">
	<h3 id="title_txt">Cart</h3>
	<div style="position:absolute; right:250px;top:200px;">
		<input type="button" value="주문하기">
	</div>
</div>

<div id="cart_div">
	<c:choose>	
	<c:when test="${empty sessionScope.cart}">
		<h3>장바구니가 비었습니다</h3>
	</c:when>
	
	<c:otherwise>
		<c:set var="cart" value="${sessionScope.cart}"/>			
		<table class="cart_tb">
			<tr><th>상품</th><th>상품명</th><th>가격</th><th>수량</th><th>금액</th>
			</tr>
			<c:set var="money" value="0"/>
			<c:forEach var="c" items="${cart}" >
			<c:set var="p" value="${c.key}"/>
				<tr><td style="padding:5px 0px;"><img src="./images/${p.no}.jpg" value="${p.no}"></img></td>
					<td>[${p.no}] ${p.name}</td>
					<td><fmt:formatNumber value="${p.price}" type="currency"/></td>
					<td>${c.value}</td>
					<td>${p.price * c.value}</td>
				</tr>
			<c:set var="money" value="${money+p.price * c.value}"/>			
			</c:forEach>
		</table>
	</c:otherwise>		
	</c:choose>
	
	<h3 style="position:absolute;right:250px;">총액: ${money}</h3>
</div>
