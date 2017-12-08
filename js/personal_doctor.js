var my_personal_doctor = -1;
var personal_doctor_messages_replied = 0;

// click event for "Share With Doctor" and "Accept Doctor" button
$("#personal_doctor_share_button").on('click', function()
{
    if($(this).text().indexOf("Share") > -1)
    {
        // open up modal window with the user's files so that he/she can share them with their doctor
        $("#personal_doctor_share_modal").dialog({bgiframe: true, width: 900, height: 400, maxHeight: 400, maxWidth: 900, resizable: false, modal: true, autoOpen: true});
        $(".ui-dialog").css("position", "fixed");
    }
    else
    {
        // user is accepting the currently set personal doctor
        $.post("set_personal_doctor.php", {user_id: $("#USERID").val(), accept: 1}, function(data, status)
        {
            get_personal_doctor();
        });
        
    }
});

// click event for viewing the personal doctor's messages
$("#personal_doctor_messages_button").on('click', function()
{
    personal_doctor_messages_replied = 0;
    $("#personal_doctors_messages_modal").dialog({bgiframe: true, width: 600, height: 600, resizable: false, modal: true, autoOpen: true, close: function()
    {
        if(personal_doctor_messages_replied > 0)
            get_personal_doctor();
    }});
    $(".ui-dialog").css("position", "fixed");
    $('#personal_doctor_message_search_bar').val('');
    get_personal_doctor_messages();
    
});

// this click event is used to expand and read messages from the personal doctor in the messages modal window
$("body").on('click', ".personal_doctor_expand_message", function()
{
    if($(this).children().eq(0).hasClass("icon-caret-down"))
    {
        // expand message
        $(this).children().eq(0).removeClass("icon-caret-down").addClass("icon-caret-up");
        if($(this).data('replied') == 0)
        {
            $(this).parent().animate({height: '300px'}, {duration: 500, easing: 'easeInOutQuad'});
        }
        else
        {
            $(this).parent().animate({height: '170px'}, {duration: 500, easing: 'easeInOutQuad'});
        }
        
        // set the message as read by changing the border/text color to gray and setthe status column in the database to 'read'
        $(this).parent().children('div').eq(0).css('color', '#666');
        $(this).parent().children('div').eq(1).css('color', '#666');
        $(this).parent().css('border', '1px solid #BABABA');
        $.post("reply_to_personal_doctor.php", {id: $(this).parent().data('id'), setRead: 1}, function(data, status){});
    }
    else
    {
        // collapse message
        $(this).children().eq(0).removeClass("icon-caret-up").addClass("icon-caret-down");
        $(this).parent().animate({height: '21px'}, {duration: 500, easing: 'easeInOutQuad'});
    }
});

// this click event sends a message reply when "send" is clicked in the messages modal window
$("body").on('click', ".personal_doctor_message_reply_button", function()
{
    var parent = $(this).parent();
    $.post("reply_to_personal_doctor.php", {user: $("#USERID").val(), message: $(this).parent().children('.personal_doctor_message_reply_text').eq(0).val(), id: $(this).data("id")}, function(data, status)
    {
        personal_doctor_messages_replied += 1;
        // remove textarea and send button from message and replace it with message that the message has been replied
        parent.children('textarea').remove();
        parent.children('button.personal_doctor_message_reply_button').remove();
        parent.children('button').eq(0).data("replied", 1);
        
        parent.append('<div style="width: 100%; height: 20px; border-radius: 5px; text-align: center; margin: auto; background-color: #F2F2F2; border: 1px solid #DDD; color: #999; font-size: 16px;"><i class="icon-ok"></i>&nbsp;&nbsp;Replied</div>');
        parent.animate({height: '170px'}, {duration: 500, easing: 'easeInOutQuad'});
    });
});

// click event for search bar button in messages modal, simply calls get_personal_doctor_messages()
$("#personal_doctor_message_search_bar_button").on('click', function()
{
    get_personal_doctor_messages();
});

// when user presses 'enter' in the search bar in the messages modal window, trigger the click event for the search button
$('#personal_doctor_message_search_bar').keypress(function (e) 
{
    if (e.which == 13) 
    {
        $("#personal_doctor_message_search_bar_button").trigger('click');
    }
});

// The user is selecting a personal doctor. Call the get_doctors() function with personal_doctor_search set to 1 to obtain all the doctors that the user can select as their
// personal doctor, then display these results in the directory window to allow the user to select a doctor
$("#personal_doctor_change_button").on('click', function()
{
    // tells get_doctors() to display only doctors that are eligible to be user's personal doctor
    personal_doctor_search = 1;
    
    // reset doctor search flags
    doctors_page_memory.length = 0;
    doctors_last_result = 0;
    doctors_next_result = 0;
    
    // change to directory view
    $("#doctor_directory").css("display", "block");
    $("#personal_doctor").css("display", "none");
    $("#search_doctor_toolbar").css("display", "none");
    $("#personal_doctors_cancel_change").css("display", "block");
    
    // load results
    get_doctors();
});

// go back to personal doctors page
$("#personal_doctors_cancel_change").on('click', function()
{
    $("#doctor_directory").css("display", "none");
    $("#personal_doctor").css("display", "block");
});

// this click even is used when the user clicks "share" in the "share with doctor" modal
$("#personal_doctor_set_button").on('click',function()
{
    // get the id of the user and doctor
    var emailId = my_personal_doctor;
    var user = $("#USERID").val();
    var idpins = '';
    var idpins_count = 0;
    var idpins_count_protected = 0;
    
    // get all of the idpins of the files which the user has selected to share, add it in the idpins string where the idpins are separated by '_'
    $("input[id^='reportcol_2_']:checked").each(function(index)
    {
        if($(this).attr('disabled') != 'disabled')
        {
            if(idpins_count > 0)
            {
                idpins += '_';
            }
            idpins += $(this).attr("id").split("_")[2];
            idpins_count++;
        }
        else
        {
            idpins_count_protected += 1;
        }
    });
    console.log(idpins_count_protected);
    
    // update the doctorslinkusers table with the information obtained above
    $.post("share_with_doctor.php", {add: 1, doctor: emailId, patient: user, idpins: idpins}, function(data, status)
    {
        $("#personal_doctor_share_modal").dialog("close");
        $("#personal_doctor_knob_graph").empty();
        
        // redraw the "Reports Shared" graph in the personal doctor window
        drawKnob($("#personal_doctor_knob_graph"),'#22aeff', num_files, parseInt(data) + idpins_count_protected, 'Shared','icon-folder-open',1,1);  
    });



   
});

// click event for the "Remove" button in the "Share with Doctor" modal window
$("#personal_doctor_reset_button").on('click',function()
{
    $('input[id^="reportcol_2_"]').each(function()
    {
        if($(this).attr('disabled') != 'disabled')
            $(this).prop('checked', false);
    });
});

// click event for the "Select All" button in the "Share with Doctor" modal window
$("#personal_doctor_select_all_button").on('click',function()
{
    $('input[id^="reportcol_2_"]').each(function()
    {
        $(this).prop('checked', true);
    });
});


/*
 *
 *  FUNCTIONS
 *
 */

// this function gets the personal doctor's messages to the user and displays them in the messages modal window
function get_personal_doctor_messages()
{
    // add a temporary loading icon in the messages container
    $("#personal_doctor_messages_container").html('<div style="width: 42px; height: 42px; margin: auto; margin-top: 250px;"><img src="images/load/29.gif" /></div>');
    
    // get messages results
    $.post("get_personal_doctors_messages.php", {doctor: my_personal_doctor, patient: $("#USERID").val(), search: $("#personal_doctor_message_search_bar").val()}, function(data, status)
    {
        var d = JSON.parse(data);
        $("#personal_doctor_messages_container").empty();
        
        // number of new messages
        var num_new = 0;
        
        // for each message ...
        for(var i = 0; i < d.length; i++)
        {
            // if the message is new, add to number of new messages
            if(d[i].status == 'new')
                num_new += 1;
            
            // blue if the message is new, gray otherwise
            var color = '#666';
            if(d[i].status == 'new')
                color = '#22AEFF';
            
            var border_color = '#BABABA';
            if(d[i].status == 'new')
                border_color = '#22AEFF';
            
            // create message div (subject, date, and content)
            var html = '<div style="width: 98%; height: 21px; padding: 1%; padding-top: 5px; background-color: #FBFBFB; margin-top: 10px; margin-bottom: 10px; border: 1px solid '+border_color+'; border-radius: 5px; overflow: hidden; text-align: left; color: #888;" data-id="'+d[i].message_id+'">';
            html += '<div style="width: 50%; height: 25px; color: '+color+'; float: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"><span style="color: #444;">Subject: </span>';
            html += d[i].Subject;
            html += '</div><div style="width: 40%; height: 25px; color: '+color+'; float: left;"><span style="color: #444;">Date:</span> ';
            html += d[i].fecha;
            html += '</div><button data-replied="'+d[i].replied+'" style="float: right; background-color: transparent; border: 0px solid #FFF; margin-top: -3px; margin-right: 5px; outline: none;" class="personal_doctor_expand_message"><i class="icon-caret-down"></i></button>';
            html += '<div style="height: 125px; width: 100%; color: #555; font-size: 12px; overflow-y: auto; text-align: left;" >'+d[i].content+'</div>';
            
            if(d[i].replied == 0)
            {
                // if the message has not been replied, display a textarea and send button to allow the user to reply
                html += '<textarea class="personal_doctor_message_reply_text" cols="8" placeholder="Type a reply..." style="width: 97%; height: 100px;"></textarea>';
                html += '<button class="personal_doctor_message_reply_button" data-id="'+d[i].message_id+'" style="width: 60px; height: 25px; margin-top: 2px; background-color: #54BC00; outline: none; border: 0px solid #FFF; border-radius: 5px; color: #FFF;">Send</button>';
            }
            else
            {
                // if the message has been replied, simply display a message indicating that the message has been replied
                html += '<div style="width: 100%; height: 20px; border-radius: 5px; text-align: center; margin: auto; background-color: #F2F2F2; border: 1px solid #DDD; color: #999; font-size: 16px;"><i class="icon-ok"></i>&nbsp;&nbsp;Replied</div>';
            }
            html += '</div>';
            
            // add the message to the container
            $("#personal_doctor_messages_container").append(html);
        }
        
        // update the red ballon on the messages button with the number of new messages
        if(num_new > 0)
        {
            $("#personal_doctor_messages_button_ballon").css('visibility', 'visible');
            $("#personal_doctor_messages_button_ballon").text(num_new);
        }
        else
        {
            $("#personal_doctor_messages_button_ballon").css('visibility', 'hidden');
        }
        
        
    });
}

// this is the main function of the personal doctors section. It loads information on the user's personal doctors and then displays it in the personal doctor window
function get_personal_doctor()
{
    $.post("get_my_personal_doctors.php", {id: $("#USERID").val()}, function(data, status)
    {
        if(data.substr(0, 2) == 'ND')
        {
            // No Personal Doctor Found
            
            // Display message that the user does not have a personal doctor
            $("#my_personal_doctor_cont").html('<div class="personal_doctor_row" style="height: 110px; padding-top: 50px; margin-left: 230px; border: 1px dashed #DADADA; background-color: #FAFAFA; color: #888; text-align: center; font-size: 14px;">You do not have a personal doctor.<br/>Select a personal doctor by selecting "Select Doctor" below.</div>');
            
            // hide/disable all elements of the page until the user selects a personal doctor
            $("#personal_doctor_share_button").attr("disabled", "disabled");
            $("#personal_doctor_share_button").css("cursor", "default");
            $("#personal_doctor_share_button").css("background-color", "#80D2FF");
            $("#personal_doctor_share_button").html('<i class="icon-share-alt"></i><span style="font-size: 12px;">&nbsp;&nbsp;&nbsp;Share With Doctor</span>');
            $("#personal_doctor_change_button").html('<i class="icon-gears"></i><span style="font-size: 12px;">&nbsp;&nbsp;&nbsp;Select Doctor</span>');
            $("#personal_doctor_timeline_label").css("visibility", "hidden");
            $("#personal_doctor_messages_button").css('visibility', 'hidden');
            $("#personal_doctor_messages_button_ballon").css('visibility', 'hidden');
        }
        else
        {
            var doc = JSON.parse(data);
            var rating = 0;
            var total_ratings = 0;
            
            // calculate doctor's rating
            if(doc['rating'] != null)
            {
                for(var k = 0 ; k < 10; k++)
                {
                    total_ratings += doc['rating'][k];
                    rating += (doc['rating'][k] * (k + 1));
                }
                rating /= total_ratings;
            }
            var html = '';
            
            // create div element to display doctor's information
            html += '<div class="personal_doctor_row" style="height: 160px; margin-left: 230px; box-shadow: 3px 3px 7px #EEE;">';
            html += '<input type="hidden" value="'+doc['id']+'" />';
            html += '<input type="hidden" value="'+doc['phone']+'" />';
            
            if(doc['image'].substr(0, 6) == "Doctor")
            {
                // display doctor's image
                html += '<img class="doctor_pic" src="'+doc['image']+'" />';
            }
            else
            {
                // display doctor's identicon
                html += '<img class="doctor_pic" src="identicon.php?size=25&hash='+doc['image']+'" />';
            }
            
            
            html += '<div class="doctor_main_label">';
            
            // display doctor's name
            html += '<div class="doctor_name"><span style="color: #22AEFF">'+doc['Name']+'</span> <span style="color: #00639A">'+doc['Surname']+'</span>';
            html += '</div>';
            
            
            html += '<div class="doctor_speciality">';
            if(doc['speciality'] != null && doc['speciality'] != '-1')
            {
                // display doctor's speciality
                html += doc['speciality'];
            }
            else
            {
                // if no speciality is set, display 'No Speciality'
                html += 'No Speciality';
            }
            html += '</div>';
            
            // display doctor's location
            html += '<div class="doctor_location">';
            if(doc['location'] != null && doc['location'] != '-1')
            {
                html += doc['location'];
            }
            else
            {
                // if no location is set, display 'Location Not Specified'
                html += 'Location Not Specified';
            }
            html += '</div>';
            
            
            html += '</div><div class="doctor_hospital_info"><div class="doctor_stars">';
            
            // display the starts that correspond to the doctor's rating
            while(rating >= 2.0)
            {
                html += '<i class="icon-star" style="float: left; font-size: 12px; color: #666;"></i>';
                rating -= 2.0;
            }
            while(rating >= 1.0)
            {
                html += '<i class="icon-star-half" style="float: left; font-size: 12px; color: #666;"></i>';
                rating -= 1.0;
            }
            
            // display doctor's hospital name
            html += '</div><div class="doctor_hospital_name">';
            if(doc['hospital_name'] != null && doc['hospital_name'].length > 0)
            {
                html += doc['hospital_name'];
            }
            else
            {
                // if no hospital is set, display 'Hospital Not Specified'
                html += 'Hospital Not Specified';
            }
            
            // display hospital address
            html += '</div><div class="doctor_hospital_address">';
            if(doc['hospital_addr'] != null && doc['hospital_addr'].length > 0)
            {
                html += doc['hospital_addr'];
            }
            html += '</div></div>';
            
            
            // diplay doctor's certifications
            html += '<div class="doctor_certifications_box">';
            if(doc['certifications'].length >= 1)
            {
                var found = false;
                var current_index = 0;
                while(!found && current_index < doc['certifications'].length)
                {
                    if(doc['certifications'][current_index]['isPrimary'] == '1')
                    {
                        found = true;
                        if(doc['certifications'][current_index]['image'].length > 0)
                        {
                            html += '<img class="doctor_certification_icon" src="'+doc['certifications'][current_index]['image']+'" />';
                        }
                        html += '<div class="doctor_certification_label">'+doc['certifications'][current_index]['name']+'</div>';
                        if(doc['certifications'][current_index]['start_date'].length > 0)
                        {
                            var year = parseInt(doc['certifications'][current_index]['start_date'].split("-")[0]);
                            var currentYear = (new Date).getFullYear();
                            var duration = currentYear - year;
                            html += '<div class="doctor_certification_label_small">'+year+' ('+duration+' years)</div>';
                        }
                    }
                    current_index += 1;
                }
                current_index = 0;
                var total_count = 0;
                while(current_index < doc['certifications'].length && total_count < 2)
                {

                    if(doc['certifications'][current_index]['isPrimary'] == '0')
                    {
                        html += '<div class="doctor_certification_label_secondary">'+doc['certifications'][current_index]['name']+'</div>';
                        total_count += 1;
                    }
                    current_index += 1;
                }
            }
            html += '</div>';
            html += '<div class="doctor_action_box">';
            html += '<div class="doctor_consultations_label"><em>'+doc['consultations']+' consultations</em></div>';

            var id_holder = doc['id'];

            //THIS CHECKS SCHEDULE
            var queUrl = 'scheduleCheck.php?id='+id_holder;
            $.ajax(
            {
                url: queUrl,
                dataType: "json",
                async: false,
                success: function(data)
                {
                    itemsCheck = data.items;  
                }
            });

            if(doc['available'])
            {
                html += '<button class="doctor_action_button">Call Now</button>';
            }
            if(doc['telemed'] == 1)
            {
                if(itemsCheck[0].show == 'no')
                {
                    html += '<button class="doctor_action_button" disabled style="background-color:gray;">Schedule</button>';
                }
                else
                {
                    html += '<button class="doctor_action_button">Schedule</button>';
                }
            }
            html += '</div>';

            html += '</div>';

            $("#my_personal_doctor_cont").html(html);
            
            if(doc['accepted'] == 1)
            {
                // this doctor has been accepted, display timeline and other elements
                $("#personal_doctor_timeline").empty();
                $("#personal_doctor_timeline").H2M_Timeline({doctor: doc['id'], patient: $("#USERID").val(), max: 50, minimized: 0, onReply: function(){get_personal_doctor_messages()}});

                $("#personal_doctor_knob_graph").empty();
                drawKnob($("#personal_doctor_knob_graph"),'#22aeff', doc['max_records'], doc['hidden_reps'], 'Shared','icon-folder-open',1,1);
                

                my_personal_doctor = doc['id'];

                num_files = doc['max_records'];
                
                $('input[id^="reportcol_2_"]').prop('checked', false);
                $('input[id^="reportcol_2_"]').removeAttr('disabled');
                $("#reportcol_2_"+doc['protected_records'][p]).parents('.attachments').eq(0).css('opacity', '1.0');
                for(var p = 0; p < doc['records'].length; p++)
                {
                    $("#reportcol_2_"+doc['records'][p]).prop('checked', true);
                }
                for(var p = 0; p < doc['protected_records'].length; p++)
                {
                    var elmt = $("#reportcol_2_"+doc['protected_records'][p]);
                    elmt.prop('checked', true);
                    $("#reportcol_2_"+doc['protected_records'][p]).attr('disabled', 'disabled');
                    $("#reportcol_2_"+doc['protected_records'][p]).parents('.attachments').eq(0).css('opacity', '0.4');
                    Tipped.remove("#reportcol_2_"+doc['protected_records'][p]);
                    Tipped.create(elmt.parent().parent(), 'Doctor has permanent access to this file');
                }
                
                $("#personal_doctor_share_button").removeAttr("disabled");
                $("#personal_doctor_share_button").css("cursor", "pointer");
                $("#personal_doctor_share_button").css("background-color", "#22AEFF");
                $("#personal_doctor_share_button").html('<i class="icon-share-alt"></i><span style="font-size: 12px;">&nbsp;&nbsp;&nbsp;Share With Doctor</span>');

                $("#personal_doctor_change_button").html('<i class="icon-gears"></i><span style="font-size: 12px;">&nbsp;&nbsp;&nbsp;Change Doctors</span>');

                $("#personal_doctor_timeline_label").css("visibility", "visible");
                
                $("#personal_doctor_messages_button").css('visibility', 'visible');
                if(doc['num_new_messages'] > 0)
                {
                    $("#personal_doctor_messages_button_ballon").css('visibility', 'visible');
                    $("#personal_doctor_messages_button_ballon").text(doc['num_new_messages']);
                }
                else
                {
                    $("#personal_doctor_messages_button_ballon").css('visibility', 'hidden');
                }
            }
            else
            {
                // this doctor has been set but not accepted, do not display timeline and allow user to accept the doctor
                $("#personal_doctor_share_button").removeAttr("disabled");
                $("#personal_doctor_share_button").css("cursor", "pointer");
                $("#personal_doctor_share_button").css("background-color", "#22AEFF");
                $("#personal_doctor_share_button").html('<i class="icon-ok"></i><span style="font-size: 12px;">&nbsp;&nbsp;&nbsp;Accept This Doctor</span>');

                $("#personal_doctor_change_button").html('<i class="icon-gears"></i><span style="font-size: 12px;">&nbsp;&nbsp;&nbsp;Change Doctors</span>');

                $("#personal_doctor_timeline_label").css("visibility", "hidden");
                
                $("#personal_doctor_messages_button").css('visibility', 'hidden');
                $("#personal_doctor_messages_button_ballon").css('visibility', 'hidden');
            }
        }

    });
}

// load the personal doctor
$(document).ready(function()
{
    get_personal_doctor();
});

