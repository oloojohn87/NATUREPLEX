console.log('h2m_userdashboard.js LOADED!');
var mem_id = $("#USERID").val();
var mem_timezone = $("#USER_TIMEZONE").val();
var mem_location = $("#USER_LOCATION").val();
var both_id = $("#MEDID").val();
var doc_email = $("#IdMEDEmail").val();
var original_user = $("#ORIGINAL_USER").val();
var upload_type = '';
var amount1 = '';
var amount2 = '';

$('#verify_back_license').live('click',function(){
	$("#scan_backdl_photo").dialog({bgiframe: true, height: 600, width: 600, modal: true});
	//alert('working');
	});

$(document).ready(function () {

	//call the code for the signature
	$('.sigPad').signaturePad();

});

//Charge CC two small amounts to verify banking information/
$("#verify_cc").click(function() {
	
	$.post("piggy_bank.php", {user: mem_id}, function(data, status)
	{
		//console.log(data);
		alert("Your account has been charges two amounts between $0.50 and $1.00.  Please check your bank statement and return to this section to complete the verification process.");
		location.reload();
	});
	
	
});

$("#check_cc_amounts").click(function() {
	amount1 = $("#charge1_cc").val();
	amount2 = $("#charge2_cc").val();
	//alert(amount2);
	$.post("verify_charges.php", {user: mem_id, charge1: amount1, charge2: amount2}, function(data, status)
	{
		//console.log(data);
		alert("Thank you for verifying your credit card information.  Don't forget to upload your profile picture and photo identification to complete the process.");
		location.reload();
	});
});


//UPLOAD STUFF////
$("#add_profile_image_button").click(function() {
	upload_type = 'profile';
    $("input[id='fileToUpload2']").click();
});

$("#add_license_button").click(function() {
	upload_type = 'license';
    $("input[id='fileToUpload2']").click();
});

jQuery("input[id='fileToUpload2']").change(function () {
    $("input[id='make_upload']").click();
});

function fileSelected() {
    var file = document.getElementById('fileToUpload2').files[0];
    if (file) {
        var fileSize = 0;
        if (file.size > 1024 * 1024)
            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        else
            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

        document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
        document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
        document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
        
        //CHANGE THE PICTURE THUMBNAIL WHEN IT CHANGES
        var hostUrl = "../";

        var profile_pic = document.getElementById('profile_pic').src;
        if(profile_pic.indexOf('defaultDP') > -1) profile_pic = 'PatientImage/'+mem_id+'.jpg';
        else profile_pic = profile_pic.substring(hostUrl.length, profile_pic.length);
        var rand = "?rand2";
        if (profile_pic.indexOf(rand) > -1) profile_pic = profile_pic.substring(0, profile_pic.indexOf(rand));
        profile_pic += rand+Math.random();
        //console.log(profile_pic);
        setTimeout(function() {document.getElementById('profile_pic').src = 'PatientImage/'+mem_id+'.jpg';}, 500);
        document.getElementById('profile_pic').src = profile_pic;
    }
}

function uploadFile2() {
    var fd = new FormData();
    fd.append("fileToUpload2", document.getElementById('fileToUpload2').files[0]);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", "uploadifyPatient.php?pullfile="+mem_id+"&upload="+upload_type);
    xhr.send(fd);
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
    /* This event is raised when the server send back a response */
    //alert(evt.target.responseText);
    //location.reload();
    
    $.post("compare_images.php", {user: mem_id}, function(data, status)
	{
		//console.log(data);
		$("#matching_percent").text(data);
	});
}

function uploadFailed(evt) {
    alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
}
////////////////////////////////////////////////////////////////////////////////////////////

//ticker code
    var containerheight = 0;
    var numbercount = 0;
    var liheight;
    var index = 1;
    function callticker() {
        $(".container ul").animate({
            "margin-top": (-1) * (liheight * index)
        }

        , 2500);
        if (index != numbercount - 1) {
            index = index + 1;
        }
        else {
            index = 0;
        }
        timer = setTimeout("callticker()", 3600);
    }           
    //end ticker code    
        
        
        
	var timeoutTime = 18000000;
	//var timeoutTime = 300000;  //5minutes
	var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);


	var active_session_timer = 60000; //1minute
	var sessionTimer = setTimeout(inform_about_session, active_session_timer);

    var reportcheck = new Array();
   
	//This function is called at regular intervals and it updates ongoing_sessions lastseen time
	function inform_about_session()
	{
		$.ajax({
			url: '/ongoing_sessions.php?userid='+both_id,
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
        
	// function launchTelemedicine()
    // {
		// $.ajax({
		// url: '<?php echo $domain?>/weemo_test.php?calleeID='+<?php echo $DoctorEmail?>,
			// success: function(data){
			//alert('done');
			// }
		// });
    // }	
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
	
	setInterval(function() {
    		$('#newinbox').trigger('click');
      }, 10000);

    /*
    //COMMENTED DUE TO THE DUPLICATE
    function displaynotification(status,message){
  
  var gritterOptions = {
			   title: status,
			   text: message,
			   image:'images/Icono_H2M.png',
			   sticky: false,
			   time: '3000'
			  };
	$.gritter.add(gritterOptions);
	
  }*/

    function getUserData(UserId) {
 	var cadenaGUD = '/GetUserData.php?UserId='+UserId;
    $.ajax(
           {
           url: cadenaGUD,
           dataType: "json",
           async: false,
           success: function(data)
           {
           //alert ('success');
           user = data.items;
           }
           });
    }

    function getMedCreator(UserId) {
 	var cadenaGUD = '/GetMedCreator.php?UserId='+UserId;
    $.ajax(
           {
           url: cadenaGUD,
           dataType: "json",
           async: false,
           success: function(data)
           {
           //alert ('success');
           doctor = data.items;
           }
           });
    }

    var find_doctor_page = 0;
    var selected_doctor_available = 0;
    var selected_doctor_info = '';
    var talk_mode = 0; // 0 = from the talk button and 1 = from the search button
    $(document).ready(function() {
        function getScript(url)
        {
            $.ajax(
            {
                url: url,
                dataType: "script",
                async: false
            });
        }
        
        // notifications
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
        //var pusher = new Pusher('d869a07d8f17a76448ed');
        //var channel_name=$('#USERID').val();
        //var channel = pusher.subscribe(channel_name);
        
        var push = new Push($('#USERID').val(), window.location.hostname + ':3955');
        push.bind('notification', function(data) 
        {
            displaynotification('New Message', data);
        });
        
        
        $("#my_doctors_phone").intlTelInput();
        $("#my_doctors_phone").css("border-radius", "0px");
        $("#my_doctors_phone").css("height", "25px");
        $("#my_doctors_phone").css("width", "712px");
        $("#my_doctors_phone").css("padding", "8px");
        $("#my_doctors_phone").css("padding-left", "40px");
        $("#my_doctors_phone").css("margin", "0px");
        $("#my_doctors_phone").css("box-shadow", "0px 0px 0px #EEE");
        $("#my_doctors_phone").css("outline", "none");
        $("#my_doctors_phone").css("border-bottom-left-radius", "5px");
        $("#my_doctors_phone").css("border-bottom-right-radius", "5px");
        
        // Check Notifications: PHS Notification box & Notification Baloon
        setTimeout(function()
        { 
            //;get_notifications (mem_id,'main_notif_container',1)
            $("#main_notif_container").h2m_notifications({type: 'PAT', patient: $('#USERID').val()});
            
        }, 3000);
        $('#main_notif_container').bind('DOMNodeInserted', function(event) 
        {
            $("#main_notification_baloon").text($("#main_notif_container").children().length - 1);
        });
        $('#main_notif_container').bind('DOMNodeRemoved', function(event) 
        {
            $("#main_notification_baloon").text($("#main_notif_container").children().length - 1);
        });
        
        //var user = getCookie("health2me");
        
        var cookieValue = $.cookie("health2me");
        
        if (cookieValue == "H2M116130") {
            
           $("#notification_bar").html("");
        
        }else{
            
            document.cookie="health2me=H2M116130";
            
            $("#notification_bar").html('<div style="position: fixed;text-align:center;width: 100%; height: 44px; color: white; z-index: 2; background-color: rgb(119, 190, 247);"><div id="notification_bar_msg" style="display:inline-block;margin-right:20px;height:40px;vertical-align: middle;">We use cookies to improve your experience. By your continued use of this site you accept such use. </div><div id="notification_bar_close" style="display:inline-block;margin-top: 2px;margin-left:40px"><i class="icon-remove-circle icon-3x"></i></div></div>');
                                        
            $("#notification_bar").slideDown("fast");
            
        }
        
        $("#notification_bar_close").on('click', function()
        { 
        
            
         $("#notification_bar").slideUp("fast");
        
        
        });
        
 
        // load send report thumbnails
        $.get("createSendStream.php?ElementDOM=na&EntryTypegroup=0&Index=1&Usuario="+mem_id, function(data, status)
        {
            $("#sendStreamContainer").html(data);
            
            // this is for the file stream for sharing files with the personal doctor (personal doctor section under doctor search modal)
            var html_1 = $("#sendStreamContainer").html().replace(/reportcol_1_/g,"reportcol_2_");
            var html_2 = html_1.replace(/checked="" disabled=""/g," ");
            $("#personalDoctorShareContainer").html(html_2);
        });
        
        // the following code is for selecting different users if this is a family account
        var family_editing_mode = 1;
        var selected_family_member = 0;
        $("#select_users_button").on('click', function()
        {
            if($(this).children().eq(0).hasClass("icon-caret-down"))
            {
                $(this).children().removeClass("icon-caret-down").addClass("icon-caret-up");
                $("#select_users").css("display", "block");
            }
            else
            {
                $(this).children().removeClass("icon-caret-up").addClass("icon-caret-down");
                $("#select_users").css("display", "none");
            }
        });
        
        $(".user_button").hover( function()
        {
            $(this).css("background-color", "#49BFFF");
        }, function()
        {
            $(this).css("background-color", "#22AEFF");
        });
        
        $(".user_button").live('click', function()
        {
            var email = $(this).attr('id').split("_")[2];
            var org_user = original_user;
            var age = parseInt($(this).attr('id').split("_")[3]);
            var grant_access = parseInt($(this).attr('id').split("_")[4]);
            if(age >= 18 && org_user != email && grant_access == 0)
            {
                swal("Access Denied", "This user cannot be accessed because the user account is private", "error");
            }
            else
            {   
                console.log("EMAIL: " + email);
                $.post("logout.php", {logging_out_family_member: true}, function(data, status)
                {
                    $.post("loginUSER.php", {Nombre: email},  function(data, status)
                    {
                        location.reload();
                    });
                });
            }
        });
        
        $(".change_user_dropdown_button").live('click', function(e)
        {
            e.preventDefault();
            var email = $(this).attr('id').split("_")[2];
            var org_user = original_user;
            var age = parseInt($(this).attr('id').split("_")[3]);
            var grant_access = parseInt($(this).attr('id').split("_")[4]);
            if(age >= 18 && org_user != email && grant_access == 0)
            {
                swal("Access Denied", "This user cannot be accessed because the user account is private", "error");
            }
            else
            {
                $.post("logout.php", {logging_out_family_member: true}, function()
                {
                    $.post("loginUSER.php", {Nombre: email},  function(data, status)
                    {
                        location.reload();
                    });
                });
            }
        });
        
        $("#upgrade_premium_button").on('click', function()
        {
            $("#upgrade_loading_bar").css('visibility', 'visible');
            $.post("change_subscription.php", {user: $("#USERID").val(), plan: 1}, function(data, status)
            {
                $("#upgrade_loading_bar").css('visibility', 'hidden');
                if(data == 'GOOD')
                {
                    location.reload();
                }
                else
                {
                    alert("You have not entered a credit card for your account, please enter a credit card by selecting the credit card icon to change your subscription");
                }
            });
        });
        
        $("#upgrade_family_button").on('click', function()
        {
            $("#upgrade_loading_bar").css('visibility', 'visible');
            $.post("change_subscription.php", {user: $("#USERID").val(), plan: 2}, function(data, status)
            {
                $("#upgrade_loading_bar").css('visibility', 'hidden');
                if(data == 'GOOD')
                {
                    location.reload();
                }
                else
                {
                    alert("You have not entered a credit card for your account, please enter a credit card by selecting the credit card icon to change your subscription");
                }
            });
        });
        
        $("#add_family_member_button").on('click', function()
        {
            family_editing_mode = 1;
            $("#family_members").css("display", "none");
            $("#edit_family_member").css("display", "block");
            $("#give_admin_privileges").children().eq(0).val('0');
            $("#give_admin_privileges").children().eq(1).css("display", "none");
            $("#family_member_name").val('');
            $("#family_member_surname").val('');
            $("#family_member_dob").val('');
            $("#family_member_phone").val('');
            $("#family_member_password").val('');
            $("#family_member_password2").val('');
            $("#family_member_email").val('');
            $("#family_member_order").val('');
            $("#family_member_gender").val('none');
            $("#family_member_gender").change();
            $("#family_member_relationship").val('none');
            $("#family_member_relationship").change();
        });
        $("#grant_admin_access_button").on('click', function()
        {
            //console.log("hello");
            var access = 1;
            if($(this).text().search("Remove") != -1)
            {
                access = 0;
                $(this).css('background-color', "#54bc00");
                $(this).text('Grant Admin Access To My Account');
            }
            else
            {
                $(this).css('background-color', '#D84840');
                $(this).text('Remove Admin Access To My Account');
            }
            $.post("EditUserFam.php", {User: $("#USERID").val(), Access: access, Grant_Access: true});
        });
        
        //New Variable added  by Pallab
        var stausOfFamilyEditingMode;
        $("#edit_family_member_done_button").on('click', function()
        {
           /* //Start of new code added by Pallab
            if(stausOfFamilyEditingMode > 0)
            {
               console.log("In edit_family_member_done_button");
               family_editing_mode = 2;
            }
            //End of new code added by Pallab
            */
            
            
            $("#setup_modal_notification").html('<img src="images/load/8.gif" alt="">');
            $("#setup_modal_notification").css("background-color", "#FFF");
            $("#setup_modal_notification_container").css("opacity", "0.0");
            $.post("EditUserFam.php", {Name: $("#family_member_name").val(), Surname: $("#family_member_surname").val(), DOB: $("#family_member_dob").val(), Phone: $("#family_member_phone").val(), Password: $("#family_member_password").val(), Password2: $("#family_member_password2").val(), Email: $("#family_member_email").val(), Order: $("#family_member_order").val(), Gender: $("#family_member_gender").val(), Relationship: $("#family_member_relationship").val(), Admin: $("#give_admin_privileges").children().eq(0).val(), Owner: $("#USERID").val(), Mode: family_editing_mode, User: selected_family_member}, function(data, status)
            {
                
                //console.log("User exists or not"+data);
                //$("#setup_modal_notification_container").css("opacity", "0.0");
                console.log(data);
                if(data.substr(0, 4) == 'GOOD')
                {
                    var items = data.split('_');
                    if(family_editing_mode == 1)
                    {
                        
                        var html = '<div id="family_member_row_'+items[1]+'" class="family_member_row">';
                        html += '<div style="width: 20%; height: 26px; float: left;">'+$("#family_member_name").val()+' '+$("#family_member_surname").val()+'</div>';
                        html += '<div style="width: 20%; height: 26px; float: left; color: #22AEFF;">'+$("#family_member_relationship").val()+'</div>';
                        html += '<div style="width: 20%; height: 26px; float: left; color: #54bc00; ';
                        if($("#give_admin_privileges").children().eq(0).val() == '1')
                        {
                            html += 'font-weight: bold;';
                            html += '">Admin</div>';
                        }
                        else
                        {
                            html += '">Delegated</div>';
                        }
                        html += '<button id="family_member_edit_'+items[1]+'" style="width: 15%; margin-left: 5%; height: 26px; float: left; color: #FFF; background-color: #54bc00; border-radius: 5px; outline: none; border: 0px solid #FFF;">Edit</button>';
                        html += '<button id="family_member_delete_'+items[1]+'" style="width: 15%; margin-left: 5%; height: 26px; float: left; color: #FFF; background-color: #D84840; border-radius: 5px; outline: none; border: 0px solid #FFF;">Delete</button>';
                        html += '</div>';

                        $("#family_users").append(html);

                        $("#family_members_dropdown").append('<li><a href="#" class="change_user_dropdown_button" id="user_'+items[1]+'_'+$("#family_member_email").val()+'_'+items[2]+'_'+items[3]+'" lang="en"><i class="icon-user"></i> '+$("#family_member_name").val()+' '+$("#family_member_surname").val()+'</a></li>');

                        $("#select_users").children().last().css("border-bottom-right-radius", "0px");
                        $("#select_users").children().last().css("border-bottom-left-radius", "0px");
                        html = '<button id="user_'+items[1]+'_'+$("#family_member_email").val()+'_'+items[2]+"_"+items[3]+'" class="user_button" style="width: 100%; height: 30px; background-color: #22AEFF; outline: 0px; border: 1px solid #555; color: #FFF; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">'+$("#family_member_name").val()+' '+$("#family_member_surname").val()+'</button>';
                        $("#select_users").append(html);
                        $("#select_users").children().first().css("border-top-right-radius", "5px");
                        $("#select_users").children().first().css("border-top-left-radius", "5px");
                        $("#select_users").children().last().css("border-bottom-right-radius", "5px");
                        $("#select_users").children().last().css("border-bottom-left-radius", "5px");

                        $(".user_button").hover( function()
                        {
                            $(this).css("background-color", "#49BFFF");
                        }, function()
                        {
                            $(this).css("background-color", "#22AEFF");
                        });

                        $("#select_users").css("height", (($("#select_users").children().length - 1) * 30) + 'px');
                        $("#select_users").css("margin-bottom", '-' + ((($("#select_users").children().length - 1) * 30) + 14) + 'px');

                        
                        $("#family_members").css("display", "block");
                        $("#edit_family_member").css("display", "none");
                        $("#setup_modal_notification").css("background-color", "#52D859");
                        $("#setup_modal_notification").html('<p style="color: #fff;">Family Member Added!</p>');
                        $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                            setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                        }});
                    }
                    else
                    {
                        $("#family_member_row_"+selected_family_member).children().eq(0).text($("#family_member_name").val()+' '+$("#family_member_surname").val());
                        $("#family_member_row_"+selected_family_member).children().eq(1).text($("#family_member_relationship").val());
                        if($("#give_admin_privileges").children().eq(0).val() == '1')
                        {
                            $("#family_member_row_"+selected_family_member).children().eq(2).text('Admin');
                            $("#family_member_row_"+selected_family_member).children().eq(2).css("font-weight", "bold");
                        }
                        else
                        {
                            $("#family_member_row_"+selected_family_member).children().eq(2).text('Delegated');
                            $("#family_member_row_"+selected_family_member).children().eq(2).css("font-weight", "normal");
                        }
                        $('button[id^="user_'+selected_family_member+'"]').text($("#family_member_name").val()+' '+$("#family_member_surname").val());
                        $('button[id^="user_'+selected_family_member+'"]').attr('id', 'user_'+selected_family_member+'_'+$("#family_member_email").val()+'_'+items[2]+'_'+items[3]);
                        
                        $('a[id^="user_'+selected_family_member+'"]').html('<i class="icon-user"></i> '+$("#family_member_name").val()+' '+$("#family_member_surname").val());
                        $('a[id^="user_'+selected_family_member+'"]').attr('id', 'user_'+selected_family_member+'_'+$("#family_member_email").val()+'_'+items[2]+'_'+items[3]);
                            
                        $("#family_members").css("display", "block");
                        $("#edit_family_member").css("display", "none");
                        $("#setup_modal_notification").css("background-color", "#52D859");
                        $("#setup_modal_notification").html('<p style="color: #fff;">Family Member Edited!</p>');
                        $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                            setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                        }});
                    }
                }
                else
                {
                    $("#setup_modal_notification").css("background-color", "#D5483A");
                    $("#setup_modal_notification").html('<p style="color: #fff;">'+data+'</p>');
                    $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                }
            });
            
            
            
            
        });
        $("#edit_family_member_cancel_button").on('click', function()
        {
            $("#family_members").css("display", "block");
            $("#edit_family_member").css("display", "none");
        });
        $("#give_admin_privileges").on('click', function()
        {
            if($(this).children().eq(1).css("display") == 'block')
            {
                $(this).children().eq(0).val('0');
                $(this).children().eq(1).css("display", "none");
            }
            else
            {
                $(this).children().eq(0).val('1');
                $(this).children().eq(1).css("display", "block");
            }
        });
        $("#family_member_phone").intlTelInput();
        $("#family_member_phone").css("width", "214px").css("height", "26px").css("margin-top", "0px");
        
        // to delete a family member:
        $('button[id^="family_member_delete_"]').live('click', function()
        {
            var id = $(this).attr("id").split("_")[3];
            var r = confirm("Are you sure you want to delete this family member?");
            if (r == true) 
            {
                $.post("EditUserFam.php", {Delete: true, User: id}, function(data, status)
                {
                    if(data == '1')
                    {
                        $("#family_member_row_"+id).remove();
                        $('button[id^="user_'+id+'"]').remove();
                        $('a[id^="user_'+id+'"]').remove();
                        $("#select_users").css("height", (($("#select_users").children().length - 1) * 30) + 'px');
                        $("#select_users").css("margin-bottom", '-' + ((($("#select_users").children().length - 1) * 30) + 14) + 'px');
                        $("#select_users").children().last().css("border-bottom-right-radius", "5px");
                        $("#select_users").children().last().css("border-bottom-left-radius", "5px");
                        $("#select_users").children().first().css("border-top-right-radius", "5px");
                        $("#select_users").children().first().css("border-top-left-radius", "5px");
                        
                        $("#setup_modal_notification").css("background-color", "#52D859");
                        $("#setup_modal_notification").html('<p style="color: #fff;">Family Member Deleted!</p>');
                        $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                            setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                        }});
                    }
                    else
                    {
                        $("#setup_modal_notification").css("background-color", "#D5483A");
                        $("#setup_modal_notification").html('<p style="color: #fff;">Unable to delete this family member.</p>');
                        $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                            setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                        }});
                    }
                });
            }
        });
        
        // to edit a family member:
        $('button[id^="family_member_edit_"]').live('click', function()
        {
           // stausOfFamilyEditingMode = 2;
            var id = $(this).attr("id").split("_")[3];
            selected_family_member = id;
            family_editing_mode = 2;
            $.post("EditUserFam.php", {Get_info: true, User: id}, function(data, status)
            {
                //console.log(data);
                var dat = JSON.parse(data);
                if(dat['subsType'] == 'Admin' || dat['subsType'] == 'Owner')
                {
                    $("#give_admin_privileges").children().eq(0).val('1');
                    $("#give_admin_privileges").children().eq(1).css("display", "block");
                }
                else
                {
                    $("#give_admin_privileges").children().eq(0).val('0');
                    $("#give_admin_privileges").children().eq(1).css("display", "none");
                }
                $("#family_member_name").val(dat['Name']);
                $("#family_member_surname").val(dat['Surname']);
                $("#family_member_dob").val(dat['DOB'].split(' ')[0]);
                $("#family_member_phone").val('+'+dat['telefono']);
                $("#family_member_password").val('');
                $("#family_member_password2").val('');
                $("#family_member_email").val(dat['email']);
                $("#family_member_order").val(dat['Orden']);
                if(dat['Sexo'] == '0')
                {
                    $("#family_member_gender").val('female');
                }
                else
                {
                    $("#family_member_gender").val('male');
                }
                $("#family_member_gender").change();
                $("#family_member_relationship").val(dat['relationship']);
                $("#family_member_relationship").change();
                $("#family_members").css("display", "none");
                $("#edit_family_member").css("display", "block");
            });
        });
              
        
        
        
        //call ticker
        numbercount = $(".container ul li").size();
        liheight = $(".container ul li").outerHeight();
        containerheight = $(".container ul  li").outerHeight() * numbercount;
        $(".container ul").css("height", containerheight);
        var timer = setTimeout("callticker()", 3600);  
        
        
        
        if($("#CURRENTCALLINGDOCTOR").val() != '' && $("#CURRENTCALLINGDOCTOR").val() != '0' && $("#CURRENTCALLINGDOCTOR").val() != '-1')
        {
            $("#video_consultation_text").text("You have a video consultation appointment with Doctor " + $("#CURRENTCALLINGDOCTORNAME").val() + ".");
            $("#telemed_notificator").css("display", "block");
        }
        $("#telemed_connect_button").live("click", function()
        {
            //window.open("telemedicine_patient.php?MED="+$("#CURRENTCALLINGDOCTOR").val()+"&PAT="+$("#USERID").val()+"&show=0","Telemedicine","height=585,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
            console.log('CURRENTCALLINGDOCTOR: ' + $("#CURRENTCALLINGDOCTOR").val());
            /*var localVideo = document.getElementById("localVideo");
            var remoteVideo = document.getElementById("remoteVideo");

            var constraints = {video: true, audio: true};

            var teleurl = $("DOMAIN").val();    //Removed the hardcoded url 'http://dev.health2.me:8888' - Debraj
            var parseURL = document.createElement('a');
            parseURL.href = teleurl;
            teleurl = parseURL.protocol + '//' + parseURL.hostname + ':8888';

            console.log("SIGNALING SERVER: " + teleurl);

            $.post("https://api.xirsys.com/getIceServers", 
            {
                ident: "bombartier",
                secret: "4a213061-f2b0-4ec9-bd2a-0c5e0ce0c2e1",
                domain: "health2.me",
                application: "default",
                room: "default",
                secure: 1
            }, function(data, status)
            {
                console.log(data);
                var info = JSON.parse(data);
                var peerConnectionConfig = info.d;
                var webrtc = new SimpleWebRTC({localVideoEl: 'localVideo',remoteVideosEl: 'remoteVideo', url: teleurl, autoRequestMedia: true, peerConnectionConfig: peerConnectionConfig});
                webrtc.on('readyToCall', function () 
                {
                    //video_recorder = RecordRTC(webrtc.webrtc.localStream, video_record_options);
                    //audio_recorder = RecordRTC(webrtc.webrtc.localStream, audio_record_options);
                    webrtc.joinRoom('health2me_room_' + $("#CURRENTCALLINGDOCTOR").val() + '_' + $("#USERID").val());
                    //call();
                    //$.post("update_webrtc.php", {doc_id: doctor_id, status: 1}, function(data, status){console.log(data);});
                    //setInterval(function(){$.post("update_webrtc.php", {doc_id: doctor_id, update_lastseen: true}, function(data, status){console.log(data);});}, 30000);
                    //$(window).unbind("beforeunload");
                });
            });*/

            $("#find_doctor_modal").dialog('close');
            window.location = 'telemedicine/telemed_pat.php?doc_id=' + $("#CURRENTCALLINGDOCTOR").val() + '&pat_id=' + $("#USERID").val();
            //videoTelemed.dialog('open');
        });
        $("#telemed_deny_button").live("click", function()
        {
            $("#telemed_notificator").slideUp();
            $.post("reset_appointment.php", {pat_id: $("#USERID").val()}, function(){});
        });
	
	$(window).load(function() {
		$('#LoadCanvas1').css('display','none');
		$('#LoadCanvas2').css('display','none');
		LoadDonuts();
        contentAct = '';  
        //CheckUserActivity();
        $('#PHSLabel').trigger('click');
	});

       /*
    function CheckUserActivity(){
       
        var UserID = mem_id;
  		
        var queUrl = 'CheckUserActivity.php?userid='+UserID;
        var result = LanzaAjax(queUrl);
        var activity = result.split('*');
         if (activity[1] > 0){
            $('#BaloonSents').html(activity[1]);
            $('#BaloonSents').css('visibility','visible');
        }
        n = 0;

            
        while (n < activity[1]){
            idActivity = activity[(n*6)+2];
            dateActivity = activity[(n*6)+3];
            datechangeActivity = activity[(n*6)+4];
            iddoctorActivity = activity[(n*6)+5]; 
            doctorActivity = activity[(n*6)+6]; 
            statusActivity = activity[(n*6)+7];
            var offset = new Date().getTimezoneOffset();
            
            if (statusActivity < 2 ) boldness = 'bold'; else boldness = 'normal';
            
            contentAct += '	 <div class="RowNotif">                 ';
            contentAct += '	 <img src="images/icons/Send_svg.png" style="float:left; position:relative; height:25px;"/>         ';
            contentAct += '	 <span class="TextNot To">To:</span>            ';
            contentAct += '	 <span class="TextNot Who" style="font-weight:'+boldness+';">'+doctorActivity+'</span>            ';
            contentAct += '	 <span class="TextNot When" style="font-weight:'+boldness+';">'+moment(dateActivity).add('minutes',(offset*-1)).fromNow()+'</span>         ';
            if (statusActivity == 1) actIcon = 'images/icons/BoxClosed_svg.png'; else  actIcon = 'images/icons/BoxOpen_svg.png';
            contentAct += '	 <button id="'+idActivity+'" class="find_doctor_button del_activity_button" style="float:right; display: block; background-color: rgb(216, 72, 64); width:40px; height: 16px;font-size: 12px;line-height: 12px; margin-right:0px;" lang="en">Del</button>            ';
            contentAct += '	 <img src="'+actIcon+'" style="float:right; position:relative; height:25px; margin-right:10px;"  title="'+moment(datechangeActivity).add('minutes',(offset*-1)).format("dddd, MMMM Do YYYY, h:mm:ss a")+'"/>              ';
            contentAct += '	 </div>         ';          
            
            n++;
        }

       
        $('#TrackNotifications').html(contentAct);
		 
    }
    */
   /*     
    $('.del_activity_button').live('click',function(){
		var activity_id = $(this).attr("id");
        var queUrl = 'ResetUserActivity.php?idActivity='+activity_id;
        var result = LanzaAjax(queUrl);
        contentAct = '';
        CheckUserActivity();
        if (result == 0) alert ('Failed to update activity for dismissal');
    });
    */
        
	function LoadDonuts(){
	//var timerId = setTimeout(function() { 

        var UserID = mem_id;
		var AdminData = 0;
		// Ajax call to retrieve a JSON Array **php return array** 
//		$.post("GetConnectedLight.php", {User: queMED, NReports: 3, Group: group}, function(data, status)
		var queUrl = 'GetSummaryDataFull.php?User='+UserID;
 		//console.log('url:  '+queUrl);
        $.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				ConnData = data.items;
			},
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);
            }
		});
		
		var queUrlPartial = 'GetSummaryData.php?User='+UserID;
 		//console.log('url:  '+queUrl);
        $.ajax(
		{
			url: queUrlPartial,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				ConnDataPartial = data.items;
			},
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.status);
                //alert(thrownError);
            }
		});
		
	
	  AdminData = ConnData[0].Data;
	  PastDx = ConnData[1].Data;
	  Medications = ConnData[2].Data;
	  Immuno = ConnData[3].Data;
	  Family = ConnData[4].Data;
	  Habits = ConnData[5].Data;
	  Allergies = ConnData[6].Data;
	  
	  AdminDataPartial = ConnDataPartial[0].Data;
	  PastDxPartial = ConnDataPartial[1].Data;
	  MedicationsPartial = ConnDataPartial[2].Data;
	  ImmunoPartial = ConnDataPartial[3].Data;
	  FamilyPartial = ConnDataPartial[4].Data;
	  HabitsPartial = ConnDataPartial[5].Data;
	  AllergiesPartial = ConnDataPartial[6].Data;
	  
	  //alert ('AdminData: '+AdminData+'   Admin Latest Update: '+ConnData[0].latest_update+'   Admin Doctor: '+ConnData[0].doctor_signed+' ***********   '+'DxData: '+ConnData[1].Data+'   Dx Latest Update: '+ConnData[1].latest_update+'   Dx Doctor: '+ConnData[1].doctor_signed+' ');

	  // SUMMARY GRAPH
	  var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');

      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = 75;
      var startAngle = 0 - (Math.PI/2);
      var counterClockwise = false;
	  
	  var ColSeg = new Array();
	  var SizSeg = new Array();
	  var ImgSeg = new Array();
	  var MaxValue = new Array();
	  var UIValue = new Array();
	  var NameSeg1 = new Array();
	  var NameSeg2 = new Array();
	  
	  ColSeg[1] = '#54bc00';
	  MaxValue[1] = 5;
	  UIValue[1] = 10;
	  if (AdminData > MaxValue[1]) {SizSeg[1] = UIValue[1]} else {SizSeg[1] = (AdminData * UIValue[1] / MaxValue[1])};
	  //alert (SizSeg[1]+' - '+MaxValue[1]+' - '+UIValue[1]+' - '+AdminData);
	  ImgSeg[1] = 'Admin';
	  NameSeg1[1] = 'Admin';
	  NameSeg2[1] = 'Data';
	 
	  ColSeg[2] = '#f39c12';
	  UIValue[2] = 10;
	  if (Allergies > 0) SizSeg[2] = 10; else SizSeg[2]=0;
	  ImgSeg[2] = 'Immuno';
	  NameSeg1[2] = 'Immun';
	  NameSeg2[2] = 'Allergy';
	  
	  ColSeg[3] = '#2c3e50';
	  MaxValue[3] = 5;
	  UIValue[3] = 40
	  if (PastDx > 0) SizSeg[3] = 40; else SizSeg[3]=0;
	  //SizSeg[3] = 40;
	  ImgSeg[3] = 'History';
	  NameSeg1[3] = 'Perso';
	  NameSeg2[3] = 'History';
	  
	  ColSeg[4] = '#18bc9c';
	  SizSeg[4] = 15;
	  UIValue[4] = 15;
	  if (Medications > 0) SizSeg[4] = 15; else SizSeg[4]=0;
	  ImgSeg[4] = 'Medication';
	  NameSeg1[4] = 'Drugs';
	  NameSeg2[4] = 'Meds';
	  	  
	  ColSeg[5] = '#e74c3c';
	  SizSeg[5] = 15;
	  UIValue[5] = 15;
	  if (Family > 0) SizSeg[5] = 15; else SizSeg[5]=0;
	  if (Family > 0) ImgSeg[5] = 'Family';
	  if (Family > 0) NameSeg1[5] = 'Family';
	  if (Family > 0) NameSeg2[5] = 'History';
	  
	  ColSeg[6] = '#3498db';
	  SizSeg[6] = 10;
	  UIValue[6] = 10;
	  if (Habits > 0) SizSeg[6] = 10; else SizSeg[6]=0;
	  if (Habits > 0) ImgSeg[6] = 'Habits';
	  if (Habits > 0) NameSeg1[6] = 'Habits';
	  if (Habits > 0) NameSeg2[6] = 'Life';


	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)
	  // Get points for Label Positioning
	  var side = new Array();
	  var rightPoints = 0;
	  var leftPoints = 0;
	  var orderside = 1;
	  var maxside = new Array();
	  var XBoxSize = 70;
	  var YBoxSize = 20;
	  var XBox = 0;
	  var YBox = 0;
	  var Swaped = new Array();

	  var n = 1;
	  var CumData = 0;
	  var midPos = Array();
	  startAngle = 0 - (Math.PI/2);
	  while (n < 7)
	  {
	  	  endAngle = startAngle + TranslateAngle(SizSeg[n],100);
	      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,100));
	      midPos[n] = midAngle;

		 halfsegment = SizSeg[n] / 2; 
	  	 //console.log ('N:  '+n+'       SizSeg: '+SizSeg[n]+'   Halfsegment:  '+halfsegment)
	  	 CumData = CumData + SizSeg[n];
	  	 //console.log ('N:  '+n+'       CumData: '+CumData+'   Halfsegment:  '+halfsegment)
	  	 if ((CumData - halfsegment) < 50 ) {
	  	 		side[n] = 'Right'; 
	  	 		rightPoints++;
	  	 	}else 
	  	 	{
	  	 		side[n] = 'Left';
	  	 		leftPoints++;
	  	 	}

	      startAngle = endAngle;
	      lastAngle = endAngle;
	  	 n++;
	  }
	  //console.log ('Right:'+rightPoints+'    Left:'+leftPoints);
	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)

	  var SummaryData = 0;
	  
      context.lineWidth = 35;
	  startAngle = 0 - (Math.PI/2);
	  var lastAngle = 0;
	  var divisor = 1;
	      	    
	  var n = 1;
	  var leftorderside = 0;
	  while (n < 7)
	  {
	  	  SummaryData = SummaryData + SizSeg[n];
	      context.beginPath();
	      ColorRGB = hexToRgb(ColSeg[n]);
	      // Opacity value reflects how recent data is
	      var Opac = Math.random();
	      var Opac = 1;
	      SegColor = 'rgba('+ColorRGB.r+','+ColorRGB.g+','+ColorRGB.b+','+Opac+')';
	      
	      // Draw the segments
 	      context.beginPath();
	      context.strokeStyle = SegColor;
	      context.lineCap = 'butt';
	      endAngle = startAngle + TranslateAngle(SizSeg[n],100);
	      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,100));
	      midPos[n] = midAngle;
		  context.lineWidth = 35;
	      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	      context.stroke();
 	      //context.closePath();
 	      //context.restore();
 	      
	      // Draw icons into segments
	      var posx = x + (radius * Math.cos (midAngle)) - 12;     
	      var posy = y + (radius * Math.sin (midAngle)) - 12;
	      var borx = x + ((radius+(35/2)) * Math.cos (midAngle));   // Coordinates of the edge of the circle at its center
	      var bory = y + ((radius+(35/2)) * Math.sin (midAngle));   // Coordinates of the edge of the circle at its center
		  var imageObj=document.getElementById(ImgSeg[n]);
		  if (SizSeg[n] > 4) context.drawImage(imageObj, posx, posy,25,25);
	     

				  //  *********************    Labels Section   MAIN PART  *************************************************
				  //side = 'Left';
				  if (n <= rightPoints ) orderside = n; else orderside = n - rightPoints;
				   				  
				  //console.log('N: '+n+'  side: '+side[n]+'  left: '+leftPoints+'    right:  '+rightPoints+' ');
				  
				  // XBox and YBox are the coordinates of the "virtual" box than contains the label
				  if (side[n] == 'Left') {
					  	leftorderside++;
					  	XBox = 10 ; 
					  	divisor = (y*2) / (leftPoints+1);
					  	//console.log('y:  '+(y*2)+'     divisor: '+divisor+'    YBox: '+YBox+'    Arrival Segment: '+(6 - (n - leftPoints + 1 )));
					    // Invert arrival of line to segment for left side points
					    Swaped[n] = 6 - (n - leftPoints + 1 ); 
					    Swaped[n] = n; 
					    borx = x + ((radius+(35/2)) * Math.cos (midPos[Swaped[n]]));
					    bory = y + ((radius+(35/2)) * Math.sin (midPos[Swaped[n]]));
					  	YBox = (y*2) - (divisor * leftorderside);
					  	// Vertical Difference between Box and Edge here:
					  	//VerticalDiff = YBox - bory;
					  	//if (Math.abs(VerticalDiff) > 50) YBox = YBox - (VerticalDiff/2);
				  	}
				  else 
				  	{
					  	XBox = ((x) - (radius/2) + 20);
					  	XBox = 280;
					  	divisor = (y*2) / (rightPoints+1);
					  	YBox = divisor * orderside;
						Swaped[n] = n; 
						// Vertical Difference between Box and Edge here:
					  	VerticalDiff = YBox - bory;
					  	//console.log('Diff: '+VerticalDiff+'     YBox: '+YBox+'     bory:'+bory);
					  	if (Math.abs(VerticalDiff) > 40) YBox = YBox - (VerticalDiff/2);
				  }
				  
			      // Virtual Box for the Label
				  
				  /*
			      context.beginPath();
			      context.fillStyle = '#cacaca';
			      context.fillRect(XBox,YBox,XBoxSize,YBoxSize);
			      context.stroke();
				  */
				  
				  // Label Text
				  
				  context.font = "10px Arial";
			      context.fillStyle = '#b6b6b6';
				  context.fillText(NameSeg1[Swaped[n]],XBox,YBox+8);
				  context.fillText(NameSeg2[Swaped[n]],XBox,YBox+8+10);
			     
			      
			      // Divisory Line
			      
			      context.beginPath();
				  context.lineWidth = 3;
				  context.strokeStyle = ColSeg[Swaped[n]];
				  context.lineCap = 'round';
		 	      context.moveTo(XBox +35, YBox);
			      context.lineTo(XBox +35, YBox+20);
			      context.stroke();
				  
				  // Section Percentage
				  
				  context.font = "bold 12px Arial";
			      context.fillStyle = 'grey';
			      percentSeg = parseInt (100 * (SizSeg[Swaped[n]] / UIValue[Swaped[n]]));
				  if (percentSeg == 100) labelSeg = 'OK'; else labelSeg = percentSeg + '%';
				  context.fillText(labelSeg,XBox+40,YBox+3+10);
			      //context.stroke();

				  // Connecting Line			      
			      context.beginPath();
				  context.strokeStyle = '#cacaca';
				  context.lineWidth = 2;
				  if (side[n] == 'Left') 
				  {
				  	X1 = XBox +40 + 30; 
				  	XMiddle = borx - ((borx-X1)/2);
				  }
				  else 
				  {
				  	X1 = XBox - 5;
				  	XMiddle = X1 - ((X1 - borx)/2);
			      }
			      Y1 = YBox+3+10-5;
				  YMiddle = bory + ((Y1-bory)/2);
		 	      YMiddle = bory ;
		 	      context.moveTo(X1, Y1); 
			      //context.lineTo(XMiddle,YMiddle);
			      //context.lineTo(borx,bory);
			      context.bezierCurveTo(XMiddle,YMiddle,XMiddle,YMiddle,borx,bory);
			      context.stroke();

				  context.lineCap = 'butt';
			      
				  //  *********************    Labels Section   MAIN PART  *************************************************
	     
	     
	      startAngle = endAngle;
	      lastAngle = endAngle;
	      n++;
	  }
 	      // Draw Inner Circle
 	      context.beginPath();
		  context.fillStyle = '#22aeff';
	      context.lineWidth = 1;
		  context.arc(x, y, radius-20, (-Math.PI/2), (Math.PI*2), counterClockwise);
	      context.fill();
	      context.stroke();
		  context.lineWidth = 35;

 		  // Draw Main Text
		  var font = '30pt Lucida Sans Unicode';
		  var message = SummaryData+' %';
		  context.fillStyle = '#22aeff';
		  context.fillStyle = 'white';
		  context.textAlign = 'left';
		  context.textBaseline = 'top'; // important!
		  context.font = font;
		  var w = context.measureText(message).width;
		  var TextH = GetCanvasTextHeight(message,font);
		  context.fillText(message, x-(w/2), y-(TextH));

		  
		  //Draw "Missing" segment
 	      context.beginPath();
	      ColorRGB = hexToRgb('#C0C0C0');
	      // Opacity value reflects how recent data is
	      var Opac = 0.2;
	      SegColor = 'rgba('+ColorRGB.r+','+ColorRGB.g+','+ColorRGB.b+','+Opac+')';
		  context.strokeStyle = SegColor;
 	      var MissingSize = 100 - SummaryData;
	      endAngle = startAngle + TranslateAngle(MissingSize,100);
	      midAngle = startAngle + (TranslateAngle(MissingSize/2,100));
		  context.lineWidth = 35;
	      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	      context.stroke();

		  //Draw external border to existing group of segments
		  context.beginPath();
	      startAngle = 0 - (Math.PI/2);
	      endAngle = lastAngle;
	      context.strokeStyle = '#585858';
		  context.lineWidth = 2;
	      context.arc(x, y, radius+17, startAngle, endAngle, counterClockwise);
	      context.stroke();
	      context.beginPath();
	      context.arc(x, y, radius-17, startAngle, endAngle, counterClockwise);
	      context.stroke();
	      context.beginPath();
	      var posx = x + ((radius-18) * Math.cos (startAngle));
	      var posy = y + ((radius-18) * Math.sin (startAngle));
	      var posx2 = x + ((radius+18) * Math.cos (startAngle));
	      var posy2 = y + ((radius+18) * Math.sin (startAngle));
		  context.moveTo(posx,posy);
	      context.lineTo(posx2,posy2);
	      var posx = x + ((radius-18) * Math.cos (lastAngle));
	      var posy = y + ((radius-18) * Math.sin (lastAngle));
	      var posx2 = x + ((radius+18) * Math.cos (lastAngle));
	      var posy2 = y + ((radius+18) * Math.sin (lastAngle));
		  context.moveTo(posx,posy);
	      context.lineTo(posx2,posy2);
	      context.stroke();	
		  
 
 	  // REPORTS GRAPH
 	  // Get Basic Icons and Colors for every type of report
 	  	var RepData = Array();
		// Ajax call to retrieve a JSON Array **php return array** 
		var queUrl = 'GetReportSet.php';
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				RepData = data.items;
			},
 	       error: function (xhr, ajaxOptions, thrownError) {
	        	alert(xhr.status);
				alert(thrownError);
	       }

		});
 	  //
        
 	  // Get Report Data for this user
 	  	var RepNumbers = Array();
		// Ajax call to retrieve a JSON Array **php return array** 
		var queUrl = 'GetReportNumbers.php?User='+UserID;
        //console.log('url = '+queUrl);
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				RepNumbers = data.items;
			},
 	       error: function (xhr, ajaxOptions, thrownError) {
	        	alert(xhr.status);
				alert(thrownError);
	       }

		});
 	  //

	  var canvas = document.getElementById('myCanvas2');
      var context = canvas.getContext('2d');
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = 85;
      var widthSegment = 15;
      var startAngle = 0 - (Math.PI/2);
      var counterClockwise = false;

 	  ColSeg.length = 0;
	  SizSeg.length = 0;
	  ImgSeg.length = 0;
	  
	  var qx = 1;
	  var TotalRep = 0;
        
      //console.log('**** RepNumbers: *****');
      //console.log(RepNumbers);
      //console.log('*******************');
 	  
      while (qx < 10){
		  SizSeg[qx] = RepNumbers[qx-1].number;
		  NameSeg1[qx] = RepData[qx-1].title.substring(0, 4);
          ColSeg[qx] = RepData[qx-1].color;
		  NameSeg2[qx] = RepData[qx-1].abrev;
          
          TotalRep = TotalRep + parseInt(SizSeg[qx]);
		  qx++;
	  }
	  
	  ImgSeg[1] = 'R1';
	  ImgSeg[2] = 'R2';
	  ImgSeg[3] = 'R3';
	  ImgSeg[4] = 'R4';
	  ImgSeg[5] = 'R5';
	  ImgSeg[6] = 'R6';
	  ImgSeg[7] = 'R7';
	  ImgSeg[8] = 'R8';
	  ImgSeg[9] = 'R9';
	  ImgSeg[10] = 'R10';
     
	  var MaxSegments = 10;
	  var MaxReports = TotalRep;
     
      context.lineWidth = widthSegment;
	  startAngle = 0 - (Math.PI/2);


	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)
	  // Get points for Label Positioning
	  var side = new Array();
	  var rightPoints = 0;
	  var leftPoints = 0;
	  var orderside = 1;
	  var maxside = new Array();
	  var XBoxSize = 70;
	  var YBoxSize = 20;
	  var XBox = 0;
	  var YBox = 0;
	  var Swaped = new Array();

	  var n = 1;
	  var sections = 0;
	  var CumData = 0;
	  var midPos = Array();
	  while (n <= MaxSegments)
	  {
	  if (SizSeg[n]>0)
		  {
		  	  endAngle = startAngle + TranslateAngle(SizSeg[n],100);
		      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,100));
		      midPos[n] = midAngle;
	
		  	 CumData = parseInt(CumData + parseInt(SizSeg[n]));
		  	 MidPoint = CumData - (parseInt(SizSeg[n])/2);
		  	 if (MidPoint <= (TotalRep/2) ) {
		  	 		side[n] = 'Right'; 
		  	 		rightPoints++;
		  	 	}else 
		  	 	{
		  	 		side[n] = 'Left';
		  	 		leftPoints++;
		  	 	}
	
			  //console.log ('Cummulated Number of Reports: '+parseInt(CumData)+'                    TotalReports/2: '+(TotalRep/2)+' ');
			  //console.log ('n: '+n+'  Size:'+SizSeg[n]+'      side:'+side[n]+'       midPos: '+midPos[n]+'             Angle Start:'+startAngle+'    Angle End: '+endAngle);

		      startAngle = endAngle;
		      lastAngle = endAngle;

			  
			  sections++;
			  
		  }
		  n++;
	  }
	 // console.log ('Total: '+sections+'     Right: '+rightPoints+'    Left: '+leftPoints);
	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)

	      	    
	  var n = 1;
	  startAngle = 0 - (Math.PI/2);
      sections = 0;

	  while (n <= MaxSegments)
	  {
	      context.beginPath();
	      SegColor = ColSeg[n];
	      if (SizSeg[n]>0){
		      sections++;
              //console.log(' section:  '+sections);
		      // Draw the segments
		      context.strokeStyle = SegColor;
		      endAngle = startAngle + TranslateAngle(SizSeg[n],MaxReports);
		      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,MaxReports));
			  context.lineWidth = widthSegment;
		      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
		      context.stroke();
	
		      // Draw badges at inner part of segments
			  var SizeBadge = 30;
			  var PointAngle = radius-(widthSegment/2)-(SizeBadge/2);
		      var posx = x + (PointAngle  * Math.cos (midAngle)) - (SizeBadge/2);
		      var posy = y + (PointAngle  * Math.sin (midAngle)) - (SizeBadge/2);
			  var imageObj=document.getElementById(ImgSeg[n]);
			  context.drawImage(imageObj, posx, posy,SizeBadge,SizeBadge);
	
				  //  *********************    Labels Section   MAIN PART  *************************************************
				  //side = 'Left';
			      var borx = x + ((radius+(widthSegment/2)) * Math.cos (midAngle));   // Coordinates of the edge of the circle at its center
			      var bory = y + ((radius+(widthSegment/2)) * Math.sin (midAngle));   // Coordinates of the edge of the circle at its center
				  if (sections <= rightPoints ) orderside = sections; else orderside = sections - rightPoints;
				   				  
				  //console.log('N: '+n+'  side: '+side[n]+'  left: '+leftPoints+'    right:  '+rightPoints+' ');
				  
				  // XBox and YBox are the coordinates of the "virtual" box than contains the label
				  if (side[n] == 'Left') {
					  	XBox = 10 ; 
                        numberpoint = leftPoints+1;
                        neworderside = numberpoint - orderside; 
					  	divisor = (y*2) / (leftPoints+1);
                        YBox = divisor * neworderside;  
                      
					    // Invert arrival of line to segment for left side points
					    Swaped[n] = 6 - (n - leftPoints + 1 ); 
					    if (Swaped[n]==0) Swaped[n]=1;
					    Swaped[n] = n; 
				  	}
				  else 
				  	{
					  	XBox = ((x) - (radius/2) + 20);
					  	XBox = 280;
                        numberpoint = rightPoints+1;
                        divisor = (y*2) / (rightPoints+1);
                        YBox = divisor * orderside;  	  
                         
						Swaped[n] = n; 				  
				  }
				  				  
				  // Label Text
				  
				  context.font = "10px Arial";
			      context.fillStyle = '#b6b6b6';
				  context.fillText(NameSeg1[Swaped[n]],XBox,YBox+8);
				  context.fillText(NameSeg2[Swaped[n]],XBox,YBox+8+10);
			     
			      
			      // Divisory Line
			      
			      context.beginPath();
				  context.lineWidth = 3;
				  context.strokeStyle = ColSeg[Swaped[n]];
				  context.lineCap = 'round';
		 	      context.moveTo(XBox +35, YBox);
			      context.lineTo(XBox +35, YBox+20);
			      context.stroke();
				  
				  // Section Percentage
				  
				  context.font = "bold 14px Arial";
			      context.fillStyle = 'grey';
			      //percentSeg = parseInt (100 * (SizSeg[Swaped[n]] / UIValue[Swaped[n]]));
				  percentSeg = SizSeg[Swaped[n]];
				  if (percentSeg == 100) labelSeg = 'OK'; else labelSeg = percentSeg + '';
				  context.fillText(labelSeg,XBox+40,YBox+5+10);
			      //context.stroke();

				  // Connecting Line			      
			      context.beginPath();
				  context.strokeStyle = '#cacaca';
				  context.lineWidth = 2;
				  if (side[n] == 'Left') 
				  {
				  	X1 = XBox +40 + 30; 
				  	XMiddle = borx - ((borx-X1)/2);
				  }
				  else 
				  {
				  	X1 = XBox - 5;
				  	XMiddle = X1 - ((X1 - borx)/2);
			      }
			      Y1 = YBox+3+10-5;
				  YMiddle = bory + ((Y1-bory)/2);
		 	      YMiddle = bory ;
		 	      context.moveTo(X1, Y1); 
			      //context.lineTo(XMiddle,YMiddle);
			      //context.lineTo(borx,bory);
			      context.bezierCurveTo(XMiddle,YMiddle,XMiddle,YMiddle,borx,bory);
			      context.stroke();

				  context.lineCap = 'butt';
			      
				  //  *********************    Labels Section   MAIN PART  *************************************************


	          //realn ++;

		      startAngle = endAngle;
	      }
		  n++;
	  }

 	      // Draw Inner Circle
 	      context.beginPath();
		  context.fillStyle = '#54bc00';
	      context.lineWidth = 1;
		  context.arc(x, y, radius-50, (-Math.PI/2), (Math.PI*2), counterClockwise);
	      context.fill();
          context.strokeStyle="grey";
	      context.stroke();
		  context.lineWidth = 35;

 		  // Draw Main Text
		  //var font = '30pt Lucida Sans Unicode';
          var font = '28pt Arial';
		  var message = MaxReports+'';
		  context.fillStyle = '#54bc00';
		  context.fillStyle = 'white';
		  context.textAlign = 'left';
		  context.textBaseline = 'top'; // important!
		  context.font = font;
		  var w = context.measureText(message).width;
		  var TextH = GetCanvasTextHeight(message,font);
		  context.fillText(message, x-(w/2), y-(TextH-7));
 

 	//}, 500)
	};


	
	$('body').bind('mousedown keydown', function(event) {
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
    });
	
	var Canvas1State = 0;
	
	$('#PHSLabel').live('click',function(){
	if (Canvas1State == 0)	{
		$('#PHSLabel').html('See Graph');
		var contentAlt = '';
		
		/*
		var contentAlt = 			'<p>Admin    Data: '+ConnData[0].Data+'   Latest Update: '+ConnData[0].latest_update+'    Doctor: '+ConnData[0].doctor_signed+'</p>';
		contentAlt = contentAlt+    '<p>DX       Data: '+ConnData[1].Data+'   Latest Update: '+ConnData[1].latest_update+'    Doctor: '+ConnData[1].doctor_signed+'</p>';
		contentAlt = contentAlt+    '<p>Med      Data: '+ConnData[2].Data+'   Latest Update: '+ConnData[2].latest_update+'    Doctor: '+ConnData[2].doctor_signed+'</p>';
		contentAlt = contentAlt+    '<p>Immuno   Data: '+ConnData[3].Data+'   Latest Update: '+ConnData[3].latest_update+'    Doctor: '+ConnData[3].doctor_signed+'</p>';
		contentAlt = contentAlt+    '<p>Family   Data: '+ConnData[4].Data+'   Latest Update: '+ConnData[4].latest_update+'    Doctor: '+ConnData[4].doctor_signed+'</p>';
		contentAlt = contentAlt+    '<p>Habits   Data: '+ConnData[5].Data+'   Latest Update: '+ConnData[5].latest_update+'    Doctor: '+ConnData[5].doctor_signed+'</p>';
		*/
		
		var bestDate = Date.parse(ConnData[0].latest_update);		
		var sourceDate = '';
		var textDate = '';
		var titleU = '';
		var k = 0;
		while (k < 5)
		{
			thisDate = Date.parse(ConnData[k].latest_update);
			if (thisDate >= bestDate) 
				{ 
					bestDate = thisDate;	
					sourceDate = ConnData[k].latest_update;
					//thisVerified = Date.parse(ConnData[k].doctor_signed);
					//if (thisVerified > -1) { bestVerified = ConnData[k].doctor_signed; }		
				}		
			k++;
		} 
		var translation = '';
		var translation2 = '';
		var translation3 = '';
		var translation4 = '';
		var translation5 = '';
		
		if(language == 'th'){
		translation = 'Última actualización en';
		translation2 = 'dias';
		translation3 = 'semana';
		translation4 = 'meses';
		translation5 = 'años';
		}else if(language == 'en'){
		translation = 'Latest update on';
		translation2 = 'days';
		translation3 = 'weeks';
		translation4 = 'months';
		translation5 = 'years';
		}
		
		titleU =  translation+' '+ sourceDate.substr(0, 10);			
		var todayDate = new Date();
		var ageDate = todayDate - bestDate;
		var DiffDays = parseInt(ageDate / (1000*60*60*24)) ;
		var DiffWeeks = parseInt(ageDate / (1000*60*60*24*7)) ;
		var DiffMonths = parseInt(ageDate / (1000*60*60*24*30)) ;
		var DiffYears = parseInt(ageDate / (1000*60*60*24*365)) ;
		if (DiffDays < 14) textDate = DiffDays+' '+translation2;
		if (DiffWeeks >= 2) textDate = DiffWeeks+' '+translation3;
		if (DiffWeeks >= 8) textDate = DiffMonths+' '+translation4;
		if (DiffMonths >= 13) textDate = DiffYears+' '+translation5;
		
		//alert ('Best Date: '+sourceDate+'  Now is: '+todayDate.getHours()+':'+todayDate.getMinutes()+' Diff in minutes: ' + ageDate / (1000*60)  );
		//alert ('Days: '+DiffDays+'   Weeks: '+DiffWeeks+'    Months: '+DiffMonths+'   Years: '+DiffYears+'   ');
		//alert (textDate);		
		var updated = DiffWeeks;
		if (updated > 1) 
			{
			var translation = '';

		if(language == 'th'){
		translation = 'Actualizar';
		}else if(language == 'en'){
		translation = 'Update';
		}
		
				contentTime = 'Summary is '+textDate+' old'; 
				iconTime = '<button id="UpdateSumm" class="find_doctor_button" style="float:right; display: block; background-color: rgb(82, 216, 89); width:80px; margin-top:-3px;">'+translation+'</button>';
			}
		else
			{
			var translation = '';

		if(language == 'th'){
		translation = 'Actualizado';
		}else if(language == 'en'){
		translation = 'Updated';
		}
				contentTime = translation;
				iconTime = '<i class="icon-check icon-2x" style="float:left;"></i>';
			}
		if (DiffYears > 4) 
			{
			var translation = '';
			var translation2 = '';

		if(language == 'th'){
		translation = 'Actualizar';
		translation2 = 'Resumen nunca actualizado';
		}else if(language == 'en'){
		translation = 'Update';
		translation2 = 'Summary never updated';
		}
		
				contentTime = translation2; 
				iconTime = '<i class="icon-exclamation icon-2x" style="float:left; color:rgb(216, 72, 64);"></i><button id="UpdateSumm" class="find_doctor_button" style="float:right; display: block; background-color: rgb(82, 216, 89); width:80px; margin-top:-3px;">'+translation+'</button>';
			}
		
		
		var verified = -1;
		var bestVerified = -1;
		var bestDate = Date.parse('1975-01-01 00:00:00');		
		var VerifiedDate = bestDate;
		var title = '';
			
		var k = 0;
		
        //Below new variables added by Pallab for fixing the blank doctor line issue
        
        
        var memberName = 'Rajkumar';
        var memberSurname = 'Patient';
        var memberUpdateTime = '';
		var thisVerified = '';
        var subTitle = '';
        var formattedMemberDate = Date.parse('1975-01-01 00:00:00');
        var formattedDoctorDate = Date.parse('1975-01-01 00:00:00');
        var thisDate = '';
        var doctorId = '';
        var date_holder = '';
        
        while (k < 7)
		{
		    //console.log('Value of k is'+k);
            thisVerified = ConnDataPartial[k].doctor_signed;
            
            //Start of new code added by Pallab for fixing blank doctor verified ribbon issue
            if (thisVerified < 0)
            {
                    
                
                
                if(Date.parse(ConnDataPartial[k].latest_update) > bestDate)
                {
                    formattedMemberDate = Date.parse(ConnDataPartial[k].latest_update); 
                    date_holder = ConnDataPartial[k].latest_update;
                    bestdate = formattedMemberDate;
                    console.log('case of doctor_previous: '+doctorId);
                    console.log('\ndoctor_signed: '+thisVerified);
                    console.log('\nformattedMemberDate: '+formattedMemberDate);
                    console.log('\nlatest_update: '+formattedDoctorDate);
                    
                } 
                    
            }
            else
            {
                
                if(Date.parse(ConnDataPartial[k].latest_update) > bestDate)
                {
					doctorId = ConnDataPartial[k].doctor_signed;
					formattedDoctorDate = Date.parse(ConnDataPartial[k].latest_update); 
					date_holder = ConnDataPartial[k].latest_update;
					bestDate = formattedDoctorDate;
					console.log('case of else: '+doctorId);
					console.log('\ndoctor_signed: '+thisVerified);
					console.log('\nformattedMemberDate: '+formattedMemberDate);
					console.log('\nlatest_update: '+formattedDoctorDate);
				}
                
            }
            //End of new code added by Pallab for fixing blank doctor verified ribbon issue
            
            //Below lines commented by Pallab
            /*thisVerified = ConnData[k].doctor_signed;
			thisDate = Date.parse(ConnData[k].latest_update);
			console.log(' K='+k+'   Doctor:'+k+'  Date:'+k+'');
			if (thisVerified != -1 && (thisDate >= bestDate) ) 
				{ 
					bestDate = thisDate;	
					bestVerified = ConnData[k].doctor_signed; 
					VerifiedDate = ConnData[k].latest_update; 
				}	*/	
			k++;
		}

        
        //console.log('Bestdate is'+bestDate+'FormattedMemberDate'+formattedMemberDate);
        //Below lines added by Pallab
       //Start of new code added by Pallab
        if(thisVerified < 0 && formattedMemberDate > formattedDoctorDate)
        {
            var offset = new Date().getTimezoneOffset();
            var formattedUserDate = moment(formattedMemberDate).add('minutes',(offset*-1)).fromNow();
            subTitle = '<br>Edited by '+memberName+' '+memberSurname+' '+formattedUserDate+'<span class ="ribbon-lgtext">';  
        }
        //End of new code added by Pallab
        
        
        //ribbonText = '';
		if (doctorId > 0 && formattedMemberDate < formattedDoctorDate) //Changed this statement from bestVerified > -1 to doctorId >= -1
		{
		var translation = '';
		var translation2 = '';
		var translation3 = '';

		if(language == 'th'){
		translation = 'Verificar';
		tranlation2 = 'Verificado por';
		translation3 = 'en';
		}else if(language == 'en'){
		translation = 'Verify';
		tranlation2 = 'Verified by';
		translation3 = 'on';
		}
			namedoctor = LanzaAjax ('../getDoctorName.php?IdDoctor='+doctorId); //Changed this statement from getDoctorName.php?IdDoctor='+bestVerified to getDoctorName.php?IdDoctor='+doctorId by Pallab
			contentVerif = translation;// by '+namedoctor;
            var offset = new Date().getTimezoneOffset();
            var formattedDate = moment(bestDate).add('minutes',(offset*-1)).fromNow(); // Changed this statement from moment(VerifiedDate) to moment(bestDate) by Pallab
            
            //Below if block added by Pallab
            if(formattedDoctorDate > bestDate)
            {
                 formattedDate = moment(formattedDoctorDate).add('minutes',(offset*-1)).fromNow();
            }
            
            
			title =  translation2+' '+namedoctor+' '+ formattedDate+subTitle; //Added the subTitle variable by Pallab
			iconVerif = '<i class="icon-check icon-2x"></i>';				
		}
		else
		{
			
			var translation = '';

		if(language == 'th'){
		translation = 'Verificar';
		contentVerif = 'No Verificado'; 
		}else if(language == 'en'){
		translation = 'Verify';
		contentVerif = 'Not Verified'; 
		}
			iconVerif = '<i class="icon-exclamation icon-2x" style="float:left; color:rgb(216, 72, 64);"></i><button id="VerifyDoctor" class="find_doctor_button" style="float:right; display: block; background-color: rgb(34, 174, 255); width:80px; margin-top:-3px;">'+translation+'</button>';			
		}
		
		var complete = 0;
		var segments = 0;
		var iconComplet = '<i class="icon-check icon-2x"></i>';
		var k = 0;
		while (k < 5)
		{
			complete += parseInt(ConnDataPartial[k].Data);
			if (ConnDataPartial[k].Data > 0 ) segments++;
			k++;
		}
		if (segments < 4) iconComplet = '<i class="icon-exclamation icon-2x" style="float:left; color:rgb(216, 72, 64);"></i>';			

			var translation = '';

		if(language == 'th'){
		translation = 'eventos registrados';
		}else if(language == 'en'){
		translation = 'events registered';
		}
        
 	    AdminData = ConnData[0].Data;
	    PastDx = ConnData[1].Data;
	    Medications = ConnData[2].Data;
	    Immuno = ConnData[3].Data;
	    Family = ConnData[4].Data;
	    Habits = ConnData[5].Data;
	    Allergies = ConnData[6].Data;
	    console.log('ALLERGIES:'+Allergies);
                           
        contentAlt += '	               <style>';
        contentAlt += '	                div.SumBox{';
        contentAlt += '	                    float:left; ';
        contentAlt += '	                    position: absolute; ';
        contentAlt += '	                    z-index: 10; ';
        contentAlt += '	                    box-shadow: inset 0px 0px 2px 0px whitesmoke;';
        contentAlt += '	                }';
        contentAlt += '	                div.SumBox:hover {         ';
        contentAlt += '	                    opacity: 0.8;                ';
        contentAlt += '	                }                                ';
        contentAlt += '	                ';
        contentAlt += '	                img.SumBoxIcon{';
        contentAlt += '	                    position:absolute;';
        contentAlt += '	                    width:30px;';
        contentAlt += '	                    height:30px;';
        contentAlt += '	                    top: 50%;';
        contentAlt += '	                    left: 50%;';
        contentAlt += '	                    transform: translate(-50%, -50%);';
        contentAlt += '	                    font-size: 20px;';
        contentAlt += '	                    color: grey;';
        contentAlt += '	                    z-index:460;';
        contentAlt += '	                    /*';
        contentAlt += '	                    border:1px solid #cacaca;';
        contentAlt += '	                    border-radius:10px;';
        contentAlt += '	                    */';
        contentAlt += '	                }';
        contentAlt += '	';
        contentAlt += '	                div.BannerIcon{     ';
        contentAlt += '	                    border: 1px solid #cacaca;       ';
        contentAlt += '	                    width: 15px;       ';
        contentAlt += '	                    height: 15px;      ';
        contentAlt += '	                    border-radius: 10px;       ';
        contentAlt += '	                    position: absolute;        ';
        contentAlt += '	                    left: 50%;       ';
        contentAlt += '	                    top: 50%;         ';
        contentAlt += '	                    z-index: 440;          ';
        contentAlt += '	                    margin-left: 8px;      ';
        contentAlt += '	                    margin-top: -18px;     ';
        contentAlt += '	                    color: #cacaca;     ';
        contentAlt += '	                    font-size: 12px;';
        contentAlt += '	                    text-align: center;     ';
        contentAlt += '	                    font-weight: bold;     ';
        contentAlt += '	                    line-height: 15px;     ';
        contentAlt += '	                }';

		//THIS DETERMINES IF USER IS MAC OR WINDOWS
var mactest=navigator.userAgent.indexOf("Mac")!=-1;

if (mactest)
{
//alert('mac');
var box1 = 'top:50%;left:45%;';
var box2 = 'top:50%;left:45%;';
var box3 = 'top:43%;left:48%;';
var box4 = 'top:43%;left:43%;';
var box5 = 'top:45%;left:45%;';
var box6 = 'top:48%;left:45%;';
var box7 = 'top:45%;left:40%;';
} else {
var box1 = 'top:40%;left:35%;';
var box2 = 'top:40%;left:40%;';
var box3 = 'top:30%;left:35%;';
var box4 = 'top:30%;left:32%;';
var box5 = 'top:30%;left:27%;';
var box6 = 'top:25%;left:35%;';
var box7 = 'top:25%;left:25%;';
}

        contentAlt += '	                    ';
        contentAlt += '	                </style>  ';
        contentAlt += '	                <div style="background-color:white; z-index:999; position:absolute; left:0%; top:0%; width:100%; height:10px;"></div>  ';
        contentAlt += '	                <div style="background-color:white; z-index:999; position:absolute; left:320px; top:0%; width:50px; height:100%;"></div>  ';
        
        contentAlt += '	                <div id="SumGraph2" style="width: 275px; height: 165px; margin-top: 10px; margin-left: 45px; border:0px solid #cacaca; position:relative; cursor: pointer; border-radius:10px;">';
        contentAlt += '	                  ';
        contentAlt += '	                    <div class="SumBox" style="width:45%; height:45%; top:0%; left:0%; background-color:#54bc00; border-top-left-radius:10px;">';
        contentAlt += '	                       <img style="'+box1+'" class="SumBoxIcon" src="images/icons/Adminx2_svg.png" />';
        if (AdminData > 0)      contentAlt += '	                       <div class="BannerIcon" >'+AdminData+'</div>';
        contentAlt += '	                    </div>        ';                              
        contentAlt += '	                    <div class="SumBox" style="width:55%; height:45%; top:0%; left:45%; background-color:#2C3E50;  border-top-right-radius:10px;">';
        contentAlt += '	                        <img style="'+box2+'" class="SumBoxIcon" src="images/icons/historyx2_svg.png" />';
        if (PastDx > 0)         contentAlt += '	                        <div class="BannerIcon" >'+PastDx+'</div>';
        contentAlt += '	                    </div>     ';       
        contentAlt += '	                    <div class="SumBox" style="width:30%; height:30%; top:45%; left:0%; background-color:#18BC9C;">';
        contentAlt += '	                        <img style="'+box3+'" class="SumBoxIcon" src="images/icons/medicationx2_svg.png" />';
        if (Medications > 0)     contentAlt += '	                        <div class="BannerIcon" >'+Medications+'</div>';
        contentAlt += '	                   </div>  ';                 
        contentAlt += '	                    <div class="SumBox" style="width:40%; height:30%; top:45%; left:30%; background-color:#E74C3C;">';
        contentAlt += '	                        <img style="'+box4+'" class="SumBoxIcon" src="images/icons/familyx2_svg.png" />';
        if (Family > 0)          contentAlt += '	                        <div class="BannerIcon" >'+Family+'</div>';
        contentAlt += '	                  </div>         ';   
        //contentAlt += '	                        <div style="width:calc(40% - 3px); height:calc(30% - 3px); top:calc(45% + 1px); left:calc(30% + 1px); border:1px solid white; position:absolute; z-index:490;"></div>';
        contentAlt += '	                    <div class="SumBox" style="width:30%; height:55%; top:45%; left:70%; background-color:#3498DB;  border-bottom-right-radius:10px;">';
        contentAlt += '	                       <img style="'+box5+'" class="SumBoxIcon" src="images/icons/habitsx2_svg.png" />';
        if (Habits > 0)         contentAlt += '	                        <div class="BannerIcon" >'+Habits+'</div>';
        contentAlt += '	                   </div>            ';
        //contentAlt += '	                        <div style="width:calc(30% - 3px); height:calc(55% - 3px); top:calc(45% + 1px); left:calc(70% + 1px); border:1px solid white; position:absolute; z-index:490;  border-bottom-right-radius: 10px;"></div>';
        contentAlt += '	                    <div class="SumBox" style="width:50%; height:25%; top:75%; left:0%; background-color:#F39C12;  border-bottom-left-radius:10px;">';
        contentAlt += '	                        <img style="'+box6+'" class="SumBoxIcon" src="images/icons/immunox2_svg.png" />';
        if (Immuno > 0)         contentAlt += '	                        <div class="BannerIcon" >'+Immuno+'</div>';
        contentAlt += '	                  </div>    ';        
        contentAlt += '	                    <div class="SumBox" style="width:20%; height:25%; top:75%; left:50%; background-color:#24CCC1;opacity:1">';
        contentAlt += '	                        <img style="'+box7+'" class="SumBoxIcon" src="images/icons/allergyx2_svg.png" />';
        if (Allergies > 0)      contentAlt += '	                        <div class="BannerIcon" >'+Allergies+'</div>';
        contentAlt += '	                   </div>      '; 
        
        //console.log("ContentAlt"+contentAlt);
        //console.log("doctoriD  "+doctorId);
        if (doctorId > 0 && formattedMemberDate < formattedDoctorDate){ // Changed this statement from bestVerified > -1 to doctorId > -1
        
            //console.log("In Verified Block");
            contentAlt += '	                    <div class="ribbon-banner" id="ribbon-verified" href="#" style="display: block; width:220px; right:-63px; top:22px; background-color:#DB3469;text-align:center;"><span class="ribbon-lgtext">Verified</span><br> <span class="ribbon-smtext" style="font-size:8px;">'+title+'<span class="ribbon-lgtext"></span></span></div>'; //Added text-align-center by Pallab for fixing the Verified ribbon shifted towards left process
        
        } //Removing the semicolon beside the right of }
        contentAlt += '	';
        contentAlt += '	                  </div> ';
                          

		/*
		contentAlt += '				             	<div style="float:left; height:45px; width:100%;"></div>';
		contentAlt += '			             		<div style="float:left; height:125px; width:100%; ">';
		contentAlt += '			             		<div style="float:left; height:125px; width:; border:0px solid #cacaca;">';
		contentAlt += '								<div style="float:left; height:40px; width:"> <!-- ROW 1 -->';
		contentAlt += '									<div style="float:left; background-color:#22aeff; width:30px; height:30px; border-radius:15px; font-size:14px; color:white;"><p style="margin-top:5px; margin-left:10px;">A</p></div>';					             	 
		contentAlt += '									<div style="float:left; width:180px; height:30px; font-size:16px; color:#22aeff; margin-left:20px; margin-top:4px;" title="'+titleU+'" lang="en"> '+contentTime+'</div>	';				             	
		contentAlt += '									<div style="float:left; width:100px; height:30px; font-size:12px; color:#54bc00; margin-left:0px; margin-top:2px;">'+iconTime+'</div>';
		contentAlt += '								</div>	';
		contentAlt += '								<div style="float:left; height:40px; width:100%;"> <!-- ROW 2 -->';
		contentAlt += '									<div style="float:left; background-color:#22aeff; width:30px; height:30px; border-radius:15px; font-size:14px; color:white;"><p style="margin-top:5px; margin-left:10px;">B</p></div>';					             	 
		contentAlt += '									<div style="float:left; width:180px; height:30px; font-size:16px; color:#22aeff; margin-left:20px; margin-top:4px;" title="'+title+'" lang="en"> '+contentVerif+'</div>		';			             	
		contentAlt += '									<div style="float:left; width:100px; height:30px; font-size:12px; color:#54bc00; margin-left:0px; margin-top:2px;">'+iconVerif+'</div>';	             
		contentAlt += '								</div>';	
		contentAlt += '								<div style="float:left; height:40px; width:100%;"> <!-- ROW 3 -->';
		contentAlt += '									<div style="float:left; background-color:#22aeff; width:30px; height:30px; border-radius:15px; font-size:14px; color:white;"><p style="margin-top:5px; margin-left:10px;">C</p></div>';					             	 
		contentAlt += '									<div style="float:left; width:180px; height:30px; font-size:16px; color:#22aeff; margin-left:20px; margin-top:4px;" title="'+title+'"> '+complete+' <span lang="en">'+translation+'</span></div>		';			             	
		contentAlt += '									<div style="float:left; width:100px; height:30px; font-size:12px; color:#54bc00; margin-left:0px; margin-top:2px;">'+iconComplet+'</div>';	             
		contentAlt += '								</div>';	
		contentAlt += '			             	</div>';
		contentAlt += '			             	</div>';
		contentAlt += '			             	<div style="float:left; height:10px; width:100%;"></div>';
*/
		
		$('#ALTCanvas1').html(contentAlt);
		$('#ALTCanvas1').animate({"height":"200px"}, 1000);
		$('#PHSLabel').css('background-color','rgb(82, 216, 89)');
		Canvas1State = 1;
	}else
	{
		$('#PHSLabel').html('See Status');
		$('#PHSLabel').css('background-color','rgb(74, 134, 54)');
		$('#ALTCanvas1').animate({"height":"0px"}, 1000);
		Canvas1State = 0;
// rgb(82, 216, 89); // see graph
//		rgb(74, 134, 54);
	}
	
	});

	$('#myCanvas').live('click',function(){
		var myClass = $('#USERID').val();
        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" scrolling="no" style="width:1000px;height:690px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true});
		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});
    $('#editPatient').live('click',function(){
        var userID = $('#USERID').val();
		window.location.replace('patientdetailMED-new.php?IdUsu='+userID); // Changed the url value from patientdetailMED-newUSER.php to patientdetailMED-new.php
    });    

	$('#ButtonReview').live('click',function(){
		var myClass = $('#USERID').val();

        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true}).onclose(function(data,success)
           {
             $.post("SavePatientSummaryAsPDF_table.php",{IdUsu: mem_id},function(data,success)
               {
              });
           
           }); // Onclosing of the dialog frame the patient updated data is database and a pdf is generated

		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});

       
//	$('#UpdateSumm').live('click',function(){
	$('#SumGraph2').live('click',function(){
		var myClass = $('#USERID').val();
        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true});
		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});

	$('#VerifyDoctor').live('click',function(){
		 //stopPropagation();
		 $("#Talk").trigger("click");
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
		window.location.replace('patientdetailMED-new.php?IdUsu='+myClass); // Changed the url value from patientdetailMED-newUSER.php to patientdetailMED-new.php
	});


    $(window).bind('load', function(){
        $('#newinbox').trigger('click');
    });
 
	$('#BotMessages').live('click',function(){
        $('#compose_message').trigger('click');
	});
	
	$('#newinbox').live('click',function(){
       //alert('trigger');
	   var queUrl ='/getInboxMessageUSER.php?IdMED='+both_id+'&patient='+mem_id;
	   //alert (queUrl);
       $('#datatable_3').load(queUrl);
	   $('#datatable_3').trigger('update');
           
   });
        
 
        
   
    $('#newoutbox').live('click',function(){
      //alert('trigger');
	   var queUrl ='/getOutboxMessageUSER.php?IdMED='+both_id+'&patient='+mem_id;
	   $('#datatable_4').load(queUrl);
	   $('#datatable_4').trigger('update');
           
   });
    
    $('#SearchDirectory').live('click', function()
    {		
		//var Codes = GetICD10Code('Append');
		//var longit = Object.keys(Codes).length;	   	   
		//alert ('Retrieved '+longit+' items. Example at [0].description: '+Codes[0].description);
        $('#search_speciality').val("Any");
        $('#country_search').val("-1");
        $('#region_search').val("-1");
        $('#region_search').html('');
        $("#advanced_toggle_button").removeClass("doctor_search_advanced_toggle_button_selected").addClass("doctor_search_advanced_toggle_button");
        $("#doctor_rows").css("display", "block");
        $("#doctors_search_page_buttons").css("display", "block");
        $("#doctor_search_advanced").css("display", "none");
        $("#search_doctor_toolbar").css("display", "block");
        $("#personal_doctors_cancel_change").css("display", "none");
        personal_doctor_search = 0;
        doctors_page_memory.length = 0;
        doctors_last_result = 0;
        doctors_next_result = 0;
        get_doctors();
        $("#search_modal").dialog({bigframe: true, width: 902, height: 730, resize: false, modal: true, resizable: false});
		
	});
    
    Stripe.setPublishableKey("pk_test_YBtrxG7xwZU9RO1VY8SeaEe9");
    function load_credit_cards(cards)
    {
        $("#credit_cards_container").html('');
        for(var i = 0; i < cards.length; i++)
        {
            var html = '';
            html += '<div class="credit_card_row"';
            if(i == 0 && i == cards.length - 1)
            {
                html += ' style="border-radius: 10px;"';
            }
            else if(i == 0)
            {
                html += ' style="border-top-left-radius: 10px; border-top-right-radius: 10px;"';
            }
            else if(i == cards.length - 1)
            {
                html += ' style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;"';
            }
            html += '>';
            html += '<button id="clear-credit-card-'+cards[i]['id']+'" style="width: 18px; height: 18px; float: right; color: #F00; padding: 0px; background-color: inherit; border: 0px solid #FFF; border-radius: 3px; outline: 0px;">';
            html += '<i class="icon-remove" style="width: 12px; height: 12px;"></i>';
            html += '</button>'
            html += '<img src="'+cards[i]['icon']+'" style="float: left; margin-left: 10px; height: 38px;" />';
            html += '<span style="float: left; color: #5A5A5A; font-size: 14px; margin-left: 60px; margin-top: 8px;">****   ****   ****   '+cards[i]['number']+'</span>';
            html += '</div>';
            $("#credit_cards_container").append(html);
        }
        $('button[id^="clear-credit-card"]').on('click', function()
        {
            var card_id = $(this).attr("id").split("-")[3];
            $("#setup_modal_notification").html('<img src="images/load/8.gif" alt="">');
            $("#setup_modal_notification").css("background-color", "#FFF");
            $("#setup_modal_notification_container").css("opacity", "1.0");
            $.post("change_credit_card.php", {type: '2', action: '2', id: $("#USERID").val(), card_id: card_id}, function(data, status)
            {
                //console.log(data);
                $("#setup_modal_notification_container").css("opacity", "0.0");
                if(data == '1')
                {
                    $("#setup_modal_notification").css("background-color", "#52D859");
                    $("#setup_modal_notification").html('<p style="color: #fff;">Credit Card Removed!</p>');
                    $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                    $.post("get_user_info.php", {id: $("#USERID").val()}, function(data, status)
                    {
                        var info = JSON.parse(data);
                        if(info.hasOwnProperty('cards') && info['cards'].length > 0)
                        {
                            load_credit_cards(info['cards']);
                        }
                    });
                }
                else if(data.substr(0, 2) == 'IC')
                {
                    alert("You are currently in a consultation, please wait until the consultation is over to delete credit cards.");
                }
                else
                {
                    $("#setup_modal_notification").css("background-color", "#D5483A");
                    $("#setup_modal_notification").html('<p style="color: #fff;">Unable To Remove Card</p>');
                    $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                }
            });
        });
    }
    
    // get and load user info for setup modal
    $("#setup_phone").intlTelInput();
    $.post("get_user_info.php", {id: $("#USERID").val()}, function(data, status)
    {
        var info = JSON.parse(data);
        $("#timezone_picker option[value='" + info['timezone'] + "']").attr('selected', 'selected');
        if(info.hasOwnProperty('location') && info['location'].length > 0)
        {
            setTimeout(function(){
                //console.log(info['location'].trim());
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
        if(info.hasOwnProperty('cards') && info['cards'].length > 0)
        {
            load_credit_cards(info['cards']);
        }
    });
        
    function stripeResponseHandler(status, response) {
        
        if (response.error) 
        {
            $("#setup_modal_notification").css("background-color", "#D5483A");
            $("#setup_modal_notification").html('<p style="color: #fff;">'+response.error.message+'</p>');
            $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
            }});
        } 
        else 
        {
            $("#setup_modal_notification").html('<img src="images/load/8.gif" alt="">');
            $("#setup_modal_notification").css("background-color", "#FFF");
            $("#setup_modal_notification_container").css("opacity", "1.0");
            $.post("change_credit_card.php", {type: '2', action: '1', id: $("#USERID").val(), token: response.id}, function(data, status)
            {
                //console.log(data);
                $("#setup_modal_notification_container").css("opacity", "0.0");
                if(data == '1')
                {
                    $("#setup_modal_notification").css("background-color", "#52D859");
                    $("#setup_modal_notification").html('<p style="color: #fff;">Credit Card Added!</p>');
                    $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                    $.post("get_user_info.php", {id: $("#USERID").val()}, function(data, status)
                    {
                        var info = JSON.parse(data);
                        if(info.hasOwnProperty('cards') && info['cards'].length > 0)
                        {
                            load_credit_cards(info['cards']);
                        }
                    });
                }
                else
                {
                    $("#setup_modal_notification").css("background-color", "#D5483A");
                    $("#setup_modal_notification").html('<p style="color: #fff;">Unable To Add Card</p>');
                    $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                        setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                    }});
                }
            });
        }
    };
    
    $("#add_card_button").on('click', function()
    {
        var date = $('#credit_card_exp_date').val().split("-");
        Stripe.card.createToken({
            number: $('#credit_card_number').val(),
            cvc: $('#credit_card_csv_code').val(),
            exp_month: date[1],
            exp_year: date[0]
        }, stripeResponseHandler);
        
    });
    $('#timezone_button').on('click', function()
    {
        $("#update_spinning_icon").css("visibility", "visible");
        $.post("update_user.php", {id: $("#USERID").val(), timezone: $("#timezone_picker").val().toString()}, function(data, status)
        {
            $("#update_spinning_icon").css("visibility", "hidden");
            $("#setup_modal_notification").css("background-color", "#52D859");
            $("#setup_modal_notification").html('<p style="color: #fff;">Timezone Changed Successfully!</p>');
            $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {location.reload();}});}, 2000);
            }});
            timezone_changed = $("#timezone_picker").val();
            
        });
        
        
    });
    $('#location_button').on('click', function()
    {
        $("#update_spinning_icon").css("visibility", "visible");
        $.post("update_user.php", {id: $("#USERID").val(), location: $("#country_setup").val(), location2: $("#state_setup").val()}, function(data, status)
        {
            $("#update_spinning_icon").css("visibility", "hidden");
            $("#setup_modal_notification").css("background-color", "#52D859");
            $("#setup_modal_notification").html('<p style="color: #fff;">Location Changed Successfully!</p>');
            $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {location.reload();}});}, 2000);
            }});

            country_changed = $("#country_setup").val();
            state_changed = $("#state_setup").val();
        });
        
        
    });
    $('#contact_button').on('click', function()
    {
        $("#update_spinning_icon").css("visibility", "visible");
        $.post("update_user.php", {id: $("#USERID").val(), email: $("#setup_email").val(), phone: $("#setup_phone").val()}, function(data, status)
        {
            $("#update_spinning_icon").css("visibility", "hidden");
            //console.log(data);
            if(data.length > 0)
            {
                $("#setup_modal_notification").css("background-color", "#D5483A");
                $("#setup_modal_notification").html('<p style="color: #fff;">'+data+'</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            }
            else
            {
                $("#setup_modal_notification").css("background-color", "#52D859");
                $("#setup_modal_notification").html('<p style="color: #fff;">Contact Information Changed Successfully!</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {location.reload();}});}, 2000);
                }});
            }
        });
        
    });
    $('button[id^="setup_menu_"]').on('click', function()
    {
        $('button[id^="setup_menu_"]').each(function(index)
        {
            $(this).css('background-color', '#FBFBFB');
            $(this).css('color', '#22AEFF');
            $(this).css('border', '1px solid #E6E6E6');
        });
        $('div[id^="setup_page_"]').each(function(index)
        {
            $(this).css('display', 'none');
        });
        var this_id = $(this).attr('id').split('_')[2];
        
        $(this).css('background-color', '#22AEFF');
        $(this).css('color', '#FFF');
        $(this).css('border', '0px solid #E6E6E6');
        $("#setup_page_"+this_id).css('display', 'block');
        if(this_id == '1')
        {
            // password
            $('#setup_title').text("Change Password");
        }
        else if(this_id == '2')
        {
            // timezone
            $('#setup_title').text("Set Timezone");
        }
        else if(this_id == '3')
        {
            // credit card
            $('#setup_title').text("Manage Credit Cards");
        }
        else if(this_id == '4')
        {
            // location
            $('#setup_title').text("Set Location");
        }
        else if(this_id == '5')
        {
            // location
            $('#setup_title').text("Set Contact Information");
        }
        else if(this_id == '6')
        {
            // subscriptions
            $('#setup_title').text("Subscription Management");
        }
        else if(this_id == '7')
        {
            // subscriptions
            $('#setup_title').text("Member Identity");
        }
    });
    
    var state_changed = "";
    var state_changed = "";
    var country_changed = "";
    var timezone_changed = "";       
    $('#SetUp').live('click', function()
    {

        
        $("#change_password_validated_section").css("display", "none");
        $("#pw1").val("");
        $("#pw2").val("");
        $("#pw3").val("");
        $("#setup_modal_notification_container").css("margin-top", "0px");
        $("#setup_modal").dialog({bigframe: true, width: 650, height: 470, resize: false, modal: true});
        
        
        var country = "";//geoplugin_countryName();
        var region ="";
        if (country == "United States") {
            country = "USA";
        }   

        
        var patient_id = mem_id;
        var place = mem_location;
        
        location_array = place.split(",");
        if (location_array.length ==2) {
            region = location_array[0].trim();
            country = location_array[1].trim();


        } else if ((location_array.length == 1)&& (location != "")) {
            
            country = place.trim();
        }   
        
        //if the country has already been changed
        if (country_changed != "") {
            country = country_changed;   
        }    
        if (country_changed != "") {
            region = state_changed;   
        }    
        
        $("#country_setup").val(country);			 
	    $("#country_setup").change();
        
        $("#state_setup").val(region);			 
	    $("#state_setup").change();
        
        var timezone = mem_timezone;
        
        timezone_array = timezone.split(":");
        timezone_format = timezone_array[0];
        timezone_format_mins = timezone_array[1];
        timezone_minutes = ".0";
        if (timezone_format_mins == "30") {
            timezone_minutes = ".5";   
        }
        timezone_format=parseInt(timezone_format, 10)+timezone_minutes;
        
        if (timezone_changed != "") {
            timezone_format = timezone_changed;   
        }    
        $("#timezone_picker").val(timezone_format);
        $("#timezone_picker").change();
        
    });
        
    $("#change_password_validate_button").live('click', function()
    {
        $.post("validate_password.php", {pat_id: $("#USERID").val(), pw: $("#pw1").val()}, function(data, status)
        {
            if(data == '1' && $("#change_password_validated_section").css("display") == 'none')
            {
                $("#change_password_validated_section").slideDown();
                
            }
            else
            {
                $("#setup_modal_notification").css("background-color", "#D5483A");
                $("#setup_modal_notification").html('<p style="color: #fff;">Password Incorrect</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            }
        });

    });
    $("#change_password_finish_button").live('click', function()
    {
        if($("#pw2").val() == $("#pw3").val())
        {
            $("#pw1").val("");
            $("#change_password_validated_section").slideUp();
            $.post("update_patient.php", {new_pw: $("#pw2").val(), pat_id: $("#USERID").val()}, function(data, status)
            {
                $("#pw2").val("");
                $("#pw3").val("");
                $("#setup_modal_notification").css("background-color", "#52D859");
                $("#setup_modal_notification").html('<p style="color: #fff;">Password Changed Successfully!</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            });
        }
        else
        {
            $("#setup_modal_notification").css("background-color", "#D5483A");
            $("#setup_modal_notification").html('<p style="color: #fff;">Passwords Did Not Match</p>');
            $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
        }
    });

    var doctor_to_connect = '';
    var type_of_doctor_to_find = '';
    var time_selected = -1;
    var day_selected= -1;
    var date_selected = '';
    var consultation_type = 1;
    var zones = null;
    var selected_timezone = "00:00:00";
    var status_interval = null;
    var latest_sid = 0;
        
    $("#country").on('change', function()
    {
        // the following code is to show the region select menu if the country is USA.
        if($(this).val() == 'USA')
        {
            $("#state").parent().parent().css('display', 'block');
        }
        else
        {
            $("#state").parent().parent().css('display', 'none');
        }
    });
    $("#country_setup").on('change', function()
    {
        // the following code is to show the region select menu if the country is USA.
        if($(this).val() == 'USA')
        {
            $("#state_setup").parent().parent().css('visibility', 'visible');
        }
        else
        {
            $("#state_setup").parent().parent().css('visibility', 'hidden');
        }
    });
    $('#Talk').live('click', function()
    {	
        doctor_to_connect = '';
        type_of_doctor_to_find = '';
        talk_mode = 0;
        $('#in_location_checkbox').removeAttr("checked");
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
        $("#find_doctor_modal").dialog({bgiframe: true, width: 550, height: 413, resize: false, modal: true}).on("dialogclose",function(data,success)
        {
            clearInterval(status_interval);
        });
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
        $('#find_doctor_my_doctors_3').css("display", "none");
        $('#find_doctor_appointment_1').css("display", "none");
        $('#find_doctor_appointment_2').css("display", "none");
        $("#find_doctor_appointment_3").css("display", "none");
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
    var videoTelemed = $("#videoTelemed").dialog({bigframe: true, width: 550, height: 440, minWidth: 550, minHeight: 440, sticky: false, modal: false, autoOpen: false, dialogClass: 'telemedModalClass', position: {my: "left+70", of: "#NombreComp"}, resize: function( event, ui ) 
      {
          $("#remoteVideo").children("video").each(function()
                                                   {
              $(this).css("height", "100%");
              $(this).css("width", "100%");
          });

      }, 
      beforeClose: function( event, ui ) 
      {
          $.post("update_webrtc.php", {doc_id: $("#MEDID").val(), status: 0}, function(){});
      }});
    $("#find_doctor_next_button").live('click', function()
    {
        if(find_doctor_page == 30 || find_doctor_page == 10)
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
        else if(find_doctor_page == 31 || find_doctor_page == 21 || find_doctor_page == 11)
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#find_doctor_label").text("Select Time");
            if(find_doctor_page == 31 || find_doctor_page == 11)
            {
                
                // find a doctor
                if($("#speciality").val() != null)
                {
                    var loc_1 = $("#country").val();
                    var loc_2 = '';
                    if($("#state").val().length > 0 && $("#state").val() != '-1' && $("#state").parent().parent().css('display') == 'block')
                    {
                        loc_2 = $("#state").val() + ", " + $("#country").val();
                    }
                    var mba = true;
                    if(find_doctor_page == 31)
                    {
                        mba = false;
                    }
                    $.post("find_doctor.php", {type: $("#speciality").val(), location_1: loc_1, location_2: loc_2, must_be_available: mba}, function(data, status)
                    {
                        //console.log(data);
                        if(data != 'none')
                        {
                            var info = JSON.parse(data);
                            selected_doctor_info = "recdoc_"+info['id']+"_"+info['phone']+"_"+info['name']+"_"+info['location'];
                            //console.log(selected_doctor_info);
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
                                if(find_doctor_page == 31)
                                {
                                    find_doctor_page = 32;
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
                                    $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;" lang="en"><strong lang="en">Thank you!</strong><br/><strong lang="en">Your consultation appointment is starting now.</strong><br/><br/><span lang="en" style="color: #555; font-size: 18px;">Call Status:  <span id="call_status_label" lang="en" style="color: #E07221;">Connecting</span></span></p>');
                                    $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
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
                            $("#not_found_text").html("Sorry, we could not find any<br/>"+$("#speciality").children("option:selected").text()+"s in your area.");
                            $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_3').fadeIn(300)}); 
                            $("#find_doctor_next_button").css("display", "none");
                            $("#step_bar_3").attr("class", "step_bar");
                            $("#step_circle_4").attr("class", "step_circle");
                            $("#find_doctor_label").text("Select Speciality");
                        }
                    });
                }
                else
                {
                    $("#step_bar_3").attr("class", "step_bar");
                    $("#step_circle_4").attr("class", "step_circle");
                    $("#find_doctor_label").text("Select Speciality");
                }
                
            }
            if(find_doctor_page == 21)
            {
                if(selected_doctor_available == 0)
                {
                    
                    if($('#in_location_checkbox').is(":checked"))
                    {
                        if(talk_mode == 0)
                        {
                            find_doctor_page = 22;
                            resetDateTimeSelector();
                            $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
                        }
                        else
                        {
                            find_doctor_page = 22;
                            resetDateTimeSelector();
                            $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
                        }
                    }
                    else
                    {
                        $("#step_bar_3").attr("class", "step_bar");
                        $("#step_circle_4").attr("class", "step_circle");
                        $("#find_doctor_label").text("Select Type");
                        alert("Please confirm your state by checking the confirmation checkbox.");
                    }
                }
                else
                {
                    
                    if($('#in_location_checkbox').is(":checked"))
                    {
                        if(talk_mode == 0)
                        {
                            find_doctor_page = 25;
                            $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_my_doctors_3').fadeIn(300)});
                        }
                        else
                        {
                            $('#connect_now_yes').trigger('click');
                        }
                    }
                    else
                    {
                        $("#step_bar_3").attr("class", "step_bar");
                        $("#step_circle_4").attr("class", "step_circle");
                        $("#find_doctor_label").text("Select Type");
                        alert("Please confirm your state by checking the confirmation checkbox.");
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
                //console.log(date_selected);
                var type = 1;
                if(consultation_type != 1)
                {
                    type = 0;
                }
                $.post("add_appointment.php", {medid: info[1], patid: $("#USERID").val(), date: date_selected, start_time: getSlotStartTime(time_selected), end_time: getSlotEndTime(time_selected), video: type, timezone: selected_timezone, type: 'pat'}, function(data,status)
                {
                    if(data != '-1')
                    {
                        $.get("send_appointment_email.php?id="+data+"&type=patient", function(data, status)
                        {
                        });
                    }
                });
            }
            if(find_doctor_page == 23)
            {
                find_doctor_page = 24;
                var info = selected_doctor_info.split("_");
                //console.log(date_selected);
                var type = 1;
                if(consultation_type != 1)
                {
                    type = 0;
                }
                $.post("add_appointment.php", {medid: info[1], patid: $("#USERID").val(), date: date_selected, start_time: getSlotStartTime(time_selected), end_time: getSlotEndTime(time_selected), video: type, timezone: selected_timezone, type: 'pat'}, function(data,status)
                {
                    if(data != '-1')
                    {
						console.log('data:'+data);
                        $.get("send_appointment_email.php?id="+data+"&type=patient", function(data, status)
                        {
                        });
                        
                        $("#find_doctor_modal").dialog('close');
                        swal("Appointment Created", "An appointment with this doctor has been successfully created!", "success");
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
                if(consultation_type == 1)
                {
                    $("#video_telemedicine_loading_bar").css("visibility", "visible");
                    $.post("start_telemed_videocall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[2], doc_id: info[1], pat_id: $("#USERID").val(), doc_name: (info[3] + ' ' + info[4]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status)
                    {
                        if(data.substr(0, 2) == 'IC')
                        {
                            $("#find_doctor_modal").dialog('close');
                            swal("Unavailable", "We're sorry, this doctor is already in a consultation with another member.\nPlease try another doctor or try again later.", "error");
                        }
                        else if(data.substr(0, 2) == 'NC')
                        {
                            $("#find_doctor_modal").dialog('close');
                            swal("No Credit Card", "You have not entered a credit card for your account.\nPlease enter a credit card in Setup and try again.", "error");
                        }
                        else
                        {
                            if(data == 1)
                            {
                                console.log('SELECTEDDOCTORINFO: ' + selected_doctor_info);
                                var doc_info = selected_doctor_info.split("_");
                                //window.open("telemedicine_patient.php?MED=" + info[1] + "&PAT=" + $("#USERID").val(),"Telemedicine","height=650,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
                                /*var localVideo = document.getElementById("localVideo");
                                var remoteVideo = document.getElementById("remoteVideo");

                                var constraints = {video: true, audio: true};
                                
                                var teleurl = $("DOMAIN").val();    //Removed the hardcoded url 'http://dev.health2.me:8888' - Debraj
                                var parseURL = document.createElement('a');
                                parseURL.href = teleurl;
                                teleurl = parseURL.protocol + '//' + parseURL.hostname + ':8888';

                                console.log("SIGNALING SERVER: " + teleurl);

                                $.post("https://api.xirsys.com/getIceServers", 
                                {
                                    ident: "bombartier",
                                    secret: "4a213061-f2b0-4ec9-bd2a-0c5e0ce0c2e1",
                                    domain: "health2.me",
                                    application: "default",
                                    room: "default",
                                    secure: 1
                                }, function(data, status)
                                {
                                    console.log(data);
                                    var info = JSON.parse(data);
                                    var peerConnectionConfig = info.d;
                                    var webrtc = new SimpleWebRTC({localVideoEl: 'localVideo',remoteVideosEl: 'remoteVideo', url: teleurl, autoRequestMedia: true, peerConnectionConfig: peerConnectionConfig});
                                    webrtc.on('readyToCall', function () 
                                    {
                                        //video_recorder = RecordRTC(webrtc.webrtc.localStream, video_record_options);
                                        //audio_recorder = RecordRTC(webrtc.webrtc.localStream, audio_record_options);
                                        var doc_info = selected_doctor_info.split("_");
                                        console.log('JOINING ROOM: ' + 'health2me_room_' + doc_info[1] + '_' + $("#USERID").val());
                                        webrtc.joinRoom('health2me_room_' + doc_info[1] + '_' + $("#USERID").val());
                                        //call();
                                        //$.post("update_webrtc.php", {doc_id: doctor_id, status: 1}, function(data, status){console.log(data);});
                                        //setInterval(function(){$.post("update_webrtc.php", {doc_id: doctor_id, update_lastseen: true}, function(data, status){console.log(data);});}, 30000);
                                        //$(window).unbind("beforeunload");
                                        $("#remoteVideo").css("height", ($("#videoTelemed").css("width") * 0.6538461538 * 0.68).toString() + "px");
                                        $("#remoteVideo").css("width", ($("#videoTelemed").css("width") * 0.68).toString() + "px");
                                        $("#telemed_notes").attr("rows", (Math.floor($("#videoTelemed").css("width") * 0.6538461538 * 0.68) / 22));
                                        var interval = setInterval(function()
                                                                   {

                                            $("#remoteVideo").children("video").each(function()
                                                                                     {
                                                $(this).css("height", "100%");
                                                $(this).css("width", "100%");
                                                clearInterval(interval);
                                            });
                                        }, 500);
                                        //$.post("update_webrtc.php", {doc_id: $("#MEDID").val(), pat_id: $("#USERID").val(), status: 1, add_to_recent_doctors: 1}, function(){});
                                        //setInterval(function(){$.post("update_webrtc.php", {doc_id: $("#MEDID").val(), update_lastseen: true}, function(data, status){console.log(data);});}, 30000);
                                        $("#remoteVideo").children("video").each(function()
                                                                                 {
                                            $(this).css("height", "100%");
                                            $(this).css("width", "100%");
                                        });
                                    });
                                });
                                */
                                $("#find_doctor_modal").dialog('close');
                                //videoTelemed.dialog('open');
                                window.location = 'telemedicine/telemed_pat.php?doc_id=' + doc_info[1] + '&pat_id=' + $("#USERID").val();
                            }
                        }
                    });
                }
                else
                {
                    $("#video_telemedicine_loading_bar").css("visibility", "visible");
                    $.post("start_telemed_phonecall.php?stage=init-call", {grant_access: 'H2M', pat_phone: $("#USERPHONE").val(), doc_phone: info[2], doc_id: info[1], pat_id: $("#USERID").val(), doc_name: (info[3] + ' ' + info[4]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val()), override: false, message_text: '', language:'en'}, function(data, status)
                    {
                        if(data.substr(0, 2) == 'IC')
                        {
                            $("#find_doctor_modal").dialog('close');
                            swal("Unavailable", "We're sorry, this doctor is already in a consultation with another member.\nPlease try another doctor or try again later.", "error");
                        }
                        else if(data.substr(0, 2) == 'NC')
                        {
                            $("#find_doctor_modal").dialog('close');
                            swal("No Credit Card", "You have not entered a credit card for your account.\nPlease enter a credit card in Setup and try again.", "error");
                        }
                        else
                        {
                            latest_sid = data;
                            status_interval = setInterval(function()
                            {
                                $.get("get_call_status.php?sid="+latest_sid, function(data, status)
                                {
                                    console.log(data);
                                    $("#call_status_label").text(data);
                                    if(data == 'Completed')
                                    {
                                        $("#call_status_label").css("color", "#54bc00"); // green
                                    }
                                    else if(data == 'No Answer' || data == 'Failed' || data == 'Busy' || data == 'Canceled')
                                    {
                                        $("#call_status_label").css("color", "#D84840"); // red
                                    }
                                    else if(data == 'Queued' || data == 'Ringing')
                                    {
                                        $("#call_status_label").css("color", "#E07221"); // orange
                                    }
                                    else
                                    {
                                        $("#call_status_label").css("color", "#22AEFF"); // blue
                                    }
                                });
                            }, 5000);
                            
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
                }
            }
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
            $("#find_doctor_label").text("Select Type");
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
                    find_doctor_page = 31;
                    $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_appointment_2').fadeIn(300)});
                    $("#find_doctor_label").text("Select Speciality");
                }
                else
                {
                    find_doctor_page = 11;
                    $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_appointment_2').fadeIn(300)});
                    $("#find_doctor_label").text("Select Speciality");
                }
            }
        }
        else if(find_doctor_page == 21 || find_doctor_page == 31 || find_doctor_page == 11)
        {
            if(find_doctor_page == 21 && talk_mode == 0)
            {
                $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_my_doctors_1').fadeIn(300)});
                find_doctor_page = 20;
                $("#find_doctor_label").text("Select Doctor");
                
            }
            else if(find_doctor_page == 31)
            {
                find_doctor_page = 30;
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
                $("#find_doctor_label").text("Select Type");
            }
            else if(find_doctor_page == 11)
            {
                find_doctor_page = 10;
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
                $("#find_doctor_label").text("Select Type");
            }
            if(talk_mode == 0)
            {
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
            $("#find_doctor_label").text("Select Type");
        }
        else if(find_doctor_page == 26)
        {
            if(talk_mode == 0)
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
            else
            {
                $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_my_doctors_2').fadeIn(300)});
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
                $("#find_doctor_label").text("Select Type");
            }
        }
        else if(find_doctor_page == 35)
        {
            $('#find_doctor_appointment_3').fadeOut(300, function(){$('#find_doctor_appointment_2').fadeIn(300)});
            find_doctor_page = 31;
            $("#find_doctor_next_button").css("display", "block");
        }
        else if(find_doctor_page == 15)
        {
            $('#find_doctor_appointment_3').fadeOut(300, function(){$('#find_doctor_appointment_2').fadeIn(300)});
            find_doctor_page = 11;
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
        clearInterval(status_interval);
    });
    $("#find_doctor_now_button").live('click',function()
    {
        // GEOLOCATION
        //alert("Your location is: " + geoplugin_countryName() + ", " + geoplugin_region() + ", " + geoplugin_city());
        var country = "";//geoplugin_countryName();
        if (country == "United States") {
            country = "USA";
        }   
    
		$("#country").val(country);			 
	    $("#country").change();
	    //populateCountries("country", "state");
	    var zone = "";//geoplugin_region();
	    var district = "";//geoplugin_city();
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
            $("#find_doctor_label").text("Select Type");
        }
    });
    $("#find_doctor_appointment_button").live('click',function()
    {
        // GEOLOCATION
        //alert("Your location is: " + geoplugin_countryName() + ", " + geoplugin_region() + ", " + geoplugin_city());
        var country = "";//geoplugin_countryName();

        if (country == "United States") {
            country = "USA";
        }   
  
        $("#country").val(country);			 
	    $("#country").change();
	    //populateCountries("country", "state");
	    var zone = "";//geoplugin_region();
	    var district = "";//geoplugin_city();
		$("#state").val(district);			 
	    $("#state").change();
        // GEOLOCATION

        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_appointment_1").fadeIn(300)});
        find_doctor_page = 30;
        $("#find_doctor_label").text("Select Type");
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
        $("#find_doctor_label").text("Select Type");
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
        if(talk_mode == 0)
        {
            $('#find_doctor_my_doctors_3').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
        }
        else
        {
            $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
        }
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
        //console.log($("#find_doctor_video_button_2").css("background-color"));
        if(consultation_type == 1)
        {
            html += 'Video ';
        }
        else
        {
            html += 'Phone ';
        }
        html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">starting <strong>NOW</strong></li></ul><div style="width: 100%; height: 48px; padding-top: 8px; visibility: hidden;" id="video_telemedicine_loading_bar"><img src="images/load/8.gif" style="margin-bottom: 7px;"  alt=""><p style="color: #333; text-align: center;">Loading Consultation. Please Wait ...</p></div><span style="color: #666; font-size: 10px; line-height: 10px;">You must share all of your records with this doctor to start the consultation.<br/> Press "Next" below to agree and start the consultation, otherwise press "Cancel."</span></div>';
        $("#find_doctor_receipt").html(html);
        $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;" lang="en"><strong lang="en">Thank you!</strong><br/><strong lang="en">Your consultation appointment is starting now.</strong><br/><br/><span lang="en" style="color: #555; font-size: 18px;">Call Status:  <span id="call_status_label" lang="en" style="color: #E07221;">Connecting</span></span></p>');
        
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
        if($("#state").val().length > 0 && $("#state").val() != '-1' && $("#state").parent().parent().css('display') == 'block')
        {
            loc_2 = $("#state").val() + ", " + $("#country").val();
        }
        var mba = true;
        if(find_doctor_page == 31)
        {
            mba = false;
        }
        //console.log(loc_1+" "+loc_2+" "+mba);
        $.post("find_doctor.php", {type: "General Practice", location_1: loc_1, location_2: loc_2, must_be_available: mba}, function(data, status)
        {
            
            //console.log(data);
            if(data != 'none')
            {
                var info = JSON.parse(data);
                selected_doctor_info = "recdoc_"+info['id']+"_"+info['phone']+"_"+info['name']+"_"+info['location'];
                //console.log(selected_doctor_info);
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
                        $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;" lang="en"><strong lang="en">Thank you!</strong><br/><strong lang="en">Your consultation appointment is starting now.</strong><br/><br/><span lang="en" style="color: #555; font-size: 18px;">Call Status:  <span id="call_status_label" lang="en" style="color: #E07221;">Connecting</span></span></p>');
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
                $("#not_found_text").html("Sorry, we could not find any<br/>general practicioners in your area.");
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
                //console.log(data);
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
            //console.log(data);
        });
    });
    $('#video_call_button').live('click',function(e)
     {
        $("#find_doctor_modal").dialog("close");
         var info = doctor_to_connect.split("_");
        $.post("start_telemed_videocall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[1], doc_id: info[0], pat_id: $("#USERID").val(), doc_name: (info[2] + ' ' + info[3]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status)
        {
            //console.log(data);
            if(data == 1)
            {
                console.log(doctor_to_connect);
                /*var info = doctor_to_connect.split("_");
                //window.open("telemedicine_patient.php?MED=" + info[1] + "&PAT=" + $("#USERID").val(),"Telemedicine","height=650,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
                var localVideo = document.getElementById("localVideo");
                var remoteVideo = document.getElementById("remoteVideo");

                var constraints = {video: true, audio: true};

                var teleurl = $("DOMAIN").val();    //Removed the hardcoded url 'http://dev.health2.me:8888' - Debraj
                var parseURL = document.createElement('a');
                parseURL.href = teleurl;
                teleurl = parseURL.protocol + '//' + parseURL.hostname + ':8888';

                console.log("SIGNALING SERVER: " + teleurl);

                $.post("https://api.xirsys.com/getIceServers", 
                {
                    ident: "bombartier",
                    secret: "4a213061-f2b0-4ec9-bd2a-0c5e0ce0c2e1",
                    domain: "health2.me",
                    application: "default",
                    room: "default",
                    secure: 1
                }, function(data, status)
                {
                    console.log(data);
                    var info = JSON.parse(data);
                    var peerConnectionConfig = info.d;
                    var webrtc = new SimpleWebRTC({localVideoEl: 'localVideo',remoteVideosEl: 'remoteVideo', url: teleurl, autoRequestMedia: true, peerConnectionConfig: peerConnectionConfig});
                    webrtc.on('readyToCall', function () 
                    {
                        //video_recorder = RecordRTC(webrtc.webrtc.localStream, video_record_options);
                        //audio_recorder = RecordRTC(webrtc.webrtc.localStream, audio_record_options);
                        var doc_info = doctor_to_connect.split("_");
                        webrtc.joinRoom('health2me_room_' + doc_info[1] + '_' + $("#USERID").val());
                        //call();
                        //$.post("update_webrtc.php", {doc_id: doctor_id, status: 1}, function(data, status){console.log(data);});
                        //setInterval(function(){$.post("update_webrtc.php", {doc_id: doctor_id, update_lastseen: true}, function(data, status){console.log(data);});}, 30000);
                        //$(window).unbind("beforeunload");
                    });
                });*/
                var doc_info = doctor_to_connect.split("_");
                $("#find_doctor_modal").dialog('close');
                //videoTelemed.dialog('open');
                window.location = 'telemedicine/telemed_pat.php?doc_id=' + doc_info[1] + '&pat_id=' + $("#USERID").val();
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
         var IdPaciente = mem_id;
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
        
    $("#Attach").live('click',function()
    {
        reportids='';

        $('input[type=checkbox][id^="reportcol1"]').each(function () 
        {
            var sThisVal = (this.checked ? "1" : "0");

            if(sThisVal == 1)
            {
                var idp
                var idp = $(this).parents("div.attachments").attr("id");
                reportcheck.push(this.id);
                reportids=reportids+idp+' ';

            }


        });
         //alert(reportids);
        var conf=false;
        if(reportids>'')
            conf=confirm("Confirm Attachments");

        if(conf)
        {
            $("#Reply").trigger('click');
            $("#attachreportdiv").append('<i id="attachment_icon" class="icon-paper-clip" style="margin-left:10px"></i>');
        }
        else
        {
            reportids='';
            for (i = 0 ; i < reportcheck.length; i++ )
            {

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
    $("#BotonBusquedaPac").click(function(event) {
     		var queMED = $("#MEDID").val();
    	    var UserInput = $('#SearchUser').val();
    	    //alert(UserInput);
    	    /*
    	    var IdUs =156;
    	    var UserInput = $('#SearchUser').val();
                                  
    	    var serviceURL = s.php' + '?Usuario=' + UserInput; 
    	    getLifePines(serviceURL);
    	    var longit = Object.keys(pines).length;	
    	    */
    	    //alert (longit);
    	     
			var onlyGroup=0;
			if ($('#RetrievePatient').is(":checked")){
			onlyGroup=1;
			}else{
			onlyGroup=1;
			}
		   
    	     if(UserInput===""){
			    UserInput=-111;
			 }
			// alert(UserInput);
    	    var queUrl ='getFullUsersMED.php?Usuario='+UserInput+'&IdMed='+queMED+'&Usuario='+UserInput+'&Group='+onlyGroup;
			//alert(queUrl);
    	    $('#TablaPac').load(queUrl);
    	    //$('#TablaPac').trigger('click');
    	    $('#TablaPac').trigger('update');
  	    
    });

    $("#BotonBusquedaPacCOMP").click(function(event) {
    	    var IdUs =156;
    	    var UserInput = $('#SearchUserYCOMP').val();
                                  
    	    var serviceURL = '/getpines.php' + '?Usuario=' + UserInput; 
    	    getLifePines(serviceURL);
    	    var longit = Object.keys(pines).length;	
    	    //alert (longit);
    	    var queUrl ='getFullUsers.php?Usuario='+UserInput+'&NReports='+longit;
    	    $('#TablaPacCOMP').load(queUrl);
    	    //$('#TablaPac').trigger('click');
    	    $('#TablaPacCOMP').trigger('update');
    });
	
	// function connectTelemedicine()
	// {
		// $.ajax({
		 // url: '<?php echo $domain?>/weemo_test.php?calleeID=<?php echo $DoctorEmail?>',
		 // method: 'get',
			// success: function(data){
		    // var htmlContent = data;
			// var e = document.createElement('div');
			// e.setAttribute('style', 'display: none;');
			// e.innerHTML = htmlContent;
			// document.body.appendChild(e);
			// console.log(document.getElementById("runscript").innerHTML);
			// eval(document.getElementById("runscript").innerHTML);
			 // }
		 // });
	// }

	// $("#Telemedicine").on('click',function() {
			// connectTelemedicine();
		 // });

	$('#BotPassbook').live('click',function(){
	  $("#modalContents").dialog({bgiframe: true, height: 1000, height: 340, modal: true});
	});

	$('#ButtonSkype').live('click',function(){
	 $('#modalContents').dialog( "close" );
	});

	$('#ButtonWeemo').live('click',function(){
		$.ajax({
			 url: '/weemo_test.php?calleeID='+doc_email,
			 method: 'get',
				success: function(data){
				var htmlContent = data;
				var e = document.createElement('div');
				e.setAttribute('style', 'display: none;');
				e.innerHTML = htmlContent;
				document.body.appendChild(e);
				eval(document.getElementById("runscript").innerHTML);
			  }
		 });
		$('#modalContents').dialog( "close" );
	});
     
	$('#telemedicine').live('click',function(){
	 // e.preventDefault();
	  $("#modalContents").dialog({bgiframe: true, height: 140, modal: true});
	 });
     /*
     $('#TablaPac').bind('click', function() {
          	
          	var NombreEnt = $('#NombreEnt').val();
            var PasswordEnt = $('#PasswordEnt').val();
                                   
          	window.location.replace('patientdetail.php?Nombre='+NombreEnt+'&Password='+PasswordEnt);

//      alert($(this).text());
      });
*/

     $('#TablaPacCOMP').bind('click', function() {
      alert($(this).text());
      });

	    
 	$('#datatable_1').dataTable( {
		"bProcessing": true,
		"bDestroy": true,
		"bRetrieve": true,
		"sAjaxSource": "getBLOCKS.php"
	} );
    
    $('#Wait1')
    .hide()  // hide it initially
    .ajaxStart(function() {
        //alert ('ajax start');
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    }); 

    $('#datatable_1 tbody').click( function () {
    // Alert the contents of an element in a SPAN in the first TD    
    alert( $('td:eq(0) span', this).html() );
    } );

    
        
    });        
    
     
    function getLifePines(serviceURL) {
    $.ajax(
           {
           url: serviceURL,
           dataType: "json",
           async: false,
           success: function(data)
           {
           pines = data.items;
           }
           });
     }        

	window.onload = function(){		
		
		var quePorcentaje = $('#quePorcentaje').val();
		var g = new JustGage({
			id: "gauge", 
			value: quePorcentaje, 
			min: 0,
			max: 100,
			title: " ",
			label: "% Refered to me"
		}); 
	};
	
	  

  
    function TranslateAngle(x,maxim){
	    var y = (x * Math.PI * 2) / maxim;
	    return parseFloat(y);
    }
    
    function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
	}
	
	function GetICD10Code(searchW)
	{		
		var queUrl ='https://api.aqua.io/codes/beta/icd10.json?utf8=%E2%9C%93&q%5Bdescription_cont%5D='+searchW;	
		var ICDCodes = '';	
		var ICDArr = Array();	
		$.ajax({
			dataType: "json",
			url: queUrl,
			async:false,
			success: function(ajaxresult)
			{
				ICDCodes = ajaxresult;
				var ICDArr = ajaxresult[0];	
			},
            error: function(data, errorThrown){
               alert(errorThrown);
              }
         });
		return ICDCodes;
	}

    
    function GetCanvasTextHeight(text,font){
    var fontDraw = document.createElement("canvas");

    var height = 100;
    var width = 100;

    // here we expect that font size will be less canvas geometry
    fontDraw.setAttribute("height", height);
    fontDraw.setAttribute("width", width);

    var ctx = fontDraw.getContext('2d');
    // black is default
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.font = font;
    ctx.fillText(text/*'Eg'*/, 0, 0);

    var pixels = ctx.getImageData(0, 0, width, height).data;

    // row numbers where we first find letter end where it ends 
    var start = -1;
    var end = -1;

    for (var row = 0; row < height; row++) {
        for (var column = 0; column < width; column++) {

            var index = (row * width + column) * 4;

            // if pixel is not white (background color)
            if (pixels[index] == 0) {
                // we havent met white (font color) pixel
                // on the row and the letters was detected
                if (column == width - 1 && start != -1) {
                    end = row;
                    row = height;
                    break;
                }
                continue;
            }
            else {
                // we find top of letter
                if (start == -1) {
                    start = row;
                }
                // ..letters body
                break;
            }

        }

    }
   /*
    document.body.appendChild(fontDraw);
    fontDraw.style.pixelLeft = 400;
    fontDraw.style.pixelTop = 400;
    fontDraw.style.position = "absolute";
   */

    return end - start;
    };
	
	function findPos(obj) {
	    var curleft = 0, curtop = 0;
	    if (obj.offsetParent) {
	        do {
	            curleft += obj.offsetLeft;
	            curtop += obj.offsetTop;
	        } while (obj = obj.offsetParent);
	        return { x: curleft, y: curtop };
	    }
	    return undefined;
	}

	function rgbToHex(r, g, b) {
	    if (r > 255 || g > 255 || b > 255)
	        throw "Invalid color component";
	    return ((r << 16) | (g << 8) | b).toString(16);
	}
				 		
//Start of code inserted from userdashboard-new-pallab.php
    // Start of code for display of modal window for Send button
    $("#Send2Doc").on('click',function(){
		$("#modal_send").dialog({bigframe: true, width: 800, height: 500, modal: false});
        //CheckUserActivity();
        var delet = 2 ;
	});
    //End of code for display of modal window of Send button
    
    //Start of code for OK button in Send page
    $("#CaptureEmail2Send2Doc").on('click',function(){
		var emailId = $("#EmailID").val();
        var user = mem_id;
        var idpins = '';
        var idpins_count = 0;
        $("input[id^='reportcol_1_']:checked").each(function(index)
        {
            if(idpins_count > 0)
            {
                idpins += '_';
            }
            idpins += $(this).attr("id").split("_")[2];
            idpins_count++;
        });
        $.get("ValidateSendEmailDoc.php?emailId="+emailId+"&user="+user+"&idpins="+idpins,function(data,status)
              {
 			    var UserID = mem_id;  		
                var queUrl = 'GetDoctorId.php?doctoremail='+emailId;
                var doctorid = LanzaAjax(queUrl);
                /*
                var queUrl = 'AddUserActivity.php?userid='+UserID+'&doctorid='+doctorid+'&type=1&status=1';
                var result = LanzaAjax(queUrl);
                */
                //New: PHS Notication system (remember to delete previous system when this is tested)
                $.post("add_notification.php", {patient_id: UserID, doctor_id: doctorid, reports: idpins}, function(data, status)
                {
                    //console.log('Dismissal Post:  '+data);
                    //console.log('Status:  '+status);
                });

                swal({   title: "Done!",   text: "The records you selected have been sent to your chosen doctor.",   type: "success",   confirmButtonText: "Ok" });
                //get_notifications (UserID,'main_notif_container',1);
                //console.log(data);
              });
        
        
	   $("#modal_send").dialog("close");
    });
    //End of code  for OK button in Send page
        
    //Start of code for getting previous doctors for Send
    /*   $("#getPreviousDoctors").on('click',function){
           
           var userId = <?php echo $UserID; ?>;
           $.get("getPreviousDoctorsSend.php?userId="+userId,function(data,success)
                 {
                 });
       }); */
        
    //End of code for getting previous doctors for Send
        
    //Start of code for display of modal window for Request button
  $("#Request").on('click',function(){
	  //$("#modal_request").dialog({bigframe: true, width: 550, height: 300, modal: false});
	  	  $("#medical-release").dialog({bigframe: true, width: 900, height: 850, modal: false});

	});


    //End of code for display of modal windown for Request button
    
    // Start of Code for Request Reports button
$("#request-button").on('click',function(){
	var $emailId = $("#doc_email").val();
	//var $patient_name  = $("#patient_name").val();
	var $member_name   = $("#member_name").val();
	var $member_street = $("#member_street").val();
	var $member_city   = $("#city").val();
	var $member_state  = $("#state").val();
	var $member_zip    = $("#zip").val();
	var $patient_name  = $("#name").val();
	var $patient_ssn   = $("#ssnum").val();
	var $patient_dob   = $("#dob").val();
	var $patient_phone = $("#telephone").val();
	var $sig_date      = $("#sig-date").val();
	var $sig_img       = $("#output").val();
	var $record_type   = $("#recordtype").val();
	
	//validate
	if ($emailId == ""){
		//validation needs to happen
		return;	
	}

	 $.post("medical_release.php", {patient_name:$patient_name,ssnum:$patient_ssn, dob:$patient_dob,telephone:$patient_phone,output:$sig_img,doc_email:$emailId,recordtype:$record_type}, function(data, status)	{
		//console.log(data);
		//DEBUG: alert(data);
				
	});
	var user=mem_id;
	var emailId = $("#doc_email").val();
	var messageForDoc = "message for doc";
    var success = 0;    
     $.get("RequestReportsFromExternalDoc.php?emailId="+emailId+"&user="+user+"&message="+messageForDoc,function(data,status)
              {		
		 		  $("#medical-release").dialog("close"); 
                  //console.log("Message    "+data);
		 
                  
					alert('Your request has been sent.');
   			
		
		 
              }); 
	 		    	swal({   title: "Done!",   text: "Your request has been sent.",   type: "success",   confirmButtonText: "Ok" });    
     });  
		
	$("#CaptureEmail2Request2Doc").on('click',function(){
        
        var emailId = $("#EmailIDRequestPage").val();
        var messageForDoc = "'"+$("#MessageForDoctor").val()+"'";
        var user = mem_id;
        //console.log("user"+user);
        
        
       $.get("RequestReportsFromExternalDoc.php?emailId="+emailId+"&user="+user+"&message="+messageForDoc,function(data,status)
              {
                  //console.log("Message    "+data);
                  //alert('Your request has been sent.');
                  swal({   title: "Done!",   text: "Your request has been sent.",   type: "success",   confirmButtonText: "Ok" });
              });
        
        
                    
        $("#modal_request").dialog("close");
        });
