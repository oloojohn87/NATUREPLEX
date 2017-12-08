var DOCTOR_CONNECT = function()
{
    this.current_page = 'find_doctor_main'; // the id of the div of the current page being shown
    this.current_identifier = 'main_menu'; // the unique identifier for this id
    this.type = 2; // 2 -> phone, 1 -> video
    this.country = 'USA';
    this.state = '';
    this.must_be_available = true;
    
    /*
     *  PAGES PROPERTY
     *
     *  The following property defines the actions that a page should take.
     *
     */
    
    this.pages = 
    {
        main_menu: 
        {
            next_page: '', 
            previous_page: '', 
            next_identifier: '', 
            previous_identifier: '', 
            next_step: 2, 
            previous_step: 1, 
            next_label: '', 
            previous_label: ''
        },
        doctor_now_step_1: 
        {
            next_page: 'find_doctor_choose_speciality', 
            previous_page: 'find_doctor_main', 
            next_identifier: 'doctor_now_step_2', 
            previous_identifier: 'main_menu', 
            next_step: 3, 
            previous_step: 1, 
            next_label: 'Select Specialty', 
            previous_label: ''
        },
        doctor_now_step_2: 
        {
            next_page: 'find_doctor_receipt', 
            previous_page: 'find_doctor_choose_region', 
            next_identifier: 'doctor_now_receipt', 
            previous_identifier: 'doctor_now_step_1', 
            next_step: 5, 
            previous_step: 2, 
            next_label: 'Confirmation', 
            previous_label: 'Select Type'
        }
        
    }
    
    // FUNCTIONS
    
    this.set_step = function(step)
    {
        $('div[id^="step_bar_"]').removeClass();
        $('div[id^="step_circle_"]').removeClass();
        for(var i = 1; i <= step; i++)
        {
            $("#step_circle_"+i).attr("class", "step_circle lit");
        }
        for(var i = step + 1; i <= 6; i++)
        {
            $("#step_circle_"+i).attr("class", "step_circle");
        }
        for(var i = 1; i < step; i++)
        {
            $("#step_bar_"+i).attr("class", "step_bar lit");
        }
        for(var i = step; i <= 5; i++)
        {
            $("#step_bar_"+i).attr("class", "step_bar");
        }
    }
    
};

var doc_con = new DOCTOR_CONNECT();

$("#find_doctor_next_button").on('click', function()
{
    $('#'+doc_con.current_page).fadeOut(300, function()
    {
        $('#'+doc_con.pages[doc_con.current_identifier].next_page).fadeIn(300);
        doc_con.set_step(doc_con.pages[doc_con.current_identifier].next_step);
        doc_con.current_page = doc_con.pages[doc_con.current_identifier].next_page;
        doc_con.current_identifier = doc_con.pages[doc_con.current_identifier].next_identifier;
        $("#find_doctor_label").text(doc_con.pages[doc_con.current_identifier].next_label);
    });
});

$("#find_doctor_previous_button").on('click', function()
{
    $('#'+doc_con.current_page).fadeOut(300, function()
    {
        $('#'+doc_con.pages[doc_con.current_identifier].previous_page).fadeIn(300);
        doc_con.set_step(doc_con.pages[doc_con.current_identifier].previous_step);
        doc_con.current_page = doc_con.pages[doc_con.current_identifier].previous_page;
        doc_con.current_identifier = doc_con.pages[doc_con.current_identifier].previous_identifier;
        $("#find_doctor_label").text(doc_con.pages[doc_con.current_identifier].previous_label);
    });
});

$("#find_doctor_now_button").live('click',function()
{
    var country = geoplugin_countryName();
    if (country == "United States") {
        country = "USA";
    }   

    $("#country").val(country);			 
    $("#country").change();
    var zone = geoplugin_region();
    var district = geoplugin_city();
    $("#state").val(district);			 
    $("#state").change();
    // GEOLOCATION

    if(!$(this).hasClass("square_blue_button_disabled"))
    {
        doc_con.set_step(2);
        $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_choose_region").fadeIn(300)});
        $("#find_doctor_label").text("Select Type");
        doc_con.current_page = 'find_doctor_choose_region';
        doc_con.current_identifier = 'doctor_now_step_1';
        
    }
});

$('button[id^="find_doctor_video_button"]').live('click', function()
{
    $('button[id^="find_doctor_video_button"]').css('background-color', '#22aeff');
    $('button[id^="find_doctor_phone_button"]').css('background-color', '#535353');
    doc_con.type = 1;
});
$('button[id^="find_doctor_phone_button"]').live('click', function()
{
    $('button[id^="find_doctor_phone_button"]').css('background-color', '#22aeff');
    $('button[id^="find_doctor_video_button"]').css('background-color', '#535353');
    doc_con.type = 2;
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
    console.log(loc_1+" "+loc_2+" "+mba);
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
                //console.log(data);
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

