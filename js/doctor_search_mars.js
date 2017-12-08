var order_column = 0; // 0 = Name, 1 = rating
var order_direction = 1; // 1 = ascending, 0 = descending
var doctors_last_result = 0;
var doctors_next_result = 0;
var doctors_page_memory = new Array();
var last_search_term = "";
var doctor_advanced_search = false;
var doctor_advanced_search_changed = false;
var my_doctor_add = true;
var my_doctor_id = -1;
var personal_doctor_search = 0;
var num_files = 0;
var doctor_search_tag = 0; // user for concurrency in doctor search
var next = false;



var share_modal = $("#personal_doctor_share_modal").dialog({bigframe: true, width: 900, height: 400, maxHeight: 400, maxWidth: 900, resizable: false, modal: true, autoOpen: false});

$(".doctor_search_nav_bar").children().eq(0).data("index", 1);
$(".doctor_search_nav_bar").children().eq(1).data("index", 2);
$(".doctor_search_nav_bar").children().eq(2).data("index", 3);
$("#available_toggle_button").on('click', function()
{
    if($(this).attr("data-on") == "true")
    {
        $(this).attr("data-on", "false");
        $(this).css("background-color", "#FFF");
    }
    else
    {
        $(this).attr("data-on", "true");
        $(this).css("background-color", "#22AEFF");
        if($("#telemedicine_toggle_button").attr("data-on") == "false")
        {
            $("#telemedicine_toggle_button").attr("data-on", "true");
            $("#telemedicine_toggle_button").css("background-color", "#22AEFF");
        }
    }
    doctors_page_memory.length = 0;
    doctors_last_result = 0;
    doctors_next_result = 0;
    get_doctors();
});
$("#telemedicine_toggle_button").on('click', function()
{
    if($(this).attr("data-on") == "true")
    {
        $(this).attr("data-on", "false");
        $(this).css("background-color", "#FFF");
        if($("#available_toggle_button").attr("data-on") == "true")
        {
            $("#available_toggle_button").attr("data-on", "false");
            $("#available_toggle_button").css("background-color", "#FFF");
        }
    }
    else
    {
        $(this).attr("data-on", "true");
        $(this).css("background-color", "#22AEFF");
    }
    doctors_page_memory.length = 0;
    doctors_last_result = 0;
    doctors_next_result = 0;
    get_doctors();
});

$("#advanced_toggle_button").on('click', function()
{
    if($(this).hasClass("doctor_search_advanced_toggle_button_selected"))
    {
        $(this).removeClass("doctor_search_advanced_toggle_button_selected").addClass("doctor_search_advanced_toggle_button");
        $("#doctor_rows").css("display", "block");
        $("#doctors_search_page_buttons").css("display", "block");
        $("#doctor_search_advanced").css("display", "none");
        doctor_advanced_search = false;
        if(doctor_advanced_search_changed == true)
        {
            doctors_page_memory.length = 0;
            doctors_last_result = 0;
            doctors_next_result = 0;
            get_doctors();
        }
    }
    else
    {
        $(this).removeClass("doctor_search_advanced_toggle_button").addClass("doctor_search_advanced_toggle_button_selected");
        $("#doctor_rows").css("display", "none");
        $("#doctors_search_page_buttons").css("display", "none");
        $("#doctor_search_advanced").css("display", "block");
        doctor_advanced_search = true;
        doctor_advanced_search_changed = false;
    }
});

$(".doctor_search_advanced_button").on('click', function()
{
    if($(this).text() == "Reset")
    {
        if($('#search_speciality').val() != "Any" || $('#country_search').val() != "-1" || ($('#region_search').val() != "-1" && $('#region_search').val() != null))
        {
            doctor_advanced_search_changed = true;
        }
        $('#search_speciality').val("Any");
        $('#country_search').val("-1");
        $('#region_search').val("-1");
        $('#region_search').html('');
    }
    else if($(this).text() == "Search")
    {
        doctors_page_memory.length = 0;
        doctors_last_result = 0;
        doctors_next_result = 0;
        get_doctors();
        $("#doctor_rows").css("display", "block");
        $("#doctors_search_page_buttons").css("display", "block");
        $("#doctor_search_advanced").css("display", "none");
        $("#advanced_toggle_button").removeClass("doctor_search_advanced_toggle_button_selected").addClass("doctor_search_advanced_toggle_button");
    }
    else
    {
        $("#advanced_toggle_button").trigger('click');
    }
});

$(".sort_button").on('click', function()
{
    if($(this).attr("id") == "name_button")
    {
        order_column = 0;
    }
    else if($(this).attr("id") == "rating_button")
    {
        order_column = 1;
    }
    if($(this).children().eq(0).hasClass("icon-caret-up"))
    {
        $(this).children().eq(0).removeClass("icon-caret-up").addClass("icon-caret-down");
        order_direction = 0;
        
    }
    else if($(this).children().eq(0).hasClass("icon-caret-down"))
    {
        $(this).children().eq(0).removeClass("icon-caret-down").addClass("icon-caret-up");
        order_direction = 1;
    }
    else
    {
        $('.sort_button').each(function(index)
        {
            $(this).children().eq(0).removeClass("icon-caret-down");
            $(this).children().eq(0).removeClass("icon-caret-up");
        });
        $(this).children().eq(0).addClass("icon-caret-up");
        order_direction = 1;
    }
    doctors_page_memory.length = 0;
    doctors_last_result = 0;
    doctors_next_result = 0;
    get_doctors();
});

$("#doctors_page_button_right").on('click', function()
{
    doctors_page_memory.push(doctors_last_result);
    get_doctors();
});
$("#doctors_page_button_left").on('click', function()
{
    doctors_next_result = doctors_page_memory.pop();
    get_doctors();
});
$("#search_bar_button").on('click', function()
{
    if(last_search_term != $("#search_bar").val())
    {
        last_search_term = $("#search_bar").val();
        doctors_page_memory.length = 0;
        doctors_last_result = 0;
        doctors_next_result = 0;
        get_doctors();
    }
});
$('#search_bar').keypress(function (e) 
{
    if (e.which == 13) 
    {
        $("#search_bar_button").trigger('click');
    }
});

$("#search_speciality").on('change', function()
{
    doctor_advanced_search_changed = true;
});
$("#country_search").on('change', function()
{
    doctor_advanced_search_changed = true;
});
$("#region_search").on('change', function()
{
    doctor_advanced_search_changed = true;
});

$(".doctor_search_nav_button").live('click', function()
{
    $(".doctor_search_nav_button_selected").removeClass("doctor_search_nav_button_selected").addClass("doctor_search_nav_button");
    $(this).removeClass("doctor_search_nav_button").addClass("doctor_search_nav_button_selected");
    if($(this).data('index') == 1)
    {
        $("#doctor_directory").css("display", "block");
        $("#my_doctors").css("display", "none");
        $("#personal_doctor").css("display", "none");
        personal_doctor_search = 0;
        doctors_page_memory.length = 0;
        doctors_last_result = 0;
        doctors_next_result = 0;
        $("#search_doctor_toolbar").css("display", "block");
        $("#personal_doctors_cancel_change").css("display", "none");
        get_doctors();
        console.log("Switching to: Directory");
    }
    else if($(this).data('index') == 2)
    {
        $("#doctor_directory").css("display", "none");
        $("#my_doctors").css("display", "block");
        $("#personal_doctor").css("display", "none");
        console.log("Switching to: My Doctors");
    }
    else if($(this).data('index') == 3)
    {
        $("#doctor_directory").css("display", "none");
        $("#my_doctors").css("display", "none");
        $("#personal_doctor").css("display", "block");
        console.log("Switching to: Personal Doctor");
    }
});

$(".my_doctors_add_button").live('click', function()
{
    $("#my_doctors_page_1").css("display", "none");
    $("#my_doctors_page_2").css("display", "block");
    
    $("#my_doctors_name").val("");
    $("#my_doctors_surname").val("");
    $("#my_doctors_hospital_name").val("");
    $("#my_doctors_hospital_street").val("");
    $("#my_doctors_hospital_zip").val("");
    $("#my_doctors_hospital_state").val("");
    $("#my_doctors_hospital_country").val("");
    $("#my_doctors_phone").val("");
    $("#my_doctors_email").val("");
    $("#my_doctors_speciality").val("General Practice");
    my_doctor_add = true;
    my_doctor_id = -1;
});
$("#my_doctors_cancel_button").live('click', function()
{
    $("#my_doctors_page_1").css("display", "block");
    $("#my_doctors_page_2").css("display", "none");
});
$(".my_doctors_delete_button").live('click', function()
{
    var id = $(this).attr("id").split("_")[1];
    var obj = $(this).parent();
    var r = confirm("Are you sure you want to delete Dr. " + $(this).parent().children('.doctor_row').eq(0).children('.doctor_main_label').eq(0).children('.doctor_name').eq(0).text() + "?");
    if (r == true) 
    {
        $.post("edit_my_doctor.php", {delete_id: id}, function(data, status)
        {
            if(data.substr(0, 2) == 'GD')
            {
                obj.remove();
                if($("#my_doctors_container").children().length == 0)
                {
                    $("#my_doctors_container").html('<div class="my_doctors_none"><span style="color: #999; font-size: 14px;">No Doctors Found</span><br/><span style="color: #AAA; font-size: 12px;">Add a doctor by pressing "+" above.</span></div>');
                }
            }
        });
    }
});
$(".my_doctors_edit_button").live('click', function()
{
    var id = $(this).attr("id").split("_")[1];
    var obj = $(this).parent();
    my_doctor_id = id;
    my_doctor_add = false;
    $("#my_doctors_hospital_name").val("");
    $("#my_doctors_hospital_street").val("");
    $("#my_doctors_hospital_zip").val("");
    $("#my_doctors_hospital_state").val("");
    $("#my_doctors_hospital_country").val("");
    $("#my_doctors_phone").val("");
    $("#my_doctors_email").val("");
    $.post("get_my_doctors.php", {iddoc: id}, function(data, status)
    {
        var d = JSON.parse(data);
        
        $("#my_doctors_name").val(d.Name);
        $("#my_doctors_surname").val(d.Surname);
        if(d.Email != null)
            $("#my_doctors_email").val(d.Email);
        if(d.Phone != null)
            $("#my_doctors_phone").val(d.Phone);
        if(d.HospitalName != null)
            $("#my_doctors_hospital_name").val(d.HospitalName);
        if(d.Address != null)
            $("#my_doctors_hospital_street").val(d.Address);
        if(d.City != null)
            $("#my_doctors_hospital_city").val(d.City);
        if(d.Zip != null)
            $("#my_doctors_hospital_zip").val(d.Zip);
        if(d.State != null)
            $("#my_doctors_hospital_state").val(d.State);
        if(d.Country != null)
            $("#my_doctors_hospital_country").val(d.Country);
        $("#my_doctors_speciality").val(d.Speciality);
        
        $("#my_doctors_page_1").css("display", "none");
        $("#my_doctors_page_2").css("display", "block");
    });
});

$('div[id^="mydoctorsinvite_"]').live('click', function()
{
    var id = $(this).attr("id").split("_")[1];
    $.post("invite_new_doctor.php", {doc_id: id, pat_id: $("#USERID").val()}, function(data, status)
    {
        if(data.substr(0, 2) == 'NE')
        {
            alert("Please enter an e-mail for this doctor in order to send them an invitation.");
        }
        else
        {
            alert("Invitation sent!");
        }
    });
});

function load_my_doctors()
{
    $.post("get_my_doctors.php", {idpac: $('#USERID').val()}, function(data, status)
    {
        var d = JSON.parse(data);
        var html = '';
        if(d.length > 0)
        {
            for(var i = 0; i < d.length; i++)
            {

                html += '<div style="width: 60%; height: 70px; margin: auto; margin-top: 15px;"><div class="personal_doctor_row" style="width: 80%; margin: auto;">';
                html += '<img class="doctor_pic" src="identicon.php?size=25&hash=\''+d[i].hash+'\'" />';  
                html += '<div class="doctor_main_label">';
                html += '<div class="doctor_name"><span style="color: #22AEFF">'+d[i].Name+'</span> <span style="color: #00639A">'+d[i].Surname+'</span></div>';
                html += '<div class="doctor_speciality">'+d[i].Speciality+'</div>';
                if(d[i].Phone != null)
                {
                    html += '<div class="doctor_hospital_contact"><strong>Phone:</strong> '+d[i].Phone+'</div>';
                }
                html += '</div>';
                html += '<div class="doctor_hospital_info">';
                if(d[i].HospitalName != null)
                {
                    html += '<div class="doctor_hospital_name" style="margin-top: 2px; width: 150px;">'+d[i].HospitalName+'</div>';
                }
                if(d[i].Address != null || d[i].Zip != null || d[i].State != null || d[i].Country != null)
                {
                    html += '<div class="doctor_hospital_address">';
                    if(d[i].Address != null)
                        html += d[i].Address+'<br/>';
                    if(d[i].City != null)
                        html += d[i].City;
                    if(d[i].City != null && d[i].State != null)
                        html += ', ';
                    else
                        html += ' ';
                    if(d[i].State != null)
                        html += d[i].State+' ';
                    if(d[i].Zip != null)
                        html += d[i].Zip+' ';
                    if(d[i].Country != null)
                        html += d[i].Country;
                    html += '</div>';
                }
                if(d[i].Email != null)
                {
                    html += '<div class="doctor_hospital_contact" style="margin-top: 2px;">';
                    html += '<strong>Email:</strong> '+d[i].Email;
                    html += '</div>';
                }
                if(d[i].H2M == 1)
                {
                    html += '<div style="width: 38px; height: 25px; background-color: #F6F6F6; border-radius: 18px; margin-top: -80px; margin-right: -31px; float: right; padding-top: 16px; padding-left: 8px; border: 1px solid #DDD;">';
                    html += '<img src="images/FlatH2M_mini.png" width="15" height="15" />';
                    html += '</div>';
                }
                else
                {
                    html += '<div title="Test" id="mydoctorsinvite_'+d[i].id+'" style="width: 38px; height: 25px; background-color: #22AEFF; border-radius: 18px; margin-top: -80px; margin-right: -31px; float: right; padding-top: 16px; padding-left: 8px; border: 1px solid #DDD; color: #FFF; text-align: left; cursor: pointer;">';
                    html += '<i class="icon-share-alt"></i>';
                    html += '</div>';
                }
                html += '</div></div><button class="my_doctors_edit_button" id="mydoctorsedit_'+d[i].id+'">Edit</button><button class="my_doctors_delete_button" id="mydoctorsdelete_'+d[i].id+'">Delete</button></div>';
            }
        }
        else
        {
            html = '<div class="my_doctors_none">';
            html += '<span style="color: #999; font-size: 14px;">No Doctors Found</span><br/>';
            html += '<span style="color: #AAA; font-size: 12px;">Add a doctor by pressing "+" above.</span>';
            html == '</div>';
        }
        $("#my_doctors_container").html(html);
        $('div[id^="mydoctorsinvite_"]').each(function()
        {
            //Tipped.create($(this), '<span style="color: #FF0000;">Invite this doctor to Health2Me</span>', {title: 'Test', position: 'bottomLeft', size: 'large', skin: 'light' });
            Tipped.create($(this), 'Invite this doctor to Health2Me', {position: 'bottomLeft', size: 'x-small', skin: 'dark' });
        });
    });
}


$("#my_doctors_done_button").live('click', function()
{
    var add = 0;
    if(my_doctor_add == true)
        add = 1;
    $.post("edit_my_doctor.php", {name: $("#my_doctors_name").val(), surname: $("#my_doctors_surname").val(), hospital: $("#my_doctors_hospital_name").val(), address: $("#my_doctors_hospital_street").val(), city: $("#my_doctors_hospital_city").val(), zip: $("#my_doctors_hospital_zip").val(), state: $("#my_doctors_hospital_state").val(), country: $("#my_doctors_hospital_country").val(), phone: $("#my_doctors_phone").val(), email: $("#my_doctors_email").val(), speciality: $("#my_doctors_speciality").val(), idpac: $('#USERID').val(), iddoc: my_doctor_id, add: add}, function(data, status)
    {
        if(data.substr(0, 2) == 'NN')
        {
            alert("Please enter a name for your doctor");
        }
        else if(data.substr(0, 2) == 'GD')
        {
            load_my_doctors();
        }
        $("#my_doctors_page_1").css("display", "block");
        $("#my_doctors_page_2").css("display", "none");
    });
});


$(document).ready(function()
{
    load_my_doctors();
});

/*$('.doctor_row').live('click', function()
{
    if($(this).children().eq(2).hasClass("icon-resize-full"))
    {
        $(".doctor_row_wrapper").each(function()
        {
            if($(this).css("height") == '176px')
            {
                $(this).animate({height:'92px'}, {duration: 500, queue: false});
            }
        });
        $(".doctor_row").each(function()
        {
            if($(this).css("height") == '160px')
            {
                $(this).animate({height:'92px'}, {duration: 500, queue: false});
                $(this).children('span').eq(0).removeClass("icon-resize-small").addClass("icon-resize-full");
            }
        });
        
        $(this).children().eq(2).removeClass("icon-resize-full").addClass("icon-resize-small");
        $(this).animate({height:'160px'},  {duration: 500, queue: false});
        $(this).parent().animate({height:'176px'}, {duration: 500, queue: false});
    }
    else
    {
        $(this).children().eq(2).removeClass("icon-resize-small").addClass("icon-resize-full");
        $(this).animate({height:'92px'},  {duration: 500, queue: false});
        $(this).parent().animate({height:'92px'}, {duration: 500, queue: false});
    }
});*/
$(".doctor_action_button").live('click', function()
{
	var member_stripe_id = $("#stripe-id-holder").val();
	var member_address_holder = $("#address-holder").val();
	console.log(member_address_holder+member_stripe_id);
	
	if(member_stripe_id == ''){
		swal("You must add a credit card before attempting to contact a doctor.");
		return;
	}
	
    if($(this).text() != 'Select Doctor')
    {
        // This function depends on the 'Talk' modal window in UserDashboard.php for calling or scheduling an appointment with the doctor.
        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#step_bar_2").attr("class", "step_bar lit");
        $("#step_circle_3").attr("class", "step_circle lit");
        $("#find_doctor_my_doctors_2").css("display", "block");
        $('#find_doctor_main').css("display", "none");
        $("#find_doctor_next_button").css("display", "block");
        $("#find_doctor_previous_button").css("display", "block");
        $("#find_doctor_cancel_button").css("display", "block");
        $("#find_doctor_close_button").css("display", "none");
        $('#find_doctor_my_doctors_1').css("display", "none");
        $('#find_doctor_my_doctors_3').css("display", "none");
        $('#find_doctor_appointment_1').css("display", "none");
        $('#find_doctor_appointment_2').css("display", "none");
        $('#find_doctor_time').css("display", "none");
        $('#find_doctor_receipt').css("display", "none");
        $('#find_doctor_confirmation').css("display", "none");
        $('#time_selector_1').css("display", "none");
        $('#day_selector_1').css("display", "none");
        $("#find_doctor_label").text("Select Type");
        talk_mode = 1;
        var doctor_name = $(this).parent().parent().children('.doctor_main_label').eq(0).children('.doctor_name').eq(0).text();
        var doctor_location = $(this).parent().parent().children('.doctor_main_label').eq(0).children('.doctor_location').eq(0).text();
        selected_doctor_info = "recdoc_"+$(this).parent().parent().children('input').eq(0).val()+"_"+$(this).parent().parent().children('input').eq(1).val()+"_"+doctor_name.replace(" ", "_")+"_"+doctor_location;
        $("#doctor_location_text").html("Doctor " + doctor_name + " is in <strong>" + doctor_location + "</strong>.<br/>Please confirm that you are in <strong>" + doctor_location + "</strong> as well.");
        find_doctor_page = 21;
        $("#find_doctor_modal").dialog({bgiframe: true, width: 550, height: 413, resize: false, modal: true});
        if($(this).text() == 'Call Now')
        {
            selected_doctor_available = 1;
        }
        else
        {
            selected_doctor_available = 0;
        }
        $('#in_location_checkbox').removeAttr("checked");
        $.post("getDoctorAvailableTimeranges.php", {id: $(this).parent().parent().children('input').eq(0).val()}, function(data, status)
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
    }
    else
    {
        // added from personal_doctor (personal_doctor.js). handles selection of personal doctor in directory and goes back to personal doctors page
        $("#my_personal_doctor_cont").html('<img src="images/load/29.gif" style="margin-top: 40px;" alt="">');
        $.post("set_personal_doctor.php", {doctor_id: $(this).parent().parent().children('input').eq(0).val(), user_id: $("#USERID").val()}, function(data, status)
        {
            get_personal_doctor();
            $("#doctor_directory").css("display", "none");
            $("#personal_doctor").css("display", "block");
        });
    }
});

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
           sealOutput = "../"+data;     
        }
    });
    //alert(sealOutput);
    return sealOutput;
}


function get_doctors()
{
    var online_only = 0;
    if($("#available_toggle_button").attr("data-on") == "true" && personal_doctor_search == 0)
    {
        online_only = 1;
    }
    var telemed_only = 0;
    if($("#telemedicine_toggle_button").attr("data-on") == "true" && personal_doctor_search == 0)
    {
        telemed_only = 1;
    }
    var loc = "";
    if($("#country_search").val() != -1 && personal_doctor_search == 0)
    {
        loc = $("#country_search").val();
    }
    if($("#region_search").val() != -1 && $("#region_search").children("option").length > 0 && personal_doctor_search == 0)
    {
        if($("#region_search").val().length > 0)
        {
            loc = $("#region_search").val() + ", " + loc;
        }
    }
    var sp = "";
    if($("#search_speciality").val() != "Any" && personal_doctor_search == 0)
    {
        sp = $("#search_speciality").val();
    }
    
    doctor_search_tag += 1;
    $("#doctor_rows").html('<div style="width: 100%; height: 220px;"></div><div style="width: 52px; height: 42px; margin-left: auto; margin-right: auto;"><img src="images/load/29.gif"  alt=""></div>');
    $.post("getTelemedDoctors_mars.php", {starting_point: doctors_next_result, order: order_column, asc: order_direction, timezone: get_timezone_offset(), online_only: online_only, telemed_only: telemed_only, search_term: $("#search_bar").val(), speciality: sp, location: loc, personal_doctor_search: personal_doctor_search, pat_id: $("#USERID").val(), tag: doctor_search_tag}, function(data,status)
    {
        console.log('GETTELEMEDDOCTORS.PHP: ' + data);
        var info = JSON.parse(data);
        if(info['tag'] == doctor_search_tag)
        {
            // this was the last requested search since its tag is equal to doctor_search_tag, display it and reset doctor_search_tag to 0
            // otherwise this is an old search query that took too long to load, ignore it
            
            doctor_search_tag = 0;
            doctors_last_result = doctors_next_result;
            doctors_next_result = info['next_result'];
            if(doctors_page_memory.length > 0)
            {
                $("#doctors_page_button_left").removeAttr("disabled");
            }
            else
            {
                $("#doctors_page_button_left").attr("disabled", "disabled");
            }
            if(info['next'] == true)
            {
                $("#doctors_page_button_right").removeAttr("disabled");
            }
            else
            {
                $("#doctors_page_button_right").attr("disabled", "disabled");
            }
            $("#doctor_rows").html('');
            var docs = info['data'];
            var master_html = '';
            var doctor_location = new Array();
            var stateList = {'Texas':'TX', 'Arizona':'AZ', 'Arkansas':'AR', 'Alaska':'AL'};
            var docState = '';
            var doctor_state = '';
            var doctor_country = '';
            var seal = '';
            var additional_licenses = new Array();
            var lic_mul = 'no';
            for(var i = 0; i < docs.length; i++)
            {
                doctor_location = new Array();
                doctor_state = '';
                doctor_country = '';
                seal = '';
                additional_licenses = new Array();
                lic_mul = 'no';
                var rating = 0;
                var total_ratings = 0;
                if(docs[i]['rating'] != null)
                {
                    for(var k = 0 ; k < 10; k++)
                    {
                        total_ratings += docs[i]['rating'][k];
                        rating += (docs[i]['rating'][k] * (k + 1));
                    }
                    rating /= total_ratings;
                }
                var html = '';
                /*if(i % 2 == 0)
                {
                    html += '<div class="doctor_row_wrapper">';
                }*/
                html += '<div class="doctor_row">';  
                html += '<div class="ribbon-preferred"><i class="icon-star" style="color:white; font-size:20px; margin-right:20px;"></i></div>';
                html += '<input type="hidden" value="'+docs[i]['id']+'" />';
                html += '<input type="hidden" value="'+docs[i]['phone']+'" />';                
                //html += '<span class="icon-resize-full doctor_row_resize"></span>';
                //html += '<i id="" class="icon-eye-open icon-large" style="margin-top: 21px;color: RGB(191,191,191);font-size: 0.7em;position: relative;float: right;margin-right: -11px; cursor:pointer;" ></i>';
                html += '<div style="width:120px; height:120px; float:left;">';      
                
                if(docs[i]['image'].substr(0, 6) == "Doctor")
                {
                    html += '<img class="doctor_pic" src="'+docs[i]['image']+'" />';
                }
                else
                {
                    html += '<img class="doctor_pic" src="identicon.php?size=25&hash='+docs[i]['image']+'" />';
                }     
                
                
                
                /* certificate pic */
                if(docs[i]['certifications'].length >= 1)
                {
                    var found = false;
                    var current_index = 0;
                    while(!found && current_index < docs[i]['certifications'].length)
                    {
                        if(docs[i]['certifications'][current_index]['isPrimary'] == '1')
                        {
                            found = true;
                            if(docs[i]['certifications'][current_index]['image'].length > 0)
                            {
                                html += '<img class="doctor_certification_icon" src="'+docs[i]['certifications'][current_index]['image']+'" />';
                            }
                            /*html += '<div class="doctor_certification_label">'+docs[i]['certifications'][current_index]['name']+'</div>';
                            if(docs[i]['certifications'][current_index]['start_date'].length > 0)
                            {
                                var year = parseInt(docs[i]['certifications'][current_index]['start_date'].split("-")[0]);
                                var currentYear = (new Date).getFullYear();
                                var duration = currentYear - year;
                                html += '<div class="doctor_certification_label_small">'+year+' ('+duration+' years)</div>';
                            }*/
                        }
                        current_index += 1;
                    }
                    current_index = 0;
                    var total_count = 0;
                    /*while(current_index < docs[i]['certifications'].length && total_count < 2)
                    {

                        if(docs[i]['certifications'][current_index]['isPrimary'] == '0')
                        {
                            html += '<div class="doctor_certification_label_secondary">'+docs[i]['certifications'][current_index]['name']+'</div>';
                            total_count += 1;
                        }
                        current_index += 1;
                    }*/
                }
                
                
                
                
                
                html += '</div>';
                html += '<div class="doctor_main_label"><div class="doctor_name"><span style="color: #22AEFF">'+docs[i]['name']+' '+docs[i]['surname']+'</span></div>';
                html += '<div class="doctor_speciality">';
                if(docs[i]['speciality'] != null && docs[i]['speciality'] != '-1')
                {
                    html += docs[i]['speciality'];
                }
                else
                {
                    html += 'No Speciality';
                }
                html += '</div>';
                /*html += '<div class="doctor_location">';
                if(docs[i]['location'] != null && docs[i]['location'] != '-1')
                {
                    html += docs[i]['location'];
                }
                else
                {
                    html += 'Location Not Specified';
                }
                html += '</div></div>';*/
                html += '<div class="doctor_hospital_info">';               
                html += '<div class="doctor_hospital_name" title="'+(docs[i]['hospital_addr'] != null && docs[i]['hospital_addr'].length > 0 ? docs[i]['hospital_addr'] : "")+'">';
                if(docs[i]['hospital_name'] != null && docs[i]['hospital_name'].length > 0)
                {
                    html += docs[i]['hospital_name'];
                }
                else
                {
                    html += 'Hospital Not Specified';
                }
                html += '</div>';
                html += '<div class="doctor_stars">';
                var num = 5;
                while(num != 0)
                {
                    html += '<i class="icon-star" style="float: left; font-size: 12px; color: #BDBDBD;"></i>';
                    num -= 1;
                }
                /*while(rating >= 1.0)
                {
                    html += '<i class="icon-star-half" style="float: left; font-size: 12px; color: #666;"></i>';
                    rating -= 1.0;
                }*/
                html += '</div>';
                /*html +='<div class="doctor_hospital_address">';
                if(docs[i]['hospital_addr'] != null && docs[i]['hospital_addr'].length > 0)
                {
                    html += docs[i]['hospital_addr'];
                }
                html += '</div>';*/

               

                // extended part

                /*html += '<div class="doctor_certifications_box">';
                if(docs[i]['certifications'].length >= 1)
                {
                    var found = false;
                    var current_index = 0;
                    while(!found && current_index < docs[i]['certifications'].length)
                    {
                        if(docs[i]['certifications'][current_index]['isPrimary'] == '1')
                        {
                            found = true;
                            if(docs[i]['certifications'][current_index]['image'].length > 0)
                            {
                                html += '<img class="doctor_certification_icon" src="'+docs[i]['certifications'][current_index]['image']+'" />';
                            }
                            html += '<div class="doctor_certification_label">'+docs[i]['certifications'][current_index]['name']+'</div>';
                            if(docs[i]['certifications'][current_index]['start_date'].length > 0)
                            {
                                var year = parseInt(docs[i]['certifications'][current_index]['start_date'].split("-")[0]);
                                var currentYear = (new Date).getFullYear();
                                var duration = currentYear - year;
                                html += '<div class="doctor_certification_label_small">'+year+' ('+duration+' years)</div>';
                            }
                        }
                        current_index += 1;
                    }
                    current_index = 0;
                    var total_count = 0;
                    while(current_index < docs[i]['certifications'].length && total_count < 2)
                    {

                        if(docs[i]['certifications'][current_index]['isPrimary'] == '0')
                        {
                            html += '<div class="doctor_certification_label_secondary">'+docs[i]['certifications'][current_index]['name']+'</div>';
                            total_count += 1;
                        }
                        current_index += 1;
                    }
                }
                html += '</div>';*/
                html += '<div class="doctor_action_box">';
                //html += '<div class="doctor_consultations_label"><em>'+docs[i]['consultations']+' consultations</em></div>';

                var id_holder = docs[i]['id'];
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
                
        

                if(personal_doctor_search == 0)
                {
                    if(docs[i]['available'])
                    {
                        html += '<button class="doctor_action_button">Call Now</button>';
                    }
                    if(docs[i]['telemed'] == 1)
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
                }
                else
                {
                    html += '<button class="doctor_action_button" style="width: 100%">Select Doctor</button>';
                }
                html += '</div></div></div>';
                
                html += '<div class="doctor_description">';
                
                html += '<div class="doctor_ex_y">';
                html += '<span class="ex_y green_letters">18</span> years experience';
                html += '</div>';
                
                html += '<div class="doctor_mem_assoc">';
                html += 'Member of <span class="mem_assoc green_letters">5</span> Medical Associations';
                html += '</div>';
                
                html += '<div class="doctor_art_pub">';
                html += '<span class="art_pub green_letters">8</span> Articles Published';
                html += '</div>';
                
                html += '<div class="doctor_expertise">';
                html += '<span class="label label-success expertise">Weight Gain</span>';
                html += '<span class="label label-success expertise">Rehabilitation</span>';
                html += '</div>';
                
                html += '</div>'; //END OF doctor_description
                
                doctor_location = docs[i]['location'].split(',');
                doctor_state = doctor_location[0];
                doctor_country = $.trim(doctor_location[1]);
                additional_licenses = docs[i]['additional_licenses'];
                if(additional_licenses.length > 0 && additional_licenses[0] != '') lic_mul = 'yes';
                
                html += '<div class="doctor_license" id="lic_'+docs[i]['id']+'" data-lic-size="'+additional_licenses.length+'" data-lic-multiple="'+lic_mul+'">';
                html += '<div class="license_container">';
                
                if(doctor_country == 'USA') {
                    docState = stateList[doctor_state];              
                    
                    //USING THE FUNCTION get_seals ABOVE
                    seal = get_seals(doctor_state, doctor_country);
                    
                    html += '<img class="license_flag" src="'+seal+'" />';
                    html += '<div class="license_locInfo">';
                    html += '<span class="lic_state_name">'+docState+'</span><br />';
                    html += '<span class="lic_country_name">'+doctor_country+'</span>';
                    html += '</div>';
                
                    if(lic_mul == 'yes') {
                        for (var addL = 0; addL < additional_licenses.length; addL++) {
                            seal = get_seals(additional_licenses[addL], doctor_country);
                            docState = stateList[additional_licenses[addL]];
                            html += '<img class="license_flag" src="'+seal+'" />';
                            html += '<div class="license_locInfo">';
                            html += '<span class="lic_state_name">'+docState+'</span><br />';
                            html += '<span class="lic_country_name">'+doctor_country+'</span>';
                            html += '</div>';
                        }
                    }   
                }               
                html += '</div>';
                html += '</div>';    
                html += '</div>'; //END OF doctor_row
                /*if(i % 2 == 1 || i == (docs.length - 1))
                {
                    html += '</div>';
                }*/
                master_html += html;
            }
            $("#doctor_rows").html(master_html);
        }
    });
}
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

function LanzaAjax (DirURL)
{
    var RecTipo = 'SIN MODIFICACIÓN';
    $.ajax(
    {
        url: DirURL,
        dataType: "html",
        async: false,
        success: function(data) 
        {
            if (typeof data == "string") 
            {
                RecTipo = data;
            }
        }
    });
    return RecTipo;
} 



function drawKnob(component, gauge_color, max_data, value_data, label_data, icon_name, use_fa, show_label){
      
      if (use_fa == 1)  
      {   
            component.append( "<span id='GraphIcon"+component.attr('id')+"' style='width: 100%; position: absolute; top: 18%; font-family: Lato; font-size: 48px; color: rgba(34, 174, 255, 0.53); text-align:center;'><i id='GraphIconInt"+component.attr('id')+"' class='"+icon_name+"' style=\"font-size: 24px; margin-left: 5px\"></i></span>" );
      }
      else
      {
            var size_icon = component.height() / 3.5;
            component.append( "<p id='GraphIcon"+component.attr('id')+"' style='width: 100%; position: absolute; top: 20%; font-family: Lato; font-size: 20px; color: rgba(34, 174, 255, 0.53); text-align:center;'><img src='images/icons/"+icon_name+".png' style='width: "+size_icon+"px; '/></p>" );
      }
      if (show_label == 1) 
      {
          component.append( "<p id='GraphData"+component.attr('id')+"' style='width: 100%; position: absolute; top: 48%; font-family: Lato; font-size: 24px; color: #9b9b9b; text-align:center;'>"+value_data+" of "+max_data+"</p>" );
          component.append( "<p id='GraphLabel"+component.attr('id')+"' style='width: 100%; position: absolute; top: 60%; font-family: Lato; font-size: 16px; color: #bbbbbb; text-align:center;'>"+label_data+"</p>" );
      }else{
          component.append( "<p id='GraphData"+component.attr('id')+"' style='width: 100%; position: absolute; top: 40%; font-family: Lato; font-size: 45px; color: #9b9b9b; text-align:center;'>"+value_data+" of "+max_data+"</p>" );
      }
      component.append( "<canvas id='myCanvas"+component.attr('id')+"'></canvas>" );
    
      /*
      $('#GraphIcon'+component.attr('id')).fitText();
      if (show_label == 1) 
      {
        $('#GraphData'+component.attr('id')).fitText(0.4);
        $('#GraphLabel'+component.attr('id')).fitText(0.6);
      }else{
        $('#GraphData'+component.attr('id')).fitText(0.5);
       } 
        */
    
      console.log ('Text stretching operations:');
      //jQuery('#GraphIcon'+component.attr('id')).fitText(1.5);
      //jQuery('#GraphIconInt'+component.attr('id')).fitText(0.5);
      console.log ('#GraphIcon'+component.attr('id'));
      if (show_label == 1) 
      {
        jQuery('#GraphData'+component.attr('id')).fitText(0.8);
        jQuery('#GraphLabel'+component.attr('id')).fitText(1.0);
      }else{
        jQuery('#GraphData'+component.attr('id')).fitText(0.5);
       } 

      var maxGraph = max_data;
      var actualValue = value_data;    
        
      var canvas = document.getElementById('myCanvas'+component.attr('id'));
      
      canvas.style.width ='100%';
      canvas.style.height='100%';
      canvas.width  = component.width();
      canvas.height = component.height();
    
        
      var context = canvas.getContext('2d');
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = x - (0.25 * x);
      var startAngle = 0.6 * Math.PI;
      var endAngle = 2.40 * Math.PI;
     
      var gap = Math.PI / 6;    
      var totalArc = (2 * Math.PI) - (2 * gap);
      var startAngle = ((1/2) * Math.PI)+gap;
      var endAngle = ((5/2) * Math.PI)-gap;
      var counterClockwise = false;

      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = (x/6) + 2;
      context.lineCap = 'round';

      // line color
      context.strokeStyle = '#d3d3d3';
      context.stroke();

      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = (x/6);
      context.lineCap = 'round';

      // line color
      context.strokeStyle = '#ececec';
      context.stroke();
    
       
        
      endAngle = 0.80 * Math.PI;
      endAngle = ((1/2) * Math.PI)+ gap + (actualValue * totalArc / maxGraph);
        
      context.beginPath();
      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      context.lineWidth = (x/6) + 2;
      context.lineCap = 'round';

      // line color
      context.strokeStyle = gauge_color;
      context.stroke();
}

   function fitToContainer(canvas){
      canvas.style.width ='100%';
      canvas.style.height='100%';
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
}
