var med_id = $("#MEDID").val();
var group_id = $("#GROUPID").val();
var consultation_date = $("#CONSULTATION_DATE").val();
var VPatType = 0;
var VPatAle = 0;
var VPatId = 0;
var VPatName = '';
var VPatTime = '';

var AnimSelected = 0;

$(document).ready(function() 
{
    if(group_id == '2') $('#ButtonDeck').css('display','block');
    
    function getScript(url)
    {
        $.ajax(
        {
            url: url,
            dataType: "script",
            async: false
        });
    }
    
    /*
    $.get("jquery-lang-js-master/js/langpack/th.json", function(data, status)
    {
        var es_json = data;
        $('*[lang^="en"]').each(function()
        {
            if(es_json.token.hasOwnProperty($(this).text()))
            {
                $(this).text(es_json.token[$(this).text()]);
                console.log("TRANSLATE: " + $(this).text());
            }
        });
    });*/
    
    
	// initial js code
	$(window).load(function() {
		$(".loader_spinner").fadeOut("slow");
        $('#Wait1').hide();  // hide it initially
	});
	
    
      var cookieValue = $.cookie("health2me");
        
        if (cookieValue == "H2M116131") {
            
           $("#notification_bar").html("");
        
        }else{
            
            document.cookie="health2me=H2M116131";
            $("#notification_bar").html('<div style="position: fixed;text-align:center;width: 100%; height: 44px; color: white; z-index: 2; background-color: rgb(119, 190, 247);"><div id="notification_bar_msg" style="display:inline-block;margin-right:20px;height:40px;vertical-align: middle;">We use cookies to improve your experience. By your continued use of this site you accept such use. </div><div id="notification_bar_close" style="display:inline-block;margin-top: 2px;margin-left:40px"><i class="icon-remove-circle icon-3x"></i></div></div>');
            $("#notification_bar").slideDown("fast");
            
        }
        
        $("#notification_bar_close").on('click', function()
        { 
        
            
        $("#notification_bar").slideUp("fast");
        
        
        });
    
    
	var Privilege = $("#Privilege").val();

	/*var timeoutTime = 18000000;
	var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);*/

	var toggleRead = 1;


	var active_session_timer = 60000; //1minute
	var sessionTimer = setTimeout(inform_about_session, active_session_timer);

	//This function is called at regular intervals and it updates ongoing_sessions lastseen time
	function inform_about_session()
	{
		$.ajax({
			url: '/ongoing_sessions.php?userid='+med_id,
			success: function(data){
			//alert('done');
			}
		});
		clearTimeout(sessionTimer);
		sessionTimer = setTimeout(inform_about_session, active_session_timer);
	}

	/*function ShowTimeOutWarning()
	{
		alert ('Session expired');
		var a=0;
		window.location = 'timeout.php';
	}*/
    
    

	var compA;
	var compB;
	var compC;
	var compD;
	var compE;
	AdobeEdge.bootstrapCallback(function(compId) {
		compA = AdobeEdge.getComposition("EDGE-43").getStage();
		compB = AdobeEdge.getComposition("EDGE-44").getStage();
		compC = AdobeEdge.getComposition("EDGE-45").getStage();
		compD = AdobeEdge.getComposition("EDGE-46").getStage();
		compE = AdobeEdge.getComposition("EDGE-47").getStage();
	});

	function vc_stop(animNumber){
		switch(animNumber)
			{
				case 1: compA.stop();
						  break;	
				case 2: compB.stop();
						  break;	
				case 3: compC.stop();
						  break;	
				case 4: compD.stop();
						  break;	
				case 5: compE.stop();
						  break;	
		
			}
	}
	function vc_play(animNumber){
		switch(animNumber)
			{
				case 1: compA.play(0);
						  break;	
				case 2: compB.play(0);
						  break;	
				case 3: compC.play(0);
						  break;	
				case 4: compD.play(0);
						  break;	
				case 5: compE.play(0);
						  break;	
		
			}
	}

	function CheckTray()
	{
		var queMED = $("#MEDID").val();
	
		var url = 'CheckTray.php?doctor_id='+queMED;
		var cadenaGUD = url;
		$.ajax(
			   {
			   url: cadenaGUD,
			   dataType: "json",
			   async: false,
			   success: function(data)
			   {
			   //alert ('success');
			   tray = data.items;
			   }
			   });

		Pa = tray.length;
   
		if (Pa > 0)
		{
			RecTipo = tray[0].TimeDif;
			if ((RecTipo/60) < 4300) //That's 3 days
			{
				SubText = tray[0].SubText;
				MainText = tray[0].MainText;
				IconText = tray[0].IconText;
				MColor = tray[0].MColor;
				MLink = tray[0].MLink;
				newcolor = '#'.MColor;
				newlink = 'patientdetailMED-new.php?IdUsu='+MLink;
				newicon = '<i class="'+IconText+' icon-2x"></i>';
				newmaintext = '<span id="" style="text-decoration:none;">'+MainText+'</span></a>';

			
				$('#SubText1').html(SubText);
				$('#MainText1').html(newmaintext);
				$('#IconText1').html(newicon);
				$('#Notif1').css('color',newcolor);
				$('#Notif1').attr('href',newlink);
				$('#MainText1').attr('href',newlink);

				SendTray(1);			
			}
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
			complete: function(){},
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

	function SendTray(order)
	{
		var audio = document.getElementsByTagName("audio")[0];
		audio.play();
	
		var n=0;
		function loop() {
			$('.H2MInText').css({opacity: 1.0});
			$('.H2MInText').animate({opacity: 0.2}, 400, function() {
				if (n<10)
					{
						loop();
						n++;
					}
				else
					{
						var audio = document.getElementsByTagName("audio")[0];
						audio.play();
						$('.H2MInText').css({opacity: 1.0});
						$(".H2MTSCont").animate({ scrollLeft: 300}, 1475);
					}	
			});
		}
		loop();
	};

	function urlExists(testUrl) {
		 var http = jQuery.ajax({
			type:"HEAD",
			url: testUrl,
			async: false
		  })
		  return http.status;
			  // this will return 200 on success, and 0 or negative value on error
	};


	function BeauStr (EString)
	{
		var FirstChar = EString.substring(0,1).toUpperCase();
		var ELen = EString.length;
		var RemainChar = EString.substring(1, ELen).toLowerCase();
		var MExit = FirstChar + RemainChar;
		return MExit;
	}

	var PatList = [{"id": "1", "value": "Afghanistan", "label": "Afghanistan"}];

	GetValidPatients();
	
	function GetValidPatients()
	{
		var queMED = $("#MEDID").val();
	
		var queUrl ='getValidPatients.php?Doctor='+queMED+'&NReports=3';		
		
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				ValPatData = data.items;
			}
		});
	
		Pa = ValPatData.length;

		PatList = ValPatData;
		ValPatData.sort( function(a,b){ return a.email - b.email } );
	
	}
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


	// end initial js code





	
	

    var telemed_pat = -1;
    
    //var pusher = new Pusher('d869a07d8f17a76448ed');
    //var channel_name=$('#MEDID').val();
    //var channel = pusher.subscribe(channel_name);
    
    var push = new Push($("#MEDID").val(), window.location.hostname + ':3955');
    
    //var notifier=new PusherNotifier(channel);
    /*channel.bind('telemed_video_call', function(data) 
    {
	
        //var d = JSON.parse(data);
        //telemed_pat = d.id;
        $.post('get_current_telemed_info.php', {id : $("#MEDID").val()}, function(data, status)
        {
            console.log(data);
            var d = JSON.parse(data);
            $("#video_consultation_text").html("Member " + d['Name'] + " " + d['Surname'] + " is calling you for a video consultation" + " <br/><span style=\"text-align: center\">(" + d['Time'] + ")</span>");
            $("#part_e").slideDown();
            telemed_pat = d['ID'];
        });
    });
    channel.bind('telemed_phone_call', function(data) 
    {
	
        //var d = JSON.parse(data);
        //telemed_pat = d.id;
        $.post('get_current_telemed_info.php', {id : $("#MEDID").val()}, function(data, status)
        {
            var d = JSON.parse(data);
            $("#phone_consultation_text").html("You are on a phone consultation with member " + d['Name'] + " " + d['Surname'] + " <br/><span style=\"text-align: center\">(" + d['Time'] + ")</span>");
            $("#part_f").css("display", "block");
            telemed_pat = d['ID'];
        });
    });*/
    var banner_holder = 0;
    setInterval(function(){
		var med_id = $('#MEDID').val();
		var locationURL = 'getGreenBanner.php?med_id='+med_id;
		$.ajax(
			{
				url: locationURL,
				dataType: "json",
				async: false,
				success: function(data)
				{
					var d = data.items[0];
					telemed_pat = d.PatId;
					
					if(d.Type == 'phone'){
						if(telemed_pat != '' && banner_holder == 0){
							$("#phone_consultation_text").html("Member " + d.name + " is calling you for a phone consultation.</font>");
							$("#part_f").css("display", "block");
						}
					}else{
						if(telemed_pat != '' && banner_holder == 0){
							//telemed_pat = d.id;
							$.post('get_current_telemed_info.php', {id : $("#MEDID").val()}, function(data, status)
							{
								console.log(data);
								var d = JSON.parse(data);
								$("#video_consultation_text").html("Member " + d['Name'] + " " + d['Surname'] + " is calling you for a video consultation" + " <br/><span style=\"text-align: center\">(" + d['Time'] + ")</span>");
								//$("#part_e").slideDown();
								telemed_pat = d['ID'];
							});
							
							//$("#video_consultation_text").html("Member " + d.docName + " is calling you for a video consultation" + " <br/><span style=\"text-align: center\">(" + d['Time'] + ")</span>");
							$("#part_e").slideDown();
						}
					}
					
					
				}
			});
	}, 3000);
    
    push.bind('doc_response', function(data) 
    {
        if(data == 'n')
        {
            $("#part_e").slideUp();
        }
    });
    push.bind('notification', function(data) 
    {
        displaynotification('New Message', data);
    });
    
    /*if($("#TELEMED_TYPE").val() == '1' && $("#IN_CONSULTATION").val() == '1')
    {
	
	if(language == 'th'){
		translation = 'Está en una sesión telefónica con un miembro';
		}else if(language == 'en'){
		translation = 'You are on a phone consultation with member';
		}
        $("#phone_consultation_text").html(translation+" " + $("#phone_consultation_name").val() + " <br/><span style=\"text-align: center\">("+consultation_date+")</span>");
        $("#part_f").css("display", "block");
        telemed_pat = $("#phone_consultation_id").val();
    }*/
    $("#phone_consultation_connect").live('click', function()
    {
        window.location = 'patientdetailMED-new.php?IdUsu='+telemed_pat+"&TELEMED=2";
    });
    
    if($("#TELEMED_TYPE").val() == '2' && $("#IN_CONSULTATION").val() == '1')
    {
        $("#video_consultation_text").html("Member " + $("#video_consultation_name").val() + " is calling you for a video consultation" + " <br/><span style=\"text-align: center\">("+consultation_date+")</span>");
        $("#part_e").css("display", "block");
        telemed_pat = $("#video_consultation_id").val();
    }
    $('#telemed_connect_button').live('click',function()
    {
        //$.post("handle_telemed_connection.php", {med_id: $("#MEDID").val(), accepted: 1}, function(data, status){});
        //window.open("telemedicine_doctor.php?MED=" + $("#MEDID").val() + "&PAT=" + telemed_pat,"Telemedicine","height=540,width=1000,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
        window.location = 'telemedicine/telemed_med.php?doc_id=' + $("#MEDID").val() + '&pat_id=' + telemed_pat;//'patientdetailMED-new.php?IdUsu='+telemed_pat+"&TELEMED=1";
    });
    $('#telemed_deny_button').live('click',function()
    {
        //$.post("handle_telemed_connection.php", {med_id: $("#MEDID").val(), accepted: 0}, function(data, status){});
        $("#part_e").slideUp();
        $.post('consultation_denied.php', {doc: $("#MEDID").val(), pat: telemed_pat});
    });

    
    $('#TimePat').timepicker({ 'scrollDefaultNow': true });
    var toLoad = new Array();
    var nextToLoad = -1;
    toLoad[0] = 0;
    toLoad[1] = 1;
    toLoad[2] = 2;
    toLoad[3] = 3;
    toLoad[4] = 4;
    toLoad[5] = 5;
    toLoad[6] = 6;
    toLoad[7] = 7;
    toLoad[8] = 8;
    toLoad[9] = 9;
    toLoad[10] = -1;
    
	$('input[type=radio][id^="slides_"]').live('click',function() {
		var getidstr=$(this).attr("id");
		var id=parseInt(getidstr.substr(7,8))  //This give the id number
	    vc_play(id-1);
	    vc_stop(id);
	    vc_stop(id-2);	    
//	    alert (id-1+' stopping '+(id-2)+' and '+(id));
	});
    
    function array_rem(arr, val)
    {
        for(var i = 0; i < arr.length; i++)
        {
            if (arr[i] == val)
            {
                arr.splice(i, 1);
                break;
            }
        }
    }
    function load_next()
    {
        var t = -1;
        if (nextToLoad >= 0)
        {
            t = nextToLoad;
            nextToLoad = -1;
            array_rem(toLoad, t);
        }
        else
        {
            t = toLoad[0];
            array_rem(toLoad, t);
        }
        switch(t)
        {
            case (0):
                FillConnect();
                break;
            case (1):
                FillEngage();
                break;
            case (2):
                GetActivity();
                break;
            case (3):
                GetReferred('in');
                break;
            case (4):
                GetReferred('out');
                break;
            case (5):
                GetTimeLine(0, 'doctor');
                break;
            case (6):
                GetTimeLine(0, 'patient');
                break;
            /*case (7):
                GetPendingReferrals();
                break;*/
            case (7):
                GetDeck(deck_date);
                break;
            /*case (9):
                EchoPendingReviews();
                break;*/
            default:
                ;
        }
    }
    $('#Group_toggle').click(function(event) 
    {
        toLoad[0] = 0;
        toLoad[1] = 1;
        toLoad[2] = 2;
        toLoad[3] = 3;
        toLoad[4] = 4;
        toLoad[5] = -1;
        toLoad[6] = -1;
        toLoad[7] = -1;
        toLoad[8] = -1;
        toLoad[9] = -1;
        $('#Connect2').html('<i class="icon-spinner icon-spin" id="H2M_Spin" style="margin:0 auto; color:white;"></i>');
        $('#Connect2T1').html('');
        $('#Connect2T2').html('');
        $('#Connect3').html('<i class="icon-spinner icon-spin" id="H2M_Spin" style="margin:0 auto; color:white;"></i>');
        $('#Connect3T1').html('');
        $('#Connect3T2').html('');
        
        $('#Engage1').html('<i class="icon-spinner icon-spin" id="H2M_Spin" style="margin:0 auto; color:white;"></i>');
        $('#Engage1T1').html('');
        $('#Engage1T2').html('');
        $('#Engage2').html('<i class="icon-spinner icon-spin" id="H2M_Spin" style="margin:0 auto; color:white;"></i>');
        $('#Engage2T1').html('');
        $('#Engage2T2').html('');
        
        $("#PatNewlyContainer_emract").html('<p id="EMRActIndicator" style="color: #22aeff; font-size:35px; font-weight:bold; text-align:center; margin-top: 30px;"><i class="icon-spinner icon-spin " id="H2M_Spin" style="margin:0 auto; color: #22aeff;"></i></p>');
        
        $("#PatNewlyContainer_refin").html('<p id="RefInIndicator" style="color: #22aeff; font-size:35px; font-weight:bold; text-align:center; margin-top: 30px;"><i class="icon-spinner icon-spin " id="H2M_Spin" style="margin:0 auto; color: #22aeff;"></i></p>');
        $("#PatNewlyContainer_refout").html('<p id="RefOutIndicator" style="color: #22aeff; font-size:35px; font-weight:bold; text-align:center; margin-top: 30px;"><i class="icon-spinner icon-spin " id="H2M_Spin" style="margin:0 auto; color: #22aeff;"></i></p>');
        
        nextToLoad = -1;
        load_next();
    });
    
    
	//GetDeck();
    var deck_date = new Date();
    var today = deck_date;
    var deck_dialog = $("#modalContents").dialog({bgiframe: true, width: 550, height: 550, modal: false, autoOpen: false});
	$('#ButtonDeck').live('click',function()
    {
	//console.log('button deck');
        deck_date = new Date();
        $('#deck_date_val').text(get_mon(deck_date.getMonth()) + ' ' + deck_date.getDate());
		GetDeck(deck_date);
        deck_dialog.dialog('open');
	});
    $('#deck_date_right').live('click',function()
    {
        deck_date.setDate(deck_date.getDate() + 1);
        $('#deck_date_val').text(get_mon(deck_date.getMonth()) + ' ' + deck_date.getDate());
        GetDeck(deck_date);
    });
    $('#deck_date_left').live('click',function()
    {
        deck_date.setDate(deck_date.getDate() - 1);
        $('#deck_date_val').text(get_mon(deck_date.getMonth()) + ' ' + deck_date.getDate());
        GetDeck(deck_date);
    });
    function get_mon(val)
    {
        switch(val)
        {
            case 0:
                return 'Jan.';
                break;
            case 1:
                return 'Feb.';
                break;
            case 2:
                return 'Mar.';
                break;
            case 3:
                return 'Apr.';
                break;
            case 4:
                return 'May';
                break;
            case 5:
                return 'Jun.';
                break;
            case 6:
                return 'Jul.';
                break;
            case 7:
                return 'Aug.';
                break;
            case 8:
                return 'Sep.';
                break;
            case 9:
                return 'Oct.';
                break;
            case 10:
                return 'Nov.';
                break;
            case 11:
                return 'Dec.';
                break;
            default:
                ;
        };
    }

    $("#PatientSBox").autocomplete({
        source: PatList,
        minLength: 1,
        select: function(event, ui) {
            // feed hidden id field
            $("#field_id").val(ui.item.id);
            // update number of returned rows
            $('#results_count').html('');
            VPatName =  ui.item.label;
            VPatId =  $("#field_id").val();
        },
        open: function(event, ui) {
            // update number of returned rows
            var len = $('.ui-autocomplete > li').length;
            $('#results_count').html('(#' + len + ')');
        },
        close: function(event, ui) {
            // update number of returned rows
            $('#results_count').html('');
        },
        // mustMatch implementation
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
                $('#field_id').val('');
            }
        }
    });
   
    $("#PatientSBox").focusout(function() {
        if ($("#field").val() === '') {
            $('#field_id').val('');
        }
    });

    $("#IconSch").click(function() {
		$("#IconSch").css('color','#22aeff');
		$("#IconSur").css('color','#cacaca');
		VPatType = 1;
    });
    
    $("#IconSur").click(function() {
		$("#IconSur").css('color','#22aeff');
		$("#IconSch").css('color','#cacaca');
		VPatType = 2;
    });
    
    $("#IconAle").click(function() {
		if (VPatAle==0){
			VPatAle=1;
			$("#IconAle").css('color','#22aeff');
		} else {
			VPatAle=0;
			$("#IconAle").css('color','#cacaca');
		}
    });
    
    $("#TimePat").change(function() {
        var temp = $("#TimePat").val().split(":");
        
        var hr = parseInt(temp[0]);
        var min = temp[1].substr(0, temp[1].length - 2);
        var type = temp[1].substr(temp[1].length - 2, 2);
        if (type == "pm" && hr != 12)
        {
            hr += 12;
        }
        else if (type == "am" && hr == 12)
        {
            hr = 0;
        }
		VPatTime =  hr.toString() + ":" + min;
	});
	
    $("#ButtonAddDeck").click(function() {
		//alert ('Id =  '+VPatId+' Name =  '+VPatName+' Time = '+VPatTime+' Type =  '+VPatType+' Ale ='+VPatAle);
		
		var queMED = $("#MEDID").val();
        var date_str = deck_date.getFullYear()+"-";
        if ((deck_date.getMonth() + 1) < 10)
        {
            date_str += "0";
        }
        date_str += (deck_date.getMonth() + 1)+"-";
        if (deck_date.getDate() < 10)
        {
            date_str += "0";
        }
        date_str += deck_date.getDate();
		var cadena='setNewDeck.php?IdDr='+queMED+'&IdPatient='+VPatId +'&NamePatient='+VPatName+'&Type='+VPatType+'&Alert='+VPatAle+'&Time='+VPatTime+'&Date='+date_str;
		var RecTipo=LanzaAjax(cadena);

		GetDeck(deck_date);
		
	});

    $(".DeleteDeck").live('click',function(){
		var myClass = $(this).attr("id"); 
		//alert (myClass);
		var cadena='deleteDeck.php?IdDr='+queMED+'&IdPatient='+myClass;
		var RecTipo=LanzaAjax(cadena);
		GetDeck(deck_date);

	});
		
	function GetDeck(date){
		load_next();
        var queMED = $("#MEDID").val();
        var date_str = deck_date.getFullYear()+"-";
		
        if ((deck_date.getMonth() + 1) < 10)
        {
            date_str += "0";
        }
        date_str += (deck_date.getMonth() + 1)+"-";
        if (deck_date.getDate() < 10)
        {
            date_str += "0";
        }
        date_str += deck_date.getDate();
        
		var queUrl ='getDeck.php?Doctor='+queMED+'&NReports=3&Date='+date_str;		
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				Deck = data.items;
				
			}
		});
		
		Pa = Deck.length;
		
		//PatData.sort( function(a,b){ return a[8] - b[8] } );
		Deck.sort( function(a,b){ return a.email - b.email } );
		
		var n = 0;
		var DeckBox='';
		while (n<Pa){
            var times = Deck[n].time.split(":");
            var hr = times[0];
            var min = times[1];
            var label = "am";
            if (parseInt(hr) > 12)
            {
                hr -= 12;
                label = "pm";
            }
            else if (parseInt(hr) == 12)
            {
                label = "pm";
            }
            else if (parseInt(hr) == 0)
            {
                hr = 12;
            }
            var newTime = "";
            newTime += hr.toString() + ":" + min + label;
			DeckBox += '<div class="InfoRow">';
			DeckBox += '<a href="patientdetailMED-new.php?IdUsu='+Deck[n].PatId+'"><div style="width:245px; float:left; margin-left:-10px;text-align:left;"><span class="PatName">'+Deck[n].name+'</span></div></a> '; //Changed the div width from 150 to 229, added margin-left:-10px by Pallab, changed width from 150 to 245
			DeckBox += '<div style="width:130px; float:left; text-align:left; color:#22aeff; font-size:8px;"><span class="DrName">(by '+Deck[n].drname+')</span></div>';
			if (Deck[n].type=='1'){
				DeckBox += '<div style="width:20px; float:left; margin-left:-38px; color:#22aeff;"><i class="icon-time"></i> </div>'; //Added margin-left = -38px by Pallab
			}else{
				DeckBox += '<div style="width:20px; float:left; margin-left:-38px; color:#22aeff;"><i class="icon-pencil"></i> </div>'; //Added margin-left = -38px by Pallab
			}
			
			DeckBox += '<div style="width:80px; float:left;margin-left:-23px;"><span >'+newTime+'</span></div>'; //Added margin-left = -23px by Pallab
			if (Deck[n].alert=='1'){
				DeckBox += '<div style="width:20px; float:left; margin-left:-7px; color:#22aeff;"><i class="icon-check-sign"></i> </div>'; //Added margin-left = -10px by Pallab
			}else{
				DeckBox += '<div style="width:20px; float:left; margin-left:-7px; color:#cacaca;"><i class="icon-check-sign"></i> </div>'; //Added margin-left = -10px by Pallab
			}
			DeckBox += '<div class="DeleteDeck" id="'+Deck[n].PatId+'" style="width:30px; float:left;"><a id="'+Deck[n].PatId+'"  class="btn" style="height: 15px; padding-top: 0px; margin-left;-1px;margin-top: -5px; color:red;">Del</a></div>';
			DeckBox += '</div>'; //Added margin-left--1px by Pallab, changed width in div containing deck from 60 to 30px
			n++;
		}
		
		$('#DeckContainer').html(DeckBox);
        if(date.getDate() == today.getDate() && date.getMonth() == today.getMonth())
        {
            $('#BaloonDeck').html(n);
            if (n>0) $('#BaloonDeck').css('visibility','visible');
            else $('#BaloonDeck').css('visibility','hidden');
        }
        
		load_next();
	}
    
    /*var num_notifications = 0;
    var items = new Array();
    function loadNotifications()
    {
        var doctorId = $("#MEDID").val();  
        num_notifications = 0;
        $.post("getPendingReviewMails.php", {Doctor: doctorId}, function(data, status)
		{
            items = JSON.parse(data);
            num_notifications += items.length;
            $.post("getPendingReferralsLight.php", {Doctor: doctorId}, function(data, status)
            {
                var referrals_items = JSON.parse(data);
                items.push.apply(items, referrals_items);
                num_notifications += referrals_items.length;
                $.get("get_appointments.php?doc_id="+doctorId, function(data, status)
                {
                    var appointments_items = JSON.parse(data);
                    num_notifications += appointments_items.length;
                    items.push.apply(items, appointments_items);
                    items.sort(function(a, b)
                    {
                        if (a.date > b.date)
                            return -1;
                        if (a.date < b.date)
                            return 1;
                        return 0;
                    });
                    displayNotifications();
                });
            });
        });
    }
    function displayNotifications()
    {
        $("#notifications").empty();
        console.log(items);
        for(var i = 0; i < items.length; i++)
        {
            var html = '';
            if(items[i].type == 'referral')
            {
                html += '<div style="width: 98%; height: 40px; background-color: #FBFBFB; border-radius: 5px; border: 1px solid #E8E8E8; margin: auto; margin-bottom: 7px; margin-top: 7px; overflow: hidden;">';
                html += '<div style="width: 5%; height: 40px; background-color: #54BC00; color: #FFF; font-size: 20px; position: relative; margin-right: 1%; float: left;">';
                html += '<div style="width: 20px; height: 20px; padding-left: 14px; padding-top: 9px;">';
                html += '<i class="icon-share-alt" style="margin-top: 10px;"></i>';
                html += '</div>';
                html += '</div>';
                html += '<div style="width: 68%; height: 40px; float: left; padding: 0px;">';
                html += '<div style="width: 100%; height: 22px; color: #54BC00; font-size: 16px; padding-top: 5px;">';
                html += '<a id="pending_referral_'+i+'" href="patientdetailMED-new.php?IdUsu='+items[i].PATIENT_ID+'&Acceso=23432">' + items[i].PATIENT + '</a> has been referred to you by Dr. ' + items[i].DOCTOR + '.';
                html += '</div>';
                html += '<style>#pending_referral_'+i+':hover{ color: #63E100; }</style>';
                html += '<div style="width: 100%; height: 10px; color: #999; font-size: 10px; padding: 0px; margin-top: -6px;">';
                html += moment(new Date(items[i].date)).fromNow();
                html += '</div>';
                html += '</div>'
                html += '<button id="pendingReferralButton_'+items[i].ID+'" class="notification_button">Acknowledge</button></div>';
            }
            else if(items[i].type == 'review')
            {
                html += '<div class="pending_review" style="width: 98%; height: 40px; background-color: #FBFBFB; border-radius: 5px; border: 1px solid #E8E8E8; margin: auto; margin-bottom: 7px; margin-top: 7px; overflow: hidden;">';
                html += '<div style="width: 5%; height: 40px; background-color: #22AEFF; color: #FFF; font-size: 22px; position: relative; margin-right: 1%; float: left;">';
                html += '<div style="width: 20px; height: 20px; padding-left: 13px; padding-top: 8px;">';
                html += '<i class="icon-folder-open" style="margin-top: 10px;"></i>';
                html += '</div>';
                html += '</div>';
                html += '<div style="width: 68%; height: 40px; float: left; padding: 0px;">';
                html += '<div style="width: 100%; height: 22px; color: #22AEFF; font-size: 16px; padding-top: 5px;">';
                html += '<a id="pending_review_'+i+'" href="patientdetailMED-new.php?IdUsu='+items[i].USER+'&Acceso=23432">' + items[i].PATIENT + '</a> sent you a review request.';
                html += '</div>';
                html += '<style>#pending_review_'+i+':hover{ color: #7AD0FF; }</style>';
                html += '<div style="width: 100%; height: 10px; color: #999; font-size: 10px; padding: 0px; margin-top: -6px;">';
                html += moment(new Date(items[i].date)).fromNow();
                html += '</div>';
                html += '</div>'
                html += '<button id="pendingReviewButton_'+items[i].MESSAGE_ID+'_'+items[i].USER+'" class="notification_button">Review</button></div>';
            }
            else
            {
                if(items[i].doc_ack == 0)
                {
                    html += '<div class="appointment_notification" style="width: 98%; height: 40px; background-color: #FBFBFB; border-radius: 5px; border: 1px solid #E8E8E8; margin: auto; margin-bottom: 7px; margin-top: 7px; overflow: hidden;">';
                    html += '<div style="width: 5%; height: 40px; background-color: #FFC23B; color: #FFF; font-size: 22px; position: relative; margin-right: 1%; float: left;">';
                    html += '<div style="width: 20px; height: 20px; padding-left: 13px; padding-top: 8px;">';
                    html += '<i class="icon-calendar-empty" style="margin-top: 10px;"></i>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div style="width: 68%; height: 40px; float: left; padding: 0px;">';
                    html += '<div style="width: 100%; height: 22px; color: #FFB400; font-size: 16px; padding-top: 5px;">';
                    html += 'New appointment with <a  id="appointment_notification_'+i+'"href="patientdetailMED-new.php?IdUsu='+items[i].pat_id+'&Acceso=23432">' + items[i].pat_name + '</a>: ';
                    if(items[i].formatted_specific_time.length > 0)
                    {
                        html += items[i].formatted_date + ' at ' + items[i].formatted_specific_time;
                    }
                    else
                    {
                        html += items[i].formatted_date + ' between ' + items[i].formatted_start_time + ' and ' + items[i].formatted_end_time;
                    }
                    html += '</div>';
                    html += '<style>#appointment_notification_'+i+':hover{ color: #FFD25C; }</style>';
                    html += '<div style="width: 100%; height: 10px; color: #999; font-size: 10px; padding: 0px; margin-top: -6px;">';
                    html += moment(new Date(items[i].date_created)).fromNow();
                    html += '</div>';
                    html += '</div>'
                    html += '<button id="appointmentNotificationButton_'+items[i].id+'" class="notification_button">Dismiss</button></div>';
                }
            }
            $("#notifications").append(html);
        }
    }
    loadNotifications();
    $('button[id^="pendingReferralButton"]').live('click',function()
    {
        var pending_referral_row = $(this).parent();
        var referral_id = $(this).attr('id').split('_')[1];
        $.post("setReferralsLight.php", {ID: referral_id}, function(data, status)
		{
            if (data == 'success')
            {
                pending_referral_row.slideUp();
                num_notifications--;
                if (num_notifications == 0)
                {
                    $("#part_d").slideUp();
                }
            }
        });
    });
    $('button[id^="pendingReviewButton"]').live('click',function(data,success)
    {
        var doctorId = $("#MEDID").val();
        var pending_review_row = $(this).parent();
        var info = $(this).attr('id').split('_');
        var message_id = info[1];
        var user_id = info[2];
        $.post("SetNewMailsAsRead.php", {doctorId: doctorId, userId: user_id, messageId: message_id}, function(data,success)
        {
            pending_review_row.slideUp();
            num_notifications--;
            if (num_notifications == 0)
            {
                $("#part_d").slideUp();
            }
            window.location.href = "patientdetailMED-new.php?IdUsu="+user_id+"&Acceso=23432";
        });
    });
    $('button[id^="appointmentNotificationButton"]').live('click', function()
    {
        var id = $(this).attr('id').split('_')[1];
        var appointment_notification_row = $(this).parent();
        $.post("acknowledge_appointment.php", {type: 1, id: id}, function(data, status)
        {
            appointment_notification_row.slideUp();
            num_notifications--;
            if (num_notifications == 0)
            {
                $("#part_d").slideUp();
            }
        });
        
    });
    */
    $('#notifications').h2m_notifications({type: 'DOC', doctor: $("#MEDID").val()});
    
    function SanDate(entrydate)
    {
        var newDate = moment(entrydate, "MM/DD/YYYY HH:mm:ss");
        return newDate;
    }
    function BeauStr (EString)
    {
        return EString.charAt(0).toUpperCase() + EString.slice(1);
    }
    
    
    function GetActivity()
	{
        var queMED = $("#MEDID").val();
        var group = 0;
        if($('#Group_toggle').is(":checked")) group=1;
        var queUrl ='getNewlyAllLight.php?Doctor='+queMED+'&NReports=3&Group='+group;		
        //var PatData;
        /*$.post(window.location.protocol + "//" + window.location.host + ":4226" + "/recentActivity", {Doctor: queMED, NReports: 3, Group: group}, function(data, status)
        {
            var rows = data;
            $("#PatNewlyContainer_emract").show();
            var html = '';

            var height = 47 * rows.length + 25;
            var overflow = '';
            if(height > 495)
            {
                height = 'height:495px;';
                overflow = 'overflow:scroll;';
            }
            else
                height = "height:" + height + "px;";
            
            html = '<div style="' + height + overflow + '"><table style="background-color:white; width:100%;"><tr style="border-bottom:1px solid #cacaca; height:25px; background-color:#cacaca; color:white;"><td style="width:20px; padding-left:15px;"><p style="margin-bottom:0px;"><span style="font-size:14px;" lang="en">item</span></p></td><td style="width:100px; padding-left:15px;"><p style="margin-bottom:0px;"><span style="font-size:14px;" lang="en">Member NAME</span></p></td><td style="width:10px;" lang="en">Rep</td><td style="width:5px;"></td><td style="width:10px;" lang="en">Msg</td><td style="width:40px; text-align: center;" lang="en">Time</td></tr>';
            
            for(var i = 0; i < rows.length; i++)
            {
                var row = rows[i];
                var tr_bgcolor = '';
                var WhatLabel = '';
                var validDif = '';
                var WhatColor = '';
                if(row['gr'] == 1) 
                    tr_bgcolor = "#EBF5FF;";
                else 
                    tr_bgcolor = "white;";

                if (row['recent'] < 24) {	
                        WhatLabel = 'hours';
                        validDif = Math.floor(row['recent']);
                }
                else {
                    WhatLabel = 'days';
                    validDif = Math.floor(row['recent']/24);
                }

                switch(true)
                {
                    case (validDif >= 0 && validDif <= 2 || WhatLabel == 'hours'): 	
                        WhatColor = 'black';
                        break;
                    case (validDif > 2 && validDif <= 7 && WhatLabel == 'days'): 	
                        WhatColor = 'grey';
                        break;
                    case (validDif > 7 && validDif < 30 && WhatLabel == 'days'): 	
                        WhatColor = '#cacaca';
                        break;
                    case (validDif >= 30 && WhatLabel == 'days'): 					
                        WhatColor = '#e9e9e9';
                        break;
                    default:								
                        WhatColor = 'blue';
                        break;
                }

                html += '<tr style="height:30px; border-bottom:1px solid #cacaca; background:' + tr_bgcolor + '">';
                html += '<td style=" width:20px; color:#22aeff; font-size:12px;" title="NEW MESSAGES &#013;NEW REPORTS">';
                html += '<div style="width:100%; text-align:center; font-size:14px; color:' + (row['Msg'] == 0 && row['MsgSent'] == 0 ? '#e9e9e9' : '#22aeff') + ';"><icon class="icon-envelope"></icon></div>';
                html += '<div style="width:100%; text-align:center; margin-top:-5px; font-size:14px; color:' + (row['UPreport'] == 0 ? '#e9e9e9' : '#22aeff') + ';"><icon class="icon-folder-open"></icon></div></td>';
                html += '<td style="padding:6px;"><a href="patientdetailMED-new.php?IdUsu=' + row['Identif'] + '" style="text-decoration:none;"><div class="truncate" style="line-height:1; color: #54bc00; font-size:14px;">' + row["Name"] + '</div><div class="truncate" style="color: #54bc00; font-size:14px; margin-top:0px;"> ' + row["Surname"].toUpperCase() + '</div></a></td>';						
                html += '<td style="width:10px; color:#22aeff; font-size:12px; text-align: center;" title="Updated Reports">';
                html += row['UPreport'] + '</td>';
                html += '<td style="width:5px;"></td>';

                html += '<td style="width:10px; color:#22aeff; font-size:12px;" title="Message Received / Sent">';
                html += row['Msg'] + '/' + row['MsgSent'] + '</td>';

                html += '<td style="width:40px; text-align:center; color: white; background-color:' + WhatColor + '; "><div style="width:100%; font-size:18px;" title="Time since last recorded activity for this patient">' + validDif + '</div><div style="width:100%; font-size:10px; margin-top:-5px;" lang="en">' + WhatLabel + '</div></td></tr>';
            }

            html += '</table></div>';*/
        
            
        
       $.get(queUrl, function(data, status)
        {
        
            $("#PatNewlyContainer_emract").show();
            $("#PatNewlyContainer_emract").html(data);
            //$("#BaloonActivity").html(ncount);
            //if (ncount>0) $("#BaloonActivity").css('visibility','visible');
            load_next();
            
        });

        
        //PatData.sort( function(a,b){ return a[8] - b[8] } );
       
			
	
	}

    
        
	function GetReferred(type)
	{
        var queMED = $("#MEDID").val();
        var group = 0;
        if($('#Group_toggle').is(":checked")) group=1;		
        /*$.post(window.location.protocol + "//" + window.location.host + ":4226" + "/referredInOut", {Doctor: queMED, NReports: 3, Group: group, TypeEntry: type}, function(data, status) {
            
            console.log(status);
            console.log(data);
            
            var html = '<div style="width:100%;">' +
            '<table style="background-color:white; width:100%;">' +
            '<tr style="border-bottom:1px solid #CACACA; height:25px; background-color:#CACACA; color:white;">' +
                '<td style="width:20px; text-align:center;">' +
                    '<p style="margin-bottom:0px; text-align:center;"><span style="font-size:14px;" lang="en">Comm</span></p>' +
                '</td>' +
                '<td style="width:100px;">' +
                    '<p style="margin-bottom:0px; text-align:center;"><span style="font-size:14px;" lang="en">Patient/Doctor</span></p>' +
                '</td>' +
                '<td style="width:60px; text-align:center;" lang="en">Stage</td>' +
                '<td style="width:5px;"></td>' +
                '<td style="width:40px; text-align:center;" lang="en">Time</td>';

            var IdPac = 0, IdDoctor = 0, MessagesReceived = 0, MessagesReceivedNEW = 0, NewstdateMessage = 0, CircleColor = '', tr_style = '', MsgColor = '', Iteration = '', tr_bgcolor = '', DoctorSelf = 0, TreatD2 = '', NameD2 = '', SurnameD2 = '', NameP = '', SurnameP = '', colorStandard = '#22AEFF;', IterationRef = {}, row, LetStage = '', St1 = 'OFF', St2 = 'OFF', St3 = 'OFF', St4 = 'OFF', CircleC1 = '', CircleC2 = '', CircleC3 = '', CircleC4 = '', title = '', now = moment(), your_date, datediff = '', validDif = '', WhatLabel = '', temp_diff = '', WhatColor = '';
            
            for(var i = 0; i < data.length; i++) {
                row = data[i];
                if(row['stage'] == 1) LetStage = 'A';
                else if(row['stage'] == 2) LetStage = 'B';
                else if(row['stage'] == 3) LetStage = 'C';
                else if(row['stage'] == 4) LetStage = 'D';
                IdPac = row['IdPac'];
                if (type == 'in') {
                    IdDoctor = row['IdMED'];
                    DoctorSelf = row['IdMED2'];
                    IterationRef[IdPac] = 0;
                    CircleColor = 'orange';
                }
                else {
                    IdDoctor = row['IdMED2'];
                    DoctorSelf = row['IdMED'];
                    IterationRef[IdPac]++;
                    CircleColor = '#54BC00';
                }

                tr_style = (i < data.length - 1 ? "height:30px; border-bottom:1px solid #CACACA;" : "height:30px; border:none;");
                tr_bgcolor = (DoctorSelf == queMED ? "white;" : "#EBF5FF;");
                NameD2 = row['DocName'], SurnameD2 = row['DocSurname'], NameP = row['PatName'], SurnameP = row['PatSurname'];
                TreatD2 = (row['DocRole'] == '1' ? 'Dr. ' : '');
                if(row['NewMesCount'] != 'undefined') MessagesReceived = row['NewMesCount'];
                if(row['NewMesFecha'] != 'undefined') MessagesReceivedNEW = row['NewMesFecha'];
                if(row['MesCount'] != 'undefined') NewstdateMessage = row['MesCount'];

                MsgColor = (MessagesReceivedNEW > 0 ? colorStandard : '#E9E9E9');

                html += '<tr style="'+tr_style+' background:'+tr_bgcolor+'">';
                html += '<td style="width:20px;"><div style="width:100%; text-align:center; margin-top:-5px; font-size:20px; color:'+MsgColor+';"><icon class="icon-envelope" title="NEW MESSAGES"></icon></div></td>';

                if (IterationRef[IdPac] > 1) Iteration = '('+IterationRef[IdPac]+')';

                html += '<td style="padding: 6px;"><a href="patientdetailMED-new.php?IdUsu='+IdPac+'" style="text-decoration:none;"><div class="truncate" style="line-height:1; color: #54bc00; font-size:14px;">'+BeauStr(SurnameP)+', '+NameP[0].toUpperCase()+' '+Iteration+'</div><div class="truncate" style="color: '+colorStandard+'; font-size:12px; margin-top:0px;"> '+SurnameD2.toUpperCase()+'</div></a></td>';

                if(row['Type'] > 0) {
                    if(row['Stage'] == 1) {
                        St1 = 'ON';
                        CircleC1 = colorStandard;
                    }
                    else if(row['Stage'] == 2) {
                        St1 = 'ON';
                        St2 = 'ON';
                        CircleC1 = colorStandard;
                        CircleC2 = colorStandard;
                    }
                    else if(row['Stage'] == 3) {
                        St1 = 'ON';
                        St2 = 'ON';
                        St3 = 'ON';
                        CircleC1 = colorStandard;
                        CircleC2 = colorStandard;
                        CircleC3 = colorStandard;
                    }
                    title = "A: PATIENT has been ACKNOWLEDGED &#013;B: INFORMATION has been REVIEWED &#013;C: Comments has been Added";
                    html += '<td style="width:66px;" title="'+title+'">';
                    html += '<div style="width: 12px;height: 12px;font-size: 11px; margin-left:2px; background-color:'+CircleC1+';" class="LetterRectangle'+St1+'">A</div>';
                    html += '<div style="width: 12px;height: 12px;font-size: 11px; margin-left:2px; background-color:'+CircleC2+';" class="LetterRectangle'+St2+'">B</div>';
                    html += '<div style="width: 12px;height: 12px;font-size: 11px; margin-left:2px; background-color:'+CircleC3+';" class="LetterRectangle'+St3+'">C</div></td>';
                }
                else {
                    if(row['Stage'] == 1) {
                        St1 = 'ON';
                        CircleC1 = colorStandard;
                    }
                    else if(row['Stage'] == 2) {
                        St1 = 'ON';
                        St2 = 'ON';
                        CircleC1 = colorStandard;
                        CircleC2 = colorStandard;
                    }
                    else if(row['Stage'] == 3) {
                        St1 = 'ON';
                        St2 = 'ON';
                        St3 = 'ON';
                        CircleC1 = colorStandard;
                        CircleC2 = colorStandard;
                        CircleC3 = colorStandard;
                    }
                    else if(row['Stage'] == 4) {
                        St1 = 'ON';
                        St2 = 'ON';
                        St3 = 'ON';
                        St4 = 'ON';
                        CircleC1 = colorStandard;
                        CircleC2 = colorStandard;
                        CircleC3 = colorStandard;
                        CircleC4 = colorStandard;
                    }
                    title = "A: PATIENT has been ACKNOWLEDGED &#013;B: INFORMATION has been REVIEWED &#013;C: Comments has been Added &#013;D: DOCTOR and PATIENT have been MET";
                    html += '<td style="width:66px;" title="'+title+'">';
                    html += '<div style="width: 12px;height: 12px;font-size: 11px; margin-left:2px; background-color:'+CircleC1+';" class="LetterCircle'+St1+'">A</div>';
                    html += '<div style="width: 12px;height: 12px;font-size: 11px; margin-left:2px; background-color:'+CircleC2+';" class="LetterCircle'+St2+'">B</div>';
                    html += '<div style="width: 12px;height: 12px;font-size: 11px; margin-left:2px; background-color:'+CircleC3+';" class="LetterCircle'+St3+'">C</div>';
                    html += '<div style="width: 12px;height: 12px;font-size: 11px; margin-left:2px; background-color:'+CircleC4+';" class="LetterCircle'+St4+'">D</div></td>';
                } //end of else 
                html += '<td style="width:5px;"></td>';
                your_date = moment(row['Fecha']).unix();
                datediff = now - your_date;
                temp_diff = datediff/3600;
                if(temp_diff < 24) {
                    validDif = Math.floor(temp_diff);
                    WhatLabel = 'hours';
                }
                else {
                    validDif = Math.floor(temp_diff/24);
                    WhatLabel = 'days';
                }
                if(validDif >= 0 && validDif <= 2 || WhatLabel == 'hours') WhatColor = 'black';
                else if(validDif > 2 && validDif <= 7 || WhatLabel == 'days') WhatColor = 'gray';
                else if(validDif > 7 && validDif < 30 || WhatLabel == 'days') WhatColor = '#CACACA';
                else if(validDif >= 30 && WhatLabel == 'days') WhatColor = '#E9E9E9';
                else WhatColor = 'blue';

                html += '<td style="width:40px; text-align:center; color: white; background-color: '+WhatColor+'; "><div style="width:100%; font-size:18px;">'+validDif+'</div><div style="width:100%; font-size:10px; margin-top:-5px;" lang="en">'+WhatLabel+'</div></td>';

            } //end of for loop
            html += '</table></div>';

            //$("#BaloonRefIn").html(n);
            //if (n>0) $("#BaloonRefIn").css('visibility','visible');*/
            
        var queUrl ='getReferredInArrayLight.php?Doctor='+queMED+'&NReports=3&TypeEntry='+type+'&Group='+group;		
        
        $.get(queUrl, function(data, status)
        {
            //if type is out
            if (type == 'in') {
                $("#PatNewlyContainer_refin").show();
                $("#PatNewlyContainer_refin").html(data);
            } else {
                $("#PatNewlyContainer_refout").show();
                $("#PatNewlyContainer_refout").html(data);
                //$("#BaloonRefOut").html(n);
                //if (n>0) $("#BaloonRefOut").css('visibility','visible');
            }
            
            
            load_next();
        });
	}

    /* var url = "test.php"*/
    
    /*
	$('#BarBtnEMRACT').live('click',function(){
		waitcontent = '<div style="width:100%; height:100%; text-align:center; display:table-cell; vertical-align:middle;"><i class="icon-spinner icon-spin icon-4x" id="H2M_Spin" style="margin:0 auto; color:#22aeff;"></i></div>';
		$("#PatNewlyContainer").html(waitcontent);			  		
		window.setTimeout(function() {
        	GetActivity();
		}, 300);
	});

	$('#BarBtnREFIN').live('click',function(){
		waitcontent = '<div style="width:100%; height:100%; text-align:center; display:table-cell; vertical-align:middle;"><i class="icon-spinner icon-spin icon-4x" id="H2M_Spin" style="margin:0 auto; color:#22aeff;"></i></div>';
		$("#PatNewlyContainer").html(waitcontent);			  		
		window.setTimeout(function() {
        	GetReferred('in');
		}, 300);
	});

	$('#BarBtnREFOUT').live('click',function(){
		waitcontent = '<div style="width:100%; height:100%; text-align:center; display:table-cell; vertical-align:middle;"><i class="icon-spinner icon-spin icon-4x" id="H2M_Spin" style="margin:0 auto; color:#22aeff;"></i></div>';
		$("#PatNewlyContainer").html(waitcontent);			  		
		window.setTimeout(function() {
        	GetReferred('out');
		}, 300);
	});
    */
	$("#PatRefIn").hide();


	waitcontent = '<div style="width:100%; height:100%; text-align:center; display:table-cell; vertical-align:middle;"><i class="icon-spinner icon-spin icon-4x" id="H2M_Spin" style="margin:0 auto; color:#22aeff;"></i></div>';
	$("#PatNewlyContainer").html(waitcontent);			  		
	load_next();

	$('#NewsComm').live('click',function(){
		GetTimeLine(toggleRead,'doctor');	
	});
	$('#EngaBOX').live('click',function(){
		FillEngage();	
	});

	var ConnectItem = 0;
    
    setInterval(function(){
		Gotoflag = 0;
	
		if (ConnectItem == 0 && Gotoflag == 0) {
			ConnectItem = 1;
			Gotoflag=1;
			$("#ConnectSCROLL").animate({ scrollTop: 60 }, { duration: 700 } );
			$("#EngageSCROLL").animate({ scrollTop: 60 }, { duration: 700 } );
		};
		if (ConnectItem == 1 && Gotoflag == 0) {
			ConnectItem = 2;
			Gotoflag=1;
			$("#ConnectSCROLL").animate({ scrollTop: 120 }, { duration: 700 } );
		};
		if (ConnectItem == 2 && Gotoflag == 0) {
			ConnectItem = 0;
			Gotoflag=1;
			$("#ConnectSCROLL").animate({ scrollTop: 0 }, { duration: 700 } );
			$("#EngageSCROLL").animate({ scrollTop: 0 }, { duration: 700 } );
		};
		
	},10000)

	function FillConnect()
	{
	
		var queMED = $("#MEDID").val();
		var queUrl ='getConnected.php?Doctor='+queMED+'&NReports=3';
        var group = 0;
		var translation;
        if($('#Group_toggle').is(":checked")) group=1;
		
		$.post("GetConnectedLight.php", {Doctor: queMED, NReports: 3, Group: group}, function(data, status)
		{
			var ConnData = JSON.parse(data);
            $('#Connect2').html(ConnData.IN+'/'+ConnData.OUT);
            $('#Connect2T1').html('<span lang="en">Members</span>');
            $('#Connect2T2').html('<span lang="en">IN/OUT RATIO</span>');
            $('#Connect3').html(ConnData.DRIN+'/'+ConnData.DROUT);
            $('#Connect3T1').html('<span lang="en">Doctors</span>');
            $('#Connect3T2').html('<span lang="en">IN/OUT RATIO</span>');
            load_next();
		});
	}

	function FillEngage()
	{
	
		var queMED = $("#MEDID").val();
        var group = 0;
        if($('#Group_toggle').is(":checked")) group=1;
        $.post("GetEngagedLight.php", {Doctor: queMED, NReports: 3, Group: group}, function(data, status)
		{
            var EngData = JSON.parse(data);
            $('#Engage1').html(EngData.NPatients);
            $('#Engage1T1').html('<span lang="en">Members</span>');
            $('#Engage1T2').html('<span lang="en">TOTAL</span>');
            $('#Engage2').html(EngData.NActive);
            $('#Engage2T1').html('<span lang="en">Members</span>');
            $('#Engage2T2').html('<span lang="en">CONNECTED</span>');
            load_next();
        });

	}

	var scrollTW = 0;
	var mesScroll = 0;
	var TotalMes = 0;
	var messCount = 0;
    
	$('#MesL').live('click',function(){
		var cadena='setMessageStatus.php?msgid='+NewMES[mesScroll].MessageID;
		var RecTipo=LanzaAjax(cadena);
		if (mesScroll>0) mesScroll--;
		$('#RCounter').html((mesScroll+1)+' of '+TotalMes);
		scrollTW = (mesScroll * 465);
		$("#TWContainer" ).animate({scrollLeft: scrollTW, opacity : 0.3 });
		$("#TWContainer" ).animate({ opacity : 1 },300);
	});
	$('#MesR').live('click',function(){
		var cadena='setMessageStatus.php?msgid='+NewMES[mesScroll].MessageID;
		var RecTipo=LanzaAjax(cadena);
		if (mesScroll < TotalMes) mesScroll++;
		$('#RCounter').html((mesScroll+1)+' of '+TotalMes);
		scrollTW = (mesScroll * 465);
		$("#TWContainer" ).animate({scrollLeft: scrollTW, opacity : 0.3 });
		$("#TWContainer" ).animate({ opacity : 1 },300);
	});
	
	$("#COthers").click(function(event) {
		 if (toggleRead == 0) toggleRead = 1; else toggleRead = 0;
		 waitcontent = '<div style="width:100%; height:100px; text-align:center;"><i class="icon-spinner icon-spin icon-4x" id="H2M_Spin" style="margin:0 auto; color:#22aeff;"></i></div>';
		 $('#MessageColumn').html(waitcontent);			  		
		 window.setTimeout(function() {
        	GetTimeLine(toggleRead,'doctor');
		}, 300);
    		
   	});

    var start = 0;
    var lastPage = 1;
    var currPage = 1;
    var numDisplay = 6;
    
    var queMED = $("#MEDID").val();
    //var totalMessages = LanzaAjax('getInboxTotalUNREAD.php?IdMED='+queMED+'&patient=-1&unread=toggleRead&scenario=doctor');
    //lastPage = Math.ceil(totalMessages/numDisplay);
    //updatePageDisplay();
            
    $("#prevMessage").click(function(event)
    {
        if(currPage > 1)
        {
            currPage--;
            start -= numDisplay;
            GetTimeLine(toggleRead, 'doctor');
            updatePageDisplay();
        }
    });
    
    $("#nextMessage").click(function(event)
    {
        if(currPage < lastPage)
        {
            currPage++;
            start += numDisplay;
            GetTimeLine(toggleRead, 'doctor');
            updatePageDisplay();
        }
    });
    
    function updatePageDisplay()
    {
        document.getElementById("pageDisplay").innerHTML = currPage + "/" + lastPage;
    } 
    
    function array_swap(arr, a, b)
    {
        var x = arr[a];
        arr[a] = arr[b];
        arr[b] = x;
    }
    
    /*$("#doctor_mes_link_1").click(function(event)
    {
        window.open("Messages.php?isDoctors=1&id=" + $("#doctor_mes_link_1").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#doctor_mes_link_2").click(function(event)
    {
        window.open("Messages.php?isDoctors=1&id=" + $("#doctor_mes_link_2").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#doctor_mes_link_3").click(function(event)
    {
        window.open("Messages.php?isDoctors=1&id=" + $("#doctor_mes_link_3").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#doctor_mes_link_4").click(function(event)
    {
        window.open("Messages.php?isDoctors=1&id=" + $("#doctor_mes_link_4").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#doctor_mes_link_5").click(function(event)
    {
        window.open("Messages.php?isDoctors=1&id=" + $("#doctor_mes_link_5").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#patient_mes_link_1").click(function(event)
    {
        window.open("Messages.php?isDoctors=0&id=" + $("#patient_mes_link_1").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#patient_mes_link_2").click(function(event)
    {
        window.open("Messages.php?isDoctors=0&id=" + $("#patient_mes_link_2").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#patient_mes_link_3").click(function(event)
    {
        window.open("Messages.php?isDoctors=0&id=" + $("#patient_mes_link_3").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#patient_mes_link_4").click(function(event)
    {
        window.open("Messages.php?isDoctors=0&id=" + $("#patient_mes_link_4").attr("name"),'_self',false);
        event.preventDefault();
    });
    $("#patient_mes_link_5").click(function(event)
    {
        window.open("Messages.php?isDoctors=0&id=" + $("#patient_mes_link_5").attr("name"),'_self',false);
        event.preventDefault();
    });
    function GetTimeLine(unread,scenario)
    {
        $("#WaitTW").css('visibility','visible');
        var queMED = $("#MEDID").val();
        var queUrl ='getInboxMessageLight.php?IdMED='+queMED+'&scenario='+scenario;
        var type = "doctor";
        if (scenario == "patient")
        {
            type = "patient";
        }
        $("#"+type+"_messages_indicator").css("display", "block");
        $("#"+type+"_mes_1").css("display", "none");
        $("#"+type+"_mes_2").css("display", "none");
        $("#"+type+"_mes_3").css("display", "none");
        $("#"+type+"_mes_4").css("display", "none");
        $("#"+type+"_mes_5").css("display", "none");
        $(type+"_messages_button").children("span.notification").css("display", "none");
        $(type+"_messages_button").children("span.triangle-1").css("display", "none");
        $.post("getInboxMessageLight.php", {IdMED: queMED, scenario: scenario}, function(data, status)
        {
            var items = JSON.parse(data);
            var num_items = items.length;
            
            // set indicator
            if (num_items > 0)
            {
                $("#"+type+"_messages_button").children("span.notification").css("display", "block");
                $("#"+type+"_messages_button").children("span.triangle-1").css("display", "block");
                $("#"+type+"_messages_button").children("span.notification").text(items[0].NUM);
                var more = items[0].NUM - 5;
                if (more < 0)
                {
                    more = 0;
                }
                $("#"+type+"_more_messages").text(more + " more messages ...");
            }
            else
            {
                $("#"+type+"_more_messages").text("0 more messages ...");
            }
            
            for(var k = 1; k <= 5; k++)
            {
                if (k <= num_items)
                {
                    $("#"+type+"_mes_"+k).css("display", "block");
                }
                else
                {
                    $("#"+type+"_mes_"+k).css("display", "none");
                }
            }
            for(var i = 0; i < num_items && i < 5; i++)
            {
                if(items[i])
                {


					if(items[i].MSG_TYPE == 'sendmessage'){
						$("#"+type+"_mes_"+(i+1)).css('background-color','#22aeff');
					}else if(items[i].MSG_TYPE == 'patientdetailmed'){
						$("#"+type+"_mes_"+(i+1)).css('background-color','#54bc00');
					}


                    var isDoctor = 0;
                    if(type === 'doctor')
                    {
                        isDoctor = 1;
                    }
                    $("#"+type+"_mes_"+(i+1)).children("div.imes").children("div.iauthor").text(items[i].NAME_sender);
                    $("#"+type+"_mes_link_"+(i+1)).attr("name", items[i].ID);
                    var text = items[i].CONTENT;
                    if (text.length > 110);
                    {
                        text = text.substr(0, 106) + " ...";
                    }
                    $("#"+type+"_mes_"+(i+1)).children("div.imes").children("div.itext").text(text);
                    if (items[i].PIC.indexOf('<div') == -1)
                    {
                        $("#"+type+"_mes_"+(i+1)).children("div.iavatar").html('<img src="'+items[i].PIC+'" alt="">');
                    }
                    else
                    {
                        $("#"+type+"_mes_"+(i+1)).children("div.iavatar").html(items[i].PIC);
                    }
                }
                
            }
            $("#"+type+"_messages_indicator").css("display", "none");
            load_next();
        });
    
        
    };  
    
            
    function checkImage(src) {
        var CheckResult = 0;
        $.ajax({
            url: src,
            type: "POST",
            dataType: "image",
            success: function() {
                CheckResult = 1;
            },
            error: function(){
               /* function if image doesn't exist like hideing div or setting default image
              } 
        });	  
    
        return CheckResult;
    }
    
    
    function GetTimeLineBOX(unread)
    {
        $("#WaitTW").css('visibility','visible');
        var queMED = $("#MEDID").val();
        var queUrl ='getInboxMessageUNREAD.php?IdMED='+queMED+'&patient=-1'+'&unread='+unread;		
        
        //alert (queUrl);
        
        $.ajax(
        {
            url: queUrl,
            dataType: "json",
            async: false,
            success: function(data)
            {
                //alert('Data Fetched');
                NewMES = data.items;
                //NewMESArray = data.items;
            }
        });
    
        Pa = NewMES.length;
        TotalMes = Pa;
        $('#RCounter').html('1 of '+Pa);
        //alert (Pa);
        $('#NewMES').css('width',Pa*470);
        var n=0;
        MesTimeline = '';
        while (n < Pa)
        {
            var queini = NewMES[n].MessageINIT.charCodeAt(0); 
            var whatcolor = 'RGB()';
            switch (true)
            {
                case (queini == 0):
                    result = "Equals Zero.";
                    break;
                case ((queini >= 64) && (queini <= 78)):		
                    whatcolor = '#0066CC';
                    break;
                case ((queini >= 79) && (queini <= 100)):		
                    whatcolor = '#00CC66';
                    break;
                case ((queini >= 101) ):		
                    whatcolor = '#663300';
                    break;
            }
            var formatDateP = new Date(NewMES[n].MessageDATE);
            var m_names = new Array("January", "February", "March","April", "May", "June", "July", "August", "September","October", "November", "December");
            var formatDate = m_names[formatDateP.getMonth()] + ' ' + formatDateP.getDay() + ', '+ formatDateP.getFullYear();
            MesTimeline = MesTimeline + '<div style="float:left; width:465px; margin-top:5px;">'; 
                MesTimeline = MesTimeline + '<div style="float:left; width:45px; margin-left:10px;">'; 
                    if (n==2) 
                        {
                        MesTimeline = MesTimeline + '<img src="images/PersonalPicSample.jpeg" style="margin-left:0px; width: 40px; height: 40px; border:#cacaca; margin-top:13px;" class="img-circle">';
                        }
                    else
                    {
                        MesTimeline = MesTimeline + '<div class="LetterCircleON" style="width:40px; height:40px; font-size:12px; margin-left:0px; background-color:' + whatcolor + ';"><p style="margin:0px; padding:0px; margin-top:13px;">'+ NewMES[n].MessageINIT +'</p></div>	';
                    }	
                MesTimeline = MesTimeline + '</div>'; 
    
                MesTimeline = MesTimeline + '<div style="float:left; width:380px; margin-left:10px; <!--border-bottom:thin dotted #cacaca;-->">'; 
                    MesTimeline = MesTimeline + '<p style="font-weight:bold; font-size:14px; ">' +  NewMES[n].MessageSEND + '<span style="color:#cacaca; float:right; font-size:12px; font-weight:normal;">    ' + formatDate + '</span> ' + '</p>' ;
                    MesTimeline = MesTimeline +  '<p style="color:grey; font-weight:bold; font-size:12px; margin-bottom:0px; margin-top:-10px;">' + NewMES[n].MessageSUBJ + '</p>';
                    MesTimeline = MesTimeline +  '<p style="color:grey; margin-bottom:0px; line-height:100%; ">' + NewMES[n].MessageCONT.replace(/sp0e/gi," ") + '</p>';
                    
                    var splitted = NewMES[n].MessageRIDS.split(" ");
                    NumReports = splitted.length - 1;
                    if (NumReports>0)
                    {
                        MesTimeline = MesTimeline + '<div style="margin:0 auto; margin-top:10px; width:95%; border:solid #cacaca; border-radius:5px; height:80px;">'; 
                            //MesTimeline = MesTimeline + NumReports + ' Reports.  ';
                            var rn = 0;
                            while (rn < NumReports)
                            {
                                var cadena = 'DecryptFileId.php?reportid='+splitted[rn]+'&queMed='+queMED;
                                var RecTipo = LanzaAjax (cadena);
                                var thumbnail = RecTipo.substr(0,RecTipo.indexOf("."))+'.png';
                                MesTimeline = MesTimeline + '<img class="ThumbTimeline" id="'+splitted[rn]+'" style="height:70px; margin:5px; border:solid 1px #cacaca;" src="temp/'+queMED+'/PackagesTH_Encrypted/'+thumbnail+'">';
                                rn++;
                            }
                        MesTimeline = MesTimeline + '</div>'; 
                    }	
                    
                    MesTimeline = MesTimeline +  '<p style="color:#cacaca; font-size:10px; margin-left:50px; margin-top:5px;"> <span style="margin-right:15px;"><i style="font-size:10px; margin-right:5px;" class="icon-mail-reply"></i>Reply</span><span style="margin-right:15px;"><i style="font-size:10px; margin-right:5px;" class="icon-arrow-right"></i>Forward</span><span style="margin-right:15px;"><i style="font-size:10px; margin-right:5px;" class="icon-bookmark"></i>Mark</span></p>';
                MesTimeline = MesTimeline + '</div>'; 
                
                
            MesTimeline = MesTimeline + '</div>'; 
            
            n++;
        }
        
        if (MesTimeline == '')
        {
            MesTimeline = '<div id="WaitTW" style="position:relative; top:80px; left:150px; height:40px; width:50px; visibility:visible;"><icon class="icon-check icon-3x " style="color:#22aeff;"></icon>  No new messages</div>';
            $('#RCounter').html('      ');
            $("#NewMES").css('width','300px');
            $("#WaitTW").css('visibility','visible');
        }
        $('#NewMES').html(MesTimeline);
        //$('#TextMES').html(MesTimeline);
    
            
    }
    
    function HideTWWait()
    {
        $("#WaitTW").css('visibility','hidden');
        //$("#WaitTW").hide();
    
        
    }	
    
    $('#NewMES').live('click',function(){
        /*
        $("#WaitTW").css('visibility','visible');
        alert ('ok');
        $.when(GetTimeLine()).then(HideTWWait());
        
        GetTimeLine(0,'doctor');	
    });
    
    //$(".MessageItem").live('click',function() {
    /*$(".RightZone").live('click',function() {
         var myClass = $(this).attr("id");  //Message ID
         var myClass2 = $(this).attr("id2");  // Patient ID
         var myClass3 = $(this).attr("id3");  // Sender ID
         //alert (myClass+' '+myClass2+' '+myClass3);
         
         var cadena='setMessageStatus.php?msgid='+myClass;
         var RecTipo=LanzaAjax(cadena);
         var WLink="patientdetailMED-new.php?IdUsu="+myClass2; 
         window.location.href = WLink;
    });
    
    $("#PatientMessagesButton").live('click',function(e) {
        window.open('Messages.php','_self',false);
        e.preventDefault();
    });
    $("#DoctorMessagesButton").live('click',function(e) {
        window.open('Messages.php?isDoctors=1','_self',false);
        e.preventDefault();
    });*/
    
    $(".ThumbTimeline").live('click',function() {
         var myClass = $(this).attr("id");
         var cadena = '/DecryptFileId.php?reportid='+myClass	+'&queMed='+med_id;
         var RecTipo = LanzaAjax (cadena);
         //var thumbnail = RecTipo.substr(0,RecTipo.indexOf("."))+'.png';
         var thumbnail = RecTipo;
         var src='temp/'+med_id+'/Packages_Encrypted/'+thumbnail;		
         
         //alert (src);
        $('#myModal').css('display','inline'); 
        
         $("#LaunchModal").trigger("click");
         $('#ZoomedIframe').attr('src',src);
    //		 $('#ZoomedIframe').attr('src',src);				
    //		 $('#ZoomedIframe').css('display','inline');				
    });
    
    $('body', $('#ZoomedIframe').contents()).click(function(event) {
             $('#ZoomedIframe').css('display','none');
    });
    
    
    $('#TypeAccount').bind('click mousedown keydown', function(event) {
        
        getNumRepViewUser();
        getNumActiveUsers();
        getNumRepUpUser();
        
        });
    
    function getNumRepViewUser()
    {
        var queMED = $("#MEDID").val();
        var queGroup = group_id;
        var queUrl ='CheckNumRepViewPat.php?MEDID='+queMED+'&GROUPID='+queGroup;
        var NumRepViewUser = LanzaAjax (queUrl);
        $('#NumRepViewUser').html(NumRepViewUser);
    }
    function getNumActiveUsers()
    {
        var queMED = $("#MEDID").val();
        var queGroup = group_id;
        var queUrl ='CheckNumActiveUsers.php?MEDID='+queMED+'&GROUPID='+queGroup;
        var NumActiveUsers = LanzaAjax (queUrl);
        $('#NumActiveUsers').html(NumActiveUsers);
    }
    function getNumRepUpUser()
    {
        var queMED = $("#MEDID").val();
        var queGroup = group_id;
        var queUrl ='CheckNumRepUpUser.php?MEDID='+queMED+'&GROUPID='+queGroup;
        var NumRepUpUser = LanzaAjax (queUrl);
        $('#NumRepUpUser').html(NumRepUpUser);
    }
    
    
    function daysBetween( date1, date2 ) {
        //Get 1 day in milliseconds
        var one_day=1000*60*60*24;
        var one_hour=1000*60*60;
        
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        
        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        
        // Convert back to days and return
        return [Math.round(difference_ms/one_day), Math.round(difference_ms/one_hour)]; 
    }
    
        
        
    /*$('body').bind('mousedown keydown', function(event) {
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
    });*/
    
    //<!--xH2MTRAY-->
    
    $('#DivAv').bind('click', function(event) {
        var audio = document.getElementsByTagName("audio")[0];
        audio.play();
        
        var n=0;
        function loop() {
            $('.H2MInText').css({opacity: 1.0});
            $('.H2MInText').animate({opacity: 0.2}, 400, function() {
                if (n<10)
                    {
                        loop();
                        n++;
                    }
                else
                    {
                        var audio = document.getElementsByTagName("audio")[0];
                        audio.play();
                        $('.H2MInText').css({opacity: 1.0});
                        $(".H2MTSCont").animate({ scrollLeft: 300}, 1475);
                    }	
            });
        }
        loop();
    });
                
    $('#DivDoctors').bind('click mousedown keydown', function(event) {
        if (Privilege == '1') 
            window.location.replace('medicalConnections.php');
        else
            window.location.replace('Patients.php');
            
    });
    $('#DivPatients').bind('click mousedown keydown', function(event) {
        if (Privilege == '1') 
            window.location.replace('PatientNetwork.php');
        else
            window.location.replace('Patients.php');
    });
    $('#DivEMR').bind('click mousedown keydown', function(event) {
        if (Privilege == '1') 
            window.location.replace('dashboard.php');
        else
            window.location.replace('Patients.php');
    });
    
    
    //Member Search Functions
    function searchMember() {
        $('#searchUserGrid').show();
        $('#Wait1').show(); 
        var queMED = $("#MEDID").val();
        var UserInput = $('#SearchUser').val();
        var onlyGroup=0;
        if ($('#RetrievePatient').is(":checked")){
        onlyGroup=1;
        }else{
        onlyGroup=1; //Chnaged the value from 1 to 0
        }

         if(UserInput===""){
            UserInput=-111;
            searchAllPatientCounter++;
         }else{
            searchAllPatientCounter=0;
            //LIMIT=10;
            OFFSET=0;
            //windowSize=standardsize;
         }

         /*if(searchAllPatientCounter>1){
            //LIMIT=LIMIT+10;
            OFFSET=OFFSET+10;
         }*/

        var queUrl ='getFullUsersMEDNEW.php?Usuario='+UserInput+'&IdMed='+queMED+'&Group='+onlyGroup+'&OFFSET=0&LIMIT=20';


        //$("#stream_indicator").css("display", "block");
        //$('#Wait1').show(); 
        //alert('calling ajax');

        setTimeout(function(){ 
             //$('#TablaPac').html("");
            $.ajax(
               {
               url: queUrl,
               dataType: "html",
               async: true,
               cache:false,
               complete: function(){ //alert('Completed');
                        },
               success: function(data) {
                        if (typeof data == "string") {
                                    RecTipo = data;
                                    //$('#TablaPac').html(RecTipo);
                                    if(OFFSET==0){
                                        $('#TablaPac').empty();
                                        $('#TablaPac').html(RecTipo);
                                    }else{
                                        $('#TablaPac').append(RecTipo);
                                    } 		
                                    //alert('done');
                                    setTimeout(function(){ 
                                    //$("#stream_indicator").css("display", "none");
                                    $('#Wait1').hide();  
                                },100);

                           }

                         },
               error: function(data){
                     $('#TablaPac').html(RecTipo);
               }

            });

            

            //$('#TablaPac').trigger('update');

      },200);
    }

 	//$('#TablePac').append();
 	var searchAllPatientCounter=0;

 	//var LIMIT=10;
 	var OFFSET=0;
 	/*var standardsize=$(window).height()/3;		//This depends on the size of the window
    
	console.log('windowsize');
 	console.log($(window).height());
    console.log('standardsize');
 	console.log(standardsize);

 	var windowSize=standardsize;

 	$(window).scroll(function() {
 		console.log('scroll position');
	 	console.log($(window).scrollTop());

	 	if(($(window).scrollTop()>windowSize)&&($('#SearchUser').val()==="")){
            
	 		 //alert("reached bottom");
	 		 searchMember();
	 		 windowSize+=standardsize;
            
            
            console.log('scrollTop');
            console.log($(window).scrollTop());
             console.log('standardsize');
            console.log(windowSize);
	 	}
	});*/

    /*$("#SearchUser").typeWatch({
				captureLength: 1,
				callback: function(value) {
					searchMember();
                     //$('#Wait1').hide();
					//alert('searching');
				}
	});*/
	$("#RetrievePatient").click(function(event) {
   		 searchMember();
         //$('#Wait1').hide();  
   	});
        
    //$.ajaxSetup({ cache: false });
    $("#SearchUser").bind('keypress', function(e) {
        var code = e.keyCode || e.which;
        if (code == 13) $("#BotonBusquedaPac").trigger('click');
    });    
    
    $("#BotonBusquedaPac").click(function(event) {
        searchMember();
    });
    
    $(".CFILA").live('click',function() {
     	var myClass = $(this).attr("id");
		var queMED = $("#MEDID").val();
		document.getElementById('UserHidden').value=myClass;
		//alert(document.getElementById('UserHidden').value);
		window.location.replace('patientdetailMED-new.php?IdUsu='+myClass);
		//alert("Here");
     	//window.location.replace('patientdetailMED.php');
    }); 
    
    //member search functions end
         

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
 
	

});        


