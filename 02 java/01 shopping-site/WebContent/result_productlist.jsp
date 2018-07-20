<%@ page contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<title>ProductListResult.jsp</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>
$(function(){
	
	var $parentObj = $("article");
	if($parentObj.length == 0){
		$parentObj = $("body");
	}
	
	//아직 DOM트리에 구성되지 않았지만 동적으로 추가될 객체에 대한 이벤트 핸들러 작성가능
	$parentObj.on("click",".detail #btcart",function(){
		alert("장바구니에 넣었습니다.");
		var no = $("table td#no").html();
		var name  = $("#name").html();
		var price = $("#price").html();
		var quantity = $("input[name=quantity]").val();
		$.ajax({url:"addcart.do",
			async : false,
			method:'post',
			data: { "no":no, "name":name, "price":price, "quantity":quantity },
			success:function(responsdData){			
				$parentObj.empty();
			},
			error:function(xhr, status,error){
				console.log(xhr.status);
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
				var jsonObj = responseData;
				//var jsonObj= JSON.parse(result);
				//console.log(jsonObj.no+","+jsonObj.name+","+jsonObj.price);
								
				var $data='';
			
				var $detail_no = jsonObj.no;
				var $detail_name = jsonObj.name;
				var $detail_price = jsonObj.price;
				
				$data ='<style>'+					
					'#prod_div1{width:800px; border-top:1px solid lightgray; margin:auto; margin-top:90px;}'+
				 	'#prod_div {width:500px; margin:auto; margin-top:50px;}'+
				 	
					'.detail{width:400px; height:200px; border:none; border-collapse: collapse; margin:auto; text-align:center;}'+
			    	'.detail th{width:100px; border:none; color::#abd0e1; text-align:right;}'+
				    '.detail td{border:none;}'+		    
					'label{font-size:60px; color:#abd0e1; font-style:italic;} '+
					
				    '#detail_img_td {width:400px;height:200px;}'+
				 	'img{ width:100%;height:100%; border-radius:50%; opacity:0.5; margin-right:100px;}'+
				 	'img:hover{ opacity:1; }'+

				    '#btcart{width:120px; height:40px; background-color:#abd0e1; border:none; border-radius:10px;color:white;}'+		
				 	
					'</style>'+
					'<div style="width:800px;margin:auto;">'+
					'<label style="position:absolute; top:170px;">Product Detail</label>'+
					'</div>'+
					
					'<div id="prod_div1">'+
						'<div id="prod_div">'+
						'<table class="detail">'+
						'<tr> <td id="detail_img_td" rowspan="5"><img src="./images/'+$detail_no+'.jpg" value="'+$detail_no+'"></img></td>'+
						'<th>상품번호</th> <td id="no">'+$detail_no+'</td> </tr>'+
						'<tr> <th>이름</th> <td id="name">'+$detail_name+'</td> </tr>'+
						'<tr>  <th>상품가격</th> <td id="price">'+$detail_price+'</td> </tr>'+
						'<tr> <th>수량</th> <td> <input type="number" min="1" value="1" name="quantity" style="width:50px" value="1"> </td> </tr>'+
						'<tr> <td colspan="2"> <input type="button" style="width:200px" id="btcart" value="장바구니에 넣기" > </td> </tr>'+
						'</table>'+		
						'</div>'+
					'</div>'	
 			 	/* var data='<h3 style="text-align:center;">상품 상세정보</h3>';
                data+='<style>';
                data+='.detail{width:300px; height:200px; border:1px solid #95B0A7; border-collapse: collapse; margin:auto; text-align:center;}';
                data+='.detail th{width:100px; border:1px solid #95B0A7; background-color:#0CCAC4; color:#fff}';
                data+='.detail td{border:1px solid #95B0A7;}';
                data+='#btcart{width:400px; height:30px; background-color:#0CCAC4; border:none}';
                data+='</style>';
                data+='<table class="detail">';
                data+='<tr>';
                data+='<th>상품번호</tth>';
                data+='<td id="no">' +jsonObj.no + '</td>';
                data+='</tr>';
                data+='<tr>';
                data+='<th>이름</th>';
                data+='<td id="name">' + jsonObj.name +'</td>';
                data+='</tr>';
                data+='<tr>';
                data+='<th>상품가격</th>';
                data+='<td id="price">'+jsonObj.price +'</td>';
                data+='</tr>';
                data+='<tr>';
                data+='<th>수량</th>';
                data+='<td>';
                data+='<input type="number" min="1" value="1" name="quantity" style="width:50px" value="1">';
                data+='</td>';
                data+='</tr>';
                data+='<tr>';
                data+='<td colspan="2">';
                data+='<input type="button" style="width:200px" id="btcart" value="장바구니에 넣기" >';
                data+='</td>';
                data+='</tr>';
                data+='</table>' */ 
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
  .product_tb{ width:180px;border:none; border-collapse: collapse; margin:auto; margin-bottom:20px;}
  .product_tb td{ text-align:center; border:none; }
  .prod_name_td{ height:25px;}
  .prod_img_td{ height:180px;padding:10px;}
  .prod_price_td{ height:25px;}
  label{font-size:60px; color:#abd0e1; font-style:italic;}
  
  img{ width:100%;height:100%; border-radius:50%; opacity:0.5; cursor:pointer;}
  img:hover{ opacity:1; }
 
  #prod_div1{width:800px; border-top:1px solid lightgray; margin:auto; margin-top:90px;}
  #prod_div2{width:730px; margin:auto; margin-top:50px;}  
</style>

<div style="width:800px;margin:auto;">
	<label style="position:absolute; top:170px;">Products</label>
	<div style="position:absolute; right:250px;top:200px;">
	<jsp:include page="search.jsp"></jsp:include>
	</div>
</div>
<div id="prod_div1">
	<div id="prod_div2">
		<c:forEach var="p" items="${result}" varStatus="status">
		
				<table class="product_tb" style="display:inline-block">
					<tr><td class="prod_img_td"><img src="./images/${p.no}.jpg" value="${p.no}"></img></td></tr>
					<tr><td class="prod_name_td"><%-- <a href="#">${p.no}</a> --%>${p.name}</td> </tr>
					<tr><td class="prod_price_td"> ${p.price}</td></tr>
				</table>
				
			<c:if test="${(status.index + 1) mod 4 eq 0}"><br></c:if>
		</c:forEach>
	</div>
</div>
<%-- <table class="tb_product" style="border:1px solid ;border-collapse:collapse; margin-top:10px">
		<tr> <th>번호</th> <th>이름</th> <th>가격</th> </tr>
					
		<c:forEach var="p" items="${result}">
			<tr>
				<td> <a href="#">${p.no}</a> </td> 
			 	<td> ${p.name} </td> 
				<td> ${p.price}</td> 
			</tr> 
		</c:forEach>				
</table>  --%>

