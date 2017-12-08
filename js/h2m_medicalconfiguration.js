var med_id = $("#MEDID").val();
var doc_speciality = $("#DOC_SPECIALITY").val();
var doc_email = $("#IdMEDEmail").val();
var doc_timezone = $("#DOC_TIMEZONE").val();
var doc_state = $("#DOC_STATE").val();
var doc_country = $("#DOC_COUNTRY").val();
var custom_look = $("#CUSTOM_LOOK").val();
var message_holder = $("#MESSAGE").val();
var timestamp_holder = $("#TIMESTAMP").val();
var unique_salt = $("#UNIQUE_SALT").val();

if(doc_country == 'USA'){
	$("#state2").parent().parent().css("display", "block");
}

function addAdditionalLicenses(){
	var state = $('#state2').val();
	$.post('addAdditionalLicense.php', {med_id:med_id, state:state, type:'add'})
		.done(function(data){
		displayAdditionalLicenses();
		});
}

function removeAdditionalLicenses(){
	var state = $('#state2').val();
	$.post('addAdditionalLicense.php', {med_id:med_id, state:state, type:'remove'})
		.done(function(data){
		displayAdditionalLicenses();
		});
}

function displayAdditionalLicenses(){
	$.post('addAdditionalLicense.php', {med_id:med_id, type:'display'})
		.done(function(data){
		$('#display-additional-licenses').text(data);
		});
}
displayAdditionalLicenses();
	
	var timeoutTime = 18000000;
	//var timeoutTime = 300000;  //5minutes
	var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
	var predefined_events = 0;
	var deleted_elements = new Array();

	var active_session_timer = 60000; //1minute
	var sessionTimer = setTimeout(inform_about_session, active_session_timer);

    function LanzaAjax (DirURL)
		{
		var RecTipo = 'SIN MODIFICACIÓN';
	    $.ajax(
           {
           url: DirURL,
           dataType: "html",
           async: false,
           complete: function(){ //alert('Completed');
                    },
           success: function(data) {
                    if (typeof data == "string") {
                                RecTipo = data;
                                }
                     }
            });
		return RecTipo;
		}

	 function displayalertnotification(message){
	 
	  var gritterOptions = {
				   title: 'status',
				   text: message,
				   image:'images/Icono_H2M.png',
				   sticky: false,
				   time: '3000'
				  };
		$.gritter.add(gritterOptions);
	   
	  } 

	//SET THE GROUP DIALOG
	var group_dialog = $("#create-group").dialog({bgiframe: true, width: 650, height: 550, modal: false, autoOpen: false, "title" : "Create Group"});
	
		///////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	function fileSelected() {
        var file = document.getElementById('fileToUpload2').files[0];
        if (file) {
            //confirm(window.location.pathname);
            var fileSize = 0;
            if (file.size > 1024 * 1024)
                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            else
                fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

            document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
            document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
            document.getElementById('fileType').innerHTML = 'Type: ' + file.type;          
            
            //CHANGE THE PICTURE THUMBNAIL WHEN IT CHANGES
            var hostUrl = window.location.protocol + "//" + window.location.host + "/";
            console.log(hostUrl);
            var profile_pic = document.getElementById('doctorImage').src;
            
            if(profile_pic.indexOf('defaultDP') > -1) profile_pic = 'DoctorImage/'+$('#MEDID').val()+'.jpg';
            else profile_pic = profile_pic.substring(hostUrl.length, profile_pic.length);
            //alert(profile_pic);
            var rand = "?rand2";
            if(profile_pic.indexOf('live') > -1) {
                if (profile_pic.indexOf(rand) > -1) profile_pic = profile_pic.substring(profile_pic.indexOf('live')+4, profile_pic.indexOf(rand));
                else profile_pic = profile_pic.substring(profile_pic.indexOf('live')+4, profile_pic.length);
            }
            if (profile_pic.indexOf(rand) > -1) profile_pic = profile_pic.substring(0, profile_pic.indexOf(rand));
            profile_pic += rand+Math.random();
            //console.log(profile_pic);  
            //setTimeout(function() {document.getElementById('doctorImage').src = 'DoctorImage/'+$('#MEDID').val()+'.jpg';}, 30000000000000000000000000);
            setTimeout(function() {document.getElementById('doctorImage').src = profile_pic;}, 500);          
            
        }
    }

      function uploadFile2() {
        var fd = new FormData();
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        /*xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);*/
        xhr.open("POST", "uploadifyDoctor.php?pulldoc="+med_id, true);
        fd.append("fileToUpload2", document.getElementById('fileToUpload2').files[0]);
        xhr.send(fd);
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    uploadComplete(xhr);
                }
                else {
                    uploadFailed();
                }
            }
        };
      }

      function uploadProgress(evt) {
        if (evt.lengthComputable) {
          var percentComplete = Math.round(evt.loaded * 100 / evt.total);
          document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
        }
        else {
          document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }
      }

      function uploadComplete(evt) {
		/*document.getElementById("image_holder").src="../PatientImage/"+med_id+".jpg";
        //This refreshes image
        var profile_pic = document.getElementById('image_holder');
        profile_pic.src += "?rand2"+Math.random();*/
        if(evt.responseText != "File is uploaded successfully.") alert(evt.responseText); 
          
      }

      function uploadFailed() {
        alert("There was an error attempting to upload the file.");
      }

      function uploadCanceled(evt) {
        alert("The upload has been canceled by the user or the browser dropped the connection.");
      }
	  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	

	$('#create-group-btn').live('click',function()
    {
		console.log('group dialog');
   	    $("#Edit_group").hide();
		$("#save_grpdate").show();
		
		$('#editgrpname').val('');
		$('#editgrpadd').val('');
		$('#editgrpzip').val('');
		$('#editgrpcity').val('');
		$('#editgrpstate').val('');
		$('#editgrpcountry').val('');
		
		$("#editgrpname").removeAttr("disabled"); 
		$('#editgrpadd').removeAttr("disabled"); 
		$('#editgrpzip').removeAttr("disabled"); 
		$('#editgrpcity').removeAttr("disabled"); 
		$('#editgrpstate').removeAttr("disabled"); 
		$('#editgrpcountry').removeAttr("disabled"); 
		$('#filesToUpload').removeAttr("disabled"); 
		group_dialog = $("#create-group").dialog({bgiframe: true, width: 650, height: 550, modal: false, autoOpen: false, "title" : "Create Group"});
        group_dialog.dialog('open');
		$('#grpimage').html('<img style="width:150px;height:150px;margin-bottom:10px" src="images/defaultgrouppic.jpg" alt="Group Picture"/>');

	});
  


    //VALIDATION CODE
    
    function alarma(mensaje,selector)
	 {
	 if (mensaje=='') { var tama = '0px'; $(selector).css ('background-color','white'); }else { var tama = '40px'; $(selector).css ('background-color','#FFF8DC'); }
	 
	 $('.MsgAlarma2').animate({
		    height: tama
		      }, 500, function() {
			      $(".MsgAlarma2").html('<p style="font-size:18px; color:white; margin:10px; top:10px; position:relative;">'+mensaje+'</p>');
		});
	 }
    
    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if( !emailReg.test( $email ) ) {
            return false;
        } else {
            return true;
        }
    } 
    //Email Validation
    /*$('#Vemail').bind("focusout", function(){    
        emailaddress =  $('#Vemail').val(); 
        if( !validateEmail(emailaddress)) 
        { 
            alert("Invalid Email Address"); 
        }    
    });*/ 
    //Phone number validation    
    $("#Vphone").intlTelInput();
            
    $('#Vphone').bind("focusout", function(){
            
           // alert('validating Phone Number');
        
         /*   if($("#Vphone").intlTelInput("isValidNumber")==false)
            {
                //alert('Invalid Phone Number');
                $('#phoneError').show();
                //$('#Vphone').focus();
                //return;
                //alarma ('Invalid Phone Number','#Vphone');
                //$('#ValorGlobal').val('-1');
            }
            else
            {	
                //$('#Phone').val($('#Phone').val().replace(/-/g, '')); //remove dashes
                $('#Vphone').val($('#Vphone').val().replace(/\s+/g, '')); //remove spaces
                //$('#ValorGlobal').val('0')
                $('#phoneError').hide();
            } */
        
    });  
        
    function checkPhoneFormat(field, rules, i, options){
      //if (field.val() != "HELLO") {
         // this allows the use of i18 for the error msgs
         // alert('validation alert');
        if($("#Vphone").intlTelInput("isValidNumber")==false) {
         
            return options.allrules.validatePhone.alertText;
        }
        else
        {	
            //$('#Phone').val($('#Phone').val().replace(/-/g, '')); //remove dashes
            $('#Vphone').val($('#Vphone').val().replace(/\s+/g, '')); //remove spaces
            //$('#ValorGlobal').val('0')
            //$('#phoneError').hide();
           return;
        } 
    }
    //end phone number validation
        
	$(window).load(function() {
	//alert("started");
        
	$(".loader_spinner").fadeOut("slow");
	})

	//This function is called at regular intervals and it updates ongoing_sessions lastseen time
	function inform_about_session()
	{
		$.ajax({
			url: '/ongoing_sessions.php?userid='+med_id,
			success: function(data){
			//alert('done');
			}
		});
		clearTimeout(sessionTimer);
		sessionTimer = setTimeout(inform_about_session, active_session_timer);
	}

	function ShowTimeOutWarning()
	{
		alert ('Session expired');
		var a=0;
		window.location = 'timeout.php';
	}
	
	function get_user_event_config(serviceURL) 
	{
		$.ajax(
		{
			url: serviceURL,
			dataType: "json",
			async: false,
			
			success: function(data)
			{
				event_config = data.items;
						
			}
		});
	}

    function getScript(url)
    {
        $.ajax(
        {
            url: url,
            dataType: "script",
            async: false
        });
    }

    function occurrences(string, subString, allowOverlapping){

        string+=""; subString+="";
        if(subString.length<=0) return string.length+1;

        var n=0, pos=0;
        var step=(allowOverlapping)?(1):(subString.length);

        while(true){
            pos=string.indexOf(subString,pos);
            if(pos>=0){ n++; pos+=step; } else break;
        }
        return(n);
    }
	
	function displaynotification(status,message){
        getScript('realtime-notifications/lib/gritter/js/jquery.gritter.min.js');
	  var gritterOptions = {
				   title: status,
				   text: message,
				   image:'images/Icono_H2M.png',
				   sticky: false,
				   time: '3000'
				  };
		$.gritter.add(gritterOptions);
		
	  }
	
	function get_user_timezone(serviceURL) 
	{
		$.ajax(
		{
			url: serviceURL,
			dataType: "json",
			async: false,
			
			success: function(data)
			{
				user_timezone = data.items;
						
			}
		});
	}
	
	function get_timezones(serviceURL) 
	{
		$.ajax(
		{
			url: serviceURL,
			dataType: "json",
			async: false,
			
			success: function(data)
			{
				timezones = data.items;
						
			}
		});
	}
	function get_user_notify_time(serviceURL) 
	{
		$.ajax(
		{
			url: serviceURL,
			dataType: "json",
			async: false,
			success: function(data)
			{
				notify_time = data.items;
						
			}
		});
	}
	
	function get_emr_config(serviceURL) 
	{
		$.ajax(
		{
			url: serviceURL,
			dataType: "json",
			async: false,
			success: function(data)
			{
				emr_config = data.items;
						
			}
		});
	}



    $(document).ready(function() { 
        
        $('#country').change(function() {
            if($('#country').val() == 'USA') $("#state2").parent().parent().css("display", "block");
            else $("#state2").parent().parent().css("display", "none");
        });
        

        //SHOW ADDITIONAL LICENSES
        /*var addLics = $('#display-additional-licenses').text().split(', ');
        var addLicNum = addLics.length;
        var addcountry = $('#country').val();
        var addstate = '';
        var addseal = '';
        for (var i = 0; i < addLicNum; i++) {
            addstate = stateList[addLics[i]];
            addseal = get_seals(addstate, addcountry);
            $('.license_container').append($('<img>').attr({'id':'licImg_'+(i+2), 'src':addseal}).addClass('license_flag'))
            .append($('div').attr('id','licInfo_'+(i+2)).addClass('license_locInfo'));
            $('div#locInfo_'+(i+2))
                .append($('span').addClass('lic_state_name').text(addstate))
                .append($('span').addClass('lic_country_name').text(addcountry));
        }*/
        
        //THIS UPLOADS PROFILE IMAGE//
        $("#doctorImage").click(function(e) {
            e.preventDefault();
            $("#fileToUpload2").click();
            //return false;
        });

        $("input[id='fileToUpload2']").change(function() {
            $("input[id='make_upload']").click();
        });
        

        //Show notification settings
        $.ajax({
            url: '../notification_docSetting.php',
            data: 'idDoc='+med_id+'&display=true',
            dataType: 'json',
            success: function(data)
            {
                console.log(data);
                var checkboxes = $("#buttons_notification :checkbox");
                $.each(data, function(key, value) {
                        if(key == 'group')
                            $("#groupN").val(value);
                        else
                        {
                            checkboxes.each(function() {
                                if($(this).attr('id').indexOf(key) == 0) {
                                    if (value.indexOf(',') > -1) {
                                        var values = value.split(', ');
                                        for (var v in values) {
                                            if (values.hasOwnProperty(v)) {
                                                $('#'+key+values[v]).prop('checked',true);
                                            }
                                        }
                                    }
                                    else {
                                        $('#'+key+value).prop('checked',true);
                                    }
                                }
                            });
                        }
                });
            },
            error: function(xhr)
            {
                console.log(xhr.responseText);
            }
        });
        
		
		//SHOW GROUP TABLE
		var grptble = LanzaAjax('getGroupDetails.php?docid='+med_id+'');
		$('#group_details').html(grptble);
	
    
        //var pusher = new Pusher('d869a07d8f17a76448ed');
        //var channel_name=$('#MEDID').val();
        //var channel = pusher.subscribe(channel_name);
        
        var push = new Push($("#MEDID").val(), window.location.hostname + ':3955');
        
        push.bind('notification', function(data) 
        {
            displaynotification('New Message', data);
        });
        
        
        var message = '';
        var unsaved_changes = false;
        if(message_holder != 'undefined'){
		message = message_holder;
        }
		if(message.length > 0)
        {
            alert(message);
            window.location = "medicalConfiguration.php";
        }
        $("#change_password_validate_button").live('click', function()
        {
            console.log('doc_id: '+$("#MEDID").val()+', pw: '+$("#pw1").val());
            $.post("validate_password.php", {doc_id: $("#MEDID").val(), pw: $("#pw1").val()}, function(data, status)
            {
                console.log(data);
                if(data == '1' && $("#change_password_validated_section").css("display") == 'none')
                {
                    $("#change_password_validated_section").slideDown();

                }
                else
                {
                    $("#password_notification").css("background-color", "#D5483A");
                    $("#password_notification").html('<p style="color: #fff;">Password Incorrect</p>');
                    $("#password_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$("#password_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                }
            });

        });
        
        $("#reset_availability_button").on('click', function()
        {
            $.post("reset_doctor_availability.php", {ID: $("#USERDID").val()}, function(data, status)
            {   
                if(data == '1')
                {
                    $("#consultation_status_label").html('You are currently: <span style="color: #54bc00;">Not in consultation</span>');
                }
            });
        });
		var translation9 = '';

		if(language == 'th'){
		translation9 = 'Contraseña Cambiada';
		}else if(language == 'en'){
		translation9 = 'Password Changed Successfully!';
		}
		
        $("#change_password_finish_button").live('click', function()
        {
            if($("#pw2").val() == $("#pw3").val())
            {
                $("#pw1").val("");
                $("#change_password_validated_section").slideUp();
                $.post("update_doctor.php", {new_pw: $("#pw2").val(), doc_id: $("#MEDID").val()}, function(data, status)
                {
                    $("#pw2").val("");
                    $("#pw3").val("");
                    $("#password_notification").css("background-color", "#52D859");
                    $("#password_notification").html('<p style="color: #fff;">'+translation9+'</p>');
                    $("#password_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$("#password_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                });
            }
            else
            {
                $("#password_notification").css("background-color", "#D5483A");
                $("#password_notification").html('<p style="color: #fff;">Passwords Did Not Match</p>');
                $("#password_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#password_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
            }
        });
        
        
        $(window).bind('beforeunload', function() 
        {
            if(unsaved_changes)
                return "You have unsaved changes.";     
        });
        $("#submit_button").on('click', function()
        {
            unsaved_changes = false;            
        });
        setTimeout(function()
        {
           $("#formID input").on('input', function()
            {
                unsaved_changes = true;
            });
            $("#formID input").on('change', function()
            {
                unsaved_changes = true;
            });
            $("#formID select").on('change', function()
            {
                unsaved_changes = true;
            });
        }, 2000);
        
        var CustomLook = custom_look;
        
        //hide appointments
        if (CustomLook == "COL"){
            $("#appointments_tab").hide();
            $("#payments_tab").hide();
        } else {
            $("#appointments_tab").show();
             $("#payments_tab").show();
        }    
        
        //THIS CALLS SEAL
        function get_seals(state, country) {
            var sealUrl = 'get_my_seal.php?state='+state+'&country='+country;
            var sealOutput = '';
            $.ajax({
                url: sealUrl,
                dataType: 'html',
                async: false,
                success: function(data)
                {
                   sealOutput = data;     
                }
            });
            //alert(sealOutput);
            return sealOutput;
        }
        
        var country = doc_country;
        var state = doc_state;
        var stateList = {'Texas':'TX', 'Arizona':'AZ', 'Arkansas':'AR', 'Alaska':'AL'};
        var docState = '';
        var seal = '';
        if(country.length > 0)
        {
            $("#country").val(country).trigger('change');
            console.log('COUNTRY: ' + country);
            if(country == 'USA')
            {
                $("#state").parent().parent().css("display", "block");
            }
            
            if(state.length > 0)
            {
                setTimeout(function(){$("#state").val(state);}, 100);
                docState = stateList[state];
                seal = get_seals(state, country);
                setTimeout(function(){
                    $("#licImg_1").attr('src', seal);
                    $("#licInfo_1").find('span').eq(0).text(docState);
                    $("#licInfo_1").find('span').eq(1).text(country);
                }, 500);
            }
            
        }
        $("#country").on('change', function()
        {
            // the following code is to show the region select menu if the country is USA.
            if($(this).val() != 'USA') {
                $("#state2").parent().parent().css('display', 'none');
            }
        });
        $("#speciality").val(doc_speciality);
        
        /*if($("#telemed_on").val() == "0")
        {
		
		}
		
            $("#start_telemed").css("background-color", "#F66765");
            $("#start_telemed").css("border-color", "#F66765");
            $("#start_telemed").text(translation2);
            
        }
        else
        {
		

		if(language == 'th'){
		
		}else if(language == 'en'){
		
		}
		
            $("#start_telemed").css("background-color", "#74F677");
            $("#start_telemed").css("border-color", "#74F677");
            $("#start_telemed").text(translation2);
            
           
        }*/
        
        var translation1 = '';
        var translation2 = '';

		if(language == 'th'){
            translation1 = 'No connectado';
            translation2 = 'En línea / Modo Editor';
		}else if(language == 'en'){
            translation1 = 'Offline';
            translation2 = 'Online / Edit Mode';
        }
        var telemed_state = false;
        if($("#telemed_on").val() == "1") telemed_state = true;
        else telemed_state = false;

         //TOGGLE TRACKING
        $('input#start_telemed').bootstrapSwitch({
            'onColor': 'success',
            'offColor': 'danger',
            'onText': translation2,
            'offText': translation1,
            'labelText': '&#8596;',
            'labelWidth': 45,
            'handleWidth': 220,
            'state': telemed_state
        });
        
        
        $("#Haddress").keydown(function(e) 
        {
            var newLines = $(this).val().split("\n").length;
            
            if(e.keyCode == 13 && newLines >= 3) 
            {
                return false;
            }
        });
        // functions and events for credit cards   
        Stripe.setPublishableKey("pk_test_YBtrxG7xwZU9RO1VY8SeaEe9");
        function stripeResponseHandler(status, response) {
        
            if (response.error) 
            {
                $(".credit_card_notification").css("background-color", "#D5483A");
                $(".credit_card_notification").text('Unable To Add Bank Account');
                $(".credit_card_notification").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$(".credit_card_notification").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            } 
            else 
            {
                $("#credit_card_loader").css("visibility", "visible");
                $.post("change_credit_card.php", {type: '1', action: '1', id: $("#USERDID").val(), token: response.id, full_name: $("#bank_account_name").val()}, function(data, status)
                {
                    console.log(data);
                    $("#credit_card_loader").css("visibility", "hidden");
                    if(data == '1')
                    {
                        $(".credit_card_notification").css("background-color", "#52D859");
                        $(".credit_card_notification").text('Bank Account Added!');
                        $(".credit_card_notification").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                            setTimeout(function(){$(".credit_card_notification").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                        }});
                        $.post("get_doctor_credit_cards.php", {id: $("#USERDID").val()}, function(data, status)
                        {
                            var info = JSON.parse(data);
                            if(info["active_account"] != null && info["active_account"]["last4"] != null && info["active_account"]["last4"].length > 0)
                            {
                                $("#current_bank_account_number").text("********"+info["active_account"]["last4"]);
                                $("#current_bank_account_country").removeClass();
                                $("#current_bank_account_country").addClass('flag-icon-background');
                                $("#current_bank_account_country").addClass('flag-icon-'+info["active_account"]["country"].toLowerCase());
                                $(".credit_card_row").css("display", "block");
                            }
                        });
                    }
                    else
                    {
                        $(".credit_card_notification").css("background-color", "#D5483A");
                        $(".credit_card_notification").text('Unable To Add Bank Account');
                        $(".credit_card_notification").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                            setTimeout(function(){$(".credit_card_notification").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                        }});
                    }
                });
            }
        }
        
        $("#add_card_button").on('click', function()
        {            
            Stripe.bankAccount.createToken({
                country: $('#bank_account_country').val(),
                routingNumber: $('#bank_account_routing_number').val(),
                accountNumber: $('#bank_account_number').val()
            }, stripeResponseHandler);
            
        });
        $("#remove_card_button").on('click', function()
        {
            $("#credit_card_loader").css("visibility", "visible");
            $.post("change_credit_card.php", {type: '1', action: '2', id: $("#USERDID").val()}, function(data, status)
            {
                $("#credit_card_loader").css("visibility", "hidden");
                if(data == '1')
                {
                    $(".credit_card_notification").css("background-color", "#52D859");
                    $(".credit_card_notification").text('Bank Account Removed');
                    $(".credit_card_notification").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$(".credit_card_notification").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                    /*$.post("get_doctor_credit_cards.php", {id: $("#USERDID").val()}, function(data, status)
                    {
                        var info = JSON.parse(data);
                        if(info.hasOwnProperty('cards') && info['cards'].length > 0)
                        {
                            load_credit_cards(info['cards']);
                        }
                        console.log(data);
                    });*/
                    $(".credit_card_row").css("display", "none");
                }
                else
                {
                    $(".credit_card_notification").css("background-color", "#D5483A");
                    $(".credit_card_notification").text('Unable To Remove Bank Account');
                    $(".credit_card_notification").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$(".credit_card_notification").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                }
            });
        });
        
		if($("#USERDID").val() != ''){
        $.post("get_doctor_credit_cards.php", {id: $("#USERDID").val()}, function(data, status)
        {
            /*var info = JSON.parse(data);
            if(info.hasOwnProperty('cards') && info['cards'].length > 0)
            {
                load_credit_cards(info['cards']);
            }*/
            var info = JSON.parse(data);
            if(info["active_account"] != null && info["active_account"]["last4"] != null && info["active_account"]["last4"].length > 0)
            {
                $("#current_bank_account_number").text("********"+info["active_account"]["last4"]);
                $("#current_bank_account_country").removeClass();
                $("#current_bank_account_country").addClass('flag-icon-background');
                $("#current_bank_account_country").addClass('flag-icon-'+info["active_account"]["country"].toLowerCase());
                $(".credit_card_row").css("display", "block");
            }
            //console.log(info["active_account"]["last4"]);
        });
		}
        
        // end functions and events for credit cards
        
        
        // functions and events for certifications
        
        function basename(path)
        {
            return path.split(/[\\/]/).pop();
        }
        function handleSelectedCertification(item, value)
        {      
            var index = item.split("_")[2];
            if(certifications.hasOwnProperty(value))
            {
                var image = certifications[value];
                $("#certification_image_"+index).attr("src", image);
                //$(".doctor_certification_icon").attr("src", image).show();
                $("#certification_filename_"+index).val(basename(image));
            }
            else
            {
                $("#certification_image_"+index).attr("src", "CertificationImages/none.jpg");
                $("#certification_filename_"+index).val("");
            }
            $("#certification_filedata_"+index).val("");
            
        }
        var certifications, keys;
        $.get("get_certifications.php", function(data, status)
        {
            certifications = JSON.parse(data);
            keys = Object.keys(certifications);
            
            $.post("get_certifications.php", {id: $("#MEDID").val()}, function(data, status)
            {
                var info = JSON.parse(data);
                $("#certifications_container").html('');
                for(var i = 0; i < info.length; i++)
                {
                    var html = '';
                    var cert = 'No Speciality';
                    var number = $("#certifications_container").children().length + 1;
                    while($("#certification_name_"+number).length)
                    {
                        number += 1;
                    }
                    html += '<div style="width:85%; height: 70px; background-color: #FBFBFB; ';
                    if(info[i]['isPrimary'] == '1')
                    {
                        html += 'border: 2px solid #22AEFF;';                        
                    }
                    else
                    {
                        html += 'border: 1px solid #E5E5E5;';
                    }
                    html += ' padding: 2%; margin: auto; margin-bottom: 10px; margin-top: 15px; border-radius: 5px;">';
                    html += '<div style="width: 220px; height: 70px; float: right;">';
                    html += '<button class="certification_button" id="certification_changeimage_'+number+'" style="width: 45%; float: right; margin-left: 3%;">Change Image</button>';
                    html += '<button class="certification_button" id="certification_makeprimary_'+number+'" style="width: 45%; float: right;">Make Primary</button>';
                    html += '<input type="file" id="certification_file_'+number+'" name="certification_file_'+number+'" style="display: none;" />';
                    html += '<input type="hidden" id="certification_filedata_'+number+'" name="certification_filedata_'+number+'" value="" />';
                    html += '<input type="hidden" id="certification_filename_'+number+'" name="certification_filename_'+number+'" value="';
                    if(info[i]['image'] != null && info[i]['image'].length > 0)
                    {
                        html += basename(info[i]['image']);
                    }
                    html += '" />';
                    html += '<input type="hidden" id="certification_primary_'+number+'" name="certification_primary_'+number+'" value="';
                    if(info[i]['isPrimary'] == '1')
                    {
                        html += '1';
                        //$(".doctor_certification_icon").attr("src", info[i]['image']).show();                      
                        if(info[i]['name'] !== null) cert = info[i]['name'];
                        $(".doctor_speciality").text(cert);
                    }
                    else
                    {
                        html += '0';
                    }
                    html += '" />';
                    html += '<button class="certification_button" style="background-color: #D84840; margin-top: 10px; width: 93%; float: right;">Delete</button>';
                    html += '</div>';
                    html += '<img id="certification_image_'+number+'" style="width: 70px; height: 70px; float: right; margin-right: 15px; border-radius: 70px; border: 1px solid #333;" src="';
                    if(info[i]['image'] != null && info[i]['image'].length > 0)
                    {
                        html += info[i]['image'];
                    }
                    else
                    {
                        html += 'CertificationImages/none.jpg';
                    }
                    html += '"/>';
                    html += '<input type="checkbox" />';
                    html += '<input type="text" id="certification_name_'+number+'" name="certification_name_'+number+'" placeholder="Certification Name" style="border: 1px solid #CCC; box-shadow: none; width: 216px; height: 25px; border-radius: 0px; padding: 4px; padding-left: 10px; margin-bottom: 0px; border-top-left-radius: 5px; border-top-right-radius: 5px; color: #989898;" value="';
                    if(info[i]['name'] != null && info[i]['name'].length > 0)
                    {
                        html += info[i]['name'];
                    }
                    html += '"  />';
                    html += '<div style="width: 100%; height: 40px; margin-top: 0px;">';
                    html += '<div style="height: 22px; width: 64px; border: 1px solid #CCC; border-right: 0px solid #333; float: left; padding: 4px; padding-left: 10px; padding-top: 7px; background-color: #FFF; color: #989898;  border-bottom-left-radius: 5px;">Start Date: </div>';
                    html += '<input type="date" name="certification_date_'+number+'" id="certification_date_'+number+'" style="height: 25px; width: 140px; float: left; border: 1px solid #CCC; border-left: 0px solid #333; border-radius: 0px; color: #989898; box-shadow: none; outline: 0px;  border-bottom-right-radius: 5px;" value="';
                    if(info[i]['start_date'] != null && info[i]['start_date'].length > 0)
                    {
                        html += info[i]['start_date'];
                    }
                    html += '" />';
                    html += '</div>';
                    html += '</div>';
                    $("#certifications_container").append(html);
                    if($("#certifications_max_count").val() < number)
                    {
                        $("#certifications_max_count").val(number);
                    }
                }
                $(".certification_button").on('click', function(e)
                {
                    e.preventDefault();
                    if($(this).text() == 'Change Image')
                    {
                        var index = $(this).attr("id").split("_")[2];
                        $("#certification_file_"+index).trigger('click');
                    }
                    else if($(this).text() == "Delete")
                    {
                        $(this).parent().parent().remove();
                    }
                    else if($(this).text() == "Make Primary")
                    {
                        $(this).parent().parent().parent().children().each(function()
                        {
                            $(this).css("border", "1px solid #E5E5E5");
                            $(this).children().eq(0).children('input').eq(3).val("0");
                        });
                        $(this).parent().parent().css("border", "2px solid #22AEFF");
                        $(this).parent().parent().children().eq(0).children('input').eq(3).val("1");
                    }
                    
                    
                });
                $('input[id^="certification_file_"]').change( function()
                {
                    console.log("CERTIFICATION FILE");
                    var index = $(this).attr("id").split("_")[2];
                    if (this.files && this.files[0]) 
                    {
                        console.log(this.files[0]);
                        
                        if(this.files[0].hasOwnProperty('name'))
                        {
                            var periods = occurrences(this.files[0].name, ".", true);
                            if(periods <= 1)
                            {
                                var file = this.files[0].name.split('.');
                                var filetype = file[1].toLowerCase();
                                if(filetype == 'jpg' || filetype == 'jpeg' || filetype == 'png' || filetype == 'gif')
                                {
                                    var reader = new FileReader();

                                    reader.onload = function (e) 
                                    {
                                        $("#certification_image_"+index).attr('src', e.target.result);
                                        //$(".doctor_certification_icon").attr('src', e.target.result).show();
                                        $("#certification_filedata_"+index).val(e.target.result);
                                    }

                                    reader.readAsDataURL(this.files[0]);
                                    $("#certification_filename_"+index).val(this.files[0].name);
                                }
                                else
                                {
                                    swal("Invalid File Type", "This file is not an image.\nPlease upload an image file (JPG, PNG, or GIF).", "error");
                                }
                            }
                            else
                            {
                                swal("Invalid File Name", "This file contains more than one period in its name.\nPlease rename it and try again.", "error");
                            }
                        }
                    }
                });
                $('input[id^="certification_name_"]').keyup(function(e)
                {
                    handleSelectedCertification($(this).attr("id"), $(this).val());
                });
                $('input[id^="certification_name_"]').autocomplete(
                {
                    source: keys,
                    select: function (event, ui) 
                    {
                        handleSelectedCertification($(this).attr("id"), ui.item.value);
                    }
                });
            });
        });
        
        
        $(".add_new_certification_button").on('click', function(e)
        {
            e.preventDefault();
            var html = '';
            var number = $("#certifications_container").children().length + 1;
            while($("#certification_name_"+number).length)
            {
                number += 1;
            }
            html += '<div style="width:85%; height: 70px; background-color: #FBFBFB; ';
            if(number == 1)
            {
                html += 'border: 2px solid #22AEFF; ';
            }
            else
            {
                html += 'border: 1px solid #E5E5E5; ';
            }
            
            html += 'padding: 2%; margin: auto; margin-bottom: 10px; margin-top: 15px; border-radius: 5px;">';
            html += '<div style="width: 220px; height: 70px; float: right;">';
            html += '<button class="certification_button" id="certification_changeimage_'+number+'" style="width: 45%; float: right; margin-left: 3%;">Change Image</button>';
            html += '<button class="certification_button" id="certification_makeprimary_'+number+'" style="width: 45%; float: right;">Make Primary</button>';
            html += '<input type="file" id="certification_file_'+number+'" name="certification_file_'+number+'" style="display: none;" />';
            html += '<input type="hidden" id="certification_filedata_'+number+'" name="certification_filedata_'+number+'" value="" />';
            html += '<input type="hidden" id="certification_filename_'+number+'" name="certification_filename_'+number+'" value="" />';
            html += '<input type="hidden" id="certification_primary_'+number+'" name="certification_primary_'+number+'" value="';
            if(number == 1)
            {
                html += '1';
            }
            else
            {
                html += '0';
            }
            html += '" />';
            html += '<button class="certification_button" style="width: 93%; background-color: #D84840; margin-top: 10px; float: right;">delete</button>';
            html += '</div>';
            html += '<img id="certification_image_'+number+'" style="width: 70px; height: 70px; float: right; margin-right: 15px; border-radius: 70px; border: 1px solid #333;" src="CertificationImages/none.jpg"/>';
            html += '<input type="text" id="certification_name_'+number+'" name="certification_name_'+number+'" placeholder="Certification Name" style="border: 1px solid #CCC; box-shadow: none; width: 216px; height: 25px; border-radius: 0px; padding: 4px; padding-left: 10px; margin-bottom: 0px; border-top-left-radius: 5px; border-top-right-radius: 5px; color: #989898;"  />';
            html += '<div style="width: 100%; height: 40px; margin-top: 0px;">';
            html += '<div style="height: 22px; width: 64px; border: 1px solid #CCC; border-right: 0px solid #333; float: left; padding: 4px; padding-left: 10px; padding-top: 7px; background-color: #FFF; color: #989898;  border-bottom-left-radius: 5px;">Start Date: </div>';
            html += '<input type="date" name="certification_date_'+number+'" id="certification_date_'+number+'"  style="height: 25px; width: 140px; float: left; border: 1px solid #CCC; border-left: 0px solid #333; border-radius: 0px; color: #989898; box-shadow: none; outline: 0px;  border-bottom-right-radius: 5px;" />';
            html += '</div>';
            html += '</div>';
            $("#certifications_container").append(html);
            if($("#certifications_max_count").val() < number)
            {
                $("#certifications_max_count").val(number);
            }
            $(".certification_button").on('click', function(e)
            {
                e.preventDefault();
                if($(this).text() == 'Change Image')
                {
                    var index = $(this).attr("id").split("_")[2];
                    $("#certification_file_"+index).trigger('click');
                }
                else if($(this).text() == "Delete")
                {
                    $(this).parent().parent().remove();
                }
                else if($(this).text() == "Make Primary")
                {
                    $(this).parent().parent().parent().children().each(function()
                    {
                        $(this).css("border", "1px solid #E5E5E5");
                        $(this).children().eq(0).children('input').eq(3).val("0");
                    });
                    $(this).parent().parent().css("border", "2px solid #22AEFF");
                    $(this).parent().parent().children().eq(0).children('input').eq(3).val("1");
                }
                
                
            });
            $('input[id^="certification_file_"]').change( function()
            {
                console.log("CERTIFICATION FILE");
                var index = $(this).attr("id").split("_")[2];
                if (this.files && this.files[0]) 
                {
                    console.log(this.files[0]);
                    if(this.files[0].hasOwnProperty('name'))
                    {
                        var periods = occurrences(this.files[0].name, ".", true);
                        if(periods <= 1)
                        {
                            var file = this.files[0].name.split('.');
                            var filetype = file[1].toLowerCase();
                            if(filetype == 'jpg' || filetype == 'jpeg' || filetype == 'png' || filetype == 'gif')
                            {
                                var reader = new FileReader();

                                reader.onload = function (e) 
                                {
                                    $("#certification_image_"+index).attr('src', e.target.result);
                                    //$(".doctor_certification_icon").attr('src', e.target.result).show();
                                    $("#certification_filedata_"+index).val(e.target.result);

                                }

                                reader.readAsDataURL(this.files[0]);
                                $("#certification_filename_"+index).val(this.files[0].name);
                            }
                            else
                            {
                                swal("Invalid File Type", "This file is not an image.\nPlease upload an image file (JPG, PNG, or GIF).", "error");
                            }
                        }
                    }
                    
                }
            });
            $('input[id^="certification_name_"]').keyup(function(e)
            {
                handleSelectedCertification($(this).attr("id"), $(this).val());
            });
            $('input[id^="certification_name_"]').autocomplete(
            {
                source: keys,
                select: function (event, ui) 
                {
                    handleSelectedCertification($(this).attr("id"), ui.item.value);
                }
            });
        });
        
        // end functions and events for certification files
        
        
        
        
        
        $("#set_rate").live('click',function() 
        {
            var isNumber =  /^\d+$/.test($("#rate").val());
            if(isNumber)
            {
                $.post("UpdateMEDUser.php", {telemed: true, hr_rate: $("#rate").val(), EnviaUserid: $("#USERDID").val()}, function(data, status){console.log(data);});
            }
            else
            {
                alert("Invalid rate amount, please try again");
            }
        });
        //$("#start_telemed").live('click',function() 
        $('input#start_telemed').on('switchChange.bootstrapSwitch', function(e, s) {
        
            if($("#telemed_on").val() == "0")
            {
                $.post("getTelemedAvailability.php", {get_telemed_info: 1, med_id: $("#MEDID").val()}, function(data, status)
                {
                    var items = JSON.parse(data);
                    console.log(items);
                    //if(items.speciality != null && items.speciality.length > 0 && items.location != null && items.location.length > 0 && items.rate > 0)
                    //{
                        $("#telemed_on").val("1");
                        $.post("getTelemedAvailability.php", {med_id: $("#MEDID").val(), set_on: 1}, function(data, status){});
                        /*$("#start_telemed").css("background-color", "#74F677");
                        $("#start_telemed").css("border-color", "#74F677");
                        $("#start_telemed").text("Online / Edit Mode");*/
                    //}
                    //else
                    //{
                    //    alert("Please configure your location, speciality, and hourly rate before turning on telemedicine.");
                    //}
                });
            }
            else
            {
                $("#telemed_on").val("0");
                $.post("getTelemedAvailability.php", {med_id: $("#MEDID").val(), set_on: 0}, function(data, status){});
                /*$("#start_telemed").css("background-color", "#F66765");
                $("#start_telemed").css("border-color", "#F66765");
                $("#start_telemed").text("Offline");*/
            }
        });
        
        var appt_data = null;
        function load_appointments()
        {
            // reload upcoming appointments information here
            $.get("get_appointments.php?doc_id="+$("#MEDID").val(), function(data, status)
            {
                console.log(data);
                appt_data = JSON.parse(data);
                refresh_appointments();
            });
        }
        function refresh_appointments()
        {
            var last_date_str = '';
            var last_time_slot_str = '';
            var last_date = null;
            var html = '';
            var count = 0;
            var start_time = null;
            var end_time = null;
            var start_hour = 0;
            var end_hour = 0;
            var start_m = 'AM';
            var end_m = 'AM';
            var sp_times = new Object();
		
			
			//set a default message for no appointments
			var num_appointments = appt_data.length;
			
			if (num_appointments == 0) {
				html = "<div style='font-size:14px; text-align:center; width:100%;'>There are currently no appointments scheduled.</div>";
			}
			
            for(var i = 0; i < appt_data.length; ++i)
            {
                var new_date = false;
                var new_timeslot = false;
                
                if(appt_data[i]['date'] != last_date_str)
                {
                    last_date_str = appt_data[i]['date'];
                    last_date = new Date();
                    last_date.setFullYear(parseInt(last_date_str.substr(0, 4)));
                    last_date.setMonth(parseInt(last_date_str.substr(5, 2)) - 1);
                    last_date.setDate(parseInt(last_date_str.substr(8, 2)));
                    html += '<h3 style="text-align: center; font-size: 20px;">';
                    html += last_date.toDateString();
                    html += '</h3>';
                    new_date = true;
                    last_time_slot_str = '';
                    
                }
                if(appt_data[i]['start_time'] != last_time_slot_str)
                {
                    last_time_slot_str = appt_data[i]['start_time'];
                    new_timeslot = true;
                    count = 0;
                    html += '<div style="text-align: center; margin-right: 10px; background-color: #7EC1FF;'
                    if(new_date)
                    {
                        html += ' border-top-left-radius: 8px; border-top-right-radius: 8px;';
                    }
                    html += ' color: #FFF; font-size: 16px; font-weight: bold; padding: 5px;">';
                    //8:00 AM - 10:00 AM
                    start_time = appt_data[i]['start_time'].split(":");
                    end_time = appt_data[i]['end_time'].split(":");
                    start_hour = parseInt(start_time[0]);
                    end_hour = parseInt(end_time[0]);
                    start_m = 'AM';
                    end_m = 'AM';
                    if(start_hour > 11)
                    {
                        start_m = 'PM';
                        if(start_hour > 12)
                        {
                            start_hour -= 12;
                        }
                    }
                    else if(start_hour == 0)
                    {
                        start_hour = 12;
                        start_m = 'AM';
                    }
                    if(end_hour > 11)
                    {
                        end_m = 'PM';
                        if(end_hour > 12)
                        {
                            end_hour -= 12;
                        }
                    }
                    else if(end_hour == 0)
                    {
                        end_hour = 12;
                        end_m = 'AM';
                    }
                    html += start_hour+":"+start_time[1]+" "+start_m+" - "+end_hour+":"+end_time[1]+" "+end_m;
                    html += '</div>';
                }
                html += '<div style="text-align: left; margin-right: 10px; background-color: ';
                if(count % 2 == 1)
                {
                    html += '#E3E3E3;';
                }
                else
                {
                    html += '#F3F3F3;';
                }
                html += ' color: #000; font-size: 14px; padding: 4px; padding-left: 10px;';
                if((i < appt_data.length - 1 && appt_data[i + 1]['date'] != last_date_str) || i == appt_data.length - 1)
                {
                    html += ' border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;';
                }
                html += '"><button id="';
                html += 'app_del_'+appt_data[i]['id']+'_'+i;
                html += '" style="width: 18px; height: 18px; float: right; color: #F00; padding: 0px; background-color: inherit; border: 0px solid #FFF; border-radius: 3px; outline: 0px;"><i class="icon-remove" style="width: 12px; height: 12px;"></i></button>';
                html += '<div style="width: 650px; height: 22px;">';
                html += '<div style="width: 315px; float: left;">';
                html += '<a href="patientdetailMED-new.php?IdUsu='+appt_data[i]['pat_id']+'" style="color: #46D542;">'+appt_data[i]['pat_name']+'</a></div>';
                html += '<div style="width: 140px; float: left; color: #777;">Set a specific time: </div>';
                html += '<input id="specific_time_'+appt_data[i]['id']+'_'+start_hour+':'+start_time[1]+start_m.toLowerCase()+'_'+end_hour+':'+end_time[1]+end_m.toLowerCase()+'" value="" type="text" style="width: 75px; padding: 0px; padding-left: 5px; margin-bottom: 0px; height: 20px; float: left;" ';
                if(appt_data[i]['specific_time'] != null)
                {
                    //html += 'value="'+dat[i]['specific_time']+'" ';
                    sp_times[(appt_data[i]['id'])] = appt_data[i]['specific_time'];
                }
                html += '/>';
                html += '<button class="app_save" style="height: 22px; width: 50px; background-color: inherit; border-radius: 2px; color: #22AEFF; border: 0px solid #FFF; outline: 0px;">Save</button>';
                html += '<button class="app_clear" style="height: 22px; width: 50px; background-color: inherit; border-radius: 2px; color: #D84840; border: 0px solid #FFF; outline: 0px;">Clear</button>';
                html += '</div></div>';
                ++count;
            }
            html += '<br/><br/>';
            $("#appointments_container").html(html);
            $("input[id^='specific_time_']").each(function(index, value) 
            {
                var info = $(this).attr("id").split("_");
                $(this).timepicker({'step': 5, 'minTime': info[3], 'maxTime': info[4]});
                if(info[2] in sp_times)
                {
                    var date = new Date();
                    var date_info = sp_times[(info[2])].split(":");
                    date.setHours(parseInt(date_info[0]));
                    date.setMinutes(parseInt(date_info[1]));
                    $(this).timepicker('setTime', date);
                }
            });
            $("#app_clear").off('click');
            $("input[id^='specific_time_']").off('change');
            //$("button[id^='app_del_']").on('click');
            $(".app_clear").on('click', function()
            {
                $(this).parent().children("input[id^='specific_time_']").val('');
                var info = $(this).parent().children("input[id^='specific_time_']").attr("id").split("_");
                $.post("update_appointment.php", {id: info[2], specific_time: 'n'}, function(data, status){console.log(data);});
            });
            /*$("input[id^='specific_time_']").on('change', function()
            {
                var info = $(this).attr("id").split("_");
                console.log(info[2] + ' ' + $(this).val());
                $.post("update_appointment.php", {id: info[2], specific_time: $(this).val()}, function(data, status){console.log(data);});
            });*/
            $(".app_save").on('click', function()
            {
                var button = $(this);
                var info = $(this).prev().attr("id").split("_");
                $(this).html('<img src="images/load/24.gif" style=" />');
                $.post("update_appointment.php", {id: info[2], specific_time: $(this).prev().val()}, function(data, status)
                {
                    button.html('Save');
                });
            });
            $("button[id^='app_del_']").on('click', function()
            {
                var item = $(this).parent();
                var answer = confirm("Are you sure you want to cancel this appointment with member "+$(this).parent().children('div').children('div').children('a').eq(0).text()+"? This action cannot be undone.");
                if(answer)
                {
                    var info = $(this).attr("id").split("_");
                    $.get("delete_appointment.php?id="+info[2], function(d, status)
                    {
                       
                        
                        if(d == '1')
                        {
                            appt_data.splice(info[3], 1);
                            refresh_appointments();
                            
                        }
                    });
                    var windowHref = location.href.split('?')[0];
                    window.location.replace(windowHref+'?appointments_config=yes');
                }
                
            });
        
        }
        
        $("#app_config_button").live('click', function()
        {
             load_appointments();                
                                
        });
        
		get_user_event_config('getusereventconfig.php');
		//predefined_events = event_config.length;
		for(var i=0;i<event_config.length;i++)
		{
			add_event_config(i,event_config[i].title,event_config[i].hours,event_config[i].minutes,event_config[i].colour)
		}
		
		
		
		get_user_notify_time('getusernotifytime.php');
		var appoint_notify = document.getElementById('appoint_notify');
		for(var j=1;j<61;j++)
		{
			appoint_notify.options[appoint_notify.options.length]= new Option(j, j);
		}
		appoint_notify.options[parseInt(notify_time[0].minutes)-1].setAttribute('selected',true);
		$('#notify_id').val(notify_time[0].id);
		
		get_timezones('gettimezones.php');
		var tz = document.getElementById('Timezone');
		for(var i=0;i<timezones.length;i++)
		{
			tz.options[tz.options.length] = new Option(timezones[i].timezones,timezones[i].id);
		}
		get_user_timezone('getusertimezone.php');
		tz.options[parseInt(user_timezone[0].timez)-1].setAttribute('selected',true);
		//$('#Timezone :selected').text(user_timezone[0].timezones);
   
		get_emr_config('getemrconfig.php');
		//alert(emr_config.length);
		set_checkbox_value('emr_personal',emr_config[0].personal);
		set_checkbox_value('emr_family',emr_config[0].family);
		set_checkbox_value('emr_pastdx',emr_config[0].pastdx);
		set_checkbox_value('emr_medications',emr_config[0].medications);
		set_checkbox_value('emr_immunizations',emr_config[0].immunizations);
		set_checkbox_value('emr_allergies',emr_config[0].allergies);
   
		set_checkbox_value('emr_address',emr_config[0].address);
		set_checkbox_value('emr_address2',emr_config[0].address2);
		set_checkbox_value('emr_city',emr_config[0].city);
		set_checkbox_value('emr_state',emr_config[0].state);
		set_checkbox_value('emr_country',emr_config[0].country);
		set_checkbox_value('emr_notes',emr_config[0].notes);
		set_checkbox_value('emr_phone',emr_config[0].phone);
		set_checkbox_value('emr_insurance',emr_config[0].insurance);
		set_checkbox_value('emr_fractures',emr_config[0].fractures);
		set_checkbox_value('emr_surgeries',emr_config[0].surgeries);
		set_checkbox_value('emr_otherknown',emr_config[0].otherknown);
		set_checkbox_value('emr_obstetric',emr_config[0].obstetric);
		set_checkbox_value('emr_othermed',emr_config[0].othermed);
		
		set_checkbox_value('emr_father',emr_config[0].father);
		set_checkbox_value('emr_mother',emr_config[0].mother);
		set_checkbox_value('emr_siblings',emr_config[0].siblings);
   
	$('body').bind('mousedown keydown', function(event) {
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
		//alert('Reset counter');
    });
   		
   	$('#dp32').live("change", function(){
	     getIdUsFIXED();
   		});	
 	
   		
    $('#gender').bind("focusout change", function(){
	     getIdUsFIXED();  		
   		});
 
     $('#orderOB').bind("focusout  change", function(){
	     getIdUsFIXED();
   		});
   	     
   	$('#Vname').bind("focusout  change", function(){
	     getIdUsFIXEDNAME();
   		});	

   	$('#Vsurname').bind("focusout  change", function(){
	     getIdUsFIXEDNAME();
   		});	
   		  		  
    $("#c2").click(function(event) {
	    	$("#MULTIPLE").css("display","inherit");
	    	var cosa=chkb($("#c2").is(':checked'));
	    	if (cosa==1){
		    	$("#MULTIPLE").css("display","inherit");
	    	}else{
		    	$("#MULTIPLE").css("display","none");
		    	$("#orderOB").val('0');
	    	}
  	  	     getIdUsFIXED();
			 
			 
  
    });
	
	$("#emr_personal").click(function(event) {
	    	$("#PH_Tab").css("display","inherit");
	    	var cosa=chkb($("#emr_personal").is(':checked'));
	    	if (cosa==1){
		    	$("#PH_Tab").css("display","inherit");
	    	}else{
		    	$("#PH_Tab").css("display","none");
		    
	    	}
  	  	      
    });
	
	$("#emr_family").click(function(event) {
			//alert('Here');
	    	$("#FA_Tab").css("display","inherit");
	    	var cosa=chkb($("#emr_family").is(':checked'));
	    	if (cosa==1){
		    	$("#FA_Tab").css("display","inherit");
	    	}else{
		    	$("#FA_Tab").css("display","none");
		    
	    	}
  	  	      
    });
	
	//Added for getting the notification state and updating it
	 /*setTimeout(function(){
	 var cadena = '/linkNotifications.php?idDoc='+med_id+'&state=0&value=0';
	 var state=LanzaAjax(cadena);
	 //alert('state'+state);
	 if(parseInt(state))
	 $("#notify_link").prop('checked', true);
	 else
	 $("#notify_link").prop('checked', false);
	 },500);*/
        
    $('#notif_update').click(function() {
        var notifArrayString = '';
        $("#buttons_notification :checkbox").each(function() {
            if($(this).is(':checked')) {
                var idVal = $(this).attr('id');
                notifArrayString += idVal+', ';
            }
        });
        //get rid of the last comma and any white space of the notifArrayString
        notifArrayString = notifArrayString.replace(/,\s*$/, "");
        var cadena = '../notification_docSetting.php?idDoc='+med_id+'&notifIDs='+notifArrayString+'&group='+$("#groupN").val();
        LanzaAjax(cadena);
        displayalertnotification('Notification Status Updated');
    });
 
    function getIdUsFIXED(){
    	var fnac = $("#dp32").val();
   		var fnacnum = fnac.substr(6,4)+fnac.substr(3,2)+fnac.substr(0,2);
   		var gender = chkb($("#c2").is(':checked'));
   		
   		var gender = $("#gender").val();
   		var orderOB = $("#orderOB").val();
   		if (gender==0){ gender='0';}
   		if (orderOB==0){ orderOB='0';}
   		
   		var VIdUsFIXED = fnacnum+gender+orderOB;
   		$('#VIdUsFIXED').html(VIdUsFIXED);
   		$('#VIdUsFIXEDINSERT').val(VIdUsFIXED);
   		
    	}
 
     function getIdUsFIXEDNAME(){
    	var vname = $("#Vname").val().toLowerCase().replace(".","").replace(" ","");
   		var vsurname = $("#Vsurname").val().toLowerCase().replace(".","").replace(" ","");
    		
   		var VIdUsFIXEDNAME = vname+'.'+vsurname;
   		$('#VIdUsFIXEDNAME').html(VIdUsFIXEDNAME);
   		$('#VIdUsFIXEDNAMEINSERT').val(VIdUsFIXEDNAME);
    	}

    function chkb(bool){
	    if(bool)
	    	return 1;
	    	return 0;
	   }
	   
	 
	  
	  function set_checkbox_value(element_name,value)
	  {
		var element = document.getElementById(element_name);
		//alert('Setting to checked ' + element_name + '  ' + value);
		if(value==1)
		{
			if (element !== null) element.checked='checked';
			if(element_name == 'emr_family')
			{
					$("#FA_Tab").css("display","inherit");
					var cosa=chkb($("#emr_family").is(':checked'));
					if (cosa==1){
					$("#FA_Tab").css("display","inherit");
					}else{
						$("#FA_Tab").css("display","none");
		    
					}
			}
			else if(element_name == 'emr_personal')
			{
				$("#PH_Tab").css("display","inherit");
				var cosa=chkb($("#emr_personal").is(':checked'));
				if (cosa==1){
					$("#PH_Tab").css("display","inherit");
				}else{
					$("#PH_Tab").css("display","none");
				
				}
				}

			}
	
	  }
 
    });
	
	function LanzaAjax (DirURL)
		{
		var RecTipo = 'SIN MODIFICACIÓN';
	    $.ajax(
           {
           url: DirURL,
           dataType: "html",
           async: false,
           complete: function(){ //alert('Completed');
                    },
           success: function(data) {
                    if (typeof data == "string") {
                                RecTipo = data;
                                }
                     }
            });
		return RecTipo;
		}

		
	function saveEMRConfig()
	{
		var demographics_checked = 1;   //Demographics has to be 1 by default
			var name_checked = 1;
			var middle_checked = 1;
			var surname_checked = 1;
			var gender_checked = 1;
			var dob_checked = 1;
			var address_checked = get_checkbox_value('emr_address');
			var address2_checked = get_checkbox_value('emr_address2');
			var city_checked = get_checkbox_value('emr_city');
			var state_checked = get_checkbox_value('emr_state');
			var country_checked = get_checkbox_value('emr_country');
			var notes_checked = get_checkbox_value('emr_notes');
			var phone_checked = get_checkbox_value('emr_phone');
			var insurance_checked = get_checkbox_value('emr_insurance');
			
		var personal_checked = get_checkbox_value('emr_personal');
			var fractures_checked = 0;
			var surgeries_checked = 0;
			var otherknown_checked = 0;
			var obstetric_checked = 0;
			var othermed_checked = 0;
			if(personal_checked)
			{
				fractures_checked = get_checkbox_value('emr_fractures');
				surgeries_checked = get_checkbox_value('emr_surgeries');
				otherknown_checked = get_checkbox_value('emr_otherknown');
				obstetric_checked = get_checkbox_value('emr_obstetric');
				othermed_checked = get_checkbox_value('emr_othermed');
			}
		var family_checked = get_checkbox_value('emr_family');
			var father_checked = 0;
			var mother_checked = 0;
			var siblings_checked = 0;
			if(family_checked)
			{
				father_checked = get_checkbox_value('emr_father');
				mother_checked = get_checkbox_value('emr_mother');
				siblings_checked = get_checkbox_value('emr_siblings');
			}
			
		var pastdx_checked = get_checkbox_value('emr_pastdx');
		var medications_checked = get_checkbox_value('emr_medications');
		var immunizations_checked = get_checkbox_value('emr_immunizations');
		var allergies_checked = get_checkbox_value('emr_allergies');
		
		var url='save_emr_config.php?ph='+personal_checked+'&fh='+family_checked+'&pastdx='+pastdx_checked+'&medications='+medications_checked+'&immunizations='+immunizations_checked+'&allergies='+allergies_checked+'&address='+address_checked+'&address2='+address2_checked+'&city='+city_checked+'&state='+state_checked+'&country='+country_checked+'&notes='+notes_checked+'&fractures='+fractures_checked+'&surgeries='+surgeries_checked+'&otherknown='+otherknown_checked+'&obstetric='+obstetric_checked+'&othermed='+othermed_checked+'&father='+father_checked+'&mother='+mother_checked+'&siblings='+siblings_checked+'&phone='+phone_checked+'&insurance='+insurance_checked;
		//alert(url);
		var RecTipo = LanzaAjax(url);
		if(RecTipo=="success")
		{
			alert("Changes Saved Successfully !!!");
		}
		else
		{
			alert("Error Saving Changes !!!");
		}
		
		
		//alert(RecTipo);
	}	
	
	function get_checkbox_value(element_name)
	{
		var element = document.getElementById(element_name);
		var element_checked = 0;
		if(element.checked)
		{
			element_checked=1;
		}
		return element_checked;
	}

	function saveSchedulerConfig()
	{	
		var serviceURL = 'clear_scheduler_data.php';
		var RecTipo = LanzaAjax(serviceURL);

		
		for(var j=0;j<predefined_events;j++)
		{
		
			if(deleted_elements.indexOf(j)==-1)
			{
				var title = $('#event'+j).val();
				var hours = $('#hours'+j).val();
				var minutes = $('#minutes'+j).val();
				var colour = $('#colour'+j).val();
				//alert(title + '  ' + hours + '  ' + minutes);
			
			
				var url = 'create_type_config_entry.php?title='+title+'&hours='+hours+'&minutes='+minutes+' &colour='+colour;
				//alert(url);
				var RecTipo = LanzaAjax(url);
				//alert(RecTipo);
			}
		}
		
		var url = 'save_notify_time.php?id='+ $('#notify_id').val() +'&minutes='+ $('#appoint_notify').val();
		//alert(url);
		RecTipo = LanzaAjax(url);
		
		
		
		var timezone_url = 'save_user_timezone.php?userid='+med_id+'&timez=' + $('#Timezone').val();
		//alert(timezone_url);
		Rectipo = LanzaAjax(timezone_url);
		
		window.location.replace("scheduler-n.php?curr_source="+med_id);
		
	}
	
	
	function add_visit_types()
		{
			add_event_config(predefined_events,'',0,0,'ffffff');
			//predefined_events++;
		}
		
		function add_event_config(i,title,hours,minutes,colour)
		{
			var grandfather = document.getElementById("CLICK_EVENT");
			//alert('Found GrandFather '+grandfather);
			
			var father = document.createElement("div");
				father.setAttribute("class","formRow");
				father.setAttribute("id","row"+i);	
					
					father.innerHTML = "Type : ";
					var title_child = document.createElement("input");
					title_child.setAttribute("type","text");
					title_child.setAttribute("id","event"+i);
					title_child.setAttribute("name","event"+i);
					title_child.setAttribute("value",title);
					title_child.style.width = '8em'
					father.appendChild(title_child);
				
					father.innerHTML += "  Hours : ";
					var hours_child = document.createElement("select");
					hours_child.setAttribute("id","hours"+i);
					hours_child.setAttribute("name","hours"+i);
					hours_child.style.width = '8em'
					for(var j=0;j<25;j++)
					{
						hours_child.options[hours_child.options.length]= new Option(j, j);
					}
					hours_child.options[parseInt(hours)].setAttribute('selected',true)
					
					father.appendChild(hours_child);
					
					father.innerHTML += "  Minutes : ";
					var minutes_child = document.createElement("select");
					minutes_child.setAttribute("id","minutes"+i);
					minutes_child.setAttribute("name","minutes"+i);
					minutes_child.style.width = '8em'
					for(var j=0;j<61;j++)
					{
						minutes_child.options[minutes_child.options.length]= new Option(j, j);
					}
					minutes_child.options[parseInt(minutes)].setAttribute('selected',true)
					father.appendChild(minutes_child);
					
					father.innerHTML += "  Pick Colour: ";
			/*		var color_child = document.createElement("select");
					color_child.class = "color";
					color_child.value = "ffffff";
					father.appendChild(color_child);*/
					
					var input = document.createElement('INPUT');
					input.style.width = '5em';
					input.setAttribute("id","colour"+i);
					input.setAttribute("name","colour"+i);
					// bind jscolor
					var col = new jscolor.color(input);
					//col.fromHSV(6/event_config.length*i, 1, 1);
					col.fromString(colour);
					father.appendChild(input);
					
					var button = document.createElement('input');
					button.setAttribute('type','image');
					button.setAttribute('id','but_'+i);
					button.setAttribute('src','images/del_button.jpg');
					button.style.width='20px';
					button.style.height='20px';
					button.onclick = function () {
						//alert('You pressed '+this.id);
						var n = this.id.split('_');
						//alert('delete' + n[1]);
						var row_to_del = 'row'+n[1];
						var element = document.getElementById(row_to_del);
						element.parentNode.removeChild(element);
						deleted_elements.push(n[1]);	
						//arrayToModify[arrayToModify.length] = this.id;
					};
					
					father.appendChild(button);
			grandfather.appendChild(father);
			predefined_events++;
		
		}
	
	
	
	
	var grptble = LanzaAjax('getGroupDetails.php?docid='+med_id);
	
	$('#group_details').html(grptble);
	
	var groupid=-1;
	
	$(".CFILADoctorEdit").live('click',function() {
	
		iconID = $(this).attr("id");
		nameSplit = iconID.split("_");
     	groupid = nameSplit[1];
		console.log("Group ID : "+groupid);

		GetGroupData('getGroupData.php?groupid='+groupid);
			
		var grpdoctble = LanzaAjax('getGroupDocs.php?docid='+med_id+'&groupid='+groupid);
		$('#group_members').html(grpdoctble);
		
		$('#editgrpname').val(group_data[0].Name);
		$('#editgrpadd').val(group_data[0].Address);
		$('#editgrpzip').val(group_data[0].ZIP);
		$('#editgrpcity').val(group_data[0].City);
		$('#editgrpstate').val(group_data[0].State);
		$('#editgrpcountry').val(group_data[0].Country);
		
		$("#editgrpname").attr("disabled", "disabled");
		$('#editgrpadd').attr("disabled", "disabled");
		$('#editgrpzip').attr("disabled", "disabled");
		$('#editgrpcity').attr("disabled", "disabled");
		$('#editgrpstate').attr("disabled", "disabled");
		$('#editgrpcountry').attr("disabled", "disabled");
		//disable uploading group picture
		$('#filesToUpload').attr("disabled", "disabled");
		
		var div = document.createElement('div');
		//this should be working
		console.log("Group Data Val " + group_data[0].Image);
		if(group_data[0].Image!=''){
			div.innerHTML = '<img style="width:150px;height:150px;margin-bottom:10px;" src="uploads/' + group_data[0].Image + '" />';
		}else {
			div.innerHTML = '<img style="width:150px;height:150px;margin-bottom:10px;" src="images/defaultgrouppic.jpg" />';
		}
		
		$("#grpimage").html(div);
		
		$("#groupconfig").dialog({bgiframe: true, width: 700, height: 650, modal: true});
		//GetDocs();
		checkowner();
	});
	
	 $("tr.CFILADoctor").live("mouseenter",function () {
			$(this).css("background","LightSteelBlue");
			//$(this).css("cursor","pointer");
		});
		
	$("tr.CFILADoctor").live("mouseleave",function () {
			$(this).css("background","");
	});
	$(".edit_group").live("mouseenter",function () {
		$(this).css("cursor","pointer");
	});
	$(".CFILADoctorEdit").live("mouseenter",function () {
		$(this).css("cursor","pointer");
	});

	$('input[type=checkbox][id^="checkcol"]').live('click',function() {
    // this represents the checkbox that was checked
	    
       if($(this).is(':checked'))       		
       		$("#remove_doc").show();			
       else
       		$("#remove_doc").hide();			
      
	});
	
	$('input[type=checkbox][id^="CFILAAdminRole"]').live('click',function() {
    // this represents the checkbox that was checked
	    var parentid=$(this).parents("tr.CFILAGroupDoc").attr("id");
		//alert('hello');
		//alert(parentid);
		var getchkval=checkowner();
		
			if (getchkval>0){
				//alert (" Admin rights");
				if($(this).is(':checked'))  {
					var cadena='addDoctorAsAdmin.php?groupid='+groupid+'&id='+parentid;
					var RecTipo=LanzaAjax(cadena);
					
				}else{
					var cadena='RemoveDocAsAdmin.php?groupid='+groupid+'&id='+parentid;
					var RecTipo=LanzaAjax(cadena);			   
				}
				
				
			}else {
				//alert (" Non-Admin rights");
				swal({   title: "Error",   text: "You do not have admin rights on this group.",   type: "error",   confirmButtonText: "Ok" }); 
				 
			}
		
				var grpdoctble = LanzaAjax('getGroupDocs.php?docid='+med_id+'&groupid='+groupid);
				$('#group_members').html(grpdoctble);
      
	});
	
	$('input[type=checkbox][id^="CFILADocRole"]').live('click',function() {
    // this represents the checkbox that was checked
	    var parentid=$(this).parents("tr.CFILAGroupDoc").attr("id");
		//alert('hello');
		//alert(parentid);	
		var getchkval=checkowner();
		
			if (getchkval>0){
				//alert (" Admin rights");
				if($(this).is(':checked'))  {
					var cadena='addDoctorAsRole.php?groupid='+groupid+'&id='+parentid+'&role=1';
					var RecTipo=LanzaAjax(cadena);
					
				}else{
					var cadena='addDoctorAsRole.php?groupid='+groupid+'&id='+parentid+'&role=2';
					var RecTipo=LanzaAjax(cadena);			   
				}
				
				
			}else {
				//alert (" Non-Admin rights");
				swal({   title: "Error",   text: "You do not have admin rights on this group.",   type: "error",   confirmButtonText: "Ok" }); 
			}		
			
			var grpdoctble = LanzaAjax('getGroupDocs.php?docid='+med_id+'&groupid='+groupid);
			$('#group_members').html(grpdoctble);
      
	});
	
	
	$('input[type=checkbox][id^="CFILAStaffRole"]').live('click',function() {
    // this represents the checkbox that was checked
	    var parentid=$(this).parents("tr.CFILAGroupDoc").attr("id");
		//alert('hello');
		//alert(parentid);	
		var getchkval=checkowner();
		
			if (getchkval>0){
				//alert (" Admin rights");
				if($(this).is(':checked'))  {
					var cadena='addDoctorAsRole.php?groupid='+groupid+'&id='+parentid+'&role=2';
					var RecTipo=LanzaAjax(cadena);
					
				}else{
					var cadena='addDoctorAsRole.php?groupid='+groupid+'&id='+parentid+'&role=1';
					var RecTipo=LanzaAjax(cadena);			   
				}
				
				
			}else {
				//alert (" Non-Admin rights");
				swal({   title: "Error",   text: "You do not have admin rights on this group.",   type: "error",   confirmButtonText: "Ok" });  
			}		
			
				var grpdoctble = LanzaAjax('getGroupDocs.php?docid='+med_id+'&groupid='+groupid);
				$('#group_members').html(grpdoctble);
      
	});
	
	
	
	$('input[type=checkbox][id^="CFILAReferralRole"]').live('click',function() {
    // this represents the checkbox that was checked
	   var parentid=$(this).parents("tr.CFILAGroupDoc").attr("id");
		//alert('hello');
		//alert(parentid);	
		var getchkval=checkowner();
		
			if (getchkval>0){
				//alert (" Admin rights");
				if($(this).is(':checked'))  {
					var cadena='addDoctorAsRefIncharge.php?groupid='+groupid+'&id='+parentid;
					var RecTipo=LanzaAjax(cadena);
					
				}else{
					var cadena='addDoctorAsRefIncharge?groupid='+groupid+'&id='+parentid;
					var RecTipo=LanzaAjax(cadena);			   
				}
				
				
			}else {
				//alert (" Non-Admin rights");
				swal({   title: "Error",   text: "You do not have admin rights on this group.",   type: "error",   confirmButtonText: "Ok" }); 
				 
			}		
      			
			    var grpdoctble = LanzaAjax('getGroupDocs.php?docid='+med_id+'&groupid='+groupid);
				$('#group_members').html(grpdoctble);
	});
	
	
    function checkowner(){

		var getownerval=LanzaAjax('CheckOwner.php?docid='+med_id+'&groupid='+groupid);
		
				
		if(getownerval>0){
			 $("input.group1").attr("disabled", true);
		 }else{
			 $("input.group1").removeAttr("disabled");
	     }
		 
		 return getownerval
	   
	}
	
	 checkowner();
	  
	
	 $("#remove_doc").live('click',function(){
	   var num=0;
	   
	   var checkowner=LanzaAjax('CheckOwner.php?docid='+med_id+'&groupid='+groupid);
	   
	   if(checkowner>0){
		   
		   var conf=confirm('Are you sure you want to remove this doctor from the group!Press Ok to confirm.');
		   if(conf){
		   $('input[type=checkbox][id^="checkcol"]').each(
		   function () {
						var sThisVal = (this.checked ? "1" : "0");
						
						//sList += (sList=="" ? sThisVal : "," + sThisVal);
						if(sThisVal==1){
						 var id=$(this).parents("tr.CFILAGroupDoc").attr("id");
						 var docid=$(this).parents("tr.CFILAGroupDoc").children("td.CFILADocname").attr("id");
						 //alert(docid);
						 //alert("Id "+idp+" selected"); 
						 //messageid=messageid+idp+' ,';
						 num=num+1;
						 var cadena='removeDocFromGroup.php?id='+id+'&groupid='+groupid+'&docid='+docid;
						 LanzaAjax(cadena);
						}
				
					
				});
		
			}
			
			var grpdoctble = LanzaAjax('getGroupDocs.php?docid='+med_id+'&groupid='+groupid);
			$('#group_members').html(grpdoctble);
		}else
			//alert("Removal not allowed since you are not the group owner");
		 	swal({   title: "Error",   text: "Removal not allowed since you are not the group owner.",   type: "error",   confirmButtonText: "Ok" }); 
			
		$("#remove_doc").hide();
	});
	
	var DocList;

        
    var VDocId = 0;
	var VDocName = '';
    $.get("getValidDoctors.php", function(data, status)
    {
        DocList = JSON.parse(data);
        $("#DoctorSBox").autocomplete({
            source: DocList,
            minLength: 1,
            select: function(event, ui) {
                // feed hidden id field
                $("#field_id").val(ui.item.id);
                // update number of returned rows
                $('#results_count').html('');
                VDocName =  ui.item.label;
                VDocId =  $("#field_id").val();
            },
            open: function(event, ui) {
                // update number of returned rows
                var len = $('.ui-autocomplete > li').length;
                $('#results_count').html('(#' + len + ')');
            },
            close: function(event, ui) {
                // update number of returned rows
                $('#results_count').html('');
            },
            // mustMatch implementation
            change: function (event, ui) {
                if (ui.item === null) {
                    $(this).val('');
                    $('#field_id').val('');
                }
            }
        });
    });
	
	
	
	/*var VDocId1 = 0;
	var VDocName1 = '';
	var VDocId2 = 0;
	var VDocName2 = '';
	var VDocId3 = 0;
	var VDocName3 = '';*/
	
	/*
	$("#DoctorSBox1").autocomplete({
        source: DocList,
        minLength: 1,
        select: function(event, ui) {
            // feed hidden id field
            $("#field_id1").val(ui.item.id);
            // update number of returned rows
            $('#results_count1').html('');
            VDocName1 =  ui.item.label;
            VDocId1 =  $("#field_id1").val();
        },
        open: function(event, ui) {
            // update number of returned rows
            var len = $('.ui-autocomplete > li').length;
            $('#results_count1').html('(#' + len + ')');
        },
        close: function(event, ui) {
            // update number of returned rows
            $('#results_count1').html('');
        },
        // mustMatch implementation
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id1').val('');
            }
        }
    });
	
	$("#DoctorSBox2").autocomplete({
        source: DocList,
        minLength: 1,
        select: function(event, ui) {
            // feed hidden id field
            $("#field_id2").val(ui.item.id);
            // update number of returned rows
            $('#results_count2').html('');
            VDocName2=  ui.item.label;
            VDocId2 =  $("#field_id2").val();
        },
        open: function(event, ui) {
            // update number of returned rows
            var len = $('.ui-autocomplete > li').length;
            $('#results_count2').html('(#' + len + ')');
        },
        close: function(event, ui) {
            // update number of returned rows
            $('#results_count2').html('');
        },
        // mustMatch implementation
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id2').val('');
            }
        }
    });
	
	$("#DoctorSBox3").autocomplete({
        source: DocList,
        minLength: 1,
        select: function(event, ui) {
            // feed hidden id field
            $("#field_id3").val(ui.item.id);
            // update number of returned rows
            $('#results_count3').html('');
            VDocName3=  ui.item.label;
            VDocId3 =  $("#field_id3").val();
        },
        open: function(event, ui) {
            // update number of returned rows
            var len = $('.ui-autocomplete > li').length;
            $('#results_count3').html('(#' + len + ')');
        },
        close: function(event, ui) {
            // update number of returned rows
            $('#results_count3').html('');
        },
        // mustMatch implementation
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id3').val('');
            }
        }
    });
   */
    $("#DoctorSBox").focusout(function() {
        if ($("#field").val() === '') {
            $('#field_id').val('');
        }
    });
	
	/*$("#DoctorSBox1").focusout(function() {
        if ($("#field").val() === '') {
            $('#field_id1').val('');
        }
    });
	
	$("#DoctorSBox2").focusout(function() {
        if ($("#field").val() === '') {
            $('#field_id2').val('');
        }
    });
	$("#DoctorSBox3").focusout(function() {
        if ($("#field").val() === '') {
            $('#field_id3').val('');
        }
    });*/
	
	//Group Image upload function
		/*function fileSelect(evt) {
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var files = evt.target.files;
		 
				var result = '';
				var file;
				for (var i = 0; file = files[i]; i++) {
					// if the file is not an image, continue
					if (!file.type.match('image.*')) {
						continue;
					}
		 
					reader = new FileReader();
					reader.onload = (function (tFile) {
						return function (evt) {
							var div = document.createElement('div');
							div.innerHTML = '<img style="width: 90px;" src="' + evt.target.result + '" />';
							document.getElementById('filesInfo').appendChild(div);
						};
					}(file));
					reader.readAsDataURL(file);
				}
			} else {
				alert('The File APIs are not fully supported in this browser.');
			}
		}
		 
		document.getElementById('filesToUpload').addEventListener('change', fileSelect, false);*/
		var whichimage=0;
		
		var picuploaded=0;
		if (window.File && window.FileReader && window.FileList && window.Blob) {
				document.getElementById('filesToUpload').onchange = function(){
					whichimage=1;
					var files = document.getElementById('filesToUpload').files;
					for(var i = 0; i < files.length; i++) {
						resizeAndUpload(files[i]);
					}
				};
				
				document.getElementById('createfilesToUpload').onchange = function(){
					
					whichimage=2;
					var files = document.getElementById('createfilesToUpload').files;
					for(var i = 0; i < files.length; i++) {
						resizeAndUpload(files[i]);
					}
				};
				
				
			} else {
				alert('The File APIs are not fully supported in this browser.');
			}
			 
			function resizeAndUpload(file) {
			var reader = new FileReader();
				
				reader.onloadend = function() {
			 
				var tempImg = new Image();
				tempImg.src = reader.result;
				tempImg.onload = function() {
			 
					var MAX_WIDTH = 400;
					var MAX_HEIGHT = 300;
					var tempW = tempImg.width;
					var tempH = tempImg.height;
					if (tempW > tempH) {
						if (tempW > MAX_WIDTH) {
						   tempH *= MAX_WIDTH / tempW;
						   tempW = MAX_WIDTH;
						}
					} else {
						if (tempH > MAX_HEIGHT) {
						   tempW *= MAX_HEIGHT / tempH;
						   tempH = MAX_HEIGHT;
						}
					}
			 
					var canvas = document.createElement('canvas');
					canvas.width = tempW;
					canvas.height = tempH;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0, tempW, tempH);
					dataURL = canvas.toDataURL("image/jpeg");
			 
					//start
						var div = document.createElement('div');
						div.innerHTML = '<img style="width:150px;height:150px;margin-bottom:10px;" src="' + dataURL + '" />';
						//document.getElementById('filesInfo').appendChild(div);
						if(whichimage==1)
							$('#grpimage').html(div);
						else if(whichimage==2)
							$('#creategrpimage').html(div);
					
					
					//end
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function(ev){
						//document.getElementById('filesInfo').innerHTML = 'Done!';
						var div = document.createElement('div');
						div.innerHTML = '<img style="width:150px;height:150px;margin-bottom:10px;" src="' + dataURL + '" />';
						//document.getElementById('filesInfo').appendChild(div);
						if(whichimage==1)
							$('#grpimage').html(div);
						else if(whichimage==2)
							$('#grpimage').html(div);
					};
					
					if(whichimage==1){
						xhr.open('POST', 'uploadResized.php?groupid='+groupid, true);
						xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
						var data = 'image=' + dataURL;
						xhr.send(data);
					}
				  }
			 
			   }
			   reader.readAsDataURL(file);
			}

	$('#add_doctors').live('click', function(){
		
		//alert(VDocId);
		if(VDocId==0){
		
			alert("Please enter a valid Doctor Name");
		 
		}else{
			var cadena='addDoctorInGroup.php?groupid='+groupid+'&docid='+VDocId;
			var RecTipo=LanzaAjax(cadena);
			if(RecTipo==0){
				alert('Doctor already present in the Group');
			}else if(RecTipo==1){
				//alert('Doctor added succesfully in the Group');
				//$("#groupconfig").dialog('close');
				var grpdoctble = LanzaAjax('getGroupDocs.php?docid='+med_id+'&groupid='+groupid);
				$('#group_members').html(grpdoctble);
			}
			$("#DoctorSBox").val('');
			VDocId=0;
		}
	
	});
	
	
	var group_data;
	function GetGroupData(dataurl){
			//var queMED = $("#MEDID").val();
			
			//var queUrl ='getValidDoctors.php';		
				
			$.ajax(
			{
				url: dataurl,
				dataType: "json",
				async: false,
				success: function(data)
				{
					group_data = data.items;
				}
			});
			
			
		
	}
	
	// Variable for capturing local image file
	var dataURL;


    $("#probe_editing_range_selector").H2MRange2({min: 0, max: 10, width: 600});
    $.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
	{
		var d = JSON.parse(data);
		var var_length = d['protocols'].length;
		$("#probes_container").html('');
		for(var i = 0; i < var_length; i++)
		{
            var question1 = 0, question1_display = 'background-color: #FAFAFA; color: #777;';
            if(d['protocols'][i].question1 != null)
            {
                question1 = d['protocols'][i].question1;
                question1_display = 'background-color: #22AEFF; color: #FFF;';
            }
            var question2 = 0, question2_display = 'background-color: #FAFAFA; color: #777;';
            if(d['protocols'][i].question2 != null)
            {
                question2 = d['protocols'][i].question2;
                question2_display = 'background-color: #22AEFF; color: #FFF;';
            }
            var question3 = 0, question3_display = 'background-color: #FAFAFA; color: #777;';
            if(d['protocols'][i].question3 != null)
            {
                question3 = d['protocols'][i].question3;
                question3_display = 'background-color: #22AEFF; color: #FFF;';
            }
            var question4 = 0, question4_display = 'background-color: #FAFAFA; color: #777;';
            if(d['protocols'][i].question4 != null)
            {
                question4 = d['protocols'][i].question4;
                question4_display = 'background-color: #22AEFF; color: #FFF;';
            }
            var question5 = 0, question5_display = 'background-color: #FAFAFA; color: #777;';
            if(d['protocols'][i].question5 != null)
            {
                question5 = d['protocols'][i].question5;
                question5_display = 'background-color: #22AEFF; color: #FFF;';
            }
            
			var html = '<div class="probes_row">';
            html += '<div style="float: left; width: 73%;">';
			html += '<div class="protocol_name" id="protocol_name_'+d['protocols'][i].protocolID+'" style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: bold; font-size: 16px; color: #555;">'+d['protocols'][i].name+'</div>';
			html += '<div class="protocol_desc" id="protocol_desc_'+d['protocols'][i].protocolID+'" style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: #777;">'+d['protocols'][i].description+'</div>';
            html += '</div>';
            html += '<div id="questions_'+d['protocols'][i].protocolID+'" style="width: 19%; height: 40px; float: left;">';
            html += '<button id="probe_question_button_1_'+d['protocols'][i].protocolID+'_'+question1+'" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; '+question1_display+' outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
            html += '1';
            html += '</button>';
            html += '<button id="probe_question_button_2_'+d['protocols'][i].protocolID+'_'+question2+'" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; '+question2_display+' outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
            html += '2';
            html += '</button>';
            html += '<button id="probe_question_button_3_'+d['protocols'][i].protocolID+'_'+question3+'" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; '+question3_display+' outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
            html += '3';
            html += '</button>';
            html += '<button id="probe_question_button_4_'+d['protocols'][i].protocolID+'_'+question4+'" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; '+question4_display+' outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
            html += '4';
            html += '</button>';
            html += '<button id="probe_question_button_5_'+d['protocols'][i].protocolID+'_'+question5+'" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; '+question5_display+' outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
            html += '5';
            html += '</button>';
            html += '</div>';
            html += '<div style="float: left; margin-top: 6px;">';
			html += '<button class="probes_edit_button" id="probes_edit_button_'+d['protocols'][i].protocolID+'"><i class="icon-pencil"></i></button>';
			html += '<button class="probes_delete_button" id="probes_delete_button_'+d['protocols'][i].protocolID+'">X</button>';
            html += '</div>';
			html += '</div>';
			$("#probes_container").append(html);
		}
        var probe_question_edit_id = 0;
        var probe_question_edit_number = 0;
        var probe_question_edit_protocol = 0;
        var probe_protocol_edit_id = 0;
        var probe_protocol_edit_mode = 0;
        $("button[id^='probe_question_button_']").live('click', function()
        {
            var id = $(this).attr('id').split('_')[5];
            var protocol = $(this).attr('id').split('_')[4];
            var question_number = parseInt($(this).text());
            probe_question_edit_id = id;
            probe_question_edit_number = question_number;
            probe_question_edit_protocol = protocol;
            console.log('EDITING: ' + id);
            if(id != 0)
            {
                $.post("get_probe_questions.php", {doc_id: $("#MEDID").val(), question_id: id}, function(data, status)
                {
                    var info = JSON.parse(data);
                    var d = info.question;
                    var u = info.units;
                    console.log(data);
                    $("#probe_question_edit_title").val(d['title']);
                    $("#probe_question_edit_question_en").val(d['question_text']);
                    $("#probe_question_edit_question_es").val(d['question_textSPA']);
                    $("#probe_question_edit_min").val(d['answer_min']);
                    $("#probe_question_edit_max").val(d['answer_max']);
                    $("#probe_question_edit_unit").val(d['unit']);
                    
                    var arr = new Array();
                    var last_value = parseInt(d['answer_min']);
                    for(var i = 0; i < u.length; i++)
                    {
                        arr.push({start: last_value, end: parseInt(u[i].value), title: u[i].label});
                        last_value = parseInt(u[i].value) + 1;
                    }
                    $("#probe_editing_range_selector").H2MRange2SetMin(d['answer_min']);
                    $("#probe_editing_range_selector").H2MRange2SetMax(d['answer_max']);
                    if(arr.length > 0)
                        $("#probe_editing_range_selector").H2MRange2SetData(arr);
                });
            }
            else
            {
                $("#probe_question_edit_title").val('');
                $("#probe_question_edit_question_en").val('');
                $("#probe_question_edit_question_es").val('');
                $("#probe_question_edit_min").val(0);
                $("#probe_question_edit_max").val(5);
                $("#probe_question_edit_unit").val('');
            }
            $("#probe_question_modal").dialog({bgiframe: true, width: 700, height: 444, autoOpen: true});
        });
        $("#probe_question_edit_save").live('click', function()
        {
            console.log($("#probe_editing_range_selector").H2MRange2GetData());
            $.post("update_probe_question.php", {title: $("#probe_question_edit_title").val(), question_en: $("#probe_question_edit_question_en").val(), question_es: $("#probe_question_edit_question_es").val(), max: $("#probe_question_edit_max").val(), min: $("#probe_question_edit_min").val(), unit: $("#probe_question_edit_unit").val(), id: probe_question_edit_id, question: probe_question_edit_number, protocol: probe_question_edit_protocol, doctor: $("#MEDID").val(), units: JSON.stringify($("#probe_editing_range_selector").H2MRange2GetData())}, function(data, status)
            {
                console.log(data);
                $("#probe_question_modal").dialog('close');
                if(probe_question_edit_id == 0)
                {
                    $("button[id^='probe_question_button_"+probe_question_edit_number+"_"+probe_question_edit_protocol+"_']").css('background-color', '#22AEFF');
                    $("button[id^='probe_question_button_"+probe_question_edit_number+"_"+probe_question_edit_protocol+"_']").css('color', '#FFF');
                    $("button[id^='probe_question_button_"+probe_question_edit_number+"_"+probe_question_edit_protocol+"_']").attr('id', 'probe_question_button_'+probe_question_edit_number+'_'+probe_question_edit_protocol+'_'+data);
                }
            });
        });
        $("#probe_question_edit_clear").live('click', function()
        {
            $.post("update_probe_question.php", {id: probe_question_edit_id, question: probe_question_edit_number, protocol: probe_question_edit_protocol, doctor: $("#MEDID").val(), clear: 1}, function(data, status)
            {
                $("#probe_question_modal").dialog('close');
                if(probe_question_edit_id != 0)
                {
                    
                    $("button[id^='probe_question_button_"+probe_question_edit_number+"_"+probe_question_edit_protocol+"_']").css('background-color', '#FAFAFA');
                    $("button[id^='probe_question_button_"+probe_question_edit_number+"_"+probe_question_edit_protocol+"_']").css('color', '#777');
                    $("button[id^='probe_question_button_"+probe_question_edit_number+"_"+probe_question_edit_protocol+"_']").attr('id', 'probe_question_button_'+probe_question_edit_number+'_'+probe_question_edit_protocol+'_0');
                }
            });
        });
        $("#probe_question_edit_min").on('change', function()
        {
            $("#probe_editing_range_selector").H2MRange2SetMin($(this).val());
        });
        $("#probe_question_edit_max").on('change', function()
        {
            $("#probe_editing_range_selector").H2MRange2SetMax($(this).val());
        });
        $('.probes_edit_button').live('click', function()
        {
            var id = $(this).attr('id').split('_')[3];
            probe_protocol_edit_id = id;
            probe_protocol_edit_mode = 0;
            $("#probe_protocol_edit_title").val($("#protocol_name_"+probe_protocol_edit_id).text());
            $("#probe_protocol_edit_description").val($("#protocol_desc_"+probe_protocol_edit_id).text());
            $("#probe_protocol_modal").dialog({bgiframe: true, width: 400, height: 220, autoOpen: true, resizable: false});
        });
        $('.probes_delete_button').live('click', function()
        {
            var id = $(this).attr('id').split('_')[3];
            var row = $(this).parent().parent();
            swal({title: "Delete Probe",   
              text: "You are about to delete the probe \""+$("#protocol_name_"+id).text()+"\". This action cannot be undone. Do you wish to continue?",   
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "Delete",   
              closeOnConfirm: true 
             }, function(isConfirm)
             {   
                if (isConfirm) 
                {
                    $.post("delete_probe_protocol.php", {id: id}, function(data, status)
                    {
                        row.remove();
                    });
                }
            });
        });
        $('#new_probe_protocol_button').live('click', function()
        {
			console.log('new probe');
            probe_protocol_edit_mode = 1;
            $("#probe_protocol_edit_title").val('');
            $("#probe_protocol_edit_description").val('');
            $("#probe_protocol_modal").dialog({bgiframe: true, width: 400, height: 220, autoOpen: true, resizable: false});
        });
        $("#probe_protocol_edit_save").live('click', function()
        {
            if(probe_protocol_edit_mode == 0)
            {
                $.post("add_probe_protocol.php", {doctor: $("#MEDID").val(), name: $("#probe_protocol_edit_title").val(), description: $("#probe_protocol_edit_description").val(), probe_id: probe_protocol_edit_id, edit: true}, function(data, status)
                {
                    $("#protocol_name_"+probe_protocol_edit_id).text($("#probe_protocol_edit_title").val());
                    $("#protocol_desc_"+probe_protocol_edit_id).text($("#probe_protocol_edit_description").val());
                    $("#probe_protocol_modal").dialog('close');
                });
            }
            else
            {
                $.post("add_probe_protocol.php", {doctor: $("#MEDID").val(), name: $("#probe_protocol_edit_title").val(), description: $("#probe_protocol_edit_description").val()}, function(data, status)
                {
                    var d = data.split("_");
                    var protocol = d[0];
                    var question = d[1];
                    var html = '<div class="probes_row">';
                    html += '<div style="float: left; width: 73%;">';
                    html += '<div class="protocol_name" id="protocol_name_'+protocol+'" style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: bold; font-size: 16px; color: #555;">'+$("#probe_protocol_edit_title").val()+'</div>';
                    html += '<div class="protocol_desc" id="protocol_desc_'+protocol+'" style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: #777;">'+$("#probe_protocol_edit_description").val()+'</div>';
                    html += '</div>';
                    html += '<div id="questions_'+protocol+'" style="width: 19%; height: 40px; float: left;">';
                    html += '<button id="probe_question_button_1_'+protocol+'_'+question+'" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; background-color: #22AEFF; color: #FFF; outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
                    html += '1';
                    html += '</button>';
                    html += '<button id="probe_question_button_2_'+protocol+'_0" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; background-color: #FAFAFA; color: #777; outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
                    html += '2';
                    html += '</button>';
                    html += '<button id="probe_question_button_3_'+protocol+'_0" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; background-color: #FAFAFA; color: #777; outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
                    html += '3';
                    html += '</button>';
                    html += '<button id="probe_question_button_4_'+protocol+'_0" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; background-color: #FAFAFA; color: #777; outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
                    html += '4';
                    html += '</button>';
                    html += '<button id="probe_question_button_5_'+protocol+'_0" style="width: 30px; height: 30px; border-radius: 30px; border: 1px solid #DDD; background-color: #FAFAFA; color: #777; outline: none; margin-top: 5px; float: left; margin-right: 5px;">';
                    html += '5';
                    html += '</button>';
                    html += '</div>';
                    html += '<div style="float: left; margin-top: 6px;">';
                    html += '<button class="probes_edit_button" id="probes_edit_button_'+protocol+'"><i class="icon-pencil"></i></button>';
                    html += '<button class="probes_delete_button" id="probes_delete_button_'+protocol+'">X</button>';
                    html += '</div>';
                    html += '</div>';
                    $("#probes_container").append(html);
                    $("#probe_protocol_modal").dialog('close');
                });
            }
        });
	});
        
	
    /*  CREATE THE GROUP */

	$("#save_grpdate").live('click', function(){
	  //change the title
	  console.log("in create group");	
	  var grpname=$('#editgrpname').val();
	  var grpadd=$('#editgrpadd').val();
	  var grpzip=$('#editgrpzip').val();
	  var grpcity=$('#editgrpcity').val();
	  var grpstate=$('#editgrpstate').val();
	  var grpcountry=$('#editgrpcountry').val();
		

	  if(grpname==''||grpadd==''||grpzip==''||grpcity==''||grpstate==''||grpcountry==''){
			swal({   title: "Error",   text: "Empty field not allowed.",   type: "error",   confirmButtonText: "Ok" }); 
	  }else{
	  
	    var cadena='CreateGroup.php?grpname='+grpname+'&grpadd='+grpadd+'&grpzip='+grpzip+'&grpcity='+grpcity+'&grpstate='+grpstate+'&grpcountry='+grpcountry+'&docid='+med_id;
		var grpid=LanzaAjax(cadena);
//		alert(grpid);
		console.log(grpid);  
		if(grpid>0){
				var defaultimage = true;
				grpimage = $("#grpimage img").attr('src')
				if (grpimage != "images/defaultgrouppic.jpg") {
					defaultimage=false;
				}
				if(defaultimage==false){
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function(ev){
						//document.getElementById('filesInfo').innerHTML = 'Done!';
						/*var div = document.createElement('div');
						div.innerHTML = '<img style="width:150px;height:150px;margin-bottom:10px;" src="' + dataURL + '" />';
						//document.getElementById('filesInfo').appendChild(div);
						/*if(whichimage==1)
							$('#grpimage').html(div);*/
						//else if(whichimage==2)
							//$('#creategrpimage').html(div);
					};
			 
					xhr.open('POST', 'uploadResized.php?groupid='+grpid, true);
					xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					var data = 'image=' + dataURL;
					xhr.send(data);
				}
					
				//alert('Group Created!');
				swal({   title: "Group Created",   text: "Group Created.",   type: "success",   confirmButtonText: "Ok" }); 
				group_dialog.dialog("close");
				var grptble = LanzaAjax('getGroupDetails.php?docid='+med_id+'');	
				$('#group_details').html(grptble);
		}
		
		$('#Groupname').val('');
		$('#Groupadd').val('');
		$('#Groupzip').val('');
		$('#Groupcity').val('');
		$('#Groupstate').val('');
		$('#Groupcountry').val('');
		  
		//always set the default image  
		$('#grpimage').html('<img style="width:150px;height:150px;margin-bottom:10px" src="images/defaultgrouppic.jpg" alt="Group Picture"/>');
	  
	  }
	  
	  grpname='';
	  grpadd='';
	  grpzip='';
	  grpcity='';
	  grpstate='';
	  grpcountry='';
	
	});
	
	
	$('.edit_group').live('click', function(){
		$("#Edit_group").show();
		iconID = $(this).attr("id");
		nameSplit = iconID.split("_");
     	groupid = nameSplit[1];
		//console.log("Group ID : "+groupid);
		
		var checkowner=LanzaAjax('CheckOwner.php?docid='+med_id+'&groupid='+groupid);
		
		//console.log("Check Owner : "+checkowner);
		GetGroupData('getGroupData.php?groupid='+groupid);
		
	   if(checkowner>0){
		   
		   		$('#editgrpname').val(group_data[0].Name);
				$('#editgrpadd').val(group_data[0].Address);
				$('#editgrpzip').val(group_data[0].ZIP);
				$('#editgrpcity').val(group_data[0].City);
				$('#editgrpstate').val(group_data[0].State);
				$('#editgrpcountry').val(group_data[0].Country);
	   
				$("#editgrpname").removeAttr("disabled"); 
				$('#editgrpadd').removeAttr("disabled"); 
				$('#editgrpzip').removeAttr("disabled"); 
				$('#editgrpcity').removeAttr("disabled"); 
				$('#editgrpstate').removeAttr("disabled"); 
				$('#editgrpcountry').removeAttr("disabled"); 
				$('#filesToUpload').removeAttr("disabled"); 
				$('#save_grpdate').hide();
		  
		//show correct image
		 var div = document.createElement('div');
		//this should be working
		console.log("Group Data Val " + group_data[0].Image);
		if(group_data[0].Image!=''){
			div.innerHTML = '<img style="width:150px;height:150px;margin-bottom:10px;" src="uploads/' + group_data[0].Image + '" />';
		}else {
			div.innerHTML = '<img style="width:150px;height:150px;margin-bottom:10px;" src="images/defaultgrouppic.jpg" />';
		}
		
		$("#grpimage").html(div);
		
		   
		   	   group_dialog = $("#create-group").dialog({bgiframe: true, width: 650, height: 550, modal: false, autoOpen: false, "title" : "Edit Group"});
		       group_dialog.dialog('open');
	   			//group_dialog.dialog({title, "Edit Groups"});
	   }else{
			//alert('Group data Edit not allowed since you are not the group owner');
		   	swal({   title: "Error",   text: "Group data edit not allowed since you are not the group owner.",   type: "error",   confirmButtonText: "Ok" }); 
	   }
	
	});
	$('#Edit_group').live('click', function(){
		
		updateGroupInfo();
	});

	
	//get the timezone from the database
    timezone_db = doc_timezone;  
	var current_timezone = get_timezone_offset();
	//console.log("TX:"+current_timezone);
        if (timezone_db != null) {
            timezone_array = timezone_db.split(":");
            timezone_format = timezone_array[0];
            timezone_format_mins = timezone_array[1];
            timezone_minutes = ".0";
            if (timezone_format_mins == "30") {
                timezone_minutes = ".5";   
            }
            timezone_format=parseInt(timezone_format, 10)+timezone_minutes;
            $("#timezone_picker").val(timezone_format); 

        }    
        else if(current_timezone != 'none')
        {
            var v = parseInt(current_timezone.substr(0, 3));
            var m = parseInt(current_timezone.substr(4, 2));
			//alert(v + '  ' + m);
            if(m != 0)
            {
                $("#timezone_picker").val(v+(m / 60.0));
            }
            else
            {
                $("#timezone_picker").val(v+'.0');
				//alert($("#timezone_picker").val());
            }
        }
	//alert(current_timezone);
	
	
	//Code for Telemedicine Tab Starts Here
	
	var d=new Date();
	var sub = d.getDay();
	d.setDate(d.getDate()-sub);
	//alert('Date on Monday was' + d.getDate());
	var startDate = new Date(d);
	d.setDate(d.getDate()+6);
	var endDate = new Date(d);
    var copyDate = startDate;
	$('#CurrentPage').text(getDateRepresentation(startDate) + ' - ' + getDateRepresentation(endDate));
	
	getWeeklyTimeslots(startDate);   //get data for this week
	showAppointmentData(startDate);  //generate html



	
	function getDateDay(index)
	{
		var dayNames= ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];
		//console.log(index);
		return dayNames[index];
	}
	
	function getDateRepresentation(d)
	{
	if(language == 'th'){
			var monthNames = [ "Ene", "Feb", "Mar", "Abr", "May", "June","July", "Ago", "Sep", "Oct", "Nov", "Dic" ];
			}else{
			var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			}
		
		var day = d.getDate();
		var month = monthNames[d.getMonth()];
		var year = d.getFullYear();
		return month + ' ' + day + ',' + year;
	}
	
	function getDateDatabaseRepresentation(d)
	{
		var day = d.getDate();
		var month = d.getMonth()+1;
		var year = d.getFullYear();
		
		return year+'-'+month+'-'+day;
	
	}
	
	function getTimeRepresentation(baseTime)
	{
		var tok = baseTime.split(':');
		var hours = parseInt(tok[0]);
		var minutes = parseInt(tok[1]);
		var t = 'am';
		
		if(hours == 0)
		{
			hours = 12;
			t='am';
		}
		else if(hours>12)
		{
			hours = hours - 12;
			t='pm';
		}
		else if(hours==12)
		{
			t='pm';
		}
		
		if(minutes==0)
		{
			return hours + '.00 ' + t;
		}
		else
		{
			return hours + '.' + minutes + ' ' + t;
		}
		
		
		
		
	}
        
    $("#copy_week").live('click', function()
    {
        $("#paste_week").css("display", "block");
        copyDate = startDate.toISOString().split("T")[0];
        console.log(copyDate);
        
    });
    $("#paste_week").live('click', function()
    {
        var pasteDate = startDate.toISOString().split("T")[0];
        if(pasteDate != copyDate && endDate >= d)
        {
            $.get("createDoctorTimeslot.php?copy="+copyDate+"&paste="+pasteDate, function(data, status)
            {
                getWeeklyTimeslots(startDate);
                showAppointmentData(startDate);
            });
        }
        else if(endDate < d)
        {
            alert("You cannot paste a week into the past.");
        }
        else
        {
            alert("Please choose another week to paste the copied week into.");
        }
    });
    $("#clear_week").live('click', function()
    {
        var answer = confirm("Are you sure you want to delete this whole week?");
        if(answer)
        {
            $.get("deleteDoctorAvailability.php?clear="+startDate.toISOString().split("T")[0], function(data, status)
            {
                displaynotification('Week Deleted',' ');
                getWeeklyTimeslots(startDate);
                showAppointmentData(startDate);
            });
            
        }
        else
        {
            //do nothing
        }	
        
    });
        

        
    $("#timezone_picker").change(function()
    {
        console.log("Clicked");
        getWeeklyTimeslots(startDate);
        showAppointmentData(startDate);
        //update the database Ajax code here
        email = doc_email;
        current_timezone=$("#timezone_picker").val();
        url= "get_timezone.php?timezone="+current_timezone+"&email="+email+"&type=doctor";
        var RecTipo=LanzaAjax(url);   
    });
	
	$("#next").live('click',function() {
		startDate.setDate(startDate.getDate()+7);
		endDate.setDate(endDate.getDate()+7);
		$('#CurrentPage').text(getDateRepresentation(startDate) + ' - ' + getDateRepresentation(endDate));
		getWeeklyTimeslots(startDate);
		showAppointmentData(startDate);
		
		lastSelected='';
		selectedRow = -1;
		selectedColumn = -1;
		selectedTime = '';
		
		
	 });	
	 
	$("#prev").live('click',function() {
		startDate.setDate(startDate.getDate()-7);
		endDate.setDate(endDate.getDate()-7);
		$('#CurrentPage').text(getDateRepresentation(startDate) + ' - ' + getDateRepresentation(endDate));
		getWeeklyTimeslots(startDate);
		showAppointmentData(startDate);
		
		lastSelected='';
		selectedRow = -1;
		selectedColumn = -1;
		selectedTime = '';
		
		
	 });	 
	 
	 function showAppointmentData(sDate)
	 {
		
		var origDt = new Date(sDate);
		var dt = new Date();
		//console.log('Start Date = ' + getDateRepresentation(origDt));
		var AppointmentBox='<button type="button" id="popover_btn" data-container="body" data-toggle="popover" data-placement="left" style="float: right; background-color: #FFF; outline: 0px; border: 0px solid #FFF;" data-content="To add a new availability timeslot, simply click on the time where you would like it to start, and then click on the time where you would like it to end.<br/><br/>To delete an availability timeslot, simply click on it and select \'OK\'. "><i class="icon-info-sign"></i></button>';
		for(i=0;i<7;++i)
		{
			if(i==6)
			{
			
				AppointmentBox += '<div class="InfoRow" style="height:40px;padding-top:40px;padding-bottom:40px" id='+getDateDatabaseRepresentation(origDt)+'>';
			}
			else
			{
				AppointmentBox += '<div class="InfoRow" style="height:40px;padding-top:40px" id='+getDateDatabaseRepresentation(origDt)+'>';
			}
			//AppointmentBox += '<div style="width:100px; float:left; text-align:left;margin-left:10px"><span class="PatName">'+getDateDay(i) + ' ' + getDateRepresentation(origDt)+'</span></div>';
		var translation3 = '';
		var translationString = ''

		if(language == 'th'){
		
		if(getDateDay(i) == 'Sunday'){
		translation3 = 'Domingo';
		}
		if(getDateDay(i) == 'Monday'){
		translation3 = 'Lunes';
		}
		if(getDateDay(i) == 'Tuesday'){
		translation3 = 'Martes';
		}
		if(getDateDay(i) == 'Wednesday'){
		translation3 = 'Miércoles';
		}
		if(getDateDay(i) == 'Thursday'){
		translation3 = 'Jueves';
		}
		if(getDateDay(i) == 'Friday'){
		translation3 = 'Viernes';
		}
		if(getDateDay(i) == 'Saturday'){
		translation3 = 'Sábado';
		}
		
		
		var str = getDateRepresentation(origDt);
		var getString = str.substring(0,3);
		var getEnd = str.substring(4,11);
		if(getString == 'Ene'){
		translationString = 'Ene '+getEnd;
		}
		if(getString == 'Feb'){
		translationString = 'Feb '+getEnd;
		}
		if(getString == 'Mar'){
		translationString = 'Mar '+getEnd;
		}
		if(getString == 'Abr'){
		translationString = 'Abr '+getEnd;
		}
		if(getString == 'May'){
		translationString = 'May '+getEnd;
		}
		if(getString == 'Jun'){
		translationString = 'Jun '+getEnd;
		}
		if(getString == 'Jul'){
		translationString = 'Jul '+getEnd;
		}
		if(getString == 'Ago'){
		translationString = 'Ago '+getEnd;
		}
		if(getString == 'Sep'){
		translationString = 'Sep '+getEnd;
		}
		if(getString == 'Oct'){
		translationString = 'Oct '+getEnd;
		}
		if(getString == 'Nov'){
		translationString = 'Nov '+getEnd;
		}
		if(getString == 'Dic'){
		translationString = 'Dic '+getEnd;
		}
		
		}else if(language == 'en'){
		
		if(getDateDay(i) == 'Sunday'){
		translation3 = 'Sunday';
		}
		if(getDateDay(i) == 'Monday'){
		translation3 = 'Monday';
		}
		if(getDateDay(i) == 'Tuesday'){
		translation3 = 'Tuesday';
		}
		if(getDateDay(i) == 'Wednesday'){
		translation3 = 'Wednesday';
		}
		if(getDateDay(i) == 'Thursday'){
		translation3 = 'Thursday';
		}
		if(getDateDay(i) == 'Friday'){
		translation3 = 'Friday';
		}
		if(getDateDay(i) == 'Saturday'){
		translation3 = 'Saturday';
		}
		
		
		var str2 = getDateRepresentation(origDt);
		var getString2 = str2.substring(0,3);
		var getEnd2 = str2.substring(4,11);
		if(getString2 == 'Jan'){
		translationString = 'Jan '+getEnd2;
		}
		if(getString2 == 'Feb'){
		translationString = 'Feb '+getEnd2;
		}
		if(getString2 == 'Mar'){
		translationString = 'Mar '+getEnd2;
		}
		if(getString2 == 'Apr'){
		translationString = 'Apr '+getEnd2;
		}
		if(getString2 == 'May'){
		translationString = 'May '+getEnd2;
		}
		if(getString2 == 'Jun'){
		translationString = 'Jun '+getEnd2;
		}
		if(getString2 == 'Jul'){
		translationString = 'Jul '+getEnd2;
		}
		if(getString2 == 'Aug'){
		translationString = 'Aug '+getEnd2;
		}
		if(getString2 == 'Sep'){
		translationString = 'Sep '+getEnd2;
		}
		if(getString2 == 'Oct'){
		translationString = 'Oct '+getEnd2;
		}
		if(getString2 == 'Nov'){
		translationString = 'Nov '+getEnd2;
		}
		if(getString2 == 'Dec'){
		translationString = 'Dec '+getEnd2;
		}
		
		}
		
			AppointmentBox += '<div style="width:100px; float:left; margin-left:10px"><span class="PatName">'+translationString+'</span>';
			AppointmentBox += '<div style="width:100%;"></div>';
			AppointmentBox += '<div style="width:100px; float:left; margin-left:10px"><span>'+translation3+'</span></div>';
            AppointmentBox += '</div>';    
			
			AppointmentBox += '<div style="float:left; text-align:left;">'+generateTimeline(i)+'</div>';
			//AppointmentBox += '<div class="DeleteDeck" style="width:40px; float:left;margin-left:10px"><a class="btn" style="height: 15px; padding-top: 0px; margin-top: -5px; color:red;">Del</a></div>';
			AppointmentBox += '</div>';
			
			
			origDt.setDate(origDt.getDate()+1);
			
		}
		
		$('#AppointmentContainer').html(AppointmentBox);
		$('#popover_btn').popover();
		origDt = new Date(sDate);
		
		for(i=0;i<7;++i) 
		{
			//console.log('Loading Data for ' + getDateRepresentation(origDt));
			loadTimeSlots(origDt,i);
			//break;
			origDt.setDate(origDt.getDate()+1);
		}
		
	 }

	 
	 function generateTimeline(row)
	 {
			
			var string = '<div class="timeCell" id="tc'+row+'_'+'1" ><div class="timeCellIndicator" style="border-top-left-radius: 3px; border-bottom-left-radius: 3px; -webkit-border-top-left-radius: 3px; -moz-border-top-left-radius: 3px;  -webkit-border-bottom-left-radius: 3px; -moz-border-bottom-left-radius: 3px;"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff" ></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">12 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'2"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">1 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'3"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">2 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'4"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">3 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'5"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">4 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'6"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">5 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'7"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">6 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'8"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">7 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'9"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">8 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'10"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">9 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'11"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">10 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'12"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">11 am</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'13"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">12 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'14"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">1 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'15"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">2 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'16"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">3 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'17"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">4 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'18"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">5 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'19"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">6 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'20"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">7 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'21"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">8 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'22"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">9 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'23"><div class="timeCellIndicator"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div></div><span class="timeLabel">10 pm</span></div>'
               +' <div class="timeCell" id="tc'+row+'_'+'24"><div class="timeCellIndicator" style="border-top-right-radius: 3px; border-bottom-right-radius: 3px; -webkit-border-top-right-radius: 3px; -moz-border-top-right-radius: 3px;  -webkit-border-bottom-right-radius: 3px; -moz-border-bottom-right-radius: 3px;"><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff"></div><div class="timeCellIndicatorOff" ></div></div><span class="timeLabel">11 pm</span></div>';
	
				
			return string;
			

	 }
	 var TimeSlotData = new Array();
	 
	 function getWeeklyTimeslots(js_date)
     {
        var day = js_date.getDate();
		    var month = js_date.getMonth()+1;
		    var year = js_date.getFullYear();
			var sqlDate = year+'-'+month+'-'+day;
	 
			var queUrl = 'getDoctorWeeklySchedule.php?week='+sqlDate;
			//console.log(queUrl);
			$.ajax(
			{
				url: queUrl,
				dataType: "json",
				async: false,
				success: function(data)
				{
					//alert('Data Fetched = ' + data);
					//console.log('Data Fetched for week of ' + sqlDate);
					TimeSlotData = data;
				},
				error: function(data, errorThrown){
					alert(errorThrown);
              } 
			});
 
     }
	 
	 
	 
	 
	 
	 function loadTimeSlots(js_date,row)
	 {
			numTimeSlots = TimeSlotData.length;
			if(numTimeSlots==0)
			{
				return;   //no need to process this week as there is no data
			}
				
			
			var wkdy = js_date.getUTCDay();
			//alert(wkdy);
			
            var next_wkdy = wkdy + 1;
            var prev_wkdy = wkdy - 1;
            if(next_wkdy > 6)
            {
                next_wkdy = 0;
            }
            if(prev_wkdy < 0)
            {
                prev_wkdy = 6;
            }
			
			
			for(var i = 0; i < numTimeSlots; i++)
			{
			
				var data = TimeSlotData[i];
				var tok = data.split('_');
				var id = parseInt(tok[0]);
				var timeslot = tok[1];
				var eventID = 'event_'+id;
				
				var slotweek = new Date(2000, 1, 2, 0, 0, 0, 0);
				
				slotweek.setUTCFullYear(parseInt(timeslot.substr(14, 4)),parseInt(timeslot.substr(18, 2)) - 1,parseInt(timeslot.substr(20, 2)));
				
				
				slotweek.setHours(0);
                slotweek.setMinutes(0);
				var slotweek_end = new Date();
                slotweek_end.setUTCDate(slotweek.getDate()+6);
                slotweek_end.setHours(23);
                slotweek_end.setMinutes(59);
                slotweek_end.setSeconds(59);
				
				
				//if(js_date.getTime() >= slotweek.getTime() && js_date.getTime() <= slotweek_end.getTime())
                //{
					
                    var start_hour = parseInt(timeslot.substr(1, 2));
					
                    var start_minute = parseInt(timeslot.substr(3, 2));
					
                    var end_hour = parseInt(timeslot.substr(5, 2));
					
                    var end_minute = parseInt(timeslot.substr(7, 2));
                    
					//console.log('Initially->' + start_hour + '  ' + start_minute + '   ' + end_hour + '   ' + end_minute);
					//Convert Time to GMT	
					
                    var add_zone = 0;
                    if(timeslot.substr(9, 1) == '+')
                    {
                        add_zone = 1;
                    }
                    if(add_zone)
                    {
						
                        var delta_hour = parseInt(timeslot.substr(10, 2));
                        var delta_minute = parseInt(timeslot.substr(12, 2));
                        start_hour -= delta_hour;
                        end_hour -= delta_hour;
                        start_minute -= delta_minute;
                        end_minute -= delta_minute;
                        if(start_minute >= 60)
                        {
                            start_minute -= 60;
                            start_hour += 1;
                            
                        }
                        else if(start_minute < 0)
                        {
                            start_minute += 60;
                            start_hour -= 1;
                        }
                        if(end_minute >= 60)
                        {
                            end_minute -= 60;
                            end_hour += 1;
                            
                        }
                        else if(end_minute < 0)
                        {
                            end_minute += 60;
                            end_hour -= 1;
                        }
                        
                    }
                    else
                    {
						
                        var delta_hour = parseInt(timeslot.substr(10, 2));
                        var delta_minute = parseInt(timeslot.substr(12, 2));
                        start_hour += delta_hour;
                        end_hour += delta_hour;
                        start_minute += delta_minute;
                        end_minute += delta_minute;
                        if(start_minute >= 60)
                        {
                            start_minute -= 60;
                            start_hour += 1;
                            
                        }
                        else if(start_minute < 0)
                        {
                            start_minute += 60;
                            start_hour -= 1;
                        }
                        if(end_minute >= 60)
                        {
                            end_minute -= 60;
                            end_hour += 1;
                            
                        }
                        else if(end_minute < 0)
                        {
                            end_minute += 60;
                            end_hour -= 1;
                        }
                    }
					
					//console.log('GMT->' + start_hour + '  ' + start_minute + '   ' + end_hour + '   ' + end_minute);
					//Convert GMT Time to Local Time
								
						
					            
					//var currentTimezone = parseFloat(get_timezone_offset());
                    // *************************************************** //
                    // Get timezone from select field instead
                    // *************************************************** //
                    var currentTimezone = parseFloat($("#timezone_picker").val());
                    
                    var currentTimezoneHour = Math.floor(currentTimezone);
					
                    var currentTimezoneMinute = (currentTimezone - currentTimezoneHour) * 60;
                    if(add_zone == 0)
                    {
                        currentTimezoneHour = Math.ceil(currentTimezone);
                        currentTimezoneMinute = (currentTimezone - currentTimezoneHour) * 60;
                    }
					
					
					
                    start_hour += currentTimezoneHour;
                    end_hour += currentTimezoneHour;
					
                    start_minute += currentTimezoneMinute;
                    end_minute += currentTimezoneMinute;
                    
					
					
					
					if(start_minute >= 60)
                    {
                        start_minute -= 60;
                        start_hour += 1;
                        
                    }
                    else if(start_minute < 0)
                    {
                        start_minute += 60;
                        start_hour -= 1;
                    }
                    if(end_minute >= 60)
                    {
                        end_minute -= 60;
                        end_hour += 1;
                        
                    }
                    else if(end_minute < 0)
                    {
                        end_minute += 60;
                        end_hour -= 1;
                    }
					
					
					
                    if(parseInt(timeslot[0]) == next_wkdy)
                    {
                        start_hour += 24;
                        end_hour += 24;
                    }
                    else if(parseInt(timeslot[0]) == prev_wkdy)
                    {
                        start_hour -= 24;
                        end_hour -= 24;
                    }
					
					//console.log('Final->' + start_hour + '  ' + start_minute + '   ' + end_hour + '   ' + end_minute + '***' + wkdy);
					
                    if(parseInt(timeslot[0]) == wkdy || parseInt(timeslot[0]) == next_wkdy || parseInt(timeslot[0]) == prev_wkdy)
                    {   
					
						//console.log('**coloring ' + "#tc"+row+"_"+(start_hour + 1) + '   ' + start_minute + '   ' + end_minute + '  ' + eventID);
                        if(start_hour < 24 )//&& end_hour > 0)
                        {
							

							if(start_hour==end_hour)
							{
								//alert('special case');
								var start=1;
								if(start_minute==0)
									start=1;
								else
									start = (start_minute / 15)+1;
														
                                var end = end_minute / 15;
								//console.log(start + '  ' + end);
								
								for(var j=1;j<5;++j)
								{
								
									if(j>=start && j<=end)
									{
										switch(j)
										{
											
											case 1:$("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
													break;
											case 2:$("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
													break;
											case 3:	$("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
													break;
											case 4:$("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn " + eventID);
													break;
										}
									}
								}
								
								
								
								
								//colorSlot(row,start_hour + 1,start_hour + 1,eventID);
								continue;
							}
								
							//console.log('other part');
                            if(start_hour >= 0)
                            {
                                var start = start_minute / 15;
                                var end = end_minute / 15;
                                if(start <= 3)
                                {
									
									//console.log('****coloring ' + "#tc"+row+"_"+(start_hour + 1) + '   ' + start + '   ' + end + '  ' + eventID);
                                    //$("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn");
									$("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn " + eventID);
									
									
									//var elem = document.getElementById('tc5_4');
									//alert(elem);
									
                                    if(start <= 2)
                                    {
										//console.log('coloring ' + "#tc"+row+"."+(start_hour + 1));
                                        $("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
                                        if(start <= 1)
                                        {
                                            $("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
                                            if(start == 0)
                                            {
                                                $("#tc"+row+"_"+(start_hour + 1)).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
                                            }
                                        }
                                    }
                                }
                            }
                            var k = start_hour + 2;
                            if(k < 1)
                            {
                                k = 1;
                            }
                            var k2 = end_hour;
                            if(k2 > 24)
                            {
                                k2 = 24
                            }
                            for(; k <= k2; k++)
                            {
                                $("#tc"+row+"_"+k).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
                                $("#tc"+row+"_"+k).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
                                $("#tc"+row+"_"+k).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
                                $("#tc"+row+"_"+k).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn " + eventID);
                            }
                            if(end_hour < 24 && end >= 1)
                            {
                                $("#tc"+row+"_"+(end_hour + 1)).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
                                if(end >= 2)
                                {
                                    $("#tc"+row+"_"+(end_hour + 1)).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
                                    if(end >= 3)
                                    {
                                        $("#tc"+row+"_"+(end_hour + 1)).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
                                    }
                                }
                            }
                        }
                        
                    }
                //}
				
				
			
				
			}
	 }
	 
	 
	 var lastSelected='';
	 var selectedRow = -1;
	 var selectedColumn = -1;
	 var selectedTime = '';
	 
	 
	 $( ".timeCellIndicatorOff" ).live('mouseover',function() {
	   if($("#telemed_on").val() == 1)
        {
			var thisDate = $(this).parent().parent().parent().parent().attr('id');
			var d1 = new Date(thisDate);
			var d2 = new Date();
			if(DateDiff.inDays(d2, d1)<0)
			{
				return;
			}
	 
	 
			$(this).addClass('timeCellIndicatorTempOn');
			//$(this).attr('class','timeCellIndicatorTempOn');
        }
			
	 });
	 
	 $( ".timeCellIndicatorOff" ).live('mouseout',function() {
         if($("#telemed_on").val() == 1)
        {
			var thisDate = $(this).parent().parent().parent().parent().attr('id');
			var d1 = new Date(thisDate);
			var d2 = new Date();
			if(DateDiff.inDays(d2, d1)<0)
			{
				return;
			}
			
			
            if($(this).hasClass('tempSelection') )//|| $(this).hasClass('timeCellIndicatorOn'))
            {
                
                //console.log('true');
            }
            else
            {
                //console.log('false');
                $(this).removeClass('timeCellIndicatorTempOn');
                //$(this).attr('class','timeCellIndicatorOff');
            }
        }
	 });
	 
	 
	 //For deleting events
	 $( ".timeCellIndicatorOn" ).live("click", function(){
		if($("#telemed_on").val() == 1)
        {
		var thisDate = $(this).parent().parent().parent().parent().attr('id');
		var d1 = new Date(thisDate);
		var d2 = new Date();
		if(DateDiff.inDays(d2, d1)<0)
		{
			displaynotification(' ','You cannot delete timeslots from the past');
			return;
		}
		
		
		var myID = $(this).parent().parent().attr('id');
		var myRow = getRowFromId(myID);
		
		
		
		if(lastSelected == myID)
		{
			
			//if you want to select slot for just 15 min
			var startTime = selectedTime;
			var endTime = getTime($(this).parent().parent().children('.timeLabel').text(),$(this).index()+1);
			endTime = add15min(endTime);
			//console.log(startTime+' - '+endTime);
			var insertid = createTimeslot(startTime,endTime,myRow);
			displaynotification('Timeslot Saved',getDateRepresentation(new Date(thisDate)) + ' ' + getTimeRepresentation(startTime) + ' - ' + getTimeRepresentation(endTime));
			//colorSlot(myRow,selectedColumn,selectedColumn,insertid);
			$(this).attr('class','timeCellIndicatorOn event_'+insertid);
			lastSelected='';
			selectedRow = -1;
			selectedColumn = -1;
			selectedTime = '';
			return;
		}
		
		
		
		
		if(lastSelected!='')
		{
			$('#'+lastSelected).children('.timeCellIndicator').children('.tempSelection').attr('class','timeCellIndicatorOff');
			lastSelected='';
			selectedRow = -1;
			selectedColumn = -1;
			selectedTime = '';
			return;
		}
		
		
		
		
		
		var classList =$(this).attr('class').split(/\s+/);
		$.each( classList, function(index, item)
		{
			
			//if there is an eventID associated
			if(item.indexOf('event') > -1)
			{
				var id = parseInt(item.split('_')[1]);
				//alert('Associated ID='+id);
				var answer = confirm("Are you sure you want to delete this event ? ");
				if(answer)
				{
					//alert('deleting ' + id);
					var url = 'deleteDoctorAvailability.php?eventID='+id;
					//console.log(url);
					LanzaAjax(url);
					uncolorEventFromRow(myRow,id);
					displaynotification('Timeslot Deleted',' ');
				}
				else
				{
					//do nothing
				}	
			
			
			}
		});
        }
	 });
	 
	 
	 function uncolorEventFromRow(row,eventID)
	 {
		//alert('I have to uncolor ' + row + ' **' + eventID);
		var eventClass = 'event_'+eventID;
		
		for(var i=0;i<25;++i)
		{
			var cellID = generateID(row,i);
		
			
			if($(cellID).children(".timeCellIndicator").children().first().hasClass(eventClass))
			{
				$(cellID).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOff");
			}
			
			if($(cellID).children(".timeCellIndicator").children().first().next().hasClass(eventClass))
			{
				$(cellID).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOff");
			}
			
			if($(cellID).children(".timeCellIndicator").children().last().prev().hasClass(eventClass))
			{
				$(cellID).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOff");
			}
			
			if($(cellID).children(".timeCellIndicator").children().last().hasClass(eventClass))
			{
				$(cellID).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOff");
			}
		}
	 }
	 
	 
	 
	 $( ".timeCellIndicatorOff" ).live("click", function(){
	
        if($("#telemed_on").val() == 1)
        {
            var thisDate = $(this).parent().parent().parent().parent().attr('id');
            var d1 = new Date(thisDate);
            var d2 = new Date();
            if(DateDiff.inDays(d2, d1)<0)
            {
                displaynotification(' ','You cannot create timeslots in the past');
                return;
            }
         
         
         
                if(lastSelected != '')
                {
                    //if this is second click
                    var myID = $(this).parent().parent().attr('id');
                    var myRow = getRowFromId(myID);
                    var myColumn = getColumnFromId(myID);
                    
                    if(myRow == selectedRow)
                    {
                        //alert('This is Second Click');
                        //if second click on same row
                        
                        
                        if(myColumn < selectedColumn)
                        {
                            //if second click is starttime
                            $(this).attr('class','timeCellIndicatorOn tempSelection');
                            
                            //console.log($(this).parent().parent().children('.timeLabel').text() + '***' + ($(this).index()+1) + ' ### ' + myColumn + ' -- ' + selectedColumn)
                            var startTime = getTime($(this).parent().parent().children('.timeLabel').text(),$(this).index()+1);
                            var endTime = add15min(selectedTime);
                            //console.log(startTime+' - '+endTime);
                            var insertid = createTimeslot(startTime,endTime,myRow);
                            colorSlot(myRow,myColumn,selectedColumn,insertid);
                            displaynotification('Timeslot Saved',getDateRepresentation(new Date(thisDate)) + ' ' + getTimeRepresentation(startTime) + ' ' + getTimeRepresentation(endTime));
                        }
                        else if(myColumn > selectedColumn)
                        {
                            //console.log('here');
                            //if second click is endtime
                            $(this).attr('class','timeCellIndicatorOn tempSelection');
                            
                            var startTime = selectedTime;
                            var endTime = getTime($(this).parent().parent().children('.timeLabel').text(),$(this).index()+1);
                            endTime = add15min(endTime);
                            //console.log(startTime+' - '+endTime);
                            var insertid = createTimeslot(startTime,endTime,myRow);
                            colorSlot(myRow,selectedColumn,myColumn,insertid);
                            displaynotification('Timeslot Saved',getDateRepresentation(new Date(thisDate)) + ' ' + getTimeRepresentation(startTime) + ' - ' + getTimeRepresentation(endTime));
                        }
                        else //if(myColumn == selectedColumn)
                        {
                            //both start and end are on same slot
                            var startTime;
                            var endTime;
                            var fClick = getIndexFromTime(selectedTime);
                            var sClick = $(this).index()+1;
                            
                                                
                            $(this).attr('class','timeCellIndicatorOn tempSelection');
                            if(fClick < sClick)
                            {
                                //first click is on left of second click
                                startTime = selectedTime;
                                endTime = getTime($(this).parent().parent().children('.timeLabel').text(),sClick);
                                endTime = add15min(endTime);
                                //console.log(startTime+' - '+endTime);
                                
                                
                            }
                            else
                            {
                                //first click is on right of second click
                                startTime = getTime($(this).parent().parent().children('.timeLabel').text(),sClick);
                                endTime = add15min(selectedTime);
                                //console.log(startTime+' - '+endTime);
                                
                                
                            }
                            var insertid = createTimeslot(startTime,endTime,myRow);
                            colorSlot(myRow,selectedColumn,myColumn,insertid);
                            displaynotification('Timeslot Saved',getDateRepresentation(new Date(thisDate)) + ' ' + getTimeRepresentation(startTime) + ' - ' + getTimeRepresentation(endTime));
                            
                        
                        }
                        lastSelected='';
                        selectedRow = -1;
                        selectedColumn = -1;
                        selectedTime = '';
                        
                        
                    }
                    else
                    {
                        //alert('here');
                        //if second click on different row
                                //undo selection in other row
                        
                        $('#'+lastSelected).children('.timeCellIndicator').children('.tempSelection').attr('class','timeCellIndicatorOff');
                        lastSelected='';
                        selectedRow = -1;
                        selectedColumn = -1;
                        selectedTime = '';
                    
                    }
                    
                    
                    
                }
                else
                {
                    //alert('This is First Click');
                    //if this is a new click
                    $(this).attr('class','timeCellIndicatorOn tempSelection');
                    var myID = $(this).parent().parent().attr('id');
                    lastSelected = myID;
                    selectedRow = getRowFromId(lastSelected);
                    selectedColumn = getColumnFromId(lastSelected);
                    selectedTime = getTime($(this).parent().parent().children('.timeLabel').text(),$(this).index()+1);
                    //console.log(selectedTime);
                    
                    
                }
        }
	 });
	 
	 function getIndexFromTime(baseTime)
	 {
		var tok = baseTime.split(':');
		var minutes = parseInt(tok[1]);
		switch(minutes)
		{
			case 0: return 1;
			case 15 : return 2;
			case 30 : return 3;
			case 45 : return 4;
		
		}
	 }
	 
	 function getTime(baseTime,offset)
	 {
		var tok = baseTime.split(' ');
		var hours = parseInt(tok[0]);
		
		
		if(tok[1]=='pm')
		{
			if(hours!=12)
			{
				hours = hours + 12;
			}
			
		}
		else
		{
			if(hours==12)
			{
				hours=0;
			}
		
		}
		
		
		var minutes = '00';
		var seconds = '00';
		switch(offset)
		{
			case 1: minutes = '00';
					break;
			case 2: minutes = '15';
					break;
			case 3: minutes = '30';
					break;
			case 4:minutes = '45';
					break;
					
		}
		
		return hours+':'+minutes+':'+seconds;
	 
	 }
	 
	 function add15min(time)
	 {
		var tok = time.split(':');
		var hours = parseInt(tok[0]);
		var minutes = parseInt(tok[1]);
		minutes = minutes + 15;
		if(minutes==60)
		{
			hours = hours + 1;
			if(hours == 24)
			{
				return '00:00:00';
			}
			else
			{
				return hours+':00:00';
			}
		}
		else
		{
			return hours+':'+minutes+':00';
		}
	 }
	 
	 
	 
	 function createTimeslot(sTime,eTime,weekDay)
	 {
		var sDate = getDateDatabaseRepresentation(startDate);
		//var timezone = parseFloat(get_timezone_offset());
		/*var current_timezone = get_timezone_offset();
	    if(current_timezone != 'none')
        {
            var v = parseInt(current_timezone.substr(0, 3));
            var m = parseInt(current_timezone.substr(4, 2));
			//alert(v + '  ' + m);
            if(m != 0)
            {
                $("#timezone_picker").val(v+(m / 60.0));
            }
            else
            {
                $("#timezone_picker").val(v+'.0');
				//alert($("#timezone_picker").val());
            }
        }*/
		
		
		//console.log('Booking Slot : ' + sTime + ' - ' + eTime);
		var picker_val = $("#timezone_picker").val().toString();
         var curr_tmzn = '';
        if(picker_val.charAt(0) == '-')
        {
            curr_tmzn = '-';
            picker_val = picker_val.replace('-','');
        }
         var nums = picker_val.split('.');
         if(nums[0].length == 1)
         {
             curr_tmzn += '0';
         }
         curr_tmzn += nums[0];
         curr_tmzn += ':';
         if(nums[1].length == 1)
         {
             curr_tmzn += '0';
         }
         curr_tmzn += nums[1];
		var url = 'createDoctorTimeslot.php?startDate='+sDate+'&startTime='+sTime+'&endTime='+eTime+'&weekday='+weekDay+'&timezone='+curr_tmzn;//current_timezone;
		console.log(url);
        //$.get(url, function(data, status){console.log(data);});
		var RecTipo = LanzaAjax(url);
		//alert(RecTipo);
		
		return parseInt(RecTipo);
		
	 
	 }
	 
	 
	 function getColumnFromId(string)
	 {
		var tok = string.split('_');
		return parseInt(tok[1]);
	 }
	 
	 
	 function getRowFromId(string)
	 {
		var tok = string.split('_');
		return parseInt(tok[0].substr(tok[0].length-1, 1));
	 }
	 
	 
	 function generateID(row,column)
	 {
		return '#tc'+row+'_'+column;
	 }
	 
	 function colorSlot(row,colStart,colEnd,insertid)
	 {
	 
		//console.log('**'+row + '  ' + colStart + '   ' + colEnd + '  ' + insertid )
		var eventID = 'event_'+insertid;
		if(colStart == colEnd)
		{
			var i= colStart;
			var id = generateID(row,i);
				//console.log('coloring' + id);
				
				
				if($(id).children(".timeCellIndicator").children().hasClass('tempSelection'))
				{
					//if the starting block is to be partially coloured
					//alert('starting block partial color');
					
					var s=0;
					var e=0;
					
					
					if($(id).children(".timeCellIndicator").children().first().hasClass('tempSelection') || flag)
					{
						s=1;
						e=1;
					}
					
					if($(id).children(".timeCellIndicator").children().first().next().hasClass('tempSelection') || flag)
					{
						if(s==0)
						{
							s=2;
						}
						e=2;
					}
					
					if($(id).children(".timeCellIndicator").children().last().prev().hasClass('tempSelection') || flag)
					{
						if(s==0)
						{
							s=3;
						}
						e=3;
					}
					
					if($(id).children(".timeCellIndicator").children().last().hasClass('tempSelection') || flag)
					{
						if(s==0)
						{
							s=4;
						}
						e=4;
					}
					//console.log('###s='+s + '  ###e='+e);
					for(var j=1;j<5;++j)
					{
						if(j>=s && j<=e)
						{
							switch(j)
							{
								case 1:	$(id).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
										break;
								case 2:$(id).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
										break;
								case 3:	$(id).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
										break;
								case 4:$(id).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn " + eventID);
										break;
							}
						}
					}
					
					
				}	
			
			
			
			
			
		}
		else
		{
			for(i=colStart;i<colEnd;i++)
			{
				var id = generateID(row,i);
				//console.log('coloring' + id);
				if($(id).children(".timeCellIndicator").children().hasClass('tempSelection'))
				{
					//if the starting block is to be partially coloured
					//alert('starting block partial color');
					var flag=false;
					if($(id).children(".timeCellIndicator").children().first().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().first().removeClass("timeCellIndicatorOff");
					}
					
					if($(id).children(".timeCellIndicator").children().first().next().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().first().next().removeClass("timeCellIndicatorOff");
					}
					
					if($(id).children(".timeCellIndicator").children().last().prev().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().last().prev().removeClass("timeCellIndicatorOff");
					}
					
					if($(id).children(".timeCellIndicator").children().last().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().last().removeClass("timeCellIndicatorOff");
					}
					
					
				}
				else
				{
					//if all four block are to be coloured
					$(id).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
					$(id).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
					$(id).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
					$(id).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn " + eventID);
				}
			}
			
			var id = generateID(row,colEnd);
			if($(id).children(".timeCellIndicator").children().hasClass('tempSelection'))
			{
					//if the last block is to be partially coloured
					var flag=false;
					if($(id).children(".timeCellIndicator").children().last().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().last().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().last().removeClass("timeCellIndicatorOff");
					}
					
					if($(id).children(".timeCellIndicator").children().last().prev().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().last().prev().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().last().prev().removeClass("timeCellIndicatorOff");
					}
					
					if($(id).children(".timeCellIndicator").children().first().next().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().first().next().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().first().next().removeClass("timeCellIndicatorOff");
					}
					
					if($(id).children(".timeCellIndicator").children().first().hasClass('tempSelection') || flag)
					{
						flag=true;
						//$(id).children(".timeCellIndicator").children().removeClass('tempSelection');
						$(id).children(".timeCellIndicator").children().first().attr("class", "timeCellIndicatorOn " + eventID);
						//$(id).children(".timeCellIndicator").children().first().removeClass("timeCellIndicatorOff");
					}
					
					
					
			}
			
			
			
			
		
		}
	 
	 
	 
	 
	 }
	 
	 
	 var DateDiff = {

			inDays: function(d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();

				return parseInt((t2-t1)/(24*3600*1000));
			},

			inWeeks: function(d1, d2) {
				var t2 = d2.getTime();
				var t1 = d1.getTime();

				return parseInt((t2-t1)/(24*3600*1000*7));
			},

			inMonths: function(d1, d2) {
				var d1Y = d1.getFullYear();
				var d2Y = d2.getFullYear();
				var d1M = d1.getMonth();
				var d2M = d2.getMonth();

				return (d2M+12*d2Y)-(d1M+12*d1Y);
			},

			inYears: function(d1, d2) {
				return d2.getFullYear()-d1.getFullYear();
			}
		}
	 
	 
 function updateGroupInfo() {
	  var grpname=$('#editgrpname').val();
	  var grpadd=$('#editgrpadd').val();
	  var grpzip=$('#editgrpzip').val();
	  var grpcity=$('#editgrpcity').val();
	  var grpstate=$('#editgrpstate').val();
	  var grpcountry=$('#editgrpcountry').val();
	  
	  group_dialog.dialog("close"); if(grpname==''||grpadd==''||grpzip==''||grpcity==''||grpstate==''||grpcountry==''){
			alert('Empty field not allowed');
	  }else{
	  
	    var cadena='SaveGroup.php?grpname='+grpname+'&grpadd='+grpadd+'&grpzip='+grpzip+'&grpcity='+grpcity+'&grpstate='+grpstate+'&grpcountry='+grpcountry+'&groupid='+groupid;
		var RecTipo=LanzaAjax(cadena);
		
		if(RecTipo==1){
				//alert('Group Created!');
				var grptble = LanzaAjax('getGroupDetails.php?docid='+med_id+'');	
				$('#group_details').html(grptble);
		}
		
		$("#editgrpname").attr("disabled", "disabled");
		$('#editgrpadd').attr("disabled", "disabled");
		$('#editgrpzip').attr("disabled", "disabled");
		$('#editgrpcity').attr("disabled", "disabled");
		$('#editgrpstate').attr("disabled", "disabled");
		$('#editgrpcountry').attr("disabled", "disabled");	
		$('#filesToUpload').attr("disabled", "disabled");

		$('#save_grpdate').hide();
		  
		
	  
	  }
	  
	  grpname='';
	  grpadd='';
	  grpzip='';
	  grpcity='';
	  grpstate='';
	  grpcountry=''; 
 }
