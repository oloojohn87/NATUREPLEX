
$.fn.H2M_Timeline = function(dictionary) 
{
    var o = $(this[0]);

    o.empty();

    // add a modal for viewing the files if it doesn't already exist
    if ($(document).find("#H2M_Timeline_File_Modal").length == 0) 
    { 
        $("body").append('<div id="H2M_Timeline_File_Modal" style="width: 600px; height: 800px; padding: 0px; display: none;"></div>');
    }

    // add the styles for a timeline item
    if ($(document).find("#H2M_Timeline_CSS").length == 0) 
    { 
        $("body").append('<style id="H2M_Timeline_CSS">\
                            .personal_doctor_timeline_item{\
                                width: 22px;\
                                height: 22px;\
                                text-align: center;\
                                border-radius: 22px;\
                                background-color: #F4F4F4;\
                                border: 1px solid #E0E0E0;\
                                float: right;\
                                margin-left: 6px;\
                                margin-right: 6px;\
                                margin-top: -14px;\
                                font-size: 14px;\
                                color: #22AEFF;\
                                cursor: pointer;\
                                font-family: Arial, sans-serif;\
                            }</style>');
    }
    
    // add a modal for replying to a doctor's message
    if ($(document).find("#personal_doctor_reply_message_modal").length == 0) 
    { 
        $("body").append('<div id="personal_doctor_reply_message_modal" title="Reply" style="display: none;">\
                            <input type="hidden" value="" />\
                            <h4 style="font-size: 14px; color: #444;">Original Message:</h4>\
                            <div id="personal_doctor_reply_message_modal_orig" style="width: 100%; height: 230px; color: #888; font-style: italic; font-size: 12px; overflow-y: scroll;" ></div>\
                            <br/><br/><br/>\
                            <textarea style="width: 500px;" rows="8" cols="50" id="personal_doctor_reply_message_modal_text"></textarea>\
                            <br/>\
                            <button id="personal_doctor_reply_message_modal_send_button" style="width: 100px; height: 30px; margin-top: 7px; background-color: #54BC00; outline: none; border: 0px solid #FFF; border-radius: 5px; color: #FFF;">\
                                Send\
                            </button>\
                        </div>');
    }
    
    var element = null;
    var element_index = 0;
    if(dictionary.hasOwnProperty("index"))
    {
        element = "personal_doctor_timeline_container_"+dictionary.index;
        element_index = dictionary.index;
    }
    else
    {
        // find the index for this timeline based on which timelines already exist in the page
        do
        {
            element_index += 1;
            element = "personal_doctor_timeline_container_"+element_index;
        } while ($(document).find("#"+element).length > 0);
    }

    // add bar
    o.html('<div style="width: 100%; height: 3px; background-color: #666; margin-top: 14px; border-radius: 3px;"></div><div id="'+element+'"></div>');

    var doctor = dictionary.doctor;
    var patient = dictionary.patient;
    var max = dictionary.max;
    if(dictionary.hasOwnProperty('onReply'))
    {
        o.data('onReply', dictionary.onReply);
    }
    
    
    // generate content to display in the timeline
    $.post("get_personal_doctor_timeline.php", {pat_id: patient, doc_id: doctor, max: max, element: "#"+element}, function(data, status)
    {
        console.log(data);
        var d = JSON.parse(data);

        var user = d[0].user;
        var doctor = d[0].doctor;
        var patient = d[0].patient;
        var current_timeline_element = d[0].element;
        var index = d[0].element.split("_")[4];

        $(current_timeline_element).empty();
        
        // go through each item in the result array and display it in the timeline
        for (var i = 1; i < d.length; i++) 
        {
            var item = d[i];

            if(item.Type == 'Doctor Viewed Report')
            {
                H2M_timeline_display_view(item, current_timeline_element, user, i, index);
            }
            else if(item.Type == 'Doctor Uploaded Report')
            {
                H2M_timeline_display_upload(item, current_timeline_element, user, i, index, 'doctor');
            }
            else if(item.Type == 'Patient Uploaded Report')
            {
                H2M_timeline_display_upload(item, current_timeline_element, user, i, index, 'patient');
            }
            else if(item.Type == 'Doctor Edited Summary')
            {
                H2M_timeline_display_summary_edit(item, current_timeline_element, user, i, index);
            }
            else if(item.Type == 'Doctor Referred')
            {
                H2M_timeline_display_referrals(item, current_timeline_element, user, i, index);
            }
            else if(item.Type == 'Doctor sent message to patient')
            {
                H2M_timeline_display_messages(item, current_timeline_element, user, i, index, 'doctor', (user === patient));
            }
            else if(item.Type == 'Patient sent message to doctor')
            {
                H2M_timeline_display_messages(item, current_timeline_element, user, i, index, 'patient', (user === patient));
            }
            else if(item.Type == 'phone')
            {
                H2M_timeline_display_consultations(item, current_timeline_element, user, i, index, 'phone');
            }
            else if(item.Type == 'video')
            {
                H2M_timeline_display_consultations(item, current_timeline_element, user, i, index, 'video');
            }
            else if(item.Type == 'Probe')
            {
                H2M_timeline_display_probe(item, current_timeline_element, user, i, index);
            }
        }
        
        // whenever the user clicks on a file image, open that file in an iframe in a modal window
        $("body").on('click', '.personal_doctor_file', function(e)
        {
            e.preventDefault();
            var file = $(this).attr("data-file");
            $("#H2M_Timeline_File_Modal").html('<iframe src="temp/'+user+'/Packages_Encrypted/'+file+'" style="width:600px;height:800px;"></iframe>');
            $("#H2M_Timeline_File_Modal").dialog({bigframe: true, width: 620, height: 840, modal: true});
            Tipped.hideAll();
        });
        
        // whenever the user clicks on a "Reply" button in a message tooltip, open a modal window so they can reply to the message
        $("body").on('click', '.personal_doctor_reply_button', function(e)
        {
            e.preventDefault();
            Tipped.hideAll();
            $("#personal_doctor_reply_message_modal_text").text('');
            $("#personal_doctor_reply_message_modal_orig").text($(this).parent().children('span').eq(0).text());
            $("#personal_doctor_reply_message_modal_send_button").data("id", $(this).data("id"));
            $("#personal_doctor_reply_message_modal").dialog({bigframe: true, width: 550, height: 600, modal: true});
            $(".ui-dialog").css("position", "fixed");
            
            o.data("last_clicked_reply_button", $(this));
        });
        
        // whenever the user clicks on the send button in the reply modal window, send the message to the doctor
        $("body").on('click', '#personal_doctor_reply_message_modal_send_button', function(e)
        {
            $.post("reply_to_personal_doctor.php", {user: user, message: $("#personal_doctor_reply_message_modal_text").val(), id: $(this).data("id")}, function(data, status)
            {
                $("#personal_doctor_reply_message_modal").dialog('close');
                o.data("last_clicked_reply_button").css('display', 'none');
                if(dictionary.hasOwnProperty('onReply'))
                {       
                    var func = o.data('onReply');
                    func();
                }
            });
        });
        
        // mouse events for animations for the items in the timeline
        $(".personal_doctor_timeline_item").mouseenter(function(e)
        {
            $(this).animate({width: '28px', height: '28px', marginTop: '-17px', fontSize: '18px', paddingTop: '3px', borderRadius: '28px', marginLeft: '3px', marginRight: '3px'}, {duration: 200, easing: 'easeInOutQuad'});
        });
        $(".personal_doctor_timeline_item").mouseleave(function()
        {
            $(this).animate({width: '22px', height: '22px', marginTop: '-14px', fontSize: '14px', paddingTop: '0px', borderRadius: '22px', marginLeft: '6px', marginRight: '6px'}, {duration: 200, easing: 'easeInOutQuad'});
        });
    });
}

/*
 *  DISPLAY FUNCTIONS
 */

function H2M_timeline_display_view(item, element, user, offset, index)
{
    var content = '';
    
    // load the images one by one into the content string, up to eight
    for(var k = 0; k < item.Image.length && k < 8; k++)
    {
        if(k == 5)
            content += '<br/>';
        
        if(item.File[k] == 'NF')
        {
            // no file was found for this entry, display a message to the user
            content += '<div style="height: 183px; width: 200px; padding: 5px; padding-top: 65px; background-color: #FAFAFA; border: 2px dashed #EEE; color: #999; font-size: 12px; text-align: center; float: left; border-radius: 3px; margin-right: 5px;">File Not Found</div>';
        }
        else
        {
            content += '<img class="personal_doctor_file" data-file="'+item.File[k]+'" src="temp/'+user+'/PackagesTH_Encrypted/'+item.Image[k]+'" height="283" width="200" style="padding: 5px; cursor: pointer;" />';
        }
    }
    
    // if there are more than eight, let the user know that there are more and give them a link to view them in patientdetailMED
    if(item.Image.length > 8)
    {
        content += '<br/><div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #666;"><a href="patientdetailMED-new.php?IdUsu='+user+'">' + (item.Image.length - 8) + ' More</a></div>';
    }
    
    // generate the date string
    var sum_date = item.Date;
    if(item.Date != item.EndDate)
        sum_date = item.EndDate+" - "+sum_date;
    
    // generate the title
    var Title = 'Doctor Viewed ' + item.Image.length + ' Report';
    if(item.Image.length > 1)
        Title += 's';
    
    // add the icon to the timeline
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-eye-open"></i></div>');
    
    // generate final content
    content += '<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+sum_date+'</div>';

    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), Title, content);
}


function H2M_timeline_display_upload(item, element, user, offset, index, type)
{
    var content = '';
    
    // load the images one by one into the content string, up to eight
    for(var k = 0; k < item.Image.length && k < 8; k++)
    {
        if(k == 5)
            content += '<br/>';
        if(item.File[k] == 'NF')
        {
            // no file was found for this entry, display a message to the user
            content += '<div style="height: 183px; width: 200px; padding: 5px; padding-top: 65px; background-color: #FAFAFA; border: 2px dashed #EEE; color: #999; font-size: 12px; text-align: center; float: left; border-radius: 3px; margin-right: 5px;">File Not Found</div>';
        }
        else
        {
            content += '<img class="personal_doctor_file" data-file="'+item.File[k]+'" src="temp/'+user+'/PackagesTH_Encrypted/'+item.Image[k]+'" height="283" width="200" style="padding: 5px; cursor: pointer;" />';
        }

    }
    
    // if there are more than eight, let the user know that there are more and give them a link to view them in patientdetailMED
    if(item.Image.length > 8)
    {
        content += '<br/><div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #666;"><a href="patientdetailMED-new.php?IdUsu='+user+'">' + (item.Image.length - 8) + ' More</a></div>';
    }
    
    //generate date string
    var sum_date = item.Date;
    if(item.Date != item.EndDate)
        sum_date = item.EndDate+" - "+sum_date;
    
    // generate title
    var Title = '';
    if(type == 'doctor')
        Title = 'Doctor';
    else
        Title = 'Patient';
    Title += ' Uploaded ' + item.Image.length + ' Report';
    if(item.Image.length > 1)
        Title += 's';
    
    // add the icon to the timeline
    if(type == 'doctor')
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-upload"></i></div>');
    else
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00"><i class="icon-upload"></i></div>');
    
    // generate final content
    content += '<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+sum_date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), Title, content);
}

function H2M_timeline_display_summary_edit(item, element, user, offset, index)
{
    var description = "";
    
    // format the edit description for html
    var split_desc = item.Description.split("<br/>");
    for(var k = 0; k < split_desc.length; k++)
    {
        var desc = split_desc[k].split(" - ");
        description += '<strong>'+desc[0]+': </strong>'+desc[1]+'<br/><br/>';
    }
    
    // generate date string
    var sum_date = item.Date;
    if(item.Date != item.EndDate)
        sum_date = item.EndDate+" - "+sum_date;
    
    // add the icon to the timeline
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-pencil"></i></div>');
    
    // generate final content
    description += '<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+sum_date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), 'Doctor Edited Summary', description);
}

function H2M_timeline_display_referrals(item, element, user, offset, index)
{
    // add the icon to the timeline
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-share-alt"></i></div>');
    
    // generate content
    var content = 'Doctor referred user to Dr. '+item.Name+'<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+item.Date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), 'Doctor Referral', content);
}

function H2M_timeline_display_messages(item, element, user, offset, index, type, isPatient)
{
    var reply_button = '';
    
    // if this is a message from the doctor to the patient, it has not been replied, and the currently logged in user is a pateint, then display a reply button
    if(item.Replied == 0 && type == 'doctor' && isPatient)
    {
        reply_button = '<button class="personal_doctor_reply_button" data-id="'+item.ID+'" style="width: 60px; height: 22px; margin-top: 7px; background-color: #54BC00; outline: none; border: 0px solid #FFF; border-radius: 5px; color: #FFF;">Reply</button>';
    }
    
    // add the icon to the timeline
    if(type == 'doctor')
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-envelope"></i></div>');
    else
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00"><i class="icon-envelope"></i></div>');
    
    // generate title
    var Title = 'Message From Doctor';
    if(type == 'patient')
        Title = 'Message From Patient';
    
    // generate content
    var content = '<span>'+item.Message+'</span><br/>'+reply_button+'<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+item.Date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1),Title, content);
}

function H2M_timeline_display_consultations(item, element, user, offset, index, type)
{
    var notes_image = '';
    
    // generate a thumbnail for the consultation's notes if it exists
    if(item.Notes_File != 'NF')
    {
        notes_image = '<img class="personal_doctor_file" data-file="'+item.Notes_File+'" src="temp/'+user+'/PackagesTH_Encrypted/'+item.Notes+'" height="283" width="200" style="padding: 5px; cursor: pointer;" /><span style="text-align: auto;">Notes</span>';
    }
    
    // add the icon to the timeline
    if(type == 'phone')
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-phone"></i></div>');
    else
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-facetime-video"></i></div>');
    
    // generate title
    var Title = 'Video Consultation';
    if(type == 'phone')
        Title = 'Phone Consultation';
    
    // generate content
    var content = '<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #333;">Doctor and user had a '+type+' consultation.</div>'+notes_image+'<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+item.Date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), Title, content);
}

function H2M_timeline_display_probe(item, element, user, offset, index)
{
    // add the icon to the timeline
    $(current_timeline_element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00"><i class="icon-check"></i></div>');
    
    // generate content
    var content = 'Response: '+item.Response+'<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+item.Date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), 'Probe Response Received', content);
}




/*
 *  HELPER FUNCTIONS
 */

function H2M_timeline_bind_tooltip(element, title, content)
{
    // this function is used to bind a Tipped tooltip to an element in the timeline
    
    // first, remove any existing tooltips from this element
    Tipped.remove(element);
    
    // then add the new tooltip
    Tipped.create(element, content, { title: title, position: 'top', size: 'large', showDelay: 200, fixed: false, skin: 'light' });
}