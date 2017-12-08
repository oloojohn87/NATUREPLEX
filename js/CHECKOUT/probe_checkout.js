console.log('probe_checkout.js');

var probe_question_title = ['', '', '', '', ''];
var probe_question_en = ['', '', '', '', ''];
var probe_question_es = ['', '', '', '', ''];
var probe_question_unit = ['', '', '', '', ''];
var probe_min = [1, 1, 1, 1, 1];
var probe_max = [5, 5, 5, 5, 5];
var probe_answer_type = [1, 1, 1, 1, 1];
var probe_units = [[], [], [], [], []];
var probe_question = 1;
var selected_probe = -1;
var titles = null;
var english_questions = null;
var spanish_questions = null;
var mins = null;
var maxs = null;
var answers = null;

function save_prove()
{
	//console.log($("#probe_time5").val());
    var protocol = 1;
    if($("#standard_probe_button").data('on') == 0)
        protocol = $("#probe_protocols").val();
    else protocol = 1;
    
    var interval = 1;
    if($("#probe_interval_weekly").data('on') == 1)
        interval = 7;
    else if($("#probe_interval_monthly").data('on') == 1)
        interval = 30;
    else if($("#probe_interval_yearly").data('on') == 1)
        interval = 365;
    
    var method = 2;
    if($("#probe_method_text").data('on') == 1)
        method = 1;
    else if($("#probe_method_email").data('on') == 1)
        method = 3;
    
    var start_val = 1;
    var exp_val = 5;
    var exp_day_1 = 7;
    var exp_day_2 = 10;
    var tolerance = $("#probe_alert_tolerance").val();
    if($("#probe_alert_start_value").val().length > 0)
        start_val = $("#probe_alert_start_value").val();
    if($("#probe_alert_expected_value").val().length > 0)
        exp_val = $("#probe_alert_expected_value").val();
    if($("#probe_alert_expected_day_1").val().length > 0)
        exp_day_1 = $("#probe_alert_expected_day_1").val();
    if($("#probe_alert_expected_day_2").val().length > 0)
        exp_day_2 = $("#probe_alert_expected_day_2").val();

    var time = '12:00pm';
    if($("#probe_time5").val().length > 0)
        time = $("#probe_time5").val();
    
    probeLang = 'en';
    if($("#probe_language").val() != 'en')
        probeLang = $("#probe_language").val();
    
	$.post("update_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient, protocol: protocol, time: time, timezone: $("#probe_timezone").val(), interval: interval, request: method, start_val: start_val, exp_val: exp_val, exp_day_1: exp_day_1, exp_day_2: exp_day_2, tolerance: tolerance, probeLanguage: probeLang}, function(data, status)
	{
		if(data == '-1')
		{
			$.post("toggle_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient, status: 'off', save: 0}, function(data, status)
			{
				if(parseInt(data) == -1)
				{
					if($("#probeToggle").is(":checked"))
					{
						$("#probeToggle").attr('checked', false);
						$("#probeToggleLabel").text('Off');
						$("#probeToggleLabel").css('color', '#D84840');
					}
					else
					{
						$("#probeToggle").attr('checked', true);
						$("#probeToggleLabel").text('On');
						$("#probeToggleLabel").css('color', '#54BC00');
					}
					swal("Error", "There was an error, please try again later", "error");
				}
				else
				{
					$("#probeToggle").attr('checked', false);
					$("#probeToggleLabel").text('Off');
					$("#probeToggleLabel").css('color', '#D84840');
				}
			});
		}
	});
}
function load_probe_protocols()
{
	$.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
	{
		var d = JSON.parse(data);
		var var_length = d['protocols'].length;
		probe_questions = d['questions'];
        $("#probe_protocols").empty();
		$("#probe_protocols").html('<option value="0" style="display: none;">N/A</option>');
		$("#probes_container").html('');
        $("#probe_protocols").data('prev', 0);
        
		for(var i = 0; i < var_length; i++)
		{
			if(i == 0)
				$("#probe_protocols").data('prev', d['protocols'][i].protocolID);
			$("#probe_protocols").append('<option value="'+d['protocols'][i].protocolID+'">'+d['protocols'][i].name+'</option>');
			var html = '<div class="probes_row">';
			html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: bold;">'+d['protocols'][i].name+'</div>';
			html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">'+d['protocols'][i].description+'</div>';
			html += '<button class="probes_edit_button" id="probes_edit_button_'+d['protocols'][i].protocolID+'"><i class="icon-pencil"></i></button>';
			html += '<button class="probes_delete_button" id="probes_delete_button_'+d['protocols'][i].protocolID+'">X</button>';
			html += '</div>';
			$("#probes_container").append(html);
		}
		/*if(var_length == 0)
		{
			$("#probe_protocols").append('<option value="-1">No probes defined.  Please add a probe below.</option>');
			////console.log('no probes');
			var html = '<div class="no_probes_notification">';
			html += 'You do not have any probes defined.<br/>To add probes, click the "+" button bellow.';
			html += '</div>';
			$("#probes_container").append(html);
		}*/
	});
}
var selected_patient = -1;
$(".CreateProbe").live('click',function() {
	if($(this).attr("id").substr(0, 5) == 'ALERT')
	{
		var info = $(this).attr("id").split("_");
		var element = $(this);
		
		$.post("dismissNotification.php", {receiver: $("#MEDID").val(), sender: info[1], is_receiver_doctor: 1, is_sender_doctor: 0, type: 'PRBALR'}, function(data, status)
		{
			element.attr("id", info[1]);
			element.css('background-color', '#22AEFF');
			element.css('border-color', '#22AEFF');
			element.css('-webkit-animation', 'none');
			
			if(element.parent().parent().children('.doctor_row_resize').hasClass('icon-resize-full'))
			{
				element.parent().parent().children('.doctor_row_resize').trigger('click');
			}
			
			var date_label = moment(info[3], "YYYY-MM-DD hh:mm:ss").fromNow();
			swal("Probe Alert", "This patient's probe responses have triggered an alert "+date_label+".\n\n Please review the patient's probe responses and communicate with them if needed.", "warning");
		});
	}
	else
	{
		selected_patient = $(this).attr("id");
		$("#probe_id_holder_for_purchase").val(selected_patient);
		$.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
		{
			var d = JSON.parse(data);
			var var_length = d['protocols'].length;
			probe_questions = d['questions'];
			
			$("#probeToggleLabel").css("opacity", "1.0");
			$("#pTL").css("opacity", "1.0");
			$("#probeToggle").removeAttr('disabled');
            
            $("#probe_protocols").empty();
            $("#probe_protocols").html('<option value="0" style="display: none;">N/A</option>');
            $("#probe_protocols").data('prev', 0);
			
			for(var i = 0; i < var_length; i++)
			{
				if(i == 0 && d['protocols'][i].protocolID != null)
					$("#probe_protocols").data('prev', d['protocols'][i].protocolID);
				$("#probe_protocols").append('<option class="probe_protocols_option" value="'+d['protocols'][i].protocolID+'">'+d['protocols'][i].name+'</option>');

				var html = '<div class="probes_row">';
				html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: bold;">'+d['protocols'][i].name+'</div>';
				html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">'+d['protocols'][i].description+'</div>';
				html += '<button class="probes_edit_button" id="probes_edit_button_'+d['protocols'][i].protocolID+'"><i class="icon-pencil"></i></button>';
				html += '<button class="probes_delete_button" id="probes_delete_button_'+d['protocols'][i].protocolID+'">X</button>';
				html += '</div>';
				$("#probes_container").append(html);
			}
			/*if(var_length == 0)
			{
				$("#probe_protocols").append('<option value="-1">No probes defined.  Please add a probe below.</option>');
				var html = '<div class="no_probes_notification">';
				html += 'You do not have any probes defined.<br/>To add probes, click the "+" button bellow.';
				html += '</div>';
				$("#probes_container").append(html);
			}*/
			probe_dialog.dialog('open');
			$.post("get_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
			{
				var d = JSON.parse(data);
				//console.log(data);
				if(d != false)
				{
					
					if(d['doctorPermission'] == '1' && d['patientPermission'] == '1')
					{
						$("#probeToggle").attr('checked', true);
						$("#probeToggleLabel").text('On');
						$("#probeToggleLabel").css('color', '#54BC00');
					}
					else
					{
						$("#probeToggle").attr('checked', false);
						$("#probeToggleLabel").text('Off');
						$("#probeToggleLabel").css('color', '#D84840');
					}
                    if(d['protocolID'] != null && d['protocolID'] > 1)
                    {
                        $("#probe_protocols").val(d['protocolID']);
                        $("#probe_protocols").data('prev', d['protocolID']);
                        $("#select_probe_section").css('border', '2px solid #333');
                    }
                    else
                    {
                        $("#standard_probe_button").css('border', '2px solid #333');
                        $("#standard_probe_button").data('on', 1);
                        $("#probe_protocols").children('option').each(function()
                        {
                            $(this).removeAttr('selected');
                        });
                        $("#probe_protocols").data('prev', 0);
                        $("#probe_protocols").val(0);
                    }
                    if(d['desiredTime'] != null && d['desiredTime'].length > 0)
					   $("#probe_time5").val(d['desiredTime']);
                    else
                        $("#probe_time5").val('12:00pm');
                    if(d['timezone'] != null)
					   $("#probe_timezone").val(d['timezone']);
                    else
                        $("#probe_timezone").val(1);
                    
                    $("button[id^='probe_method_']").removeClass('probe_method_button_selected').addClass('probe_method_button');
                    $("button[id^='probe_method_']").data('on', 0);
                    if(d['smsRequest'] == 1)
                    {
                        $("#probe_method_text").data('on', 1);
                        $("#probe_method_text").removeClass('probe_method_button').addClass('probe_method_button_selected');
                    }
                    else if(d['emailRequest'] == 1)
                    {
                        $("#probe_method_email").data('on', 1);
                        $("#probe_method_email").removeClass('probe_method_button').addClass('probe_method_button_selected');
                    }
                    else
                    {
                        $("#probe_method_phone").data('on', 1);
                        $("#probe_method_phone").removeClass('probe_method_button').addClass('probe_method_button_selected');
                    }
                    
                    $("button[id^='probe_interval_']").removeClass('probe_interval_button_selected').addClass('probe_interval_button');
                    $("button[id^='probe_interval_']").data('on', 0);
                    if(d['probeInterval'] == 365)
                    {
                        $("#probe_interval_yearly").data('on', 1);
                        $("#probe_interval_yearly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                    }
                    else if(d['probeInterval'] == 30)
                    {
                        $("#probe_interval_monthly").data('on', 1);
                        $("#probe_interval_monthly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                    }
                    else if(d['probeInterval'] == 7)
                    {
                        $("#probe_interval_weekly").data('on', 1);
                        $("#probe_interval_weekly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                    }
                    else
                    {
                        $("#probe_interval_daily").data('on', 1);
                        $("#probe_interval_daily").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                    }
                    
                    if(d['start_val'] != null)
                        $("#probe_alert_start_value").val(d['start_val']);
                    else
                        $("#probe_alert_start_value").val(1);

                    if(d['exp_val'] != null)
                        $("#probe_alert_expected_value").val(d['exp_val']);
                    else
                        $("#probe_alert_expected_value").val(5);

                    if(d['exp_day_1'] != null)
                        $("#probe_alert_expected_day_1").val(d['exp_day_1']);
                    else
                        $("#probe_alert_expected_day_1").val(7);

                    if(d['exp_day_2'] != null)
                        $("#probe_alert_expected_day_2").val(d['exp_day_2']);
                    else
                        $("#probe_alert_expected_day_2").val(10);

                    if(d['tolerance'] != null)
                        $("#probe_alert_tolerance").val(d['tolerance']);
                    else
                        $("#probe_alert_tolerance").val(5);
                    
                    if(d['probeLanguage'] != null)
                        $("#probe_language").val(d['probeLanguage']);
                    else
                        $("#probe_language").val('en');
                }
                else
                {
                    $("#probeToggle").attr('checked', false);
                    $("#probeToggleLabel").text('Off');
                    $("#probeToggleLabel").css('color', '#D84840');

                    $("#probe_protocols").children('option').each(function()
                    {
                        $(this).removeAttr('selected');
                    });
                    $("#probe_timezone").val(1);
                    $("#probe_time5").val('12:00pm');
                    $("#standard_probe_button").css('border', '2px solid #333');
                    $("#standard_probe_button").data('on', 1);
                    $("#probe_protocols").data('prev', 0);
                    $("#probe_protocols").val(0);
                    $("#probe_language").val('en');
                    $("button[id^='probe_method_']").removeClass('probe_method_button_selected').addClass('probe_method_button');
                    $("button[id^='probe_method_']").data('on', 0);
                    $("button[id^='probe_interval_']").removeClass('probe_interval_button_selected').addClass('probe_interval_button');
                    $("button[id^='probe_interval_']").data('on', 0);
                    $("#probe_method_phone").data('on', 1);
                    $("#probe_method_phone").removeClass('probe_method_button').addClass('probe_method_button_selected');
                    $("#probe_interval_daily").data('on', 1);
                    $("#probe_interval_daily").removeClass('probe_interval_button').addClass('probe_interval_button_selected');

                    $("#probe_alert_start_value").val(1);
                    $("#probe_alert_expected_value").val(5);
                    $("#probe_alert_expected_day_1").val(7);
                    $("#probe_alert_expected_day_2").val(10);
                    $("#probe_alert_tolerance").val(5);
                }
                $("#probe_alert_tolerance_value").text($("#probe_alert_tolerance").val());
			});
		});
		
	}
	
	
	
	/*var myClass = $(this).attr("id");
	var url = 'getPatientContactInfo.php?idusu='+myClass;
	getusuariosdata(url);
	$('#patientID').val(myClass);

	var quecolor='RED';
	$('#InfoIDPacienteB').html('<span id="ETUSER" class="label label-info" style="font-size:18px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; margin-left:20px;">'+myClass+'</span><span class="label label-info" style="background-color:'+quecolor+'; font-size:14px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; margin-left:20px;">'+patient[0].idusfixedname+'</span>');
	//alert(patient[0].idusfixedname + '  ' + patient[0].email + '   ' + patient[0].telefono);

	$('#Email').val(patient[0].email);
	$('#Phone').val(patient[0].telefono);
	$('#Message').val(patient[0].telefono);

	$('#ProbeIDHidden').val(-111);

	$('#probeRequest').trigger('click');
	*/

});

$("#standard_probe_button").on('click', function()
{
    var protocol = $(this).val();
    swal({title: "Probe Change",   
          text: "Switching probes will erase any probe alerts that you have defined for this user. Do you wish to continue?",   
          type: "warning",   
          showCancelButton: true,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "Change",   
          closeOnConfirm: true 
         }, function(isConfirm)
         {   
            if (isConfirm) 
            {
                $("#standard_probe_button").data('on', 1);
                $.post("save_probe_alerts.php", {clear: true, doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
                {
                });
                $("#standard_probe_button").css('border', '2px solid #333');
                $("#probe_protocols").data('prev', 0);
                $("#probe_protocols").val(0);
                $("#select_probe_section").css('border', '0px solid #FFF');
                save_prove();

                $("#probe_protocols").children('option').each(function()
                {
                    $(this).removeAttr('selected');
                });
                $("#probe_protocols").val(0);
            } 
            else 
            {     
                $("#probe_protocols").val($("#probe_protocols").data('prev'));
                $("#probe_protocols").data('prev', $("#probe_protocols").val());
                if($("#probe_protocols").val() != 1)
                {
                    $("#standard_probe_button").css('border', '2px solid #333');
                    $("#standard_probe_button").data('on', 1);
                    $("#select_probe_section").css('border', '0px solid #FFF');
                    $("#probe_protocols").data('prev', 0);
                    $("#probe_protocols").val(0);
                }
                else
                {
                    $("#standard_probe_button").css('border', '0px solid #FFF');
                    $("#standard_probe_button").data('on', 0);
                    $("#select_probe_section").css('border', '2px solid #333');
                }
            }
    });
});
$("#probe_alert_chart_button").bind('mouseenter', function()
{
    Tipped.remove("#probe_alert_chart_button");
    
    // then add the new tooltip
    var img = draw_probe_alert_graph();
    Tipped.create("#probe_alert_chart_button", '<img src="'+img+'" />', { title: 'Expectation Graph', position: 'top', size: 'large', showDelay: 200, fixed: false, skin: 'light' });
    
    Tipped.show("#probe_alert_chart_button");
});
$("#probe_alert_chart_button").bind('mouseleave', function()
{
    Tipped.hide("#probe_alert_chart_button");
});

$("button[id^='probe_method_']").on('click', function()
{
    $("button[id^='probe_method_']").removeClass('probe_method_button_selected').addClass('probe_method_button');
    $("button[id^='probe_method_']").data('on', 0);
    $(this).removeClass('probe_method_button').addClass('probe_method_button_selected');
    $(this).data('on', 1);
    save_prove();
});
$("button[id^='probe_interval_']").on('click', function()
{
    $("button[id^='probe_interval_']").removeClass('probe_interval_button_selected').addClass('probe_interval_button');
    $("button[id^='probe_interval_']").data('on', 0);
    $(this).removeClass('probe_interval_button').addClass('probe_interval_button_selected');
    $(this).data('on', 1);
    save_prove();
});

$("#probeToggle").on('change', function(e)
{
	//console.log($(this).is(":checked"));
    save_prove();
	if($(this).is(":checked"))
	{
		$("#probeToggleLabel").text('On');
		$("#probeToggleLabel").css('color', '#54BC00');
		$.post("toggle_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient, status: 'on'}, function(data, status)
		{
			//console.log(data);
			if(parseInt(data) == -1 || parseInt(data) == -2)
			{
				if(parseInt(data) == -1)
				{
					swal("Error", "Please fill out all of the fields above and try again.", "error");
					if($("#probeToggle").is(":checked"))
					{
						$("#probeToggle").attr('checked', false);
						$("#probeToggleLabel").text('Off');
						$("#probeToggleLabel").css('color', '#D84840');
					}
					else
					{
						$("#probeToggle").attr('checked', true);
						$("#probeToggleLabel").text('On');
						$("#probeToggleLabel").css('color', '#54BC00');
					}
				}
				else if(parseInt(data) == -2)
				{
					if($("#probeToggle").is(":checked"))
					{
						$("#probeToggle").attr('checked', false);
						$("#probeToggleLabel").text('Off');
						$("#probeToggleLabel").css('color', '#D84840');
					}
					else
					{
						$("#probeToggle").attr('checked', true);
						$("#probeToggleLabel").text('On');
						$("#probeToggleLabel").css('color', '#54BC00');
					}
					
					//selected_patient = $(this).attr("id");
					$.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
					{
						var d = JSON.parse(data);
						var var_length = d['protocols'].length;
						probe_questions = d['questions'];
                        $("#probe_protocols").empty();
                        $("#probe_protocols").html('<option value="0" style="display: none;">N/A</option>');
						$("#probe_protocols").data('prev', 0);
						$("#probes_container").html('');
                        
                        
						for(var i = 0; i < var_length; i++)
						{
							if(i == 0 && d['protocols'][i].protocolID != null)
								$("#probe_protocols").data('prev', d['protocols'][i].protocolID);
							$("#probe_protocols").append('<option class="probe_protocols_option" value="'+d['protocols'][i].protocolID+'">'+d['protocols'][i].name+'</option>');

							var html = '<div class="probes_row">';
							html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: bold;">'+d['protocols'][i].name+'</div>';
							html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">'+d['protocols'][i].description+'</div>';
							html += '<button class="probes_edit_button" id="probes_edit_button_'+d['protocols'][i].protocolID+'"><i class="icon-pencil"></i></button>';
							html += '<button class="probes_delete_button" id="probes_delete_button_'+d['protocols'][i].protocolID+'">X</button>';
							html += '</div>';
							$("#probes_container").append(html);
						}
						$("#connectMemberStep1").css("display", "none");
						$("#connectMemberStep4").css("display", "block");
						$.post("get_user_info.php", {id: selected_patient}, function(data, status)
						{
							var info = JSON.parse(data);

							$("#connectMemberEmail").val(info['email']);
							$("#connectMemberPhone").val('+'+info['phone']);
							if(info.hasOwnProperty('cards') && info['cards'].length > 0)
							{
								load_credit_cards(info['cards']);
							}
						});
						connectMemberSubscribeButtonClicked = true;
						$("#connectMemberSubscribeButton").css('background-color', '#54BC00');
						connectMemberSelected = selected_patient;
						connectMemberDialog.dialog('open');
						probe_dialog.dialog('close');
						$.post("get_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
                        {
                            var d = JSON.parse(data);
                            //console.log(data);
                            if(d != false)
                            {

                                if(d['doctorPermission'] == '1' && d['patientPermission'] == '1')
                                {
                                    $("#probeToggle").attr('checked', true);
                                    $("#probeToggleLabel").text('On');
                                    $("#probeToggleLabel").css('color', '#54BC00');
                                }
                                else
                                {
                                    $("#probeToggle").attr('checked', false);
                                    $("#probeToggleLabel").text('Off');
                                    $("#probeToggleLabel").css('color', '#D84840');
                                }
                                if(d['protocolID'] != null && d['protocolID'] > 1)
                                {
                                    $("#probe_protocols").val(d['protocolID']);
                                    $("#probe_protocols").data('prev', d['protocolID']);
                                    $("#select_probe_section").css('border', '2px solid #333');
                                }
                                else
                                {
                                    $("#standard_probe_button").css('border', '2px solid #333');
                                    $("#standard_probe_button").data('on', 1);
                                    $("#probe_protocols").children('option').each(function()
                                    {
                                        $(this).removeAttr('selected');
                                    });
                                    $("#probe_protocols").data('prev', 0);
                                    $("#probe_protocols").val(0);
                                }
                                if(d['desiredTime'] != null && d['desiredTime'].length > 0)
                                   $("#probe_time5").val(d['desiredTime']);
                                else
                                    $("#probe_time5").val('12:00pm');
                                if(d['timezone'] != null)
                                   $("#probe_timezone").val(d['timezone']);
                                else
                                    $("#probe_timezone").val(1);

                                $("button[id^='probe_method_']").removeClass('probe_method_button_selected').addClass('probe_method_button');
                                $("button[id^='probe_method_']").data('on', 0);
                                if(d['smsRequest'] == 1)
                                {
                                    $("#probe_method_text").data('on', 1);
                                    $("#probe_method_text").removeClass('probe_method_button').addClass('probe_method_button_selected');
                                }
                                else if(d['emailRequest'] == 1)
                                {
                                    $("#probe_method_email").data('on', 1);
                                    $("#probe_method_email").removeClass('probe_method_button').addClass('probe_method_button_selected');
                                }
                                else
                                {
                                    $("#probe_method_phone").data('on', 1);
                                    $("#probe_method_phone").removeClass('probe_method_button').addClass('probe_method_button_selected');
                                }

                                $("button[id^='probe_interval_']").removeClass('probe_interval_button_selected').addClass('probe_interval_button');
                                $("button[id^='probe_interval_']").data('on', 0);
                                if(d['probeInterval'] == 365)
                                {
                                    $("#probe_interval_yearly").data('on', 1);
                                    $("#probe_interval_yearly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                                }
                                else if(d['probeInterval'] == 30)
                                {
                                    $("#probe_interval_monthly").data('on', 1);
                                    $("#probe_interval_monthly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                                }
                                else if(d['probeInterval'] == 7)
                                {
                                    $("#probe_interval_weekly").data('on', 1);
                                    $("#probe_interval_weekly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                                }
                                else
                                {
                                    $("#probe_interval_daily").data('on', 1);
                                    $("#probe_interval_daily").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                                }

                                if(d['start_val'] != null)
                                    $("#probe_alert_start_value").val(d['start_val']);
                                else
                                    $("#probe_alert_start_value").val(1);

                                if(d['exp_val'] != null)
                                    $("#probe_alert_expected_value").val(d['exp_val']);
                                else
                                    $("#probe_alert_expected_value").val(5);

                                if(d['exp_day_1'] != null)
                                    $("#probe_alert_expected_day_1").val(d['exp_day_1']);
                                else
                                    $("#probe_alert_expected_day_1").val(7);

                                if(d['exp_day_2'] != null)
                                    $("#probe_alert_expected_day_2").val(d['exp_day_2']);
                                else
                                    $("#probe_alert_expected_day_2").val(10);

                                if(d['tolerance'] != null)
                                    $("#probe_alert_tolerance").val(d['tolerance']);
                                else
                                    $("#probe_alert_tolerance").val(5);
                            }
                            else
                            {
                                $("#probeToggle").attr('checked', false);
                                $("#probeToggleLabel").text('Off');
                                $("#probeToggleLabel").css('color', '#D84840');
                                
                                $("#probe_protocols").children('option').each(function()
                                {
                                    $(this).removeAttr('selected');
                                });
                                $("#probe_timezone").val(1);
                                $("#probe_time5").val('12:00pm');
                                $("#standard_probe_button").css('border', '2px solid #333');
                                $("#standard_probe_button").data('on', 1);
                                $("#probe_protocols").data('prev', 0);
                                $("#probe_protocols").val(0);
                                $("button[id^='probe_method_']").removeClass('probe_method_button_selected').addClass('probe_method_button');
                                $("button[id^='probe_method_']").data('on', 0);
                                $("button[id^='probe_interval_']").removeClass('probe_interval_button_selected').addClass('probe_interval_button');
                                $("button[id^='probe_interval_']").data('on', 0);
                                $("#probe_method_phone").data('on', 1);
                                $("#probe_method_phone").removeClass('probe_method_button').addClass('probe_method_button_selected');
                                $("#probe_interval_daily").data('on', 1);
                                $("#probe_interval_daily").removeClass('probe_interval_button').addClass('probe_interval_button_selected');

                                $("#probe_alert_start_value").val(1);
                                $("#probe_alert_expected_value").val(5);
                                $("#probe_alert_expected_day_1").val(7);
                                $("#probe_alert_expected_day_2").val(10);
                                $("#probe_alert_tolerance").val(5);
                            }
                            $("#probe_alert_tolerance_value").text($("#probe_alert_tolerance").val());
                        });
					});

					//swal("Cannot Activate Probe", "This probe could not be activated because it has not been purchased yet.", "error");
				}

			}
		});
	}
	else
	{
		$.post("toggle_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient, status: 'off', save: 0}, function(data, status)
		{
			if(parseInt(data) == -1)
			{
				if($("#probeToggle").is(":checked"))
				{
					$("#probeToggle").attr('checked', false);
					$("#probeToggleLabel").text('Off');
					$("#probeToggleLabel").css('color', '#D84840');
				}
				else
				{
					$("#probeToggle").attr('checked', true);
					$("#probeToggleLabel").text('On');
					$("#probeToggleLabel").css('color', '#54BC00');
				}
				swal("Error", "There was an error, please try again later", "error");
			}
			else
			{
				$("#probeToggleLabel").text('Off');
				$("#probeToggleLabel").css('color', '#D84840');
			}
		});

	}
});
$(".EditProbe").live('click',function() {
	selected_patient = $(this).attr("id");
	/*

	var probeID = $(this).attr("id");

	var url = 'getProbeData.php?probeID='+probeID;
	getprobedata(url);


	//Fill out the existing data in the popup
	var url = 'getPatientContactInfo.php?idusu='+probe[0].patientID;
	getusuariosdata(url);
	$('#patientID').val(probe[0].patientID);

	var quecolor='RED';
	$('#InfoIDPacienteB').html('<span id="ETUSER" class="label label-info" style="font-size:18px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; margin-left:20px;">'+probe[0].patientID+'</span><span class="label label-info" style="background-color:'+quecolor+'; font-size:14px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; margin-left:20px;">'+patient[0].idusfixedname+'</span>');
	//alert(patient[0].idusfixedname + '  ' + patient[0].email + '   ' + patient[0].telefono);

	$('#Email').val(patient[0].email);
	//$('#Phone').val(patient[0].telefono);
	//$('#Message').val(patient[0].telefono);
	$("#Phone").val('+'+patient[0].telefono);
	$("#Message").val('+'+ patient[0].telefono);

	document.getElementById('Timezone').value=probe[0].timezone;
	document.getElementById('Time').value=probe[0].desiredTime;
	document.getElementById('Interval').value=probe[0].probeInterval;

	if(probe[0].emailRequest==1)
	{
		document.getElementById('Method').value='Email';
	}
	else if(probe[0].phoneRequest==1)
	{
		document.getElementById('Method').value='Phone';
	}
	else //if(probe[0].smsRequest==1)
	{
		document.getElementById('Method').value='Message';
	}
	changeMethod();

	$('#ProbeIDHidden').val(probeID);

	$('#probeRequest').trigger('click');
	*/

	$.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
	{
		var d = JSON.parse(data);
		var var_length = d['protocols'].length;
		probe_questions = d['questions'];
        $("#probe_protocols").empty();
		$("#probe_protocols").html('<option value="0" style="display: none;">N/A</option>');
        $("#probe_protocols").data('prev', 0);
        $("#probes_container").html('');
        
        
		for(var i = 0; i < var_length; i++)
		{
			if(i == 0)
				$("#probe_protocols").data('prev', d['protocols'][i].protocolID);
			$("#probe_protocols").append('<option value="'+d['protocols'][i].protocolID+'">'+d['protocols'][i].name+'</option>');

			var html = '<div class="probes_row">';
			html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-weight: bold;">'+d['protocols'][i].name+'</div>';
			html += '<div style="float: left; width: 40%; margin-right: 3%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">'+d['protocols'][i].description+'</div>';
			html += '<button class="probes_edit_button" id="probes_edit_button_'+d['protocols'][i].protocolID+'"><i class="icon-pencil"></i></button>';
			html += '<button class="probes_delete_button" id="probes_delete_button_'+d['protocols'][i].protocolID+'">X</button>';
			html += '</div>';
			$("#probes_container").append(html);
		}
		
		probe_dialog.dialog('open');
		
		$.post("get_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
        {
            var d = JSON.parse(data);
            //console.log(data);
            if(d != false)
            {

                if(d['doctorPermission'] == '1' && d['patientPermission'] == '1')
                {
                    $("#probeToggle").attr('checked', true);
                    $("#probeToggleLabel").text('On');
                    $("#probeToggleLabel").css('color', '#54BC00');
                }
                else
                {
                    $("#probeToggle").attr('checked', false);
                    $("#probeToggleLabel").text('Off');
                    $("#probeToggleLabel").css('color', '#D84840');
                }
                if(d['protocolID'] != null && d['protocolID'] > 1)
                {
                    $("#probe_protocols").val(d['protocolID']);
                    $("#probe_protocols").data('prev', d['protocolID']);
                    $("#select_probe_section").css('border', '2px solid #333');
                }
                else
                {
                    $("#standard_probe_button").css('border', '2px solid #333');
                    $("#standard_probe_button").data('on', 1);
                    $("#probe_protocols").children('option').each(function()
                    {
                        $(this).removeAttr('selected');
                    });
                    $("#probe_protocols").data('prev', 0);
                    $("#probe_protocols").val(0);
                }
                if(d['desiredTime'] != null && d['desiredTime'].length > 0)
                   $("#probe_time5").val(d['desiredTime']);
                else
                    $("#probe_time5").val('12:00pm');
                if(d['timezone'] != null)
                   $("#probe_timezone").val(d['timezone']);
                else
                    $("#probe_timezone").val(1);

                $("button[id^='probe_method_']").removeClass('probe_method_button_selected').addClass('probe_method_button');
                $("button[id^='probe_method_']").data('on', 0);
                if(d['smsRequest'] == 1)
                {
                    $("#probe_method_text").data('on', 1);
                    $("#probe_method_text").removeClass('probe_method_button').addClass('probe_method_button_selected');
                }
                else if(d['emailRequest'] == 1)
                {
                    $("#probe_method_email").data('on', 1);
                    $("#probe_method_email").removeClass('probe_method_button').addClass('probe_method_button_selected');
                }
                else
                {
                    $("#probe_method_phone").data('on', 1);
                    $("#probe_method_phone").removeClass('probe_method_button').addClass('probe_method_button_selected');
                }

                $("button[id^='probe_interval_']").removeClass('probe_interval_button_selected').addClass('probe_interval_button');
                $("button[id^='probe_interval_']").data('on', 0);
                if(d['probeInterval'] == 365)
                {
                    $("#probe_interval_yearly").data('on', 1);
                    $("#probe_interval_yearly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                }
                else if(d['probeInterval'] == 30)
                {
                    $("#probe_interval_monthly").data('on', 1);
                    $("#probe_interval_monthly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                }
                else if(d['probeInterval'] == 7)
                {
                    $("#probe_interval_weekly").data('on', 1);
                    $("#probe_interval_weekly").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                }
                else
                {
                    $("#probe_interval_daily").data('on', 1);
                    $("#probe_interval_daily").removeClass('probe_interval_button').addClass('probe_interval_button_selected');
                }

                if(d['start_val'] != null)
                    $("#probe_alert_start_value").val(d['start_val']);
                else
                    $("#probe_alert_start_value").val(1);

                if(d['exp_val'] != null)
                    $("#probe_alert_expected_value").val(d['exp_val']);
                else
                    $("#probe_alert_expected_value").val(5);

                if(d['exp_day_1'] != null)
                    $("#probe_alert_expected_day_1").val(d['exp_day_1']);
                else
                    $("#probe_alert_expected_day_1").val(7);

                if(d['exp_day_2'] != null)
                    $("#probe_alert_expected_day_2").val(d['exp_day_2']);
                else
                    $("#probe_alert_expected_day_2").val(10);

                if(d['tolerance'] != null)
                    $("#probe_alert_tolerance").val(d['tolerance']);
                else
                    $("#probe_alert_tolerance").val(5);
            }
            else
            {
                $("#probeToggle").attr('checked', false);
                $("#probeToggleLabel").text('Off');
                $("#probeToggleLabel").css('color', '#D84840');

                $("#probe_protocols").children('option').each(function()
                {
                    $(this).removeAttr('selected');
                });
                $("#probe_timezone").val(1);
                $("#probe_time5").val('12:00pm');
                $("#standard_probe_button").css('border', '2px solid #333');
                $("#standard_probe_button").data('on', 1);
                $("#probe_protocols").data('prev', 0);
                $("#probe_protocols").val(0);
                $("button[id^='probe_method_']").removeClass('probe_method_button_selected').addClass('probe_method_button');
                $("button[id^='probe_method_']").data('on', 0);
                $("button[id^='probe_interval_']").removeClass('probe_interval_button_selected').addClass('probe_interval_button');
                $("button[id^='probe_interval_']").data('on', 0);
                $("#probe_method_phone").data('on', 1);
                $("#probe_method_phone").removeClass('probe_method_button').addClass('probe_method_button_selected');
                $("#probe_interval_daily").data('on', 1);
                $("#probe_interval_daily").removeClass('probe_interval_button').addClass('probe_interval_button_selected');

                $("#probe_alert_start_value").val(1);
                $("#probe_alert_expected_value").val(5);
                $("#probe_alert_expected_day_1").val(7);
                $("#probe_alert_expected_day_2").val(10);
                $("#probe_alert_tolerance").val(5);
            }
            $("#probe_alert_tolerance_value").text($("#probe_alert_tolerance").val());
        });
	});
	
	

});
function get_probe_questions()
{
	$.post("get_probe_questions.php", {doc_id: $("#MEDID").val()}, function(data, status)
	{
		var d = JSON.parse(data);
		titles = d['titles'];
		units = d['units'];
		english_questions = d['questions_en'];
		spanish_questions = d['questions_es'];
		mins = d['min'];
		maxs = d['max'];
		answers = d['type'];
		$("#probe_question_en").autocomplete("destroy");
		$("#probe_question_es").autocomplete("destroy");
		$("#probe_question_en").autocomplete(
		{
			source: english_questions,
			select: function(event, ui)
			{
				var index = ui.item.index;
				$("#probe_question_title").val(titles[index].label);
				$("#probe_question_en").val(english_questions[index].label);
				$("#probe_question_es").val(spanish_questions[index].label);
				$("#probe_question_unit").val(units[index].label);
				$("#probe_question_min").val(mins[index].label);
				$("#probe_question_max").val(maxs[index].label);
				$("#probe_question_answer_type").val(answers[index].label);
				
				probe_question_title[probe_question - 1] = titles[index].label;
				probe_question_en[probe_question - 1] = english_questions[index].label;
				probe_question_es[probe_question - 1] = spanish_questions[index].label;
				probe_question_unit[probe_question - 1] = units[index].label;
				probe_min[probe_question - 1] = mins[index].label;
				probe_max[probe_question - 1] = maxs[index].label;
				probe_answer_type[probe_question - 1] = answers[index].label;
			}
		});
		$("#probe_question_es").autocomplete(
		{
			source: spanish_questions,
			select: function(event, ui)
			{
				var index = ui.item.index;
				$("#probe_question_title").val(titles[index].label);
				$("#probe_question_en").val(english_questions[index].label);
				$("#probe_question_es").val(spanish_questions[index].label);
				$("#probe_question_unit").val(units[index].label);
				$("#probe_question_min").val(mins[index].label);
				$("#probe_question_max").val(maxs[index].label);
				$("#probe_question_answer_type").val(answers[index].label);
				
				probe_question_title[probe_question - 1] = titles[index].label;
				probe_question_en[probe_question - 1] = english_questions[index].label;
				probe_question_es[probe_question - 1] = spanish_questions[index].label;
				probe_question_unit[probe_question - 1] = units[index].label;
				probe_min[probe_question - 1] = mins[index].label;
				probe_max[probe_question - 1] = maxs[index].label;
				probe_answer_type[probe_question - 1] = answers[index].label;
			}
		});
	});
}
get_probe_questions();
var checkout_window = $("#checkout-window").dialog({bgiframe: true, width: 1050, height: 650, resize: false, modal: true, autoOpen: false});
$("#probe_toggle").on('click', function()
{
	if($(this).text().indexOf('Turn Probe On') != -1)
	{
		if($("#probe_protocols").val() <= 0)
			swal("Error", "Please select a probe", "error");
		else if($("#probe_time5").val().length == 0)
			swal("Error", "Please select the probe's time", "error");
		else
		{
			$.post("toggle_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient, status: 'on', protocol: $("#probe_protocols").val(), time: $("#probe_time5").val(), timezone: $("#probe_timezone").val(), interval: $("#probe_interval").val(), request: $("#probe_method").val(), save: 0}, function(data, status)
			{
				if(parseInt(data) == -1)
				{
					swal("Error", "There was an error, please try again later", "error");
				}else if(parseInt(data) == -2){
					
					var med_id = $("#MEDID").val();
					var probe_id = $('#probe_protocols').val();
					var probe_text = $('#probe_protocols').text();
					var probe_time = $('#probe_time').val();
					var probe_time_text = $('#probe_time').text();
					var probe_timezone = $('#probe_timezone').val();
					var probe_timezone_text = $('#probe_timezone').text();
					var probe_method = $('#probe_method').val();
					var probe_method_text = $('#probe_method').text();
					var probe_interval = $('#probe_interval').val();
					var probe_interval_text = $('#probe_interval').text();
					var mem_email = $("#connectMemberEmail").val();
					var mem_phone = $("#connectMemberPhone").val();
					$("#checkout-window").html('<iframe src="checkoutClassUnit.php?member_email='+mem_email+'&member_phone='+mem_phone+'&user_id='+selected_patient+'&med_id='+med_id+'&probe_id='+probe_id+'&probe_text='+probe_text+'&probe_time='+probe_time+'&probe_time_text='+probe_time_text+'&probe_timezone='+probe_timezone+'&probe_timezone_text='+probe_timezone_text+'&probe_method='+probe_method+'&probe_method_text='+probe_method_text+'&probe_interval='+probe_interval+'&probe_interval_text='+probe_interval_text+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
					checkout_window.dialog('open');
				}else{
					$("#probe_toggle").html('<i class="icon-remove"></i>&nbsp;&nbsp;Turn Probe Off');
					$("#probe_toggle").css('background-color', '#D84840');
					$("#probe_status").css('color', '#54BC00');
					$("#probe_status").text('On');
				}
			});
		}
	}
	else
	{
		
		$.post("toggle_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient, status: 'off', save: 0}, function(data, status)
		{
			if(parseInt(data) == -1)
			{
				swal("Error", "There was an error, please try again later", "error");
			}
			else
			{
				$("#probe_toggle").html('<i class="icon-off"></i>&nbsp;&nbsp;Turn Probe On');
				$("#probe_toggle").css('background-color', '#54bc00');
				$("#probe_status").css('color', '#D84840');
				$("#probe_status").text('Off');
			}
		});
	}
});

 function draw_probe_alert_graph()
    {
        var canvas = document.getElementById('probe_alert_graph');
        var context = canvas.getContext('2d');
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        var min_day = 0;
        if($("#probe_alert_expected_day_1").val().length > 0)
            min_day = parseInt($("#probe_alert_expected_day_1").val());
        var max_day = min_day + 1;
        if($("#probe_alert_expected_day_2").val().length > 0)
            max_day = parseInt($("#probe_alert_expected_day_2").val());
        
        var start_value = 0;
        if($("#probe_alert_start_value").val().length > 0)
            start_value = parseInt($("#probe_alert_start_value").val());
        var expected_value = start_value + 1;
        if($("#probe_alert_expected_value").val().length > 0)
            expected_value = parseInt($("#probe_alert_expected_value").val());
        
        var tolerance = 0.5;
        if($("#probe_alert_tolerance").val().length > 0)
            tolerance = parseInt($("#probe_alert_tolerance").val()) / 100.0;
        
        var days = (1.0 - (min_day / max_day));
        var slope = expected_value / max_day;
        
        var start_x = 30;
        var end_x = canvas.width - 50;
        var x_diff = canvas.width - end_x;
        var start_y = 0;
        var end_y = canvas.height - 30;
        if(expected_value < start_value)
        {
            end_y = 0;
            start_y = canvas.height - 30;
        }

        context.beginPath();
        context.rect(start_x, 0, canvas.width - start_x - x_diff, canvas.height - 30);
        context.fillStyle = "rgba(226, 241, 251, 1.0)";
        context.fill();
        
        context.beginPath();
        context.moveTo(start_x, end_y);
        context.lineTo(canvas.width - x_diff, start_y);
        context.lineTo((canvas.width - start_x - x_diff) * (parseFloat(min_day) / parseFloat(max_day)) + start_x, start_y);
        context.lineTo(start_x, end_y);
        context.closePath();
        context.strokeStyle = 'rgba(255, 255, 255, 1.0)';
        context.fillStyle = 'rgba(255, 255, 255, 1.0)';
        context.setLineDash([0,0]);
        context.stroke();
        context.fill();
        
        context.beginPath();
        context.moveTo(start_x, end_y);
        context.lineTo(days * tolerance * (canvas.width - start_x - x_diff) + start_x, end_y);
        context.lineTo((canvas.width - start_x - x_diff) + (days * tolerance * canvas.width) + start_x, start_y);
        context.lineTo(canvas.width - x_diff, start_y);
        context.lineTo(start_x, end_y);
        context.closePath();
        context.strokeStyle = 'rgba(194, 206, 218, 1.0)';
        context.fillStyle = 'rgba(194, 206, 218, 1.0)';
        context.setLineDash([0,0]);
        context.stroke();
        context.fill();
        
        context.beginPath();
        context.moveTo(days * tolerance * (canvas.width - start_x - x_diff) + start_x, end_y);
        context.lineTo(canvas.width - x_diff, end_y);
        context.lineTo((canvas.width - start_x - x_diff) + (days * tolerance * canvas.width) + start_x, start_y);
        context.lineTo(days * tolerance * (canvas.width - start_x - x_diff) + start_x, end_y);
        context.closePath();
        context.strokeStyle = 'rgba(165, 175, 185, 1.0)';
        context.fillStyle = 'rgba(165, 175, 185, 1.0)';
        context.setLineDash([0,0]);
        context.stroke();
        context.fill();
        
        context.beginPath();
        context.rect(start_x, 0, canvas.width - start_x - x_diff, canvas.height - 30);
        context.strokeStyle = "rgba(226, 241, 251, 1.0)";
        context.lineWidth = 2;
        context.stroke();
        
        if(min_day > 0)
        {
            context.beginPath();
            context.moveTo((min_day / max_day) * (canvas.width - start_x - x_diff) + start_x, 0);
            context.lineTo((min_day / max_day) * (canvas.width - start_x - x_diff) + start_x, canvas.height - 30);
            context.strokeStyle = '#999';
            context.setLineDash([5,5]);
            context.lineWidth = 1;
            context.stroke();
        }
        
        context.clearRect(end_x, 0, canvas.width - end_x, canvas.height);
        
        context.font = "12px Helvetica";
        context.fillStyle = "#333";
        if(expected_value >= start_value)
        {
            context.fillText(start_value, 0, canvas.height - 30);
            context.fillText(expected_value, 0, 12);
        }
        else
        {
            context.fillText(expected_value, 0, canvas.height - 30);
            context.fillText(start_value, 0, 12);
        }
        
        context.fillText('0 Days', start_x - 7, canvas.height - 5);
        if(min_day > 0)
            context.fillText(min_day+' Days', (min_day / max_day) * (canvas.width - start_x - x_diff) + start_x - 20, canvas.height - 5);
        context.fillText(max_day+' Days', canvas.width - 70, canvas.height - 5);
        
        return canvas.toDataURL();
        
    }
    var alerts = [{}, {}, {}, {}, {}];
    var probe_questions = [];
    $("#probe_alert_clear_button").on('click', function()
    {
        alerts = [{tolerance: 10}, {tolerance: 10}, {tolerance: 10}, {tolerance: 10}, {tolerance: 10}];
        $("#probe_alert_start_value").val("");
        $("#probe_alert_expected_value").val("");
        $("#probe_alert_expected_day_1").val("");
        $("#probe_alert_expected_day_2").val("");
        $("#probe_alert_tolerance").val(10);
    });
    $("#probe_protocols").data('prev', $("#probe_protocols").val());
    $("#probe_protocols").on('change', function()
    {
        var protocol = $(this).val();
        swal({title: "Probe Change",   
              text: "Switching probes will erase any probe alerts that you have defined for this user. Do you wish to continue?",   
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "Change",   
              closeOnConfirm: true 
             }, function(isConfirm)
             {   
                if (isConfirm) 
                {
                    $.post("save_probe_alerts.php", {clear: true, doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
                    {
                    });

                    $("#standard_probe_button").css('border', '0px solid #FFF');
                    $("#standard_probe_button").data('on', 0);
                    $("#select_probe_section").css('border', '2px solid #333');

                    save_prove();


                } 
                else 
                {     
                    $("#probe_protocols").val($("#probe_protocols").data('prev'));
                    $("#probe_protocols").data('prev', $("#probe_protocols").val());
                    if($("#probe_protocols").val() != 1)
                    {
                        $("#standard_probe_button").css('border', '0px solid #FFF');
                        $("#standard_probe_button").data('on', 0);
                        $("#select_probe_section").css('border', '2px solid #333');
                    }
                    else
                    {
                        $("#standard_probe_button").css('border', '2px solid #333');
                        $("#standard_probe_button").data('on', 1);
                        $("#probe_protocols").data('prev', 0);
                        $("#probe_protocols").val(0);
                        $("#select_probe_section").css('border', '0px solid #FFF');
                    }
                }
        });
    });
    
    /*$("#select_probe_section").on('click', function()
    {
        var protocol = $(this).val();
        swal({title: "Probe Change",   
              text: "Switching probes will erase any probe alerts that you have defined for this user. Do you wish to continue?",   
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "Change",   
              closeOnConfirm: true 
             }, function(isConfirm)
             {   
                if (isConfirm) 
                {
                    $.post("save_probe_alerts.php", {clear: true, doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
                    {
                    });
                    
                    $("#standard_probe_button").css('border', '0px solid #FFF');
                    $("#standard_probe_button").data('on', 0);
                    $("#select_probe_section").css('border', '2px solid #333');
                    
                    save_prove();
                    
                } 
                else 
                {     
                    $("#probe_protocols").val($("#probe_protocols").data('prev'));
                    $("#probe_protocols").data('prev', $("#probe_protocols").val());
                    if($("#probe_protocols").val() != 1)
                    {
                        $("#standard_probe_button").css('border', '0px solid #FFF');
                        $("#standard_probe_button").data('on', 0);
                        $("#select_probe_section").css('border', '2px solid #333');
                    }
                    else
                    {
                        $("#standard_probe_button").css('border', '2px solid #333');
                        $("#standard_probe_button").data('on', 1);
                        $("#select_probe_section").css('border', '0px solid #FFF');
                    }
                }
        });
    });*/
    
    $("#probe_time5").on('change', function()
    {
        $("#probeToggle").trigger('change');
        save_prove();
    });
    $("#probe_timezone").on('change', function()
    {
        save_prove();
    });
    $("#probe_language").on('change', function()
    {
        save_prove();
    });
    $("#probe_interval").on('change', function()
    {
        save_prove();
    });
    $("#probe_method").on('change', function()
    {
        save_prove();
    });
    $("#probe_alert_button").on('click', function()
    {
        if($("#probe_protocols").val() == -1)
        {
            swal("No probe", "You do not have a probe defined.\nYou must have a probe to assign an alert to.", "error");
        }
        else
        {
            $.post('get_probe_alerts.php', {doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
            {
                //console.log(data);
                alerts = [{}, {}, {}, {}, {}];
                var d = JSON.parse(data);
                for(var k = 0; k < d.length; k++)
                {
                    alerts[d[k].question - 1] = 
                    {
                         start_value: d[k].start_value, 
                         exp_value: d[k].exp_value, 
                         exp_day_1: d[k].exp_day_1,
                         exp_day_2: d[k].exp_day_2, 
                         tolerance: d[k].tolerance
                    };
                }
                if(alerts[0].hasOwnProperty('start_value'))
                {
                    $("#probe_alert_start_value").val(alerts[0].start_value);
                    $("#probe_alert_expected_value").val(alerts[0].exp_value);
                    $("#probe_alert_expected_day_1").val(alerts[0].exp_day_1);
                    $("#probe_alert_expected_day_2").val(alerts[0].exp_day_2);
                    $("#probe_alert_tolerance").val(alerts[0].tolerance);
                }
                else
                {
                    $("#probe_alert_start_value").val("");
                    $("#probe_alert_expected_value").val("");
                    $("#probe_alert_expected_day_1").val("");
                    $("#probe_alert_expected_day_2").val("");
                    $("#probe_alert_tolerance").val(10);
                    alerts[0].tolerance = 10;
                }
                $("#edit_probe_alerts").css("display", "block");
                $("#manage_user_probe").css("display", "none");
                $("#probe_alert_question").empty();
                //console.log("QUESTIONS: " + probe_questions[$("#probe_protocols").val()].length);
                $("#probe_alert_question").append('<option value="1">General Health</option>');
                for(var i = 0; i < probe_questions[$("#probe_protocols").val()].length; i++)
                {
                    $("#probe_alert_question").append('<option value="'+probe_questions[$("#probe_protocols").val()][i].index+'">'+probe_questions[$("#probe_protocols").val()][i].text+'</option>');
                }
                draw_probe_alert_graph();
            });
        }
    });
    $("#probe_alert_question").on('change', function()
    {
        if(alerts[$(this).val() - 1].hasOwnProperty('start_value'))
        {
            $("#probe_alert_start_value").val(alerts[$(this).val() - 1].start_value);
            $("#probe_alert_expected_value").val(alerts[$(this).val() - 1].exp_value);
            $("#probe_alert_expected_day_1").val(alerts[$(this).val() - 1].exp_day_1);
            $("#probe_alert_expected_day_2").val(alerts[$(this).val() - 1].exp_day_2);
            $("#probe_alert_tolerance").val(alerts[$(this).val() - 1].tolerance);
        }
        else
        {
            $("#probe_alert_start_value").val("");
            $("#probe_alert_expected_value").val("");
            $("#probe_alert_expected_day_1").val("");
            $("#probe_alert_expected_day_2").val("");
            $("#probe_alert_tolerance").val(10);
            alerts[$(this).val() - 1].tolerance = 10;
        }
        draw_probe_alert_graph();
    });
    $("#probe_alert_start_value").on('change', function()
    {
        //alerts[$("#probe_alert_question").val() - 1].start_value = $(this).val();
        //draw_probe_alert_graph();
        save_prove();
    });
    $("#probe_alert_expected_value").on('change', function()
    {
        //alerts[$("#probe_alert_question").val() - 1].exp_value = $(this).val();
        //draw_probe_alert_graph();
        save_prove();
    });
    $("#probe_alert_expected_day_1").on('change', function()
    {
        //alerts[$("#probe_alert_question").val() - 1].exp_day_1 = $(this).val();
        //draw_probe_alert_graph();
        save_prove();
    });
    $("#probe_alert_expected_day_2").on('change', function()
    {
        //alerts[$("#probe_alert_question").val() - 1].exp_day_2 = $(this).val();
        //draw_probe_alert_graph();
        save_prove();
    });
    $("#probe_alert_tolerance").on('change', function()
    {
        //alerts[$("#probe_alert_question").val() - 1].tolerance = $(this).val();
        $("#probe_alert_tolerance_value").text($(this).val());
        //draw_probe_alert_graph();
        save_prove();
    });
    $('#probe_alerts_button_back').live('click', function()
    {
        $("#edit_probe_alerts").css("display", "none");
        $("#manage_user_probe").css("display", "block");
    });
    $('#probe_alerts_save_button').live('click', function()
    {
		var first_value = $("#probe_alert_expected_day_1").val();
		var second_value = $("#probe_alert_expected_day_2").val();
		
		var first_value_parsed = parseInt(first_value);
		var second_value_parsed = parseInt(second_value);
		
		if(first_value_parsed <= second_value_parsed){
			$.post("save_probe_alerts.php", {alerts: JSON.stringify(alerts), doctor: $("#MEDID").val(), patient: selected_patient}, function(data, status)
			{
				$("#edit_probe_alerts").css("display", "none");
				$("#manage_user_probe").css("display", "block");
			});
		}else{
			$("#probe_alert_expected_day_1").focus();
			swal("Your first day value must be greater than or equal to your second day value.");
		}
    });
    $("#save_probes_button").on('click', function()
    {
        if($("#probe_protocols").val() <= 0)
            swal("Error", "Please select a probe", "error");
        else if($("#probe_time5").val().length == 0)
            swal("Error", "Please select the probe's time", "error");
        else
        {
            $.post("toggle_probe.php", {doctor: $("#MEDID").val(), patient: selected_patient, status: 'null', protocol: $("#probe_protocols").val(), time: $("#probe_time5").val(), timezone: $("#probe_timezone").val(), interval: $("#probe_interval").val(), request: $("#probe_method").val(), save: 1}, function(data, status)
            {
                if(parseInt(data) == 1 || parseInt(data) == -2)
                {
                    swal("Saved", "The probe has been saved successfully.", "success");
                }
                else
                {
                    
                    swal("Error", "There was an error, please try again later", "error");
                }
            });
        }
    });
    $("#edit_probes_button").on('click', function()
    {
        //$("#manage_user_probe").css("display", "none");
        //$("#view_probes").css("display", "block");
        
        var probe_id = $("#probe_protocols").val();//$(this).attr("id").split("_")[3];
        selected_probe = probe_id;
        $.post("get_probe_protocols.php", {id: probe_id}, function(data, status)
        {
            //console.log(data);
            var d = JSON.parse(data);
            probe_question_title = [d['question_title_1'], d['question_title_2'], d['question_title_3'], d['question_title_4'], d['question_title_5']];
            probe_question_en = [d['question_en_1'], d['question_en_2'], d['question_en_3'], d['question_en_4'], d['question_en_5']];
            probe_question_es = [d['question_es_1'], d['question_es_2'], d['question_es_3'], d['question_es_4'], d['question_es_5']];
            probe_question_unit = [d['question_unit_1'], d['question_unit_2'], d['question_unit_3'], d['question_unit_4'], d['question_unit_5']];
            probe_min = [d['answer_min_1'], d['answer_min_2'], d['answer_min_3'], d['answer_min_4'], d['answer_min_5']];
            probe_max = [d['answer_max_1'], d['answer_max_2'], d['answer_max_3'], d['answer_max_4'], d['answer_max_5']];
            probe_answer_type = [d['answer_type_1'], d['answer_type_2'], d['answer_type_3'], d['answer_type_4'], d['answer_type_5']];
            probe_units = [d['units_1'], d['units_2'], d['units_3'], d['units_4'], d['units_5']];
            range.setMax(d['answer_max_1']);
            range.setMin(d['answer_min_1']);
            range.setData(d['units_1']);
            $("#probe_question_label").text('Question 1');
            $("#probe_name_edit").val(d['name']);
            $("#probe_description").val(d['description']);
            $("#probe_question_title").val(d['question_title_1']);
            $("#probe_question_en").val(d['question_en_1']);
            $("#probe_question_es").val(d['question_es_1']);
            $("#probe_question_unit").val(d['question_unit_1']);
            $("#probe_question_min").val(d['answer_min_1']);
            $("#probe_question_max").val(d['answer_max_1']);
            $("#probe_question_answer_type").val(d['answer_type_1']);
            //$("#view_probes").css('display', 'none');
            $("#manage_user_probe").css("display", "none");
            $("#add_probe").css('display', 'block');
        });
    });
    $("#launch_probes_button").on('click', function()
    {
		probe_dialog.dialog('close');
        $.post('launch_probe.php', {doc: $("#MEDID").val(), pat: selected_patient}, function(data, status)
        {
            //console.log(data);
            if(data == '1')
            {
                swal({title: "Sent", text: "The probe has been sent successfully.", type: "success", confirmButtonColor: "#22AEFF"});
            }
            else if(data == '-1')
            {
                swal("Unable To Send Probe", "This probe has not been activated.", "error");
            }
            else
            {
                swal("Unable To Send Probe", "This probe has not been properly defined.\n Please make sure that all the fields have been filled out and try again.", "error");
            }
        });
    });
    $('#add_probe_button').live('click', function()
    {
        selected_probe = -1;
        probe_question_title = ['', '', '', '', ''];
        probe_question_en = ['', '', '', '', ''];
        probe_question_es = ['', '', '', '', ''];
        probe_question_unit = ['', '', '', '', ''];
        probe_min = [1, 1, 1, 1, 1];
        probe_max = [5, 5, 5, 5, 5];
        probe_answer_type = [1, 1, 1, 1, 1];
        probe_units = [[], [], [], [], []];
        $("#probe_question_label").text('Question 1');
        $("#probe_name_edit").val('');
        $("#probe_description").val('');
        $("#probe_question_title").val('');
        $("#probe_question_en").val('');
        $("#probe_question_es").val('');
        $("#probe_question_unit").val('');
        $("#probe_question_min").val('1');
        $("#probe_question_max").val('5');
        range.setMin(1);
        range.setMax(5);
        range.setData([]);
        $("#probe_question_answer_type").val(1);
        $("#manage_user_probe").css('display', 'none');
        $("#add_probe").css('display', 'block');
    });
    $('#add_probe_button_back').live('click', function()
    {
        $("#manage_user_probe").css("display", "block");
        $("#view_probes").css("display", "none");
    });
    
    var range = $("#probe_range_selector").H2MRange({width: 572, min: 0, max: 100, data: [{value: 40, label: 'Bad'}, {value: 100, label: 'Good'}]});
    $('body').on('click', 'button[id^="probes_edit_button_"]', function()
    {
        
        var probe_id = $(this).attr("id").split("_")[3];
        selected_probe = probe_id;
        $.post("get_probe_protocols.php", {id: probe_id}, function(data, status)
        {
            //console.log(data);
            var d = JSON.parse(data);
            probe_question_title = [d['question_title_1'], d['question_title_2'], d['question_title_3'], d['question_title_4'], d['question_title_5']];
            probe_question_en = [d['question_en_1'], d['question_en_2'], d['question_en_3'], d['question_en_4'], d['question_en_5']];
            probe_question_es = [d['question_es_1'], d['question_es_2'], d['question_es_3'], d['question_es_4'], d['question_es_5']];
            probe_question_unit = [d['question_unit_1'], d['question_unit_2'], d['question_unit_3'], d['question_unit_4'], d['question_unit_5']];
            probe_min = [d['answer_min_1'], d['answer_min_2'], d['answer_min_3'], d['answer_min_4'], d['answer_min_5']];
            probe_max = [d['answer_max_1'], d['answer_max_2'], d['answer_max_3'], d['answer_max_4'], d['answer_max_5']];
            probe_answer_type = [d['answer_type_1'], d['answer_type_2'], d['answer_type_3'], d['answer_type_4'], d['answer_type_5']];
            probe_units = [d['units_1'], d['units_2'], d['units_3'], d['units_4'], d['units_5']];
            range.setMax(d['answer_max_1']);
            range.setMin(d['answer_min_1']);
            range.setData(d['units_1']);
            $("#probe_question_label").text('Question 1');
            $("#probe_name_edit").val(d['name']);
            $("#probe_description").val(d['description']);
            $("#probe_question_title").val(d['question_title_1']);
            $("#probe_question_en").val(d['question_en_1']);
            $("#probe_question_es").val(d['question_es_1']);
            $("#probe_question_unit").val(d['question_unit_1']);
            $("#probe_question_min").val(d['answer_min_1']);
            $("#probe_question_max").val(d['answer_max_1']);
            $("#probe_question_answer_type").val(d['answer_type_1']);
            $("#view_probes").css('display', 'none');
            $("#add_probe").css('display', 'block');
        });
    });
    $('#probe_delete_button').live('click', function()
    {
        var probe_id = $("#probe_protocols").val();
        if(probe_id > 1)
        {
            swal({   title: "Are you sure?",   text: "Are you sure you want to delete this probe? This action cannot be undone.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes",   cancelButtonText: "No",   closeOnConfirm: false,   closeOnCancel: false }, function(isConfirm)
            {   
                if (isConfirm) 
                {     
                    $.post("delete_probe_protocol.php", {id: probe_id}, function(d, status)
                    {
                        swal("Deleted!", "The probe has been deleted successfully.", "success");
                        load_probe_protocols();
                    });
                } 
                else 
                {     
                    swal("Cancelled", "Deletion Cancelled", "error");   
                } 
            });
        }
    });
    $("#probe_question_next").on('click', function()
    {
        if(probe_question < 5)
        {
            probe_units[probe_question - 1] = range.get();
            probe_question += 1;
            $("#probe_question_title").val(probe_question_title[probe_question - 1]);
            $("#probe_question_en").val(probe_question_en[probe_question - 1]);
            $("#probe_question_es").val(probe_question_es[probe_question - 1]);
            $("#probe_question_unit").val(probe_question_unit[probe_question - 1]);
            $("#probe_question_min").val(probe_min[probe_question - 1]);
            $("#probe_question_max").val(probe_max[probe_question - 1]);
            $("#probe_question_answer_type").val(probe_answer_type[probe_question - 1]);
            $("#probe_question_label").text("Question "+probe_question);
            range.setMax(probe_max[probe_question - 1]);
            range.setMin(probe_min[probe_question - 1]);
            range.setData(probe_units[probe_question - 1]);
        }
    });
    $("#probe_question_previous").on('click', function()
    {
        if(probe_question > 1)
        {
            probe_units[probe_question - 1] = range.get();
            probe_question -= 1;
            $("#probe_question_title").val(probe_question_title[probe_question - 1]);
            $("#probe_question_en").val(probe_question_en[probe_question - 1]);
            $("#probe_question_es").val(probe_question_es[probe_question - 1]);
            $("#probe_question_unit").val(probe_question_unit[probe_question - 1]);
            $("#probe_question_min").val(probe_min[probe_question - 1]);
            $("#probe_question_max").val(probe_max[probe_question - 1]);
            $("#probe_question_answer_type").val(probe_answer_type[probe_question - 1]);
            $("#probe_question_label").text("Question "+probe_question);
            range.setMax(probe_max[probe_question - 1]);
            range.setMin(probe_min[probe_question - 1]);
            range.setData(probe_units[probe_question - 1]);
        }
    });
    $("#probe_question_title").on('input', function()
    {
        setTimeout(function()
        {
            probe_question_title[probe_question - 1] = $("#probe_question_title").val();
        }, 100);
    });
    $("#probe_question_en").on('input', function()
    {
        setTimeout(function()
        {
            probe_question_en[probe_question - 1] = $("#probe_question_en").val();
        }, 100);
    });
    $("#probe_question_es").on('input', function()
    {
        setTimeout(function()
        {
            probe_question_es[probe_question - 1] = $("#probe_question_es").val();
        }, 100);
    });
    $("#probe_question_unit").on('input', function()
    {
        setTimeout(function()
        {
            probe_question_unit[probe_question - 1] = $("#probe_question_unit").val();
        }, 100);
    });
    $("#probe_question_min").on('change', function()
    {
        probe_min[probe_question - 1] = $(this).val();
        range.setMin($(this).val());
    });
    $("#probe_question_max").on('change', function()
    {
        probe_max[probe_question - 1] = $(this).val();
        range.setMax($(this).val());
    });
    $("#probe_question_answer_type").on('change', function()
    {
        probe_answer_type[probe_question - 1] = $(this).val();
    });
    $("#probe_add").on('click', function()
    {
        probe_units[probe_question - 1] = range.get();
        var e = 0;
        if(selected_probe > 0)
        {
            e = 1;
        }
        if($("#probe_name_edit").val().length == 0)
            swal("Error", "Please add a name for the probe", "error");
        else if($("#probe_description").val().length == 0)
            swal("Error", "Please add a description for the probe", "error");
        else if(probe_question_en[0].length == 0)
            swal("Error", "Please add at least one question for the probe", "error");
        else if(probe_question_title[0].length == 0)
            swal("Error", "Please add at least one question for the probe", "error");
        else
        {
            var cont = true;
            for(var i = 0; i < 5; i++)
            {
                if((probe_min[i] < 0 || probe_min[i] > 9 || probe_max[i] < 0 || probe_max[i] > 9) && probe_answer_type[i] == 1)
                {
                    swal("Error", "Probe question " + (i + 1) + " has min and max values that are outside the range of the answer type. Please adjust the values and try again.", "error");
                    cont = false;
                }
            }
            if(cont)
            {
                //console.log(probe_units);
                $.post("add_probe_protocol.php", {doctor: $("#MEDID").val(), name: $("#probe_name_edit").val(), description: $("#probe_description").val(), questions_en: probe_question_en, questions_es: probe_question_es, min: probe_min, max: probe_max, titles: probe_question_title, question_units: probe_question_unit, answer_type: probe_answer_type, units: probe_units, edit: e, probe_id: selected_probe}, function(data, status)
                {
                    load_probe_protocols();
                    //$("#view_probes").css('display', 'block');
                    //$("#add_probe").css('display', 'none');
                    $("#manage_user_probe").css("display", "block");
                    $("#add_probe").css('display', 'none');
                });
            }
        }
    });
    $("#probe_cancel").on('click', function()
    {
        //$("#view_probes").css('display', 'block');
        //$("#add_probe").css('display', 'none');
        $("#manage_user_probe").css("display", "block");
        $("#add_probe").css('display', 'none');
    });
