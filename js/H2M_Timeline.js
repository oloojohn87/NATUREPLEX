var start_date = '';
var end_date = '';
var container_height = 0;
var member_row = 0;
var doctor_row = 0;

$.fn.H2M_Timeline = function(dictionary) 
{
    var o = $(this[0]);

    o.empty();

    var minimized = dictionary.minimized;
    
    if (minimized == 0)
    {
        circle_size  = 22;  
        timeline_height = 30; 
        band_width = 15;
        font_icon = 14;
    }
    if (minimized == 1)
    {
        circle_size  = 12;  //22
        timeline_height = 12; //30
        band_width = 5; //15
        font_icon = 10;
    }

    //asign font-size for year and month labels
    if (timeline_height >20) 
    {
        font_month = 8;
        font_year = 10;
    }
    if (timeline_height <=20 && timeline_height>10) 
    {
        font_month = 6;
        font_year = 6;
    }
    
    
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
                                width: '+ circle_size+'px;\
                                height: '+ circle_size+'px;\
                                text-align: center;\
                                border-radius: '+ circle_size+'px;\
                                background-color: #F4F4F4;\
                                border: 1px solid #E0E0E0;\
                                float: right;\
                                font-size: '+font_icon+'px;\
                                line-height: '+ circle_size+'px;\
                                color: #22AEFF;\
                                cursor: pointer;\
                                font-family: Arial, sans-serif;\
                            }\
                            .timeline_label{\
                                font-family: Lato-Regular;\
                                line-height: '+timeline_height+'px;\
                                text-align: center;\
                                color: #FFFFFF;\
                                margin-left: -5px;\
                            }\
                            .label_year{\
                                font-size: '+font_year+'px;\
                                color:#FFFFFF;\
                            }\
                           .label_month{\
                                font-size: '+font_month+'px;\
                                color:#C2C2C2;\
                                margin-left: -3px;\
                            }\
                            .timeline_box_label{\
                                height:'+timeline_height+'px;\
                                position:relative;\
                                top:'+(-timeline_height-1)+'px;\
                                float:left;\
                                position:absolute;\
                                width:15px;\
                                background:#E2E1E1;\
                                top: '+((o.height()/2)-(timeline_height/2)+1)+'px;\
                            }\
                            .timeline_day_line{\
                                height:'+timeline_height+'px;\
                                position:relative;\
                                top:'+(-timeline_height-1)+'px;\
                                float:left;\
                                position:absolute;\
                                width:1px;\
                                background:#F5F5F5;\
                                top: '+((o.height()/2)-(timeline_height/2)+1)+'px;\
                            }\
                            .box_month{\
                                width: 10px;\
                                background: #EFEEEE;\
                            }\
                            .rotate {\
                              -webkit-transform: rotate(270deg);\
                              -ff-transform: rotate(270deg);\
                              -moz-transform: rotate(270deg);\
                              -ms-transform: rotate(270deg);\
                              -o-transform: rotate(270deg);\
                              transform: rotate(270deg);\
                            }\
                         </style>');
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

    container_height = o.height();
    
    // add bar (JV: remove this after tweaks and replace with code in line 108 )
    o.html('<div style="width: 100%; height: 3px; background-color: #cacaca; margin-top: '+(container_height/2)+'px; border-radius: 3px;"></div><div id="'+element+'"></div>');

    //var parentheight = $('#object').width($('#object').parent().width());
    
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

        var user = d[0].patient;//user;
        var doctor = d[0].doctor;
        var patient = d[0].patient;
        var current_timeline_element = d[0].element;
        var index = d[0].element.split("_")[4];

        $(current_timeline_element).empty();
                
        // Calculate time span for this timeline
        start_date = d[1].Date;
        end_date = d[d.length-1].Date;
        
        start_date = d[d.length-1].Date;
        end_date = d[1].Date;
       
        // JUST TESTING, PLEASE DELETE
        //start_date = 'Oct 2, 2013 7:20 AM';
        /*
        end_date = 'Apr 21, 2015 7:20 AM';
        
        alert ('Start:'+start_date+'   End:'+end_date);
        */
        // JUST TESTING, PLEASE DELETE
        
        var a = moment(new Date(start_date));
        var b = moment(new Date(end_date));
        // Calculate number of years within time span
        var years_span = b.format('YYYY') - a.format('YYYY'); 
        // Calculate number of months within time span
        var months_span = parseInt(b.format('M')) + parseInt((12 - a.format('M') + 1)) + (12 * (years_span - 1));          
        // Calculate number of days contained in time span
        var days_span = b.diff(a, 'days');
                
        doctor_row = ((container_height/2) - (timeline_height/2) - band_width - circle_size);
        member_row = ((container_height/2) + (timeline_height/2) + band_width);
        center_row = ((container_height/2) - (circle_size/2));
        console.log('container_height: '+container_height);
        console.log('timeline_height: '+timeline_height);
        console.log('band_width: '+band_width);
        console.log('circle_size: '+circle_size);
        console.log('doctor_row: '+doctor_row);
        console.log('member_row: '+member_row);
        console.log('center_row: '+center_row);
        
        
        // add Timeline time-span background bar
        o.html('');
        o.append('<div id="scale_timeline" style="width: 100%; height:'+timeline_height +'px; border-radius: 25px; background: #FAFAFA; border: 1px solid #CACACA; margin-top: '+((container_height/2)-(timeline_height/2))+'px; "></div>');
        o.append('<div id="'+element+'"></div>');
        
        container_width = o.width() - 25 - 40; // working width equals width minus rounded ends, minus security margin

        // add Day markers
        // Create a sort of responsivity behavior for the month labels (draw less months if overlap is estimated)
        jump_value = 1;  // This means:  draw one day each (jum_value) days
        days_density = container_width / (days_span * 2);  // '2' is the width of the line that represents a day
        if (days_density < 2) jump_value = 2;
        if (days_density < 1) jump_value = 9999;
        //if (days_density < .5) jump_value = 5;
        console.log ('days_density:  '+days_density+'    jump_value:'+jump_value);
        jump = 0;
        var a_keep = moment(new Date(start_date));
        for (var i = 0; i <= days_span; i++)
        {
            jump++;
            jump_now = 0;
            if (jump != jump_value) { jump_now = 1; } else { jump = 0; };
            draw_day = a_keep.add(1, 'days');  
            position_item = H2M_plot_date(draw_day.format('MMM D YYYY'), start_date, end_date, container_width);
            if (jump_now == 0) o.append('  <div class="timeline_day_line" style="left:'+position_item+'px;"></div>');
        }
        
        // add Year dividers
        start_year = a.format('YYYY');
        for (var i = 0; i <= years_span; i++)
        {
            item_date = 'Jan 01, '+(parseInt(start_year)+i+1)+' 0:01 AM';
            var d_item = moment(new Date(item_date));
            days_item = d_item.diff(a, 'days');
            position_item = H2M_plot_date(item_date, start_date, end_date, container_width);
            if (i != years_span) o.append('  <div class="timeline_box_label" style="left:'+position_item+'px;"><div class="timeline_label label_year rotate" style="">'+(parseInt(start_year)+i+1)+'</div></div>');
           
            // add Month dividers
            start_month_i = 2;
            end_month_i = 13;
            if (i == 0)             start_month_i = 1 + parseInt(a.format('M'));                        
            if (i == (years_span))  end_month_i   = 1 + parseInt(b.format('M')); 
             
            timeline_density = container_width / (months_span * 10);  // '10' is the width (rotated height) of the box that contains the month label
            // Create a sort of responsivity behavior for the month labels (draw less months if overlap is estimated)
            jump_value = 1;  // This means:  draw one month each (jum_value) months
            if (timeline_density < 2) jump_value = 2;
            if (timeline_density < 1) jump_value = 3;
            jump = 0;
            for (var j = start_month_i; j < end_month_i; j++)
                {
                    jump++;
                    jump_now = 0;
                    if (jump != jump_value) { jump_now = 1; } else { jump = 0; };
                    item_date = j+'-01-'+(parseInt(start_year)+i)+' 0:01 AM';
                    start_month_a = moment(new Date(item_date)).format('MMM');
                    position_item = H2M_plot_date(item_date, start_date, end_date, container_width);
                    if (jump_now == 0) o.append('  <div class="timeline_box_label box_month" style="left:'+ position_item +'px;"><div class="timeline_label label_month rotate" style="">'+start_month_a+'</div></div>');
               }

        }

        // add starting and ending labels to the graph
        o.append('<div id="start_date_label" style="font-size:10px; color:#cacaca; position:absolute; left: 15px; top:'+((container_height/2)+(timeline_height/2)+ (band_width+20))+'px;">'+a.format('MMM D, YYYY')+'</div>');
        o.append('<div id="start_date_line" style="z-index:0; height:'+(band_width+30)+'px; width:1px; background:#E4E4E4; position:absolute; left: 12.5px; top:'+((container_height/2)+(timeline_height/2))+'px;"></div>');
        o.append('<div id="end_date_label" style="font-size:10px; width:120px; text-align:right; color:#cacaca; position:absolute; left: '+(o.width() - 15 - 120 )+'px; top:'+((container_height/2)+(timeline_height/2)+ (band_width+20))+'px;">'+b.format('MMM D, YYYY')+'</div>');
        o.append('<div id="end_date_line" style="z-index:0; height:'+(band_width+30)+'px; width:1px; background:#E4E4E4; position:absolute; left: '+(o.width() - 12.5)+'px; top:'+((container_height/2)+(timeline_height/2))+'px;"></div>');
        
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
            else if(item.Type == 'SignUp')
            {
                H2M_timeline_display_signup(item, current_timeline_element, user, i, index);
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
        
        var arrange_once = 0;
        // mouse events for animations for the items in the timeline
        $(".personal_doctor_timeline_item").mouseenter(function(e)
        {
            if (arrange_once == 0) rearrange(index,d);
            arrange_once = 1;
            $(this).animate({backgroundColor: '#E8E8E8', borderColor: '#B6B6B6'}, {duration: 200, easing: 'easeInOutQuad'});
        });
        $(".personal_doctor_timeline_item").mouseleave(function()
        {
            $(this).animate({backgroundColor: '#F4F4F4', borderColor: '#E0E0E0'}, {duration: 200, easing: 'easeInOutQuad'});
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
    content = '<div style="width: 100%; height: 283px;">';
    for(var k = 0; k < item.Image.length && k < 8; k++)
    {
        if(k == 4)
            content += '</div><div style="width: 100%; height: 283px;">';
        
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
    content += '</div>';
    
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
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="position:absolute; left:'+position_item+'px; top:'+doctor_row+'px;"><i class="icon-eye-open"></i></div>');

    // add connecting line from icon to timeline
    $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) - (timeline_height/2) - band_width +1)+'px;"></div>');
      
    // generate final content
    content += '<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+sum_date+'</div>';

    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), Title, content);
}

function H2M_timeline_display_upload(item, element, user, offset, index, type)
{
    var content = '';
    
    content += '<div style="width: 100%; height: 283px;">';
    // load the images one by one into the content string, up to eight
    for(var k = 0; k < item.Image.length && k < 8; k++)
    {
        if(k == 4)
        {
            content += '</div><div style="width: 100%; height: 283px;">';
        }
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
    content += '</div>';
    
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
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    //console.log ('Item Date: '+item.Date+'    REAL POSITION: '+position_item+'  start_date: '+start_date+' end_date: '+end_date+'   container_width:'+container_width);
    if(type == 'doctor') 
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="position:absolute; left:'+position_item+'px; top:'+doctor_row+'px;"><i class="icon-upload"></i></div>');
    else
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00; position:absolute; left:'+position_item+'px; top:'+member_row+'px;"><i class="icon-upload" ></i></div>');
   
    // add connecting line from icon to timeline
    if(type == 'doctor') 
    {
       $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) - (timeline_height/2) - band_width +1)+'px;"></div>');
    }
    else
    {
        $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) + (timeline_height/2) +1)+'px;"></div>');
    }
    
    
    // generate final content
    content += '<div style="width: 100%; height: 30px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+sum_date+'</div>';
    
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
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="position:absolute; left:'+position_item+'px; top:'+doctor_row+'px;"><i class="icon-pencil" ></i></div>');

    // add connecting line from icon to timeline
    $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) - (timeline_height/2) - band_width +1)+'px;"></div>');

    // generate final content
    description += '<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+sum_date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), 'Doctor Edited Summary', description);
}

function H2M_timeline_display_referrals(item, element, user, offset, index)
{
    // add the icon to the timeline
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="position:absolute; left:'+position_item+'px; top:'+doctor_row+'px;"><i class="icon-share-alt"></i></div>');

    // add connecting line from icon to timeline
    $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) - (timeline_height/2) - band_width +1)+'px;"></div>');

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
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    /*
    if(type == 'doctor')
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-envelope"></i></div>');
    else
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00"><i class="icon-envelope"></i></div>');
    */
    if(type == 'doctor') 
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="position:absolute; left:'+position_item+'px; top:'+doctor_row+'px;"><i class="icon-envelope"></i></div>');
    else
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00; position:absolute; left:'+position_item+'px; top:'+member_row+'px;"><i class="icon-envelope"></i></div>');

    // add connecting line from icon to timeline
    if(type == 'doctor') 
    {
       $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) - (timeline_height/2) - band_width +1)+'px;"></div>');
    }
    else
    {
        $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) + (timeline_height/2) +1)+'px;"></div>');
    }

    
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
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    if(type == 'phone')
        //$(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-phone"></i></div>');
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="position:absolute; left:'+position_item+'px; top:'+center_row+'px; color: #EE8F19;  z-index:99;"><i class="icon-phone"></i></div>');
    else
        //$(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item"><i class="icon-facetime-video"></i></div>');
        $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="position:absolute; left:'+position_item+'px; top:'+center_row+'px; color: #EE8F19; z-index:99;"><i class="icon-facetime-video"></i></div>');
   
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
    //$(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00"><i class="icon-check"></i></div>');
    
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    //$(current_timeline_element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00"><i class="icon-check"></i></div>');
    
//current_timeline_element
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00; position:absolute; left:'+position_item+'px; top:'+member_row+'px;"><i class="icon-check"></i></div>');

    $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) + (timeline_height/2) +1)+'px;"></div>');

    
    // generate content
    var content = 'Response: '+item.Response+'<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+item.Date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), 'Probe Response Received', content);
}

function H2M_timeline_display_signup(item, element, user, offset, index)
{
    // add the icon to the timeline
    //$(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00"><i class="icon-star"></i></div>');
    //alert ('signup icon');
    position_item = H2M_plot_date(item.Date, start_date, end_date, container_width);
    $(element).append('<div id="personal_doctor_timeline_item_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item" style="color: #54bc00; position:absolute; left:'+position_item+'px; top:'+member_row+'px;"><i class="icon-star"></i></div>');
  
    // add connecting line from icon to timeline
    $(element).append('<div id="personal_doctor_timeline_item_line_'+index+'_'+(offset+1)+'" class="personal_doctor_timeline_item_line" style="width:1px; height:'+(band_width-1)+'px; background:#cacaca; position:absolute; left:'+(position_item + (circle_size/2))+'px; top:'+((container_height/2) + (timeline_height/2) +1)+'px;"></div>');

    // generate content
    var content = 'User account was created<div style="width: 100%; height: 15px; padding-top: 5px; text-align: center; color: #AAA; font-style: italic;">'+item.Date+'</div>';
    
    // bind a new tooltip to this element
    H2M_timeline_bind_tooltip("#personal_doctor_timeline_item_"+index+'_'+(offset+1), 'User Account Created', content);
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

function H2M_plot_date(entry_date, start_date, end_date, container_width)
{
    var d_it = moment(new Date(entry_date));
    var a = moment(new Date(start_date));
    var b = moment(new Date(end_date));
    var days_span = b.diff(a, 'days');
    days_it = d_it.diff(a, 'days');
    position_it = 12.5 + 20 + (days_it * container_width / days_span); // position needs to add rounded end and security margin 
    return (position_it);
}


function rearrange(index,d)
{

i=2;
item_id = 'personal_doctor_timeline_item_'+index+'_'+(i+1);
console.log ('TEST  TEST   '+item_id+'  html: '+$('#'+item_id).html());
var collision_left = new Array();
var collision_right = new Array();
var collision_index = 0;
    
console.log ('...re-arranging timeline');    
    
// Traverse the result array to look for collisions when displaying it in the timeline
for (var i = 1; i < d.length; i++) 
{
    var item = d[i];
    if(item.Type != 'phone' && item.Type != 'video')
    {
         item_id = 'personal_doctor_timeline_item_'+index+'_'+(i+1);
         for (var j = 1; j < d.length; j++) 
         {
              var item_sub = d[j];
             if(item_sub.Type != 'phone' && item_sub.Type != 'video')
             {
                item_sub_id = 'personal_doctor_timeline_item_'+index+'_'+(j+1);
                distance_items = parseInt($('#'+item_id).position().left) - parseInt($('#'+item_sub_id).position().left); 
                if ($('#'+item_id).css('color') == $('#'+item_sub_id).css('color')) same_band = 1; else same_band = 0;
                if (Math.abs(distance_items) < circle_size && (i != j) && same_band == 1) 
                {
                              if (j == 15)
                              {
                                console.log ();
                              }
  
                    // Detect patient or doctor row and calculate new positions for icons and lines
                    item_sub_id_line = 'personal_doctor_timeline_item_line_'+index+'_'+(j+1);
                    if ($('#'+item_id).css('color') == '#54bc00' || $('#'+item_id).css('color') == 'rgb(84, 188, 0)') {
                        new_top = member_row + 20;
                        new_line_top = $('#'+item_sub_id_line).position().top;
                        new_line_height = $('#'+item_sub_id_line).height() + 20;
                    }else {
                        new_top = doctor_row - 20;
                        new_line_top = $('#'+item_sub_id_line).position().top - 20;
                        new_line_height = $('#'+item_sub_id_line).height() + 20;
                    }
                    // Check if already done
                    already_detected = 0; 
                    for (var k = 0; k < collision_index; k++) if ((collision_right[k] == j && collision_left[k] == i) || (collision_right[k] == i && collision_left[k] == j) ) already_detected = 1; 
                    
                    if (already_detected == 0) {
                        $('#'+item_sub_id).animate({top: new_top}, {duration: 200, easing: 'easeInOutQuad'});
                        // extend connecting line from icon to timeline
                        $('#'+item_sub_id_line).animate({top: new_line_top, height: new_line_height}, {duration: 200, easing: 'easeInOutQuad'});
                        $('#'+item_sub_id_line).css('z-index','0');
                    }
                    collision_left[collision_index] = i;
                    collision_right[collision_index] = j;
                    collision_index++;
                }
            }
         }
     }
}

    
}


/*
function degL($x1,$y1,$x2,$y2)
{
	$a = $x2 - $x1;
	$b = $y2 - $y1;
	$L = sqrt(pow($a,2) + pow($b,2));
	
	$alfa = asin($b/$L);
	
	$solved[0] = $L;
	$solved[1] = rad2deg($alfa);
	
	return $solved;
}

function draw_box_line()
{
    $n = 0;
    $daysLength = daysOld($datesource[$count-1]);
    $pixelLength = $HeightContainer-5;
    while ($n < $count)
    {	
        $days = daysOld($datesource[$n]);
        $dateHeight = ($pixelLength * $days)/$daysLength;
        $x1 = 0;
        $y1 = $dateHeight+1;
        $x2 = 50;
        $y2 = ($HeightLabel * ($n+1))-($HeightLabel/2);
        $returned =  degL($x1,$y1,$x2,$y2);
        $Len = $returned[0];
        $Alf = $returned[1];
        echo '<div class="ELine" style="height: 0px; width:'.$Len.'px; border-top: 1px solid lightgrey; position:absolute; left: 0px; top:'.$y1.'px; transform:rotate('.$Alf.'deg); -ms-transform:rotate('.$Alf.'deg); -webkit-transform:rotate('.$Alf.'deg); -webkit-transform-origin: 0% 0%;"></div>';	    
        $n++;
    }


}

*/










