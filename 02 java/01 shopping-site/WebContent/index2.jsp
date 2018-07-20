<%@ page contentType="text/html; charset=UTF-8"%>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"> </script>
<script>
$(function(){
	$.ajax({
		url: 'productlist.do',
		async:false,
		success:function(responseData){
				$parentObj = $("article");
				$parentObj.empty();
				$parentObj.html(responseData.trim());	
			}	
	});	
});
</script>