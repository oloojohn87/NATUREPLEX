$(document).ready(function() {  
	var session_userid = $("#USERID").val();

		///WORKS ABOVE
    $('#LoadCanvas1').css('display','none');
    $('#LoadCanvas2').css('display','none');
	$.getScript("js/h2m_info_utils.js", function(){
			LoadDonuts(session_userid);  
			$('#PHSLabel').trigger('click');
	});
	
});

var session_userid = $("#USERID").val();
var session_medid = $("#MEDID").val();
var domain = $("#DOMAIN").val();
    $('#myCanvas,#ALTCanvas1').live('click',function(){
		var myClass = $('#USERID').val();
        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" scrolling="no" style="width:1000px;height:690px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true});
		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});

	//edit patient button
    $('#editPatient').live('click',function(){
        var userID = $('#USERID').val();
		window.location.replace('patientdetailMED-new.php?IdUsu='+userID); // Changed the url value from patientdetailMED-newUSER.php to patientdetailMED-new.php
    });        
        
		$('#ButtonReview').live('click',function(){
		var myClass = $('#USERID').val();

        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true}).onclose(function(data,success)
           {
             $.post("SavePatientSummaryAsPDF.php",{IdUsu: session_userid},function(data,success)
               {
              });
           
           }); // Onclosing of the dialog frame the patient updated data is database and a pdf is generated

		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});

		
	
	
	$('#myCanvas').mousemove(function(e) {
	    var pos = findPos(this);
	    var x = e.pageX - pos.x;
	    var y = e.pageY - pos.y;
	    var coord = "x=" + x + ", y=" + y;
	    var c = this.getContext('2d');
	    var p = c.getImageData(x, y, 1, 1).data; 
	    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	    $('#status').html(coord + "<br>" + hex + " - ");
	});

	$('#myCanvas2').live('click',function(){
		var myClass = $('#USERID').val();
		window.location.replace('patientdetailMED-new.php?IdUsu='+myClass);
	});
$(window).bind('load', function(){
        $('#newinbox').trigger('click');
    });
 
	$('#BotMessages').live('click',function(){
        $('#compose_message').trigger('click');
	});
	
	$('#newinbox').live('click',function(){
       //alert('trigger');
	   var queUrl = domain+'/getInboxMessageUSER.php?IdMED='+session_medid+'&patient='+session_userid;
	   //alert (queUrl);
       $('#datatable_3').load(queUrl);
	   $('#datatable_3').trigger('update');
           
   });
   
    $('#newoutbox').live('click',function(){
      //alert('trigger');
	   var queUrl ='<?php echo $domain;?>/getOutboxMessageUSER.php?IdMED=<?php echo $MEDID;?>&patient='+session_userid;
	   $('#datatable_4').load(queUrl);
	   $('#datatable_4').trigger('update');
           
   });
    
    $('#SearchDirectory').live('click', function()
    {		
		var Codes = GetICD10Code('Append');
		var longit = Object.keys(Codes).length;	   	   
		//alert ('Retrieved '+longit+' items. Example at [0].description: '+Codes[0].description);
		
	});
    $("#setup_phone").intlTelInput();
    $.post("get_user_info.php", {id: $("#USERID").val()}, function(data, status)
    {
        var info = JSON.parse(data);
        $("#timezone_picker option[value='" + info['timezone'] + "']").attr('selected', 'selected');
        if(info.hasOwnProperty('location') && info['location'].length > 0)
        {
            setTimeout(function(){
                $("#country_setup").val(info['location']);
                $("#country_setup").change();
            }, 800);
        }
        if(info.hasOwnProperty('location2') && info['location2'].length > 0)
        {
            setTimeout(function(){
                $("#state_setup").val(info['location2']);
                $("#state_setup").change();
            }, 900);
        }
        if(info.hasOwnProperty('email') && info['email'].length > 0)
        {
            $("#setup_email").val(info['email']);
        }
        if(info.hasOwnProperty('phone') && info['phone'].length > 0)
        {
            $("#setup_phone").val("+" + info['phone']);
        }
    });
    
    $('#timezone_picker').on('change', function()
    {
        console.log('clicked');
    });
	$('#MedHistory').live('click',function(){
		var myClass = $('#USERID').val();	
        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true});
		
	});    
	

	/***********************TALK****************************/
	/*******************************************************/
	/*******************************************************/
$('#Talk').live('click', function()
    {	
        doctor_to_connect = '';
        type_of_doctor_to_find = '';
        $('.recent_doctor_button_selected').attr("class", "recent_doctor_button");
        $("#Talk_Section_1").css("display", "block");
        $("#Talk_Section_2").css("display", "none");
        $("#Talk_Section_3").css("display", "none");
        $("#Talk_Section_4").css("display", "none");
        /*var h = ($("#recent_doctors").children().length - 1) * 35;
        for(var k = 0; k < $("#recent_doctors").children().length; k++)
        {
            if(k == 0 && $("#recent_doctors").children().length == 1)
            {
                $("#recent_doctors").children().eq(k).css("border-top-left-radius", "");
                $("#recent_doctors").children().eq(k).css("border-top-right-radius", "");
                $("#recent_doctors").children().eq(k).css("border-bottom-left-radius", "");
                $("#recent_doctors").children().eq(k).css("border-bottom-right-radius", "");
                $("#recent_doctors").children().eq(k).css("border-radius", "10px");
            }
            else if(k == 0 && $("#recent_doctors").children().length > 1)
            {
                $("#recent_doctors").children().eq(k).css("border-radius", "");
                $("#recent_doctors").children().eq(k).css("border-top-left-radius", "10px");
                $("#recent_doctors").children().eq(k).css("border-top-right-radius", "10px");
                $("#recent_doctors").children().eq(k).css("border-bottom-left-radius", "0px");
                $("#recent_doctors").children().eq(k).css("border-bottom-right-radius", "0px");
            }
            else if(k > 0 && k < $("#recent_doctors").children().length - 1)
            {
                $("#recent_doctors").children().eq(k).css("border-radius", "");
                $("#recent_doctors").children().eq(k).css("border-top-left-radius", "");
                $("#recent_doctors").children().eq(k).css("border-top-right-radius", "");
                $("#recent_doctors").children().eq(k).css("border-bottom-left-radius", "");
                $("#recent_doctors").children().eq(k).css("border-bottom-right-radius", "");
            }
            else if(k == $("#recent_doctors").children().length - 1)
            {
                $("#recent_doctors").children().eq(k).css("border-radius", "");
                $("#recent_doctors").children().eq(k).css("border-top-left-radius", "");
                $("#recent_doctors").children().eq(k).css("border-top-right-radius", "");
                $("#recent_doctors").children().eq(k).css("border-bottom-left-radius", "10px");
                $("#recent_doctors").children().eq(k).css("border-bottom-right-radius", "10px");
            }
        }
        $("#recent_doctors_section").css("display", "block");
        if($("#recent_doctors").children().length == 0)
        {
            h = -90;
            $("#recent_doctors_section").css("display", "none");
        }*/
        $("#find_doctor_modal").dialog({bgiframe: true, width: 550, height: 413, resize: false, modal: true});
        $("#step_bar_1").attr("class", "step_bar");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle");
        $("#step_bar_2").attr("class", "step_bar");
        $("#step_circle_3").attr("class", "step_circle");
        $("#step_bar_3").attr("class", "step_bar");
        $("#step_circle_4").attr("class", "step_circle");
        $("#step_bar_4").attr("class", "step_bar");
        $("#step_circle_5").attr("class", "step_circle");
        $("#step_bar_5").attr("class", "step_bar");
        $("#step_circle_6").attr("class", "step_circle");
        $("#find_doctor_label").text("");
        $("#find_doctor_next_button").css("display", "block");
        $("#find_doctor_previous_button").css("display", "block");
        $("#find_doctor_cancel_button").css("display", "block");
        $("#find_doctor_close_button").css("display", "none");
        $('#find_doctor_my_doctors_1').css("display", "none");
        $('#find_doctor_my_doctors_2').css("display", "none");
        $('#find_doctor_appointment_1').css("display", "none");
        $('#find_doctor_appointment_2').css("display", "none");
        $('#find_doctor_appointment_3').css("display", "none");
        $('#find_doctor_time').css("display", "none");
        $('#find_doctor_receipt').css("display", "none");
        $('#find_doctor_confirmation').css("display", "none");
        $('#time_selector_1').css("display", "none");
        $('#day_selector_1').css("display", "none");
        $('#find_doctor_main').css("display", "block");
        find_doctor_page = 0;
        
    });
        
    function getDay(i)
    {
        if(i == 1)
        {
            return "Sunday";
        }
        else if(i == 2)
        {
            return "Monday";
        }
        else if(i == 3)
        {
            return "Tuesday";
        }
        else if(i == 4)
        {
            return "Wednesday";
        }
        else if(i == 5)
        {
            return "Thursday";
        }
        else if(i == 6)
        {
            return "Friday";
        }
        else if(i == 7)
        {
            return "Saturday";
        }
    }
    function getSlot(i)
    {
        if(i == 1)
        {
            return "8:00 AM and 10:00 AM";
        }
        else if(i == 2)
        {
            return "10:00 AM and 12:00 PM";
        }
        else if(i == 3)
        {
            return "12:00 PM and 2:00 PM";
        }
        else if(i == 4)
        {
            return "2:00 PM and 4:00 PM";
        }
        else if(i == 5)
        {
            return "4:00 PM and 6:00 PM";
        }
        else if(i == 6)
        {
            return "6:00 PM and 8:00 PM";
        }
        else if(i == 7)
        {
            return "8:00 PM and 10:00 PM";
        }
    }
    function getSlotStartTime(i)
    {
        if(i == 1)
        {
            return "08:00:00";
        }
        else if(i == 2)
        {
            return "10:00:00";
        }
        else if(i == 3)
        {
            return "12:00:00";
        }
        else if(i == 4)
        {
            return "14:00:00";
        }
        else if(i == 5)
        {
            return "16:00:00";
        }
        else if(i == 6)
        {
            return "18:00:00";
        }
        else if(i == 7)
        {
            return "20:00:00";
        }
    }
    function getSlotEndTime(i)
    {
        if(i == 1)
        {
            return "10:00:00";
        }
        else if(i == 2)
        {
            return "12:00:00";
        }
        else if(i == 3)
        {
            return "14:00:00";
        }
        else if(i == 4)
        {
            return "16:00:00";
        }
        else if(i == 5)
        {
            return "18:00:00";
        }
        else if(i == 6)
        {
            return "20:00:00";
        }
        else if(i == 7)
        {
            return "22:00:00";
        }
    }
    function resetDateTimeSelector()
    {
        $("#sun").removeClass("day_selected");
        $("#mon").removeClass("day_selected");
        $("#tues").removeClass("day_selected");
        $("#wed").removeClass("day_selected");
        $("#thur").removeClass("day_selected");
        $("#fri").removeClass("day_selected");
        $("#sat").removeClass("day_selected");

        $("#8_10_am").removeClass("slot_selected");
        $("#10_12").removeClass("slot_selected");
        $("#12_2").removeClass("slot_selected");
        $("#2_4").removeClass("slot_selected");
        $("#4_6").removeClass("slot_selected");
        $("#6_8").removeClass("slot_selected");
        $("#8_10_pm").removeClass("slot_selected");
        
        time_selected = -1;
        day_selected= -1;
        date_selected = '';
        $("#day_selector_1").css("display", "none");
        $("#time_selector_1").css("display", "none");
    }
    $("#find_doctor_next_button").live('click', function()
    {
        console.log(find_doctor_page);
        // commented out to skip step 2 for Llama al Doctor
        /*if(find_doctor_page == 30 || find_doctor_page == 10) 
        {
            if($("#country").val() != "-1" && $("#country").val().length > 0)
            {
                if(find_doctor_page == 30)
                {
                    find_doctor_page = 31;
                }
                else
                {
                    find_doctor_page = 11;
                }
                $("#find_doctor_appointment_1").fadeOut(300, function(){$("#find_doctor_appointment_2").fadeIn(300)});
                
                $("#step_bar_1").attr("class", "step_bar lit");
                $("#step_circle_1").attr("class", "step_circle lit");
                $("#step_circle_2").attr("class", "step_circle lit");
                $("#step_bar_2").attr("class", "step_bar lit");
                $("#step_circle_3").attr("class", "step_circle lit");
                $("#find_doctor_label").text("Select Speciality");
            }
        }
        else */if(find_doctor_page == 30 || find_doctor_page == 21 || find_doctor_page == 10)
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#find_doctor_label").text("Select Time");
            if(find_doctor_page == 30 || find_doctor_page == 10)
            {
                
                // find a doctor
                if(find_doctor_page == 10 || find_doctor_page == 30)
                {
                    var speciality = "General Practice";
                    if(find_doctor_page != 10 && find_doctor_page != 30 && $("#speciality").val() != null)
                    {
                        speciality = $("#speciality").val();
                    }
                    var loc_1 = $("#country").val();
                    var loc_2 = '';
                    if($("#state").val().length > 0 && $("#state").val() != '-1')
                    {
                        loc_2 = $("#state").val() + ", " + $("#country").val();
                    }
                    var mba = true;
                    if(find_doctor_page == 31)
                    {
                        mba = false;
                    }
                    $.post("find_doctor.php", {type: speciality, location_1: loc_1, location_2: loc_2, must_be_available: mba}, function(data, status)
                    {
                        if(data != 'none')
                        {
                            var info = JSON.parse(data);
                            selected_doctor_info = "recdoc_"+info['id']+"_"+info['phone']+"_"+info['name']+"_"+info['location'];
                            console.log(selected_doctor_info);
                            $.post("getDoctorAvailableTimeranges.php", {id: info['id']}, function(data2, status)
                            {
                                console.log(data2);
                                var info = JSON.parse(data2);
                                for(var i = 0; i < 7; i++)
                                {
                                    if(info['slots'][i].length == 0)
                                    {
                                        $("#"+getDayStr(i)).addClass("day_disabled");
                                        $("#"+getDayStr(i)).children("input").eq(1).val("[]");
                                        $("#"+getDayStr(i)).children("input").eq(2).val("");
                                    }
                                    else
                                    {
                                        $("#"+getDayStr(i)).removeClass("day_disabled");
                                        $("#"+getDayStr(i)).children("input").eq(1).val("["+info['slots'][i].toString()+"]");
                                        $("#"+getDayStr(i)).children("input").eq(2).val("["+info['zones'][i].toString()+"]");
                                    }
                                }
                                if(find_doctor_page == 30)
                                {
                                    find_doctor_page = 32;
                                    resetDateTimeSelector();
                                    $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
                                }
                                else
                                {
                                    find_doctor_page = 12;
                                    var info = selected_doctor_info.split("_");
                                    var html = '<ul style="color: #22AEFF; margin-top: 50px; margin-left: 120px;"><li style="text-align: left;">Receipt: <strong>HTI - CR102388</strong></li><li style="text-align: left;"><strong>';
                                    if(consultation_type == 1)
                                    {
                                        html += 'Video ';
                                    }
                                    else
                                    {
                                        html += 'Phone ';
                                    }
                                    html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">starting <strong>NOW</strong></li></ul></div>';
                                    $("#find_doctor_receipt").html(html);
                                    $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed and will start IMMEDIATELY.</strong></p></div>');
                                    $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
                                    $("#step_bar_4").attr("class", "step_bar lit");
                                    $("#step_circle_5").attr("class", "step_circle lit");
                                    $("#find_doctor_label").text("Confirmation");
                                }
                            });
                        }
                        else
                        {
                            // tell user the doctor could not be found in their area
                            if(find_doctor_page == 31)
                            {
                                find_doctor_page = 35;
                            }
                            else
                            {
                                find_doctor_page = 15;
                            }
							if(language == 'th'){
							translation = 'Lo siento, no hemos podido encontrar ning√∫n</br>m√©dico general en tu area.';
							}else if(language == 'en'){
							translation = "Sorry, we could not find any<br/>general practicioners in your area.";
							}
                            $("#not_found_text").html(translation);
                            $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_appointment_3').fadeIn(300, function(){$("#find_doctor_next_button").css("display", "none");})}); 
                            $("#step_bar_3").attr("class", "step_bar");
                            $("#step_circle_4").attr("class", "step_circle");
							if(language == 'th'){
							translation = 'Seleccionar Especialidad';
							}else if(language == 'en'){
							translation = 'Select Speciality';
							}
                            $("#find_doctor_label").text(translation);
                        }
                    });
                }
                else
                {
                    $("#step_bar_3").attr("class", "step_bar");
                    $("#step_circle_4").attr("class", "step_circle");
						if(language == 'th'){
				        translation = 'Seleccionar Especialidad';
						}else if(language == 'en'){
						translation = 'Select Speciality';
						}
                    $("#find_doctor_label").text(translation);
                }
                
            }
            if(find_doctor_page == 21)
            {
                if(selected_doctor_available == 0)
                {
                    
                    if($('#in_location_checkbox').is(":checked"))
                    {
                        find_doctor_page = 22;
                        resetDateTimeSelector();
                        $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
                    }
                    else
                    {
                        $("#step_bar_3").attr("class", "step_bar");
                        $("#step_circle_4").attr("class", "step_circle");
						if(language == 'th'){
						translation = 'Seleccionar Tipo';
						}else if(language == 'en'){
						translation = 'Select Type';
						}
                        $("#find_doctor_label").text(translation);
                    }
                }
                else
                {
                    
                    if($('#in_location_checkbox').is(":checked"))
                    {
                        find_doctor_page = 25;
                        $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_my_doctors_3').fadeIn(300)});
                    }
                    else
                    {
                        $("#step_bar_3").attr("class", "step_bar");
                        $("#step_circle_4").attr("class", "step_circle");
						if(language == 'th'){
						translation = 'Seleccionar Tipo';
						}else if(language == 'en'){
						translation = 'Select Type';
						}
                        $("#find_doctor_label").text(translation);
                    }
                }
            }
        }
        else if(find_doctor_page == 32 || find_doctor_page == 22)
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar lit");
            $("#step_circle_5").attr("class", "step_circle lit");
            $("#find_doctor_label").text("Confirmation");
            if(find_doctor_page == 32)
            {
                var info = selected_doctor_info.split("_");
                var html = '<ul style="color: #22AEFF; margin-top: 50px; margin-left: 120px;"><li style="text-align: left;">Receipt: <strong>HTI - CR102388</strong></li><li style="text-align: left;"><strong>';
                if(consultation_type == 1)
                {
                    html += 'Video ';
                }
                else
                {
                    html += 'Phone ';
                }
                html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">next <strong>'+getDay(day_selected)+'</strong> between <strong>'+getSlot(time_selected)+'</strong></li></ul></div>';
                $("#find_doctor_receipt").html(html);
                $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed.</strong><br/>Please be ready at the selected day and time, and follow the instructions that we sent to you</p></div>');
                find_doctor_page = 33;
                $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
            }
            else if(find_doctor_page == 22 && time_selected != -1 && day_selected != -1)
            {
                find_doctor_page = 23;
                var info = selected_doctor_info.split("_");
                var html = '<ul style="color: #22AEFF; margin-top: 50px; margin-left: 120px;"><li style="text-align: left;">Receipt: <strong>HTI - CR102388</strong></li><li style="text-align: left;"><strong>';
                if(consultation_type == 1)
                {
                    html += 'Video ';
                }
                else
                {
                    html += 'Phone ';
                }
                html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">next <strong>'+getDay(day_selected)+'</strong> between <strong>'+getSlot(time_selected)+'</strong></li></ul></div>';
                $("#find_doctor_receipt").html(html);
                $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed.</strong><br/>Please be ready at the selected day and time, and follow the instructions that we sent to you</p></div>');
                $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
            }
            else
            {
                $("#step_bar_4").attr("class", "step_bar");
                $("#step_circle_5").attr("class", "step_circle");
                $("#find_doctor_label").text("Select Time");
            }
            
        }
        else if(find_doctor_page == 33 || find_doctor_page == 23 || find_doctor_page == 26 || find_doctor_page == 12)
        {
            if(find_doctor_page == 33)
            {
                find_doctor_page = 34;
                var info = selected_doctor_info.split("_");
                console.log(date_selected);
                var type = 1;
                if(consultation_type != 1)
                {
                    type = 0;
                }
                $.post("add_appointment.php", {medid: info[1], patid: $("#USERID").val(), date: date_selected, start_time: getSlotStartTime(time_selected), end_time: getSlotEndTime(time_selected), video: type, timezone: selected_timezone}, function(data,status)
                {
                    if(data != '-1')
                    {
                        $.get("send_appointment_email.php?id="+data+"&type=patient", function(data, status)
                        {
                            $.get("send_appointment_email.php?id="+data+"&type=doctor", function(data, status){});
                        });
                    }
                });
            }
            if(find_doctor_page == 23)
            {
                find_doctor_page = 24;
                var info = selected_doctor_info.split("_");
                console.log(date_selected);
                var type = 1;
                if(consultation_type != 1)
                {
                    type = 0;
                }
                $.post("add_appointment.php", {medid: info[1], patid: $("#USERID").val(), date: date_selected, start_time: getSlotStartTime(time_selected), end_time: getSlotEndTime(time_selected), video: type, timezone: selected_timezone}, function(data,status)
                {
                    if(data != '-1')
                    {
                        $.get("send_appointment_email.php?id="+data+"&type=patient", function(data, status)
                        {
                            $.get("send_appointment_email.php?id="+data+"&type=doctor", function(data, status){});
                        });
                    }
                });
            }
            if(find_doctor_page == 26 || find_doctor_page == 12)
            {
                if(find_doctor_page == 26)
                {
                    find_doctor_page = 27;
                }
                else
                {
                    find_doctor_page = 13;
                }
                
                // start appointment now with selected doctor
                var info = selected_doctor_info.split("_");
                
                // NO VIDEO FOR HTI USERS
                /*if(consultation_type == 1)
                {
                    
                    $.post("start_telemed_videocall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[2], doc_id: info[1], pat_id: $("#USERID").val(), doc_name: (info[3] + ' ' + info[4]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status)
                    {
                        if(data == 1)
                        {
                            
                            window.open("telemedicine_patient.php?MED=" + info[1] + "&PAT=" + $("#USERID").val(),"Telemedicine","height=650,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
                        }
                        else
                        {
                            alert("There was an error. Please try again later");
                        }
                    });
                }
                else
                {*/
                    $.post("start_telemed_phonecall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[2], doc_id: info[1], pat_id: $("#USERID").val(), doc_name: (info[3] + ' ' + info[4]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status){console.log(data);});
                //}
            }
            $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_confirmation').fadeIn(300)});
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar lit");
            $("#step_circle_5").attr("class", "step_circle lit");
            $("#step_bar_5").attr("class", "step_bar lit");
            $("#step_circle_6").attr("class", "step_circle lit");
            $("#find_doctor_label").text("");
            $("#find_doctor_next_button").css("display", "none");
            $("#find_doctor_previous_button").css("display", "none");
            $("#find_doctor_cancel_button").css("display", "none");
            $("#find_doctor_close_button").css("display", "block");
        }
    });
    $("#find_doctor_previous_button").live('click', function()
    {
        if(find_doctor_page == 23 || find_doctor_page == 33)
        {
            if(find_doctor_page == 23)
            {
                find_doctor_page = 22;
            }
            else if(find_doctor_page == 33)
            {
                find_doctor_page = 32;
            }
            resetDateTimeSelector();
            $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
            $("#find_doctor_label").text("Select Time");
        }
        else if(find_doctor_page == 22 || find_doctor_page == 32 || find_doctor_page == 12)
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
			if(language == 'th'){
			translation = 'Seleccionar Tipo';
			}else if(language == 'en'){
			translation = 'Select Type';
			}
            $("#find_doctor_label").text(translation);
            if(find_doctor_page == 22)
            {
                if(selected_doctor_available == 0)
                {
                    find_doctor_page = 21;
                    $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_my_doctors_2').fadeIn(300)});
                }
                else
                {
                    find_doctor_page = 25;
                    $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_my_doctors_3').fadeIn(300)});
                    $("#find_doctor_label").text("Select Time");
                    $("#step_bar_3").attr("class", "step_bar lit");
                    $("#step_circle_4").attr("class", "step_circle lit");
                }
                
            }
            
            else if(find_doctor_page == 32 || find_doctor_page == 12)
            {
                if(find_doctor_page == 32)
                {
                    find_doctor_page = 30;
                    $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
					if(language == 'th'){
					translation = 'Seleccionar Tipo';
					}else if(language == 'en'){
					translation = 'Select Type';
					}
                    $("#find_doctor_label").text(translation);
                    $("#step_bar_2").attr("class", "step_bar");
                    $("#step_circle_3").attr("class", "step_circle");
                }
                else
                {
                    find_doctor_page = 10;
                    $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
					if(language == 'th'){
					translation = 'Seleccionar Tipo';
					}else if(language == 'en'){
					translation = 'Select Type';
					}
                    $("#find_doctor_label").text(translation);
                    $("#step_bar_2").attr("class", "step_bar");
                    $("#step_circle_3").attr("class", "step_circle");
                }
            }
        }
        else if(find_doctor_page == 21 || find_doctor_page == 31 || find_doctor_page == 11)
        {
            if(find_doctor_page == 21)
            {
                $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_my_doctors_1').fadeIn(300)});
                find_doctor_page = 20;
                $("#find_doctor_label").text("Select Doctor");
                
            }
            else if(find_doctor_page == 31)
            {
                find_doctor_page = 30;
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
				if(language == 'th'){
				translation = 'Seleccionar Tipo';
				}else if(language == 'en'){
				translation = 'Select Type';
				}
                $("#find_doctor_label").text(translation);
            }
            else
            {
                find_doctor_page = 10;
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
				if(language == 'th'){
				translation = 'Seleccionar Tipo';
				}else if(language == 'en'){
				translation = 'Select Type';
				}
                $("#find_doctor_label").text(translation);
            }
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar");
            $("#step_circle_3").attr("class", "step_circle");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
        }
        else if(find_doctor_page == 20 || find_doctor_page == 30 || find_doctor_page == 10)
        {
            if(find_doctor_page == 20)
            {
                $('#find_doctor_my_doctors_1').fadeOut(300, function(){$('#find_doctor_main').fadeIn(300)});
            }
            else if(find_doctor_page == 30 || find_doctor_page == 10)
            {
                $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_main').fadeIn(300)});
            }
            find_doctor_page = 0;
            $("#step_bar_1").attr("class", "step_bar");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle");
            $("#step_bar_2").attr("class", "step_bar");
            $("#step_circle_3").attr("class", "step_circle");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
            $("#find_doctor_label").text("");
        }
        else if(find_doctor_page == 25)
        {
            $('#find_doctor_my_doctors_3').fadeOut(300, function(){$('#find_doctor_my_doctors_2').fadeIn(300)});
            find_doctor_page = 21;
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
			if(language == 'th'){
			translation = 'Seleccionar Tipo';
			}else if(language == 'en'){
			translation = 'Select Type';
			}
            $("#find_doctor_label").text(translation);
        }
        else if(find_doctor_page == 26)
        {
            $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_my_doctors_3').fadeIn(300)});
            find_doctor_page = 25;
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
            $("#find_doctor_label").text("Select Time");
        }
        else if(find_doctor_page == 35)
        {
            $('#find_doctor_appointment_3').fadeOut(300, function(){$('#find_doctor_appointment_2').fadeIn(300)});
            find_doctor_page = 31;
            $("#find_doctor_next_button").css("display", "block");
        }
        else if(find_doctor_page == 15)
        {
            $('#find_doctor_appointment_3').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
            find_doctor_page = 10;
            $("#find_doctor_next_button").css("display", "block");
        }
    });
    $("#find_doctor_cancel_button").live('click', function()
    {
        $("#find_doctor_modal").dialog("close");
    });
    $("#find_doctor_close_button").live('click', function()
    {
        $("#find_doctor_modal").dialog("close");
    });
    $("#find_doctor_now_button").live('click',function()
    {
        // GEOLOCATION
        //alert("Your location is: " + geoplugin_countryName() + ", " + geoplugin_region() + ", " + geoplugin_city());
        var country = geoplugin_countryName();
        if (country == "United States") {
            country = "USA";
        }    
		$("#country").val(country);	
	    $("#country").change();
        
        if(country== 'USA')
        {
            $("#state").parent().parent().css('display', 'block');
        }
        else
        {
            $("#state").parent().parent().css('display', 'none');
        }
	    //populateCountries("country", "state");
	    var zone = geoplugin_region();
	    var district = geoplugin_city();
		$("#state").val(district);			 
	    $("#state").change();
        // GEOLOCATION
    
        if(!$(this).hasClass("square_blue_button_disabled"))
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_appointment_1").fadeIn(300)});
            find_doctor_page = 10;
			if(language == 'th'){
			translation = 'Seleccionar Tipo';
			}else if(language == 'en'){
			translation = 'Select Type';
		}
            $("#find_doctor_label").text(translation);
        }
    });
    $("#find_doctor_appointment_button").live('click',function()
    {
        // GEOLOCATION
        //alert("Your location is: " + geoplugin_countryName() + ", " + geoplugin_region() + ", " + geoplugin_city());
        var country = geoplugin_countryName();
        if (country == "United States") {
            country = "USA";
        }    
		$("#country").val(country);	
	    $("#country").change();
        if(country== 'USA')
        {
            $("#state").parent().parent().css('display', 'block');
        }
        else
        {
            $("#state").parent().parent().css('display', 'none');
        }
	    //populateCountries("country", "state");
	    var zone = geoplugin_region();
	    var district = geoplugin_city();
		$("#state").val(district);			 
	    $("#state").change();
        // 

        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_appointment_1").fadeIn(300)});
        find_doctor_page = 30;
		if(language == 'th'){
		translation = 'Seleccionar Tipo';
		}else if(language == 'en'){
		translation = 'Select Type';
		}
        $("#find_doctor_label").text(translation);
    });
    $("#find_doctor_my_doctors_button").live('click',function()
    {
        if(!$(this).hasClass("square_blue_button_disabled"))
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_my_doctors_1").fadeIn(300)});
            find_doctor_page = 20;
            $("#find_doctor_label").text("Select Doctor");
        }
    });
    function getDayStr(i)
    {
        if(i == 0)
        {
            return "sun";
        }
        else if(i == 1)
        {
            return "mon";
        }
        else if(i == 2)
        {
            return "tues";
        }
        else if(i == 3)
        {
            return "wed";
        }
        else if(i == 4)
        {
            return "thur";
        }
        else if(i == 5)
        {
            return "fri";
        }
        else if(i == 6)
        {
            return "sat";
        }
    }
    $("[id^='recdoc_']").live('click', function()
    {
        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#step_bar_2").attr("class", "step_bar lit");
        $("#step_circle_3").attr("class", "step_circle lit");
        $("#find_doctor_my_doctors_1").fadeOut(300, function(){$("#find_doctor_my_doctors_2").fadeIn(300)});
        find_doctor_page = 21;
        if($(this).attr("id").search("Available") != -1)
        {
            selected_doctor_available = 1;
        }
        else
        {
            selected_doctor_available = 0;
        }
		var translation = '';
		
		
		if(language == 'th'){
		translation = 'Seleccionar Tipo';
		}else if(language == 'en'){
		translation = 'Select Type';
		}
        $("#find_doctor_label").text(translation);
        var info = $(this).attr("id").split("_");
        selected_doctor_info = $(this).attr("id");
        $("#doctor_location_text").html("Doctor " + info[3] + " " + info[4] + " is in <strong>" + info[5] + "</strong>.<br/>Please confirm that you are in <strong>" + info[5] + "</strong> as well.");
        $("#doctor_oncall_text").html("Doctor " + info[3] + " " + info[4] + " is ON CALL NOW!<br/>Would you like to connect now?");
        $.post("getDoctorAvailableTimeranges.php", {id: info[1]}, function(data, status)
        {
            var info = JSON.parse(data);
            for(var i = 0; i < 7; i++)
            {
                if(info['slots'][i].length == 0)
                {
                    $("#"+getDayStr(i)).addClass("day_disabled");
                    $("#"+getDayStr(i)).children("input").eq(1).val("[]");
                    $("#"+getDayStr(i)).children("input").eq(2).val("");
                }
                else
                {
                    $("#"+getDayStr(i)).removeClass("day_disabled");
                    $("#"+getDayStr(i)).children("input").eq(1).val("["+info['slots'][i].toString()+"]");
                    $("#"+getDayStr(i)).children("input").eq(2).val("["+info['zones'][i].toString()+"]");
                }
            }
        });
    });
    $("#find_doctor_video_button").live('click', function()
    {
        $("#find_doctor_video_button").css('background-color', '#22aeff');
        $("#find_doctor_phone_button").css('background-color', '#535353');
        consultation_type = 1;
    });
    $("#find_doctor_phone_button").live('click', function()
    {
        $("#find_doctor_phone_button").css('background-color', '#22aeff');
        $("#find_doctor_video_button").css('background-color', '#535353');
        consultation_type = 2;
    });
    $("#find_doctor_video_button_2").live('click', function()
    {
        $("#find_doctor_video_button_2").css('background-color', '#22aeff');
        $("#find_doctor_phone_button_2").css('background-color', '#535353');
        consultation_type = 1;
    });
    $("#find_doctor_phone_button_2").live('click', function()
    {
        $("#find_doctor_phone_button_2").css('background-color', '#22aeff');
        $("#find_doctor_video_button_2").css('background-color', '#535353');
        consultation_type = 2;
    });
    $("#connect_now_yes").live('click', function()
    {
        find_doctor_page = 26;
        $('#find_doctor_my_doctors_3').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#step_bar_2").attr("class", "step_bar lit");
        $("#step_circle_3").attr("class", "step_circle lit");
        $("#step_bar_3").attr("class", "step_bar lit");
        $("#step_circle_4").attr("class", "step_circle lit");
        $("#step_bar_4").attr("class", "step_bar lit");
        $("#step_circle_5").attr("class", "step_circle lit");
        $("#find_doctor_label").text("Confirmation");
        var info = selected_doctor_info.split("_");
        var html = '<ul style="color: #22AEFF; margin-top: 50px; margin-left: 120px;"><li style="text-align: left;">Receipt: <strong>HTI - CR102388</strong></li><li style="text-align: left;"><strong>';
        console.log($("#find_doctor_video_button_2").css("background-color"));
        if(consultation_type == 1)
        {
            html += 'Video ';
        }
        else
        {
            html += 'Phone ';
        }
        html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">starting <strong>NOW</strong></li></ul></div>';
        $("#find_doctor_receipt").html(html);
        $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed<br/> and will start IMMEDIATELY.</strong></p></div>');
        
    });
    $("#connect_now_no").live('click', function()
    {
        find_doctor_page = 22;
        resetDateTimeSelector();
        $('#find_doctor_my_doctors_3').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#step_bar_2").attr("class", "step_bar lit");
        $("#step_circle_3").attr("class", "step_circle lit");
        $("#step_bar_3").attr("class", "step_bar lit");
        $("#step_circle_4").attr("class", "step_circle lit");
        $("#find_doctor_label").text("Select Time");
    });
        
    $("#find_doctor_general_practicioner").live('click', function()
    {
        var loc_1 = $("#country").val();
        var loc_2 = '';
        if($("#state").val().length > 0 && $("#state").val() != '-1')
        {
            loc_2 = $("#state").val() + ", " + $("#country").val();
        }
        var mba = true;
        if(find_doctor_page == 31)
        {
            mba = false;
        }
        console.log(loc_1+" "+loc_2+" "+mba);
        $.post("find_doctor.php", {type: "General Practice", location_1: loc_1, location_2: loc_2, must_be_available: mba}, function(data, status)
        {
            
            
            if(data != 'none')
            {
                var info = JSON.parse(data);
                selected_doctor_info = "recdoc_"+info['id']+"_"+info['phone']+"_"+info['name']+"_"+info['location'];
                console.log(selected_doctor_info);
                $.post("getDoctorAvailableTimeranges.php", {id: info['id']}, function(data, status)
                {
                    console.log(data);
                    var info = JSON.parse(data);
                    for(var i = 0; i < 7; i++)
                    {
                        if(info['slots'][i].length == 0)
                        {
                            $("#"+getDayStr(i)).addClass("day_disabled");
                            $("#"+getDayStr(i)).children("input").eq(1).val("[]");
                            $("#"+getDayStr(i)).children("input").eq(2).val("");
                        }
                        else
                        {
                            $("#"+getDayStr(i)).removeClass("day_disabled");
                            $("#"+getDayStr(i)).children("input").eq(1).val("["+info['slots'][i].toString()+"]");
                            $("#"+getDayStr(i)).children("input").eq(2).val("["+info['zones'][i].toString()+"]");
                        }
                    }
                       
                    $("#step_bar_1").attr("class", "step_bar lit");
                    $("#step_circle_1").attr("class", "step_circle lit");
                    $("#step_circle_2").attr("class", "step_circle lit");
                    $("#step_bar_2").attr("class", "step_bar lit");
                    $("#step_circle_3").attr("class", "step_circle lit");
                    $("#step_bar_3").attr("class", "step_bar lit");
                    $("#step_circle_4").attr("class", "step_circle lit");
                    
                    if(find_doctor_page == 31)
                    {
                        find_doctor_page = 32;
                        $("#find_doctor_label").text("Select Time");
                        resetDateTimeSelector();
                        $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)}); 
                    }
                    else
                    {
                        find_doctor_page = 12;
                        var info = selected_doctor_info.split("_");
                        var html = '<ul style="color: #22AEFF; margin-top: 50px; margin-left: 120px;"><li style="text-align: left;">Receipt: <strong>HTI - CR102388</strong></li><li style="text-align: left;"><strong>';
                        if(consultation_type == 1)
                        {
                            html += 'Video ';
                        }
                        else
                        {
                            html += 'Phone ';
                        }
                        html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">starting <strong>NOW</strong></li></ul></div>';
                        $("#find_doctor_receipt").html(html);
                        $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed and will start IMMEDIATELY.</strong></p></div>');
                        $("#find_doctor_label").text("Confirmation");
                        $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
                        $("#step_bar_4").attr("class", "step_bar lit");
                        $("#step_circle_5").attr("class", "step_circle lit");
                    }
                });
            }
            else
            {
                // tell user a general practicioner could not be found in their area
                if(find_doctor_page == 31)
                {
                    find_doctor_page = 35;
                }
                else
                {
                    find_doctor_page = 15;
                }
		var translation = '';
		
		
		if(language == 'th'){
		translation = 'Lo siento, no hemos podido encontrar ning√∫n</br>m√©dico general en tu area.';
		
		}else if(language == 'en'){
		translation = "Sorry, we could not find any<br/>general practicioners in your area.";
		
		}
                $("#not_found_text").html(translation);
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_3').fadeIn(300)}); 
                $("#find_doctor_next_button").css("display", "none");
            }
        });
        
    });
        
    function selectDay(day)
    {
        $("#sun").removeClass("day_selected");
        $("#mon").removeClass("day_selected");
        $("#tues").removeClass("day_selected");
        $("#wed").removeClass("day_selected");
        $("#thur").removeClass("day_selected");
        $("#fri").removeClass("day_selected");
        $("#sat").removeClass("day_selected");
        $("#"+day).addClass("day_selected");
    }
    function selectTime(slot)
    {
        $("#8_10_am").removeClass("slot_selected");
        $("#10_12").removeClass("slot_selected");
        $("#12_2").removeClass("slot_selected");
        $("#2_4").removeClass("slot_selected");
        $("#4_6").removeClass("slot_selected");
        $("#6_8").removeClass("slot_selected");
        $("#8_10_pm").removeClass("slot_selected");
        $("#"+slot).addClass("slot_selected");
    }
    $("#8_10_am").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 1;
            selected_timezone = zones[0];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "10px");
            selectTime("8_10_am");
        }
    });
    $("#10_12").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 2;
            selected_timezone = zones[1];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "42px");
            selectTime("10_12");
        }
    });
    $("#12_2").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 3;
            selected_timezone = zones[2];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "74px");
            selectTime("12_2");
        }
    });
    $("#2_4").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 4;
            selected_timezone = zones[3];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "106px");
            selectTime("2_4");
        }
    });
    $("#4_6").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 5;
            selected_timezone = zones[4];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "138px");
            selectTime("4_6");
        }
    });
    $("#6_8").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 6;
            selected_timezone = zones[5];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "170px");
            selectTime("6_8");
        }
    });
    $("#8_10_pm").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 7;
            selected_timezone = zones[6];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "202px");
            selectTime("8_10_pm");
        }
    });
        
    function disableAllSlots()
    {
        $("#8_10_am").addClass("slot_disabled");
        $("#10_12").addClass("slot_disabled");
        $("#12_2").addClass("slot_disabled");
        $("#2_4").addClass("slot_disabled");
        $("#4_6").addClass("slot_disabled");
        $("#6_8").addClass("slot_disabled");
        $("#8_10_pm").addClass("slot_disabled");
    }
        
    $("#sun").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 1;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "20px");
            selectDay("sun");
            var info = $("#sun").children("input").eq(1).val().substr(1, $("#sun").children("input").eq(1).val().length - 2).split(",");
            zones = $("#sun").children("input").eq(2).val().substr(1, $("#sun").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#sun").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
            
        }
    });
    $("#mon").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 2;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "68px");
            selectDay("mon");
            var info = $("#mon").children("input").eq(1).val().substr(1, $("#mon").children("input").eq(1).val().length - 2).split(",");
            zones = $("#mon").children("input").eq(2).val().substr(1, $("#mon").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#mon").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#tues").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 3;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "116px");
            selectDay("tues");
            var info = $("#tues").children("input").eq(1).val().substr(1, $("#tues").children("input").eq(1).val().length - 2).split(",");
            zones = $("#tues").children("input").eq(2).val().substr(1, $("#tues").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#tues").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#wed").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 4;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "164px");
            selectDay("wed");
            var info = $("#wed").children("input").eq(1).val().substr(1, $("#wed").children("input").eq(1).val().length - 2).split(",");
            zones = $("#wed").children("input").eq(2).val().substr(1, $("#wed").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#wed").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#thur").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 5;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "212px");
            selectDay("thur");
            var info = $("#thur").children("input").eq(1).val().substr(1, $("#thur").children("input").eq(1).val().length - 2).split(",");
            zones = $("#thur").children("input").eq(2).val().substr(1, $("#thur").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#thur").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#fri").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 6;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "260px");
            selectDay("fri");
            var info = $("#fri").children("input").eq(1).val().substr(1, $("#fri").children("input").eq(1).val().length - 2).split(",");
            zones = $("#fri").children("input").eq(2).val().substr(1, $("#fri").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#fri").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#sat").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 7;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "308px");
            selectDay("sat");
            var info = $("#sat").children("input").eq(1).val().substr(1, $("#sat").children("input").eq(1).val().length - 2).split(",");
            zones = $("#sat").children("input").eq(2).val().substr(1, $("#sat").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#sat").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    
  
        
        
    $('#find_doctor_button').live('click', function()
    {
        if(doctor_to_connect.length > 0 || type_of_doctor_to_find.length > 0)
        {
            var info = doctor_to_connect.split("_");
            $.post("find_doctor.php", {type: type_of_doctor_to_find, id: info[0]}, function(data, status)
            {
                if(data == 'none')
                {
                    $('#find_doctor_modal').dialog('option', 'title', 'No Doctors Found');
                    $("#Talk_Section_1").fadeOut("Slow", function(){$("#Talk_Section_3").fadeIn("slow");});
                    $("#find_doctor_modal").dialog("widget").animate({width: '550px', height: '130px'}, {duration: 500, step: 
                        function()
                        {
                            $("#dialog").dialog('option', 'position', 'center');
                        }
                    });
                }
                else
                {
                    var doc = JSON.parse(data);
                    var name = doc.name;
                    name = name.replace("_", " ");
                    doctor_to_connect = doc.id + "_" + doc.phone + "_" + doc.name;
                    $('#find_doctor_modal').dialog('option', 'title', 'Doctor ' + name);
                    $("#Talk_Section_1").fadeOut("Slow", function(){$("#Talk_Section_2").fadeIn("slow");});
                    $("#find_doctor_modal").dialog("widget").animate({width: '550px', height: '130px'}, {duration: 500, step: 
                        function()
                        {
                            $("#dialog").dialog('option', 'position', 'center');
                        }
                    });
                }
            });
        }
        
    });
    $('.recent_doctor_button').live('click', function()
    {
        $('.recent_doctor_button_selected').attr("class", "recent_doctor_button");
        $(this).attr("class", "recent_doctor_button_selected");
        doctor_to_connect = $(this).attr("id");
        type_of_doctor_to_find = '';
    });
    $("#speciality").change(function()
    {
        doctor_to_connect = '';
        type_of_doctor_to_find = $(this).val();
    });
    $('#phone_call_button').live('click',function(e)
    {
        //$("#find_doctor_modal").dialog("close");
        var info = doctor_to_connect.split("_");
        $('#find_doctor_modal').dialog('option', 'title', 'Calling Doctor ' + info[2]);
        $("#Talk_Section_2").fadeOut("Slow", function(){$("#Talk_Section_4").fadeIn("slow");});
        $.post("start_telemed_phonecall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[1], doc_id: info[0], pat_id: $("#USERID").val(), doc_name: (info[2] + ' ' + info[3]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status)
        {
            console.log(data);
        });
    });
    $('#video_call_button').live('click',function(e)
     {
        $("#find_doctor_modal").dialog("close");
         var info = doctor_to_connect.split("_");
        $.post("start_telemed_videocall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[1], doc_id: info[0], pat_id: $("#USERID").val(), doc_name: (info[2] + ' ' + info[3]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status)
        {
            console.log(data);
            if(data == 1)
            {
                var info = doctor_to_connect.split("_");
                window.open("telemedicine_patient.php?MED=" + info[0] + "&PAT=" + $("#USERID").val(),"Telemedicine","height=650,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
            }
            else
            {
                alert("There was an error. Please try again later");
            }
        });
     });

    $('#compose_message').live('click',function(){
        $('#messagecontent_inbox').attr('value','');
        $('#ToDoctor').attr('value','To: ');
        $('#subjectname_inbox').attr('value','');
        $('#subjectname_inbox').removeAttr("readonly");   
        $('#messagedetails').hide();
        $('#replymessage').show();
        $("#attachments").empty();
        $('#attachments').hide();
        $('#Reply').hide();
        $("#CloseMessage").hide();
        $('#Attach').hide();
        $('#sendmessages_inbox').show();
        $('#attachreports').show();
        $('#message_modal').trigger('click');
   });
                              
    $('#sendmessages_inbox').live('click',function(){
         var IdPaciente = session_userid;
         var FullNamePaciente = $('#NombreComp').html();
         //alert (FullNamePaciente);
         IdDoctor = $("#IdDoctor").attr('value');
         var content = $('#messagecontent_inbox').val();
         var subject=$('#subjectname_inbox').val();;
         //reportids = reportids.replace(/\s+$/g,' ');
         var IdDocOrigin = IdDoctor;
         var IdDoctor = IdDoctor;
         var Receiver = 0;
         reportids = ' ';
         //alert ('IdPaciente: '+IdPaciente+' - '+'Sender: '+IdDocOrigin+' - '+'Attachments: '+reportids+' - '+'Receiver: '+IdDoctor+' - '+'Content: '+content+' - '+'subject: '+subject+' - '+'connection_id: 0');
         var cadena='sendMessageUSER.php?sender='+IdDocOrigin+'&receiver='+IdDoctor+'&patient='+IdPaciente+''+'&content='+content+'&subject='+subject+'&attachments='+reportids+'&connection_id=0&tofrom=to';
         var RecTipo=LanzaAjax(cadena);
         
         $('#messagecontent_inbox').attr('value','');
         $('#subjectname_inbox').attr('value','');
         displaynotification('status',RecTipo);
         getUserData(IdPaciente);
         var UserName = user[0].Name;
         var UserSurname = user[0].Surname; 
         
         getMedCreator(IdDoctor);
         var NameMed = doctor[0].Name;
         var SurnameMed = doctor[0].Surname; 
         
         var cadena='push_serverUSER.php?FromDoctorName='+UserName+'&FromDoctorSurname='+UserSurname+'&FromDoctorId='+IdDoctor+'&Patientname='+UserName+'&PatientSurname='+UserSurname+'&IdUsu='+IdPaciente+'&message= New Message <br>From: '+UserName+' '+UserSurname+' <br>Subject: '+(subject).replace(/RE:/,'')+'&NotifType=1&channel='+IdDoctor+'&Selector=2';
         //alert(cadena);
         var RecTipo=LanzaAjax(cadena);
         
         //}
         reportids='';
         $("#attachment_icon").remove();
    
        
        //alert ('Answer of Messg Proc.?: '+RecTipo);
         $('#message_modal').trigger('click');  //Close the modal window
});
     
    $('.CFILA').live('click',function(){
       var id = $(this).attr("id");
       // Get Doctor id and some info
       var cadena='getDoctorMessage.php?msgid='+id;
       var RecTipo=LanzaAjax(cadena);
       var n = RecTipo.indexOf(",");
	   var IdDoctor = RecTipo.substr(0,n);
       var Remaining = RecTipo.substr(n+1,RecTipo.length);
       m = Remaining.indexOf(",");
	   var NameDoctor = Remaining.substr(0,m);
       var SurnameDoctor = Remaining.substr(m+1,Remaining.length);
       $("#IdDoctor").attr('value',IdDoctor);
       //throw "stop execution";
       
       //displaynotification('Message ID'+ id);
	   
       
       $('input[type=checkbox][id^="reportcol"]').each(
        function () {
		 $('input[type=checkbox][id^="reportcol"]').checked=false;
		});
	   reportcheck.length=0;
	   var content=$(this).find('span#'+id).text().replace(/br8k/g,"\n").replace(/sp0e/g," ");
	   $(this).find('span').hide();
	   var reportsattached=$(this).find('ul#'+id).text();
	   
       //alert(reportsattached);
	   
       $("#attachments").empty();
	   if(reportsattached){
               //alert("into attachments");
               var ElementDOM ='All';
               var EntryTypegroup ='0';
               var Usuario = $('#userId').val();
               var MedID =$('#MEDID').val();
               //alert ('Usuario: '+Usuario+' MedID: '+MedID);
                var queUrl ='CreateAttachmentStream.php?ElementDOM=na&EntryTypegroup='+EntryTypegroup+'&Usuario='+Usuario+'&MedID='+MedID+'&Reports='+reportsattached;
                var RecTipo=LanzaAjax(queUrl);
                //alert(RecTipo);
                $("#attachments").append(RecTipo);
                /*$("#attachments").load(queUrl);
                $("#attachments").trigger('update');*/
                $("#attachments").show();
		}else{
                $('#attachments').hide();
                //alert("no attachments");
		}
	   //content.replace(/[break]/g,"\n").replace(/[space]/g," ");
	   //alert($(this).find('a').text());
	   //displaynotification('Message read');
	   //$('#attachments').hide();
	   $('#Attach').hide();
	   $('#messagedetails').show();
       $("#ToDoctor").show();
       $('#ToDoctor').html('To: '+NameDoctor+' '+SurnameDoctor);
       $('#replymessage').hide();
	   $("#Reply").attr('value','Reply');
       $("#Reply").show();
       $("#CloseMessage").show();
	   $('#messagedetails').val(content);
	   $('#messagedetails').attr('readonly','readonly');
	   $('#messagedetails,#subjectname_inbox').css("cursor","pointer");
	   $('#subjectname_inbox').val($(this).find('a').text());
	   $('#subjectname_inbox').attr('readonly','readonly');
	   $('#replymessage').hide();
	   $('#sendmessages_inbox').hide();
	   $('#attachreports').hide();
	   $('#message_modal').trigger('click');
	   var cadena='setMessageStatusUSER.php?msgid='+id;
	   var RecTipo=LanzaAjax(cadena);
	   /*setTimeout(function(){
	   $('#newinbox').trigger('click');},1000);*/
	   
   });
        
    $('.CFILA_out').live('click',function(){
       var id = $(this).attr("id");
	   //displaynotification('Message ID'+ id);
	   $('input[type=checkbox][id^="reportcol"]').each(
        function () {
		 $('input[type=checkbox][id^="reportcol"]').checked=false;
		});
	   reportcheck.length=0;
	   var content=$(this).find('span#'+id).text().replace(/br8k/g,"\n").replace(/sp0e/g," ");
	   $(this).find('span').hide();
	   var reportsattached=$(this).find('ul#'+id).text();
	   //alert(reportsattached);
	   $("#attachments").empty();
	   if(reportsattached){
	   //alert("into attachments");
	   var ElementDOM ='All';
	   var EntryTypegroup ='0';
	   var Usuario = $('#userId').val();
	   var MedID =$('#MEDID').val();
	   
		var queUrl ='CreateAttachmentStream.php?ElementDOM=na&EntryTypegroup='+EntryTypegroup+'&Usuario='+Usuario+'&MedID='+MedID+'&Reports='+reportsattached;
	    var RecTipo=LanzaAjax(queUrl);
		//alert(RecTipo);
		$("#attachments").append(RecTipo);
      	/*$("#attachments").load(queUrl);
    	$("#attachments").trigger('update');*/
		$("#attachments").show();
		}else{
		$('#attachments').hide();
		//alert("no attachments");
		}
	   //content.replace(/[break]/g,"\n").replace(/[space]/g," ");
	   //alert($(this).find('a').text());
	   //displaynotification('Message read');
	   //$('#attachments').hide();
	   $('#Attach').hide();
	   $('#messagedetails').show();
       $('#replymessage').hide();
	   $("#Reply").attr('value','Reply');
       $("#Reply").hide();
       $("#CloseMessage").show();
	   $('#messagedetails').val(content);
	   $('#messagedetails').attr('readonly','readonly');
	   $('#messagedetails,#subjectname_inbox').css("cursor","pointer");
	   $('#subjectname_inbox').val($(this).find('a').text());
	   $('#subjectname_inbox').attr('readonly','readonly');
	   $('#replymessage').hide();
	   $('#sendmessages_inbox').hide();
	   $('#attachreports').hide();
	   //$('#clearmessage').hide();
	   $('#message_modal').trigger('click');
	   /*var cadena='setMessageStatus.php?msgid='+id;
	   var RecTipo=LanzaAjax(cadena);
	   setTimeout(function(){
	   $('#newoutbox').trigger('click');},1000);*/
	   
   });
        
    $("#Attach").live('click',function(){
     reportids='';
    
    $('input[type=checkbox][id^="reportcol"]').each(
     function () {
				var sThisVal = (this.checked ? "1" : "0");
				
				//sList += (sList=="" ? sThisVal : "," + sThisVal);
				if(sThisVal==1){
				 var idp=$(this).parents("div.attachments").attr("id");
				//alert("Id "+idp+" selected"); 
				reportcheck.push(this.id);
				 //messageid=messageid+idp+' ,';
				 reportids=reportids+idp+' ';
				
				 /*var cadena='setMessageStatus.php?msgid='+idp+'&delete=1';
				 LanzaAjax(cadena);*/
				}
			
				
	});
	 //alert(reportids);
	var conf=false;
	if(reportids>'')
		conf=confirm("Confirm Attachments");
	
	if(conf){
	$("#Reply").trigger('click');
	$("#attachreportdiv").append('<i id="attachment_icon" class="icon-paper-clip" style="margin-left:10px"></i>');
	//alert(reportids);
	}else{
	reportids='';
	for (i = 0 ; i < reportcheck.length; i++ ){
				
		document.getElementById(reportcheck[i]).checked = false;
				
	}
	reportcheck.length=0;
	$("#Reply").trigger('click');
	}
      
   });
   
    var isloaded=false;   //This variable is to make sure the page loads the report only once.
   
  
   
    $('#attachreports').live('click',function(){
   
    $('input[type=checkbox][id^="reportcol"]').each(
     function () {
				var sThisVal = (this.checked ? "1" : "0");
				if(sThisVal==1){
				reportcheck.push(this.id);
				}
				
	});
	/*if(!isloaded){
	//$('#attachments').remove();*/
	$("#attachments").empty();
	createPatientReports();
	//isloaded=true;
	//}
	setTimeout(function(){
	for (i = 0 ; i < reportcheck.length; i++ ){
				
		document.getElementById(reportcheck[i]).checked = true;
				
	}},400);
   $("#attachment_icon").remove();
   $('#sendmessages_inbox').hide();
   $('#replymessage').hide();
   $(this).hide();   
   $('#attachments').show();
   $('#Attach').show();
   $("#Reply").attr('value','Back');
   $("#Reply").show();
   
   
   });
      
    $("#Reply").live('click',function(){
       var subject_name='RE:'+($('#subjectname_inbox').val()).replace(/RE:/,'');
       $('#ToDoctor').show();
       $('#ToDoctor').attr('value','To: ');
       $('#subjectname_inbox').val(subject_name);   
       $('#messagedetails').hide();
       $('#replymessage').show();
       $('#attachments').hide();
       $('#Attach').hide();
       $(this).hide();
       $("#CloseMessage").hide();
       $('#sendmessages_inbox').show();
       $('#attachreports').show();
   });

    $("#SearchUser").typeWatch({
				captureLength: 1,
				callback: function(value) {
					$("#BotonBusquedaPac").trigger('click');
					//alert('searching');
				}
	});
	$("#RetrievePatient").click(function(event) {
   		 $('#BotonBusquedaPac').trigger('click');
   	});
/********************************************************/
/********************************************************/
/********************************************************/
