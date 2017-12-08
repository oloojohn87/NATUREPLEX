console.log('connect_member_button.js LOADED!');

var connectMemberDialog = $('#connectMemberDialog').dialog(
{bigframe: false,
autoOpen: false, 
resizable: false, 
width: 600, 
height: 600,
close: function(event, ui) {
	   $("#connectMembersSearchBar").val('');        
	   $("div[id^='connectMemberStep']").hide();
	   $("#connectMemberStep1").show();
	   $("#credit_cards_container").html('');  
	   } 
});
var probe_dialog = $("#probe_editor").dialog({width: 600, height: 600, bigframe: true, autoOpen: false});

$("#ConnectMemberButton").click(function(event) {
	$.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
	{
		var d = JSON.parse(data);
		probe_questions = d['questions'];
		var var_length = d['protocols'].length;
		$("#connectMember_probe_protocols").html('');
        $("#connectMember_probe_protocols").append('<option value="1">General Health</option>');
		for(var i = 0; i < var_length; i++)
		{
			$("#connectMember_probe_protocols").append('<option value="'+d['protocols'][i].protocolID+'">'+d['protocols'][i].name+'</option>');
		}
	});
	loadMembersToConnect('');
	$("#probeToggleLabel").css("opacity", "0.5");
	$("#pTL").css("opacity", "0.5");
	$("#probeToggle").attr('disabled', 'disabled');
	connectMemberSubscribeButtonClicked = false;
	$("#connectMemberSubscribeButton").css('background-color', '#FFF');
	connectMemberDialog.dialog('open');

});

$("#connectMemberPhone").intlTelInput();
$("#connectMemberPhone").css('width', '415px');
$("#connectMemberPhone").css('height', '28px');
var connectMemberSelected = -1;
function loadMembersToConnect(search)
{
	var IdMed = $('#MEDID').val();
	var url ='getPatientsConnectedShort.php?Usuario='+search+'&UserDOB=&IdDoc='+IdMed+'&NReports=3';
	var col1 = "#FFF";
	var col2 = "#D7F9BD";
	$.get(url, function(data, status)
	{
		//console.log(data);
		var info = JSON.parse(data);
		$("#connectMemberTable").empty();
		for(var i = 0; i < info.length; i++)
		{
			var html = '';
			var bg = 'bg1';
			if(i % 2 == 1)
				bg = 'bg2';
			html += '<div id="connectMemberRow_'+info[i].id+'" class="connectMemberRow connectMemberRow_'+bg+'"';
			//if(i == 0 && i == info.length - 1)
			//    html += ' style="border-radius: 5px; "';
			/*else */if(i == 0)
				html += ' style="border-top-left-radius: 5px; border-top-right-radius: 5px; "';
			else if(i == info.length - 1 && i > 6)
				html += ' style="border-bottom-right-radius: 5px; border-bottom-left-radius: 5px;"';
			html += '>';
			html += '<div style="width: 40%; height: 20px; float: right; margin-top: 10px;">';
			
			if(info[i].referred == 1)
			{
				html += '<i class="icon-share-alt" style="float: right; font-size: 20px; margin-right: 10px;" />';
			}
            if(info[i].probestate !== null)
			{
                if(info[i].probestate == 1) html += '<i class="icon-signal" style="float: right; font-size: 20px; margin-right: 10px;" />';
                else html += '<i class="icon-signal" style="float: right; font-size: 20px; margin-right: 10px; color:#CECECE;" />';
			}
            if(info[i].probestate == 1)
			{
                html += '<i class="icon-link" style="float: right; font-size: 20px; margin-right: 10px;" />';
			}
            
			html += '<div style="height: 20px; float: left;">'+info[i].reports+' Report';
			if(info[i].reports != 1)
				html += 's';
			html += '</div>';
			html += '</div>';
			
			html += info[i].name;
			html += '<br/>';
			html += '<span>'+info[i].email+'</span>';
			html += '</div>';
			$("#connectMemberTable").append(html);
		}
		for(var k = info.length; k < 7; k++)
		{
			var html = '';
			var bg = 'bg1';
			if(k % 2 == 1)
				bg = 'bg2';
			html += '<div class="connectMemberRow connectMemberRow_'+bg+'"';
			if(k == 0)
				html += ' style="border-top-left-radius: 5px; border-top-right-radius: 5px; "';
			else if(k == 6)
				html += ' style="border-bottom-right-radius: 5px; border-bottom-left-radius: 5px;"';
			html += '>';
			html += '<div style="width: 30%; height: 20px; float: right; margin-top: 10px;">';
			html += '<div style="width: 70%; height: 20px; float: left;">';
			html += '</div>';
			html += '</div>';
			html += '<br/>';
			html += '<span></span>';
			html += '</div>';
			$("#connectMemberTable").append(html);
		}
	});
}

Stripe.setPublishableKey("pk_test_YBtrxG7xwZU9RO1VY8SeaEe9");
function stripeResponseHandler(status, response) 
{
	
	if (response.error) 
	{
		swal('Incorrect Credit Card Information', 'The credit card information is invalid.\n Please correct it and try again.', 'error');
	} 
	else 
	{
		//console.log("CHARGE CARD ID: " + response.id);
		$.post('member_invitation_checkout.php', {paid: true, IdMed: $("#MEDID").val(), IdUsu: connectMemberSelected, email: $("#connectMemberEmail").val(), phone: $("#connectMemberPhone").val(), stripe_token: response.id, probe: $("#connectMember_probe_protocols").val(), probe_time: $("#connectMember_probe_time").val(), probe_timezone: $("#connectMember_probe_timezone").val(), probe_method: $("#connectMember_probe_method").val(), probe_interval: $("#connectMember_probe_interval").val()}, function(data, status)
		{
			$("#connectMemberFinishCode").css("display", "block");
			$("#connectMemberFinishButton").attr("disabled", "disabled");
		});
	}
}

function stripeResponseHandler2(status, response) {
					var user_id = $("#probe_id_holder_for_purchase").val();
					
					if (response.error) 
					{
						$("#setup_modal_notification").css("background-color", "#D5483A");
						$("#setup_modal_notification").html("<p style=\"color: #fff;\">"+response.error.message+"</p>");
						$("#setup_modal_notification_container").animate({opacity: "1.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {
							setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: "0.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {}});}, 2000);
						}});
					} 
					else 
					{
						$("#setup_modal_notification").html("<img src=\"images/load/8.gif\" alt=\"\">");
						$("#setup_modal_notification").css("background-color", "#FFF");
						$("#setup_modal_notification_container").css("opacity", "1.0");
						console.log(user_id+response.id);
						$.post("change_credit_card.php", {type: "2", action: "1", id: user_id, token: response.id}, function(data, status)
						{
						swal("Credit Card Added!", "You have successfully added a credit card to this account.", "success")
							//console.log(data);
							$("#setup_modal_notification_container").css("opacity", "0.0");
							if(data == "1")
							{
								$("#setup_modal_notification").css("background-color", "#52D859");
								$("#setup_modal_notification").html("<p style=\"color: #fff;\">Credit Card Added!</p>");
								$("#setup_modal_notification_container").animate({opacity: "1.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {
									setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: "0.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {}});}, 2000);
								}});
								$.post("get_user_info.php", {id: user_id}, function(data, status)
								{
									var info = JSON.parse(data);
									if(info.hasOwnProperty("cards") && info["cards"].length > 0)
									{
										load_credit_cards(info["cards"]);
									}
								});
							}
							else
							{
								$("#setup_modal_notification").css("background-color", "#D5483A");
								$("#setup_modal_notification").html("<p style=\"color: #fff;\">Unable To Add Card</p>");
								$("#setup_modal_notification_container").animate({opacity: "1.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {
									setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: "0.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {}});}, 2000);
								}});
							}
						});
					}
				};

$(".connectMemberRow").live('click', function()
{
	if($(this).attr("id"))
	{
		var id = $(this).attr("id").split('_')[1];
		//console.log(id);
		connectMemberSelected = id;
		selected_patient = id;
		$("#probe_id_holder_for_purchase").val(id);
		
		$("#share_files_container").html('<iframe id="share_reports" src="share_reports.php?Usuario='+connectMemberSelected+'" style="border: 0px solid #FFF; width: 100%; height: 490px;" />');
		$("#connectMemberStep1").hide();
		$("#connectMemberStep2").show();
		if($("#probe_id_holder_for_purchase").val() != ''){
			var user_id = $("#probe_id_holder_for_purchase").val();
		}else{
			var user_id = connectMemberSelected;
		}
		$.post("get_user_info.php", {id: user_id}, function(data, status)
		{
			var info = JSON.parse(data);
			
			$("#connectMemberEmail").val(info['email']);
			$("#connectMemberPhone").val('+'+info['phone']);
			if(info.hasOwnProperty('cards') && info['cards'].length > 0)
			{
				load_credit_cards(info['cards']);
			}
			//$("#probe_id_holder_for_purchase").val('');
		});
		/*
		var ElementDOM ="All";
		var EntryTypegroup ="0";
		var Usuario = connectMemberSelected;
		var MedID = $("#MEDID").val();
		var queUrl ="createAttachmentStreamNEWTEST.php?ElementDOM=na&EntryTypegroup="+EntryTypegroup+"&Usuario="+Usuario+"&MedID="+MedID+"&display_member=yes";
		$.get(queUrl, function(data, status)
		{
			$("#share_files_container").html(data);
			$("#connectMemberStep1").hide();
			$("#connectMemberStep2").show();
		});*/
	}
	
});
$("#connectMemberAssignPaymentToPatient").on('click', function()
{
	if($(this).data('on') == 0)
	{
		$(this).data('on', 1);
		$("#connectMemberPayNow").data('on', 0);
		$("#connectMemberCardPayNow").data('on', 0);
		$(this).css('background-color', '#54BC00');
		$(this).css('border', '0px solid #FFF');
		$(this).css('color', '#FFF');
		$("#connectMemberPayNow").css('background-color', '#F8F8F8');
		$("#connectMemberPayNow").css('border', '1px solid #DDD');
		$("#connectMemberPayNow").css('color', '#555');
		$("#connectMemberPayNowSection").css('display', 'none');
		$("#connectMemberPayNowSectionCard").css('display', 'none');
		$("#connectMemberCardPayNow").css('background-color', '#F8F8F8');
		$("#connectMemberCardPayNow").css('border', '1px solid #DDD');
		$("#connectMemberCardPayNow").css('color', '#555');
		$("#probe-review-section").hide();
		
		if($("#connectMemberPayNow").data('on') == 0 && $("#connectMemberCardPayNow").data('on') == 0){
			var months = parseInt($("#connectMemberMonths").val());
			var charge_calc = (months * (parseInt($("#doc-tracking-price").val()) + 1000) / 100);
			$("#costCredits").text(charge_calc);
		}else{
			$("#costCredits").text(parseInt($("#connectMemberMonths").val()) * 10);
		}
	}
});
$("#connectMemberPayNow").on('click', function()
{
	if($(this).data('on') == 0)
	{
		$(this).data('on', 1);
		$("#connectMemberAssignPaymentToPatient").data('on', 0);
		$("#connectMemberCardPayNow").data('on', 0);
		$(this).css('background-color', '#54BC00');
		$(this).css('border', '0px solid #FFF');
		$(this).css('color', '#FFF');
		$("#connectMemberAssignPaymentToPatient").css('background-color', '#F8F8F8');
		$("#connectMemberAssignPaymentToPatient").css('border', '1px solid #DDD');
		$("#connectMemberAssignPaymentToPatient").css('color', '#555');
		$("#connectMemberPayNowSection").css('display', 'block');
		$("#connectMemberPayNowSectionCard").css('display', 'none');
		$("#connectMemberCardPayNow").css('background-color', '#F8F8F8');
		$("#connectMemberCardPayNow").css('border', '1px solid #DDD');
		$("#connectMemberCardPayNow").css('color', '#555');
		$("#probe-review-section").hide();
		
		if($("#connectMemberPayNow").data('on') == 0 && $("#connectMemberCardPayNow").data('on') == 1){
			var months = parseInt($("#connectMemberMonths").val());
			var charge_calc = (months * (parseInt($("#doc-tracking-price").val()) + 1000) / 100);
			$("#costCredits").text(charge_calc);
		}else{
			$("#costCredits").text(parseInt($("#connectMemberMonths").val()) * 10);
		}
	}
});
$("#connectMemberCardPayNow").on('click', function()
{
	if($(this).data('on') == 0)
	{
		$(this).data('on', 1);
		$("#connectMemberAssignPaymentToPatient").data('on', 0);
		$("#connectMemberPayNow").data('on', 0);
		$(this).css('background-color', '#54BC00');
		$(this).css('border', '0px solid #FFF');
		$(this).css('color', '#FFF');
		$("#connectMemberAssignPaymentToPatient").css('background-color', '#F8F8F8');
		$("#connectMemberAssignPaymentToPatient").css('border', '1px solid #DDD');
		$("#connectMemberAssignPaymentToPatient").css('color', '#555');
		$("#connectMemberPayNowSectionCard").css('display', 'block');
		$("#connectMemberPayNowSection").css('display', 'none');
		$("#connectMemberPayNow").css('background-color', '#F8F8F8');
		$("#connectMemberPayNow").css('border', '1px solid #DDD');
		$("#connectMemberPayNow").css('color', '#555');
		//$("#probe-review-section").show();
		
		if($("#connectMemberPayNow").data('on') == 0 && $("#connectMemberCardPayNow").data('on') == 1){
			var months = parseInt($("#connectMemberMonths").val());
			var charge_calc = (months * (parseInt($("#doc-tracking-price").val()) + 1000) / 100);
			$("#costCredits").text(charge_calc);
		}else{
			$("#costCredits").text(parseInt($("#connectMemberMonths").val()) * 10);
		}
	}
});
$(".CreateProbe").live('click',function() {
	setTimeout(function(){
		if(parseInt($(this).attr("id")) > 0){
			var user_id = parseInt($(this).attr("id"));
			$("#probe_id_holder_for_purchase").val(user_id);
		}else{
			var user_id = connectMemberSelected;
		}

		$.post("get_user_info.php", {id: user_id}, function(data, status)
						{
							var info = JSON.parse(data);
							$("#timezone_picker option[value=\"" + info["timezone"] + "\"]").attr("selected", "selected");
							if(info.hasOwnProperty("location") && info["location"].length > 0)
							{
								setTimeout(function(){
									//console.log(info["location"].trim());
									$("#country_setup").val(info["location"]);
									$("#country_setup").change();
								}, 800);
							}else{
								$("#credit_cards_container").html("<center>No credit cards on file for this member.</br>Please add a credit card to continue.</center>");
							}
							if(info.hasOwnProperty("location2") && info["location2"].length > 0)
							{
								setTimeout(function(){
									$("#state_setup").val(info["location2"]);
									$("#state_setup").change();
								}, 900);
							}
							if(info.hasOwnProperty("email") && info["email"].length > 0)
							{
								$("#setup_email").val(info["email"]);
							}
							if(info.hasOwnProperty("phone") && info["phone"].length > 0)
							{
								$("#setup_phone").val("+" + info["phone"]);
							}
							if(info.hasOwnProperty("cards") && info["cards"].length > 0)
							{
								load_credit_cards(info["cards"]);
							}
							//$("#probe_id_holder_for_purchase").val('');
		});
	}, 3000);
});

function add_credit_card2()
				{
					var date = $("#credit_card_exp_date").val().split("-");
					Stripe.card.createToken({
						number: $("#credit_card_number").val(),
						cvc: $("#credit_card_csv_code").val(),
						exp_month: date[1],
						exp_year: date[0]
					}, stripeResponseHandler2);
					
				}

$("#connectMemberSharePrevButton").on('click', function()
{
	$("#connectMemberStep2").hide();
	$("#connectMemberStep1").show();
});
$("#connectMemberShareNextButton").on('click', function()
{
	console.log('CONNECTING...');
	var iframeshared = $('iframe#share_reports').contents();
	iframeshared.find('button#save').trigger('click');
	//console.log('clicked but...?');
	var reportcheck=new Array();
	var reportids="";
	$("input[type=checkbox][id^=\"reportcol\"]").each(
		function () {
			var sThisVal = (this.checked ? "1" : "0");
			if(sThisVal==1)
			{
				var idp=$(this).parents("div.attachments").attr("id");
				reportcheck.push(this.id);
				reportids=reportids+idp+" ";
				console.log('reportids:'+reportids);
			}

console.log('HERE WE GO');

		});
		//$.post( "display_pin_for_member.php", { reports: reportids })
		//.done(function( data ) {
			//$.post( "hide_from_member.php", { reports: reportids_unchecked }).done(function( data ) {
			//swal("Reports Shared!", "You have successfully shared the selected reports with this member.", "success");
			$("#connectMemberStep2").hide();
			$("#connectMemberStep3").show();
			//});
		//});
		
		reportids="";
		reportcheck.length=0;
});
$("#connectMembersSearchBarButton").on('click', function()
{
	loadMembersToConnect($("#connectMembersSearchBar").val());
});
var connectMemberSubscribeButtonClicked = false;
$("#connectMemberSubscribeButton").on('click', function()
{
	if(!connectMemberSubscribeButtonClicked)
	{
		/*if($("#connectMember_probe_protocols").children().length == 0)
		{
			swal('No Probes', 'You have not created any probes.\nPlease create at least one probe in the\n configuration section to assign one to this member.', 'error');
		}
		else
		{
			connectMemberSubscribeButtonClicked = true;
			$(this).css('background-color', '#54BC00');
			$("#connectMembersProbeSection").css("display", "block");
		}*/
		connectMemberSubscribeButtonClicked = true;
		$(this).css('background-color', '#54BC00');
		$("#connectMembersProbeSection").css("display", "none");
		selected_patient = connectMemberSelected;
		$.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
		{
			var d = JSON.parse(data);
			var var_length = d['protocols'].length;
			probe_questions = d['questions'];
			$("#probe_protocols").html('');
			$("#probes_container").html('');
            
            $("#probe_protocols").html('<option value="0">N/A</option>');
            $("#probe_protocols").data('prev', 0);
            $("#probes_container").html('');
            $("#probe_protocols").data('prev', 1);
            $("#probe_protocols").append('<option value="1">General Health</option>');
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
			if(var_length == 0)
			{
				$("#probe_protocols").append('<option value="-1">No probes defined.  Please add a probe below.</option>');
				var html = '<div class="no_probes_notification">';
				html += 'You do not have any probes defined.<br/>To add probes, click the "+" button bellow.';
				html += '</div>';
				$("#probes_container").append(html);
			}
			probe_dialog.dialog('open');
			$.post("get_probe.php", {doctor: $("#MEDID").val(), patient: connectMemberSelected}, function(data, status)
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
		
	}
	else
	{
		connectMemberSubscribeButtonClicked = false;
		$(this).css('background-color', '#FFF');
		$("#connectMembersProbeSection").css("display", "none");
	}
});
$("#connectMember_edit_probes").on('click', function()
{
	selected_patient = connectMemberSelected;
	$.post("get_probe_protocols.php", {doctor: $("#MEDID").val()}, function(data, status)
	{
		var d = JSON.parse(data);
		var var_length = d['protocols'].length;
		probe_questions = d['questions'];
		$("#probe_protocols").html('');
		$("#probes_container").html('');
        
        $("#probe_protocols").html('<option value="0">N/A</option>');
        $("#probe_protocols").data('prev', 0);
        $("#probes_container").html('');
        $("#probe_protocols").data('prev', 1);
        $("#probe_protocols").append('<option value="1">General Health</option>');
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
		if(var_length == 0)
		{
			$("#probe_protocols").append('<option value="-1">No probes defined.  Please add a probe below.</option>');
			var html = '<div class="no_probes_notification">';
			html += 'You do not have any probes defined.<br/>To add probes, click the "+" button bellow.';
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

$("#connectMemberCheckoutPrevButton").on('click', function() {
	$("#connectMemberStep3").hide();
	$("#connectMemberStep2").show();
});

function load_credit_cards(cards)
{
	$("#credit_cards_container").html("");
	for(var i = 0; i < cards.length; i++)
	{
		var html = "";
		var stripe_holder = cards[i]["stripe_id"];
		stripe_holder = JSON.stringify(stripe_holder).replace(/&/, "&amp;").replace(/"/g, "&quot;");
		var cc_spot_holder = cards[i]["number"];
		cc_spot_holder = JSON.stringify(cc_spot_holder).replace(/&/, "&amp;").replace(/"/g, "&quot;");
		var cc_icon = cards[i]["icon"];
		cc_icon = JSON.stringify(cc_icon).replace(/&/, "&amp;").replace(/"/g, "&quot;");
		html += "<div onclick=\"select_card("+stripe_holder+", "+cc_spot_holder+", "+cc_icon+");\" class=\"credit_card_row\"";
		if(i == 0 && i == cards.length - 1)
		{
			html += " style=\"border-radius: 10px;\"";
		}
		else if(i == 0)
		{
			html += " style=\"border-top-left-radius: 10px; border-top-right-radius: 10px;\"";
		}
		else if(i == cards.length - 1)
		{
			html += " style=\"border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;\"";
		}
		html += ">";
		html += "</button>"
		html += "<img src=\""+cards[i]["icon"]+"\" style=\"float: left; margin-left: 10px; height: 38px;\" />";
		html += "<span style=\"float: left; color: #5A5A5A; font-size: 14px; margin-left: 60px; margin-top: 8px;\">****   ****   ****   "+cards[i]["number"]+"</span>";
		html += "</div>";
		$("#credit_cards_container").append(html);
	}
	$('button[id^="clear-credit-card"]').on('click', function()
	{
		if($("#probe_id_holder_for_purchase").val() != ''){
			var user_id = $("#probe_id_holder_for_purchase").val();
		}else{
			var user_id = $('#USERID').val();
		}
		var card_id = $(this).attr("id").split("-")[3];
		$("#setup_modal_notification").html('<img src="images/load/8.gif" alt="">');
		$("#setup_modal_notification").css("background-color", "#FFF");
		$("#setup_modal_notification_container").css("opacity", "1.0");
		$.post("change_credit_card.php", {type: '2', action: '2', id: $("#USERID").val(), card_id: card_id}, function(data, status)
		{
			////console.log(data);
			$("#setup_modal_notification_container").css("opacity", "0.0");
			if(data == '1')
			{
				$("#setup_modal_notification").css("background-color", "#52D859");
				$("#setup_modal_notification").html('<p style="color: #fff;">Credit Card Removed!</p>');
				$("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
					setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
				}});
				$.post("get_user_info.php", {id: user_id}, function(data, status)
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
		//$("#probe_id_holder_for_purchase").val('');
	});
}

function select_card(stripe_id, cc_num, cc_icon){
	$("#stripe-id-holder").val(stripe_id);
	$("#review-cc-number").html("<span style=\"color: white; font-size: 12px;\">You have selected </span><img src=\""+cc_icon+"\" style=\"height: 38px;\" /><span style=\"color: white; font-size: 12px;\"> card ending in "+cc_num+".</span>");
	$(".probe_cc_section").hide();
	$("#probe-review-section").show();
	$("#payment-review-section").show();
	swal("Credit Card Selected!", ("You have selected card ending in ("+cc_num+")."), "success");
	$("#payment-type").val(0);
}

function change_cards(){
	$(".probe_cc_section").show();
	$("#probe-review-section").hide();
	$("#stripe-id-holder").val("");
	$("#payment-review-section").hide();
	$("#credits-review-section").hide();
	$("#drcredits-review-section").hide();
	$("#check-out-button-final").removeAttr("disabled");
}

function purchaseHealthies()
{
	var healthies = $("#calc-purchase-healthies").val();
	var total = "$"+(healthies * .5)+".00";
	if(healthies % 2 == 1){
		total = "$"+(healthies * .5)+"0";
	}
	swal({   title: "Purchase Healthies?",   text: ("Are you sure you would like to purchase "+healthies+" healthies? \n Cost: "+total+""),   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, purchase healthies!",   closeOnConfirm: false }, 
	function(){   
		swal("Purchased!", ("You have successfully purchased "+healthies+" healthies."), "success");
		$.post("purchaseCredits.php", {doctor: $("#MEDID").val(), quantity: healthies}).done(function(data, status)
		{
			var old_count = $("#doctor-healthies-count").val();
			var healthies_remaining = $("#doctor-remaining-healthies-count").val();
			var count = parseInt(old_count)+parseInt(healthies);
			var update_remaining = parseInt(healthies_remaining) + parseInt(healthies);
			$("#doctor-healthies-count").val(count);
			$("#display-doctor-healthies").text(count);
			$("#display-healthies-remaining").text(update_remaining);
			$("#doctor-remaining-healthies-count").val(update_remaining);
			if(update_remaining < 0){
				$("#display-healthies-remaining").css("color", "red");
			}else{
				$("#display-healthies-remaining").css("color", "black");
			}
		}).error(function(){
				swal("The charge was rejected!");
		});	

	});
}

function stripeBuyTokensResponseHandler(status, response) 
{
	
	if (response.error) 
	{
		swal('Incorrect Credit Card Information', 'The credit card information is invalid.\n Please correct it and try again.', 'error');
		$("#creditsLoadingBar").css("display", "none");
		$("#creditsLabel").css("display", "block");
	} 
	else 
	{
        var credits =  $("#connectMemberNumCredits").val();
		$.post("purchaseCredits.php", {doctor: $("#MEDID").val(), quantity: credits, token: response.id}).done(function(data, status)
		{
            swal("Purchased!", ("You have successfully purchased $"+credits+" Credits."), "success");
			$("#numDoctorCredits").text((data / 100));
			$("#creditsLoadingBar").css("display", "none");
			$("#creditsLabel").css("display", "block");
			
			$("#connectMemberNumCredits").val('');
			$("#connectMemberCreditCard").val('');
			$("#connectMemberExpDate").val('');
			$("#connectMemberCVC").val('');
		}).error(function(){
			swal("Rejected", "The charge was rejected!", "error");
			$("#creditsLoadingBar").css("display", "none");
			$("#creditsLabel").css("display", "block");
		});
	}
}
function stripeBuyDocCardTokensResponseHandler(status, response) 
{
	var months = parseInt($("#connectMemberMonths").val());
	var charge_calc = months * (parseInt($("#doc-tracking-price").val()) + 1000);
	var total = "$"+(months * ((parseInt($("#doc-tracking-price").val()) + 1000) / 100))+".00";
	var user_id = $("#probe_id_holder_for_purchase").val();
	
	if (response.error) 
	{
		swal('Incorrect Credit Card Information', 'The credit card information is invalid.\n Please correct it and try again.', 'error');
		$("#creditsLoadingBar").css("display", "none");
		$("#creditsLabel").css("display", "block");
	} 
	else 
	{
		$.post("memberCardPurchase.php", {user_id: user_id, doc_id: $("#MEDID").val(), quantity: charge_calc, months:months, token:response.id}).done( function(data, status)
			{
				$.post("member_invitation_checkout.php", {paid: true, send: true, IdMed: $("#MEDID").val(), IdUsu: user_id, email: $("#connectMemberEmail").val(), phone: $("#connectMemberPhone").val(), end_date: months}, function(data, status)
				{
					//console.log($("#MEDID").val()+'userid:'+user_id+$("#connectMemberEmail").val()+$("#connectMemberPhone").val()+months);
				});
				$("#checkout-window").dialog("close");
				setTimeout(function(){
				swal({title:"Probe Purchased", 
				text:"The probe has been successfully purchased for this member.", 
				type:"success", 
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "Okay",   
				closeOnConfirm: true},
				function(){
				connectMemberDialog.dialog('close');
				});
			});
			}).error(function(data){
				swal("The charge was rejected!");
			});
	}
}
$("#connectMemberPurchaseTokensButton").on('click', function()
{
	var total = "$"+($("#connectMemberNumCredits").val())+".00";

	swal({   title: "Purchase Credits",   text: ("Are you sure you would like to purchase "+$("#connectMemberNumCredits").val()+" credits? \n Cost: "+total+""),   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, purchase credits!",   closeOnConfirm: true }, function()
	{
		$("#creditsLoadingBar").css("display", "block");
		$("#creditsLabel").css("display", "none");
		var date = $('#connectMemberExpDate').val().split("-");
		Stripe.card.createToken({
			number: $('#connectMemberCreditCard').val(),
			cvc: $('#connectMemberCVC').val(),
			exp_month: date[1],
			exp_year: date[0]
		}, stripeBuyTokensResponseHandler);
	});
		
});
$("#connectMemberMonths").on('change', function()
{
	if($("#connectMemberAssignPaymentToPatient").data('on') == 1 || $("#connectMemberCardPayNow").data('on') == 1){
		var months = parseInt($("#connectMemberMonths").val());
		var charge_calc = (months * (parseInt($("#doc-tracking-price").val()) + 1000) / 100);
		$("#costCredits").text(charge_calc);
	}else{
		$("#costCredits").text(parseInt($(this).val()) * 10);
	}
});
$("#connectMemberCheckoutButton").on('click', function()
{
	if($("#connectMemberEmail").val().length == 0)
	{
		swal('No Email', 'Please enter the Email of the member.', 'error');
	}
	else if($("#connectMemberPhone").val().length == 0)
	{
		swal('No Phone', 'Please enter the Phone of the member.', 'error');
	}
	else if(!$("#connectMemberPhone").intlTelInput("isValidNumber"))
	{
		swal('Incorrect Phone', 'This phone number is not correct.\nPlease try again.', 'error');
	}
	/*else if($("#connectMember_probe_time").val().length == 0 && connectMemberSubscribeButtonClicked)
	{
		swal('No Probe Time', 'Please specify a time for the probe to be sent.', 'error');
	}*/
	else
	{
		$.post('validate_email.php', {email: $("#connectMemberEmail").val(), type: 0, IdUsu: connectMemberSelected}, function(data, status)
		{
			var res = parseInt(data);
			if(res == 2)
			{
				swal('Incorrect Email', 'This email is not correct.\nPlease try again.', 'error');
			}
			else if(res == 0)
			{
				swal('Duplicate Email', 'Another user is already using this email.\n Please pick another email and try again.', 'error');
			}
			else
			{


				//var myClass = id;
				
				/*var checkout_window = $("#checkout-window").dialog({bigframe: true, width: 1050, height: 650, resize: false, modal: true, autoOpen: false});
				var med_id = $("#MEDID").val();
				var probe_id = $('#connectMember_probe_protocols').val();
				var probe_text = $('#connectMember_probe_protocols').text();
				var probe_time = $('#connectMember_probe_time').val();
				var probe_time_text = $('#connectMember_probe_time').text();
				var probe_timezone = $('#connectMember_probe_timezone').val();
				var probe_timezone_text = $('#connectMember_probe_timezone').text();
				var probe_method = $('#connectMember_probe_method').val();
				var probe_method_text = $('#connectMember_probe_method').text();
				var probe_interval = $('#connectMember_probe_interval').val();
				var probe_interval_text = $('#connectMember_probe_interval').text();
				var mem_email = $("#connectMemberEmail").val();
				var mem_phone = $("#connectMemberPhone").val();
				$("#checkout-window").html('<iframe src="checkoutClassUnit.php?member_email='+mem_email+'&member_phone='+mem_phone+'&user_id='+connectMemberSelected+'&med_id='+med_id+'&probe_id='+probe_id+'&probe_text='+probe_text+'&probe_time='+probe_time+'&probe_time_text='+probe_time_text+'&probe_timezone='+probe_timezone+'&probe_timezone_text='+probe_timezone_text+'&probe_method='+probe_method+'&probe_method_text='+probe_method_text+'&probe_interval='+probe_interval+'&probe_interval_text='+probe_interval_text+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
				checkout_window.dialog('open');*/
					
				if(connectMemberSubscribeButtonClicked)
				{
					// credit card page
					//console.log('credit card page');
					$("#connectMemberStep3").css("display", "none");
					$("#connectMemberStep4").css("display", "block");
				}
				else
				{
					// final page
					//console.log('final page');
					$.post('member_invitation_checkout.php', {IdMed: $("#MEDID").val(), IdUsu: connectMemberSelected, email: $("#connectMemberEmail").val(), phone: $("#connectMemberPhone").val()}, function(data, status)
					{
						connectMemberDialog.dialog("close");
						swal({title:"Patient Connected", 
						text:"This member has been connected successfully.", 
						type:"success", 
						confirmButtonColor: "#DD6B55",   
						confirmButtonText: "Okay",   
						closeOnConfirm: true},
						function(){
							;
						});
					});
					
					$.get('checkoutClassUnit.php', {med_id: $("#MEDID").val(), user_id: connectMemberSelected, ajax:"yes"}, function(data, status)
					{
					});
					
				}


			}
		});
		
	}
});
$("#connectMemberPatientPayButton").on('click', function()
{
	$.post("member_invitation_checkout.php", {paid: true, IdMed: $("#MEDID").val(), IdUsu: connectMemberSelected, email: $("#connectedMemberEmail").val(), phone: $("#connectedMemberPhone").val(), probe: $("#connectedMember_probe_protocols").val(), probe_time: $("#connectedMember_probe_time").val(), probe_timezone: $("#connectedMember_probe_timezone").val(), probe_method: $("#connectedMember_probe_method").val(), probe_interval: $("#connectedMember_probe_interval").val(), end_date: $("#connectMemberMonths").val(), send: 1}, function(data, status)
	{
		connectMemberDialog.dialog("close");
		swal({title:"Probe Created", 
		text:"The probe has been created and put on hold.\n We will notify the patient to activate the probe.", 
		type:"success", 
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Okay",   
		closeOnConfirm: true},
		function(){
			;
		});
	});
});
$("#purchaseMoreCreditsButton").on('click', function()
{
	if($(this).data('on') == 0)
	{
		$(this).data('on', 1);
		$("#connectMemberPurchaseCredits").slideDown();
		$(this).html('Purchase More Credits <i class="icon-caret-up"></i>');
	}
	else
	{
		$(this).data('on', 0);
		$("#connectMemberPurchaseCredits").slideUp();
		$(this).html('Purchase More Credits <i class="icon-caret-down"></i>');
	}
});
$("#connectMemberFinishButton").on('click', function()
{
	$("#connectMemberFinishButton").attr("disabled",true);
	$("#connectMemberFinishButton").css("background-color","#cacaca");
	if($("#connectMemberPayNow").data('on') == 0 && $("#connectMemberCardPayNow").data('on') == 0)
	{
		$.post("member_invitation_checkout.php", {paid: true, IdMed: $("#MEDID").val(), IdUsu: connectMemberSelected, email: $("#connectMemberEmail").val(), phone: $("#connectMemberPhone").val(), end_date: $("#connectMemberMonths").val()}, function(data, status)
		{
			connectMemberDialog.dialog("close");
			swal({title:"Probe Created", 
			text:"The probe has been created and put on hold.\n We will notify the patient to activate the probe.", 
			type:"success", 
			confirmButtonColor: "#DD6B55",   
			confirmButtonText: "Okay",   
			closeOnConfirm: true},
			function(){
				connectMemberDialog.dialog('close');
			});
		});
	}
	else if($("#connectMemberPayNow").data('on') == 0 && $("#connectMemberCardPayNow").data('on') == 1){
		var months = parseInt($("#connectMemberMonths").val());
		var charge_calc = months * (parseInt($("#doc-tracking-price").val()) + 1000);
		var total = "$"+(months * ((parseInt($("#doc-tracking-price").val()) + 1000) / 100))+".00";
		var user_id = $("#probe_id_holder_for_purchase").val();
		//console.log(user_id+$("#MEDID").val()+charge_calc+months+$("#doc-tracking-price").val());
		
			var total = "$"+($("#connectMemberNumCredits").val())+".00";

	swal({   title: "Purchase Probe",   text: ("Are you sure you would like to purchase this probe?"),   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, purchase probe!",   closeOnConfirm: true }, function()
	{
		//$("#creditsLoadingBar").css("display", "block");
		//$("#creditsLabel").css("display", "none");
		var date = $('#credit_card_exp_date').val().split("-");
		Stripe.card.createToken({
			number: $('#credit_card_number').val(),
			cvc: $('#credit_card_csv_code').val(),
			exp_month: date[1],
			exp_year: date[0]
		}, stripeBuyDocCardTokensResponseHandler);
		
	});
		
		
		/*$.post("memberCardPurchase.php", {user_id: user_id, doc_id: $("#MEDID").val(), quantity: charge_calc, months:months}).done( function(data, status)
			{
				$.post("member_invitation_checkout.php", {paid: true, send: true, IdMed: $("#MEDID").val(), IdUsu: user_id, email: $("#connectMemberEmail").val(), phone: $("#connectMemberPhone").val(), end_date: months}, function(data, status)
				{
				});
				$("#checkout-window").dialog("close");
				setTimeout(function(){
				swal({title:"Probe Purchased", 
				text:"The probe has been successfully purchased for this member.", 
				type:"success", 
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "Okay",   
				closeOnConfirm: true},
				function(){
				connectMemberDialog.dialog('close');	
				}); }, 500);
			}).error(function(data){
				swal("The charge was rejected!");
			});*/
	}else{
		swal({   title: "Finish",   text: ("You account will be charged "+($("#connectMemberMonths").val() * 10)+" credits for this probe subscription. Do you wish to continue?"),   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, finish!",   closeOnConfirm: true }, function()
		{
			$.post("spendDoctorHealthies.php", {user_id: connectMemberSelected, doc_id: $("#MEDID").val(), quantity: (parseInt($("#connectMemberMonths").val()) * 10), months: (parseInt($("#connectMemberMonths").val()))}).done( function(data, status)
			{
				var res = parseInt(data);
				//console.log(res);
				if(res != 0)
				{
					$.post("member_invitation_checkout.php", {paid: true, send: true, IdMed: $("#MEDID").val(), IdUsu: connectMemberSelected, email: $("#connectMemberEmail").val(), phone: $("#connectMemberPhone").val(), end_date: $("#connectMemberMonths").val()}, function(data, status)
					{
						connectMemberDialog.dialog("close");
						swal({title:"Probe Purchased", 
						text:"The probe has been successfully purchased for this member.", 
						type:"success", 
						confirmButtonColor: "#DD6B55",   
						confirmButtonText: "Okay",   
						closeOnConfirm: true},
						function(){
							connectMemberDialog.dialog('close');
						});
					});
				}
				else
				{
					setTimeout(function()
					{
						swal("Not Enough Credits", "You do not have enough credits to buy this probe.\n Please buy more credits and try again.", "error");
					}, 200);
				}

			}).error(function(data){
				swal("The charge was rejected!");
			});
		});
	}
	$("#connectMemberFinishButton").css("background-color","#54BC00");
	$("#connectMemberFinishButton").removeAttr("disabled");
});
                                                              

