/**
 * Login Script
 */
function DoLogin(){
    var userid = $("input[name='userid']").val();
    var userpw = $("input[name='userpw']").val();
    var token = CryptoJS.SHA256(userid+userpw).toString(CryptoJS.enc.Hex);

    var startlen = 0;
    var endlen = userpw.length;
    userpw = "";

    while(startlen < endlen){
    	userpw += "*";
    	startlen++;
    }

    $('form').append('<input type="hidden" name="token" />');
    $('form').append('<input type="hidden" name="ts" />');
    $("input[name='userpw']").val(userpw);
    $("input[name='token']").val(token);
    $("input[name='ts']").val(new Date().getTime());
}
$(function(){
	$('form').submit(DoLogin);
});
