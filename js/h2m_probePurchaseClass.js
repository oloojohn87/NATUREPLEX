console.log('h2m_purchaseProbeClass');
var mem_id = $("#USERID").val();
var med_id = $("#probe_medid_pass").val();
var base_price = $("#probe_medid_base_price").val();
var probe_protocol = $("#probe_protocols_pass").val();
var probe_time = $("#probe_time_pass").val();
var probe_timezone = $("#probe_timezone_pass").val();
var probe_method = $("#probe_method_pass").val();
var probe_interval = $("#probe_interval_pass").val();
var probe_name = $("#probe_name_pass").val();
var member_email = $("#member_email_pass").val();
var member_phone = $("#member_phone_pass").val();
var member_fullname = $("#member_name_pass").val();
var months = $("#probe_months_pass").val();

var probe_cc_section = $(".probe_cc_section").dialog({bgiframe: true, height: 350, width: 700, modal: true, autoOpen:false});

function purchaseProbe(){
	//console.log(this.getAttribute('id'));
	//if(true){
	//	var str = this.id;
	//	var res = str.split( '_' );
		
	//	alert('hello'+res[0]);
	
	//	probe_cc_section.dialog('open');
	//}else{
		probe_cc_section.dialog('open');
	//	console.log('else');
	//}
}

function add_credit_card2()
{
	var date = $("#credit_card_exp_date2").val().split("-");
	Stripe.card.createToken({
		number: $("#credit_card_number2").val(),
		cvc: $("#credit_card_csv_code2").val(),
		exp_month: date[1],
		exp_year: date[0]
	}, stripeResponseHandler);
					
}

function stripeResponseHandler(status, response) {
        
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
						$.post("change_credit_card.php", {type: "2", action: "1", id: mem_id, token: response.id}, function(data, status)
						{
						swal("Credit Card Added!", ("You have successfully added a credit card to "+member_fullname+"\s account."), "success")
							//console.log(data);
							$("#setup_modal_notification_container").css("opacity", "0.0");
							if(data == "1")
							{
								$("#setup_modal_notification").css("background-color", "#52D859");
								$("#setup_modal_notification").html("<p style=\"color: #fff;\">Credit Card Added!</p>");
								$("#setup_modal_notification_container").animate({opacity: "1.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {
									setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: "0.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {}});}, 2000);
								}});
								$.post("get_user_info.php", {id: mem_id}, function(data, status)
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
$("#credit_cards_container2").html("<center>No credit cards on file for member "+member_fullname+".</br>Please add a credit card to continue.</center>");
$.post("get_user_info.php", {id: mem_id}, function(data, status)
{
	var info = JSON.parse(data);
	console.log(info["cards"]);
	$("#timezone_picker option[value=\"" + info["timezone"] + "\"]").attr("selected", "selected");
	if(info.hasOwnProperty("location") && info["location"].length > 0)
	{
		setTimeout(function(){
			//console.log(info["location"].trim());
			$("#country_setup").val(info["location"]);
			$("#country_setup").change();
		}, 800);
	}else{
		$("#credit_cards_container").html("<center>No credit cards on file for member "+member_fullname+".</br>Please add a credit card to continue.</center>");
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
});

function change_cards(){
	$(".probe_cc_section").show();
	$("#card-hider").show();
	$("#probe-review-section").hide();
	$("#stripe-id-holder").val("");
	$("#payment-review-section").hide();
	$("#healthies-review-section").hide();
	$("#drhealthies-review-section").hide();
	$("#check-out-button-final").removeAttr("disabled");
}

function check_out_button(){
	
		var charge_calc = parseInt(months) * (parseInt(base_price) + 1000);
		var total = "$"+((parseInt(months) * (parseInt(base_price) + 1000)) / 100)+".00";

			var probe_name = $("#probe_protocols_pass").text();
			var probe_time_display = probe_time;
		
						
		var time = "";
		if(probe_interval == 1){
			time = "Daily";
		}else if(probe_interval == 7){
			time = "Weekly";
		}else if(probe_interval == 30){
			time = "Monthly";
		}else if(probe_interval == 365){
			time = "Yearly";
		}
		
		var method = "";
		if(probe_method == 1){
			method = "Text Message";
		}else if(probe_method == 2){
			method = "Phone Call";
		}else{
			method = "Email";
		}
		
		var timezone= "";
		if(probe_timezone == 1){
			timezone = "US Eastern Time";
		}else if(probe_timezone == 2){
			timezone = "US Central Time";
		}else if(probe_timezone == 3){
			timezone = "US Pacific Time";
		}else if(probe_timezone == 4){
			timezone = "US Mountain Time";
		}else if(probe_timezone == 5){
			timezone = "Europe Central Time";
		}else if(probe_timezone == 6){
			timezone = "Greenwich Mean Time";
		}
			
						
						
						
		swal({   
		title: "Checking out member "+member_fullname+"!",   
		text: ("To summarize... \n Member: "+member_fullname+" \n Email: "+member_email+" \n Phone: "+member_phone+" \n Will be charged a total: "+total+" \n\n Probe: "+probe_name+" \n For "+months+" Months \n At: "+probe_time_display+" \n Timezone: "+timezone+" \n Contact: By "+method+" \n Interval: "+time+""),   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, complete checkout!",   closeOnConfirm: true }, 
		function(){ 
			$.post("memberCardPurchase.php", {user_id: mem_id, doc_id: med_id, quantity: charge_calc, months: months}).done( function(data, status)
			{
				$.post("member_invitation_checkout.php", {paid: true, send: true, IdMed: med_id, IdUsu: mem_id, email: member_email, phone: member_phone, probe: probe_protocol, probe_time: probe_time_display, probe_timezone: probe_timezone, probe_method: probe_method, probe_interval: probe_interval, end_date: months, send_doctor_message: true}, function(data, status)
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
					
					setTimeout(function(){
						window.location.replace('UserDashboard.php');
					}, 1000);
					
				}); }, 500);
			}).error(function(data){
				swal("The charge was rejected!");
			});
		});
}
				

function select_card(stripe_id, cc_num, cc_icon){
	$("#stripe-id-holder").val(stripe_id);
	$("#review-cc-number").html("<span style=\"color: white; font-size: 12px;\">You have selected </span><img src=\""+cc_icon+"\" style=\"height: 38px;\" /><span style=\"color: white; font-size: 12px;\"> card ending in "+cc_num+".</span>");
	$("#card-hider").hide();
	$("#probe-review-section").show();
	$("#payment-review-section").show();
	swal("Credit Card Selected!", ("You have selected card ending in ("+cc_num+")."), "success");
	$("#payment-type").val(0);
}

//Stripe.setPublishableKey("pk_test_YBtrxG7xwZU9RO1VY8SeaEe9");
function load_credit_cards(cards)
{
	$("#credit_cards_container2").html("");
	for(var i = 0; i < cards.length; i++)
	{
		var html = "";
		var stripe_holder = cards[i]["stripe_id"];
		stripe_holder = JSON.stringify(stripe_holder).replace(/&/, "&amp;").replace(/"/g, "&quot;");
		var cc_spot_holder = cards[i]["number"];
		cc_spot_holder = JSON.stringify(cc_spot_holder).replace(/&/, "&amp;").replace(/"/g, "&quot;");
		var cc_icon = cards[i]["icon"];
		console.log(stripe_holder);
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
		html += "<img src=\""+cards[i]["icon"]+"\" style=\"float: left; margin-left: 175px; height: 38px;\" />";
		html += "<span style=\"float: left; color: #5A5A5A; font-size: 14px; margin-left: 60px; margin-top: 8px;\">****   ****   ****   "+cards[i]["number"]+"</span>";
		html += "</div>";
		$("#credit_cards_container2").append(html);
	}
	$("button[id^=\"clear-credit-card\"]").on("click", function()
	{
		var card_id = $(this).attr("id").split("-")[3];
		$("#setup_modal_notification").html("<img src=\"images/load/8.gif\" alt=\"\">");
		$("#setup_modal_notification").css("background-color", "#FFF");
		$("#setup_modal_notification_container").css("opacity", "1.0");
		$.post("change_credit_card.php", {type: "2", action: "2", id: mem_id, card_id: card_id}, function(data, status)
		{
			//console.log(data);
			$("#setup_modal_notification_container").css("opacity", "0.0");
			if(data == "1")
			{
				$("#setup_modal_notification").css("background-color", "#52D859");
				$("#setup_modal_notification").html("<p style=\"color: #fff;\">Credit Card Removed!</p>");
				$("#setup_modal_notification_container").animate({opacity: "1.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {
					setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: "0.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {}});}, 2000);
				}});
				$.post("get_user_info.php", {id: '.$this->user_id.'}, function(data, status)
				{
					var info = JSON.parse(data);
					if(info.hasOwnProperty("cards") && info["cards"].length > 0)
					{
						load_credit_cards(info["cards"]);
					}
				});
			}
			else if(data.substr(0, 2) == "IC")
			{
				alert("You are currently in a consultation, please wait until the consultation is over to delete credit cards.");
			}
			else
			{
				$("#setup_modal_notification").css("background-color", "#D5483A");
				$("#setup_modal_notification").html("<p style=\"color: #fff;\">Unable To Remove Card</p>");
				$("#setup_modal_notification_container").animate({opacity: "1.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {
					setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: "0.0"}, {duration: 1000, easing: "easeInOutQuad", complete: function() {}});}, 2000);
				}});
			}
		});
	});
}
