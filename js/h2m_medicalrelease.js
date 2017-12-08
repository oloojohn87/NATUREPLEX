$(document).ready(function () {
    //$('.sigPad').signaturePad({drawOnly:true});

	//$('.sigPad').signaturePad();
	

});

function displaySelectOptions() {
	var $recordtype = $("#recordtype").val();

	switch (parseInt($recordtype)) {
    	case 0:
			$("#recordtype-info").hide();
			$("#recordtype-dates").hide();
        	break;
    	case 1:
        	$("#recordtype-dates").show();
			$("#recordtype-info").hide();
        	break;
		default:
			$("#recordtype-info").show();
			$("#recordtype-dates").hide();		
	}

}
function medicalReleaseSelect(user,emailId) {
	
		//here call medical passport in ajax call	
	   	messageForDoc = "message for doc";
        
       	$.get("RequestReportsFromExternalDoc.php?emailId="+emailId+"&user="+user+"&message="+messageForDoc,function(data,status)
              {
                  console.log("Message    "+data);
                  //alert('Your request has been sent.');
                  
		   		  swal({   title: "Done!",   text: "Your request has been sent.",   type: "success",   confirmButtonText: "Ok" });
              });
	 	//$(this).closest('.ui-dialog-content').dialog('close'); 
	//$(this).dialog('close');
}