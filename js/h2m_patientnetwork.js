var med_id = $('#MEDID').val();
var load_patient = $("#LOADPATIENT").val();

function grabTimeline(id){
    var IdMed = $('#MEDID').val();
    var queUrl2 ='display_timeline.php?doctor='+IdMed+'&patient='+id+'&max=50&index='+id;

    var ContentDyn = "";
    $.ajax(
        {
            url: queUrl2,

            success: function(data)
            {
                ContentDyn = data;
                $('#timeline'+id).html(ContentDyn);
                //$('#timeline'+id).html('timeline');
                ////console.log(ContentDyn);
            }
        });


}

//SETS NEW APPOINTMENT CREATED BY DOCTOR/////////////////////////////
function createDoctorAppointmentPhone(doc, mem){
    var timeslot_holder = $('#time_holder').val();
    var dateslot_holder = $('#date_holder').val();

    if(timeslot_holder == '8am - 10am'){
        var timeslot_holder_start = '08:00:00';
        var timeslot_holder_end = '10:00:00';
    }else if(timeslot_holder == '10am - 12pm'){
        var timeslot_holder_start = '10:00:00';
        var timeslot_holder_end = '12:00:00';
    }else if(timeslot_holder == '12pm - 2pm'){
        var timeslot_holder_start = '12:00:00';
        var timeslot_holder_end = '14:00:00';
    }else if(timeslot_holder == '2pm - 4pm'){
        var timeslot_holder_start = '14:00:00';
        var timeslot_holder_end = '16:00:00';
    }else if(timeslot_holder == '4pm - 6pm'){
        var timeslot_holder_start = '16:00:00';
        var timeslot_holder_end = '18:00:00';
    }else if(timeslot_holder == '6pm - 8pm'){
        var timeslot_holder_start = '18:00:00';
        var timeslot_holder_end = '20:00:00';
    }else if(timeslot_holder == '8pm - 10pm'){
        var timeslot_holder_start = '20:00:00';
        var timeslot_holder_end = '22:00:00';
    }

    $.get("createDoctorAppointment.php?type=0&member="+mem+"&doctor="+doc+"&timestart="+timeslot_holder_start+"&timeend="+timeslot_holder_end+"&date="+dateslot_holder,function(data,status)
          {
        alert('Your appointment has been created.');
    });
}

function createDoctorAppointmentVideo(doc, mem){
    var timeslot_holder = $('#time_holder').val();
    var dateslot_holder = $('#date_holder').val();

    if(timeslot_holder == '8am - 10am'){
        var timeslot_holder_start = '08:00:00';
        var timeslot_holder_end = '10:00:00';
    }else if(timeslot_holder == '10am - 12pm'){
        var timeslot_holder_start = '10:00:00';
        var timeslot_holder_end = '12:00:00';
    }else if(timeslot_holder == '12pm - 2pm'){
        var timeslot_holder_start = '12:00:00';
        var timeslot_holder_end = '14:00:00';
    }else if(timeslot_holder == '2pm - 4pm'){
        var timeslot_holder_start = '14:00:00';
        var timeslot_holder_end = '16:00:00';
    }else if(timeslot_holder == '4pm - 6pm'){
        var timeslot_holder_start = '16:00:00';
        var timeslot_holder_end = '18:00:00';
    }else if(timeslot_holder == '6pm - 8pm'){
        var timeslot_holder_start = '18:00:00';
        var timeslot_holder_end = '20:00:00';
    }else if(timeslot_holder == '8pm - 10pm'){
        var timeslot_holder_start = '20:00:00';
        var timeslot_holder_end = '22:00:00';
    }

    $.get("createDoctorAppointment.php?type=1&member="+mem+"&doctor="+doc+"&timestart="+timeslot_holder_start+"&timeend="+timeslot_holder_end+"&date="+dateslot_holder,function(data,status)
          {
        alert('Your appointment has been created.');
    });
}
///////////////////////////////////////////////////////////////

//THIS BUILD THE DONUT GRAPH WITH GRAPH.JS/////////////////////////
var vg_probe = $("#vg_probe").val();
var g_probe = $("#g_probe").val();
var n_probe = $("#n_probe").val();
var b_probe = $("#b_probe").val();
var vb_probe = $("#vb_probe").val();
var total_probe = $("#total_probe").val();

//340 degrees is used to accommodate for 4 degrees between each section............
var vg_piece = vg_probe / total_probe * 340;
var g_piece = g_probe / total_probe * 340;
var n_piece = n_probe / total_probe * 340;
var b_piece = b_probe / total_probe * 340;
var vb_piece = vb_probe / total_probe * 340;

var points = (((vg_probe * 5) + (g_probe * 4) + (n_probe * 3) + (b_probe * 2) + (vb_probe * 1)) / (total_probe * 5)) * 100;
var rounded = points.toFixed(2);

////console.log('vg:'+vg_probe+'g:'+g_probe+'n:'+n_probe+'b:'+b_probe+'vb:'+vb_probe+'t:'+total_probe+'%:'+rounded);
$("span#health_percent").text(rounded+'%');

/*var data = [{
    value: vg_piece,
    color: "#2E2EFE",
    label:'Very Good'
}, {
    value: g_piece,
    color: "#A9A9F5",
    label:'Good'
}, {
    value: n_piece,
    color: "#F2F2F2",
    label:'Normal'
}, {
    value: b_piece,
    color: "#F5A9A9",
    label:'Bad'
}, {
    value: vb_piece,
    color: "#FE2E2E",
    label: 'Very Bad'
}

           ]

var options = {
    animation: true,
    animationSteps:75
};

//Get the context of the canvas element we want to select
var c = $('#myChart');
var ct = c.get(0).getContext('2d');
var ctx = document.getElementById("myChart").getContext("2d");*/
/*************************************************************************/
//myNewChart = new Chart(ct).Doughnut(data, options);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//THIS IS FOR SETTING NEW APPOINTMENTS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS PULLS THE CALENDAR WHERE YOU CAN CHOOSE A NEW DATE AND TIMESLOT///////////////////////////////////
function pullCalendar(holder, member){
    var doc_id = $('#MEDID').val();
    var link2 = 'getTimeslotAppointments.php?docid='+doc_id+'&holder='+holder+'&member='+member;
    $.ajax({
        url: link2,
        dataType: "html",
        async: true,
        success: function(data)
        {
            $('#make_appointment').html(data);
        }
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS ALTERS THE TIMESLOT YOU ARE CURRENTLY VIEWING/////////////////////////////////////////////////////////
var time_dialog = $( "#make_appointment" ).dialog( "option", "title");
function setTimeSlot(time){
    var timeslot_holder = $('#time_holder').val(time);
    var dateslot_holder = $('#date_holder').val();
    //THIS WILL CHANGE THE TITLE OF THE TIMESLOT BOX TO MATCH THE NEW TIMESLOT............
    time_dialog.dialog( "option", "title", "Selected Timeslot : "+dateslot_holder+" @ "+time );
    if(timeslot_holder > '' && dateslot_holder > ''){
        $("button#button_appointment_phone").removeAttr("disabled");
        $("button#button_appointment_video").removeAttr("disabled");
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THIS SETS THE ACTUAL DATE FOR THE NEW DATESLOT///////////////////////////////////////////////////
var date_dialog = $( "#make_appointment" ).dialog( "option", "title");
function setDateSlot(date){
    var dateslot_holder = $('#date_holder').val(date);
    var timeslot_holder = $('#time_holder').val();
    //THIS WILL CHANGE THE TITLE OF THE TIMESLOT BOX TO MATCH THE NEW DATESLOT............
    date_dialog.dialog("option", "title", "Selected Timeslot : "+date+" @ "+timeslot_holder);
    if(timeslot_holder > '' && dateslot_holder > ''){
        $("button#button_appointment_phone").removeAttr("disabled");
        $("button#button_appointment_video").removeAttr("disabled");
    }
}
///////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var time_stop = 0;
function setGrabQuery2()
{
    if(time_stop == 0){
        time_stop = 1;
        //getPatientList();
        $('#BotonBusquedaProbe').trigger('click');
        $('#BotonBusquedaPending').trigger('click');
        $('#newinbox').trigger('click');
        $('#connect_spinner').css('display', 'none');
        //alert('mouse moved!');
    }
}


var currpage = 1; //for probe paging
var paciente='';
var destino='';
var IdPaciente = -1;
var GRelType = -1;
var GKnows = -1;
var GlobalIdUser = -1;
var IdDoctor = -1;
var timeoutTime = 30000000;
//var timeoutTime = 300000;  //5minutes
var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);

$('#PendingTasks').hide(); 
$('#OLDpatientstable').hide(); 

var reportcheck = new Array();

var active_session_timer = 60000; //1minute
var sessionTimer = setTimeout(inform_about_session, active_session_timer);
var gconn=0;

$(window).load(function() {

    //alert("started");
    $(".loader_spinner").fadeOut("slow");

})

/*function setGrabQuery3()
{
    var userSurname = $('#SearchUserUSERFIXED').val();
    var IdMed = $('#MEDID').val();
    var UserDOB = '';
    var queUrl ='getPatientNetworkStatsRedesign.php?Usuario='+userSurname+'&UserDOB='+UserDOB+'&IdDoc='+IdMed;


    $.ajax({
        url: queUrl,
        success: function(data){
            //alert(data);
            var res = data.split("::");
            //alert(res[0] + '   ' + res[1]);
            var UConn = res[0];
            gconn=UConn;
            var UTotal = res[1];
            var UProbe = res[2];
            var TotMsg = res[3];
            var TotUpDr = res[4];
            var TotUpUs = res[5];

            $('#TotMsgV').html(TotMsg);
            $('#TotUpDrV').html(TotUpUs);
            $('#TotUpUsV').html(UProbe);
            if (TotMsg > 0) $('#TotMsgV').css('visibility','visible');
            if (TotUpUs > 0) $('#TotUpDrV').css('visibility','visible');
            if (UProbe > 0) $('#TotUpUsV').css('visibility','visible');

            //alert(UProbe);
            titulo = 'Percentage of your members probe responses, reflecting overall health of your members.';
            $('#gaugetitulo').attr('Title',titulo);

            $('#TotPats').css('font-size','50px');
            $('#TotPats').css('color','#22aeff');
            $('#TotPats').html(UTotal);
            $('#TotPatsD').css('background-color','#22aeff');
            $('#TotPatsD').css('border','1px solid #22aeff');

            $('#TotConn').css('font-size','50px');
            $('#TotConn').css('color','#54bc00');
            $('#TotConn').html(UConn);
            $('#TotConnD').css('background-color','#54bc00');
            $('#TotConnD').css('border','1px solid #54bc00');

            /*
				 $('#StatsPat').css('font-size','50px');
				 $('#StatsPat').css('color','#FF8000');
				 $('#StatsPat').html(pases);
				 $('#StatsPatN').css('font-size','16px');
				 $('#StatsPatN').css('color','#FF8000');
				 $('#StatsPatN').html(' x% from reach');
				 $('#StatsPatD').css('background-color','#FF8000');
				 $('#StatsPatD').css('border','1px solid #FF8000');
				*//*

            $(".gauge_spinner").hide();





        }
    });



}*/


var summary_holder = $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true, autoOpen: false});

function openSummary(id)
{
    var myClass = id;
    $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
    summary_holder.dialog('open');
}


var vitals_holder = $("#vitals-window").dialog({bigframe: true, width: 600, height: 350, resize: false, modal: true, autoOpen: false});

function openVitalsWindow(id,type)
{
	var translationdel = '';

		if(language == 'th'){
		translationdel = 'Bor';
		}else if(language == 'en'){
		translationdel = 'Del';
		}
		
	if(type == 'meds'){
	var MedicationData;
		var queUrl ='getMedications.php?IdUsu='+id;
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				MedicationData = data.items;
                
                
			}
		});
	
		numMedications = MedicationData.length;
	
		var n = 0;
		var MedicationBox
		if (numMedications==0)
		{
		var translation51 = '';

		if(language == 'th'){
		translation51 = 'No se encontraron datos';
		}else if(language == 'en'){
		translation51 = 'No Data Found';
		}
			MedicationBox='<span>'+translation51+'</span>';
		}
		else
		{
			MedicationBox='';
		}
		
		while (n<numMedications){
			var del = MedicationData[n].deleted;
			var drugname = MedicationData[n].drugname;
			var frequency = MedicationData[n].frequency;
			var dossage = MedicationData[n].dossage;
			var rowid = MedicationData[n].id;	
			if(del==0)
			{
			MedicationBox += '<div class="InfoRow">';
			
			
			var f=1;
			var d=1;
			
			if(frequency=='' || frequency==null)
			{
				f=0;
			}
			
			if(dossage=='' || dossage==null)
			{
				d=0;
			}
			
			var middlecolumn='Unknown';
			
			switch(f)
			{
				case 0:	switch(d)
						{
							case 0:middlecolumn='Unknown';
								   break;
							case 1:middlecolumn=dossage;
								   break;
						}
						break;
				
				case 1:switch(d)
						{
							case 0:middlecolumn=frequency;
								   break;
							case 1:middlecolumn=frequency + ' for ' + dossage;
								   break;
						}
						break;
			}
			
			
					MedicationBox += '<div style="width:160px; float:left; text-align:left;"><span class="PatName">'+drugname.substr(0,15)+'...</span></div>';
					MedicationBox += '<div style="width:200px; float:left; text-align:left; color:#22aeff;"><span class="DrName">'+middlecolumn +' </span></div>';
					MedicationBox += '';
					MedicationBox += '';
				
			
			MedicationBox += '</div>';
			}
			n++;
		}
		$('#vitals-window').html(MedicationBox);
		vitals_holder.dialog('open');
	}
	
	if(type == 'family'){
		var queUrl ='getRelatives.php?IdUsu='+id;
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				RelativesData = data.items;
			}
		});
	
		numRelatives = RelativesData.length;
	
		var n = 0;
		var RelativesBox
		if (numRelatives==0)
		{
		var translation51 = '';

		if(language == 'th'){
		translation51 = 'No se encontraron datos';
		}else if(language == 'en'){
		translation51 = 'No Data Found';
		}
			RelativesBox='<span>'+translation51+'</span>';
		}
		else
		{
			RelativesBox='';
		}
		
		while (n<numRelatives){
			var del = RelativesData[n].deleted;
			var relativename = RelativesData[n].relative;
			var relativetype = RelativesData[n].relativetype;
			var disease = RelativesData[n].disease;
			var diseasegroup = RelativesData[n].diseasegroup;
			var ICD10 = RelativesData[n].ICD10;
			var ICD9 = RelativesData[n].ICD9;
			var ageevent = RelativesData[n].atage;
			var rowid = RelativesData[n].id;	

			var middlecolumn = disease + ' @ '+ageevent;
			if(del==0)
			{
			RelativesBox += '<div class="InfoRow">';
			
			
					RelativesBox += '<div style="width:180px; float:left; text-align:left;"><span class="PatName">'+relativename+'</span></div>';
					RelativesBox += '<div style="width:150px; float:left; text-align:left; color:#22aeff;"><span class="DrName">'+middlecolumn +' </span></div>';
					RelativesBox += '';
					RelativesBox += '';
			
			
			RelativesBox += '</div>';
			}
			n++;
		}
		$('#vitals-window').html(RelativesBox);
		vitals_holder.dialog('open');
	}
	
	if(type == 'vacc'){
		var queUrl ='getVaccines.php?IdUsu='+id;
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				VaccinesData = data.items;
			}
		});
	
		numVaccines = VaccinesData.length;
	
		var n = 0;
		var VaccinesBox
		if (numVaccines==0)
		{
		var translation51 = '';

		if(language == 'th'){
		translation51 = 'No se encontraron datos';
		}else if(language == 'en'){
		translation51 = 'No Data Found';
		}
			VaccinesBox='<span>'+translation51+'</span>';
		}
		else
		{
			VaccinesBox='';
		}
		
		while (n<numVaccines){
			var del = VaccinesData[n].deleted;
			var VaccCode = VaccinesData[n].VaccCode;
			var VaccName = VaccinesData[n].VaccName;
			var AllerCode = VaccinesData[n].AllerCode;
			var AllerName = VaccinesData[n].AllerName;
			var intensity = VaccinesData[n].intensity;
			var dateEvent = VaccinesData[n].dateEvent;
			var ageEvent = VaccinesData[n].ageEvent;

			var rowid = VaccinesData[n].id;	

			if (VaccName != '')
			{
				var isAllergy = 0;
				var leftcolumn = VaccCode;
				var middlecolumn = 'at '+ ageEvent+' of age';
			

			if(del==0)
			{
			VaccinesBox += '<div class="InfoRow">';
					
			
					VaccinesBox += '<div style="width:180px; float:left; text-align:left;"><span class="PatName">'+leftcolumn+'</span></div>';
					VaccinesBox += '<div style="width:300px; float:left; text-align:left; color:#22aeff;"><span class="DrName">'+middlecolumn +' </span></div>';
					VaccinesBox += '';
					VaccinesBox += '';
			
			
			VaccinesBox += '</div>';
			}
			}
			n++;
	
		}
		$('#vitals-window').html(VaccinesBox);
		vitals_holder.dialog('open');
	}

	if(type == 'aller'){
		var queUrl ='getVaccines.php?IdUsu='+id;
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				VaccinesData = data.items;
			}
		});
	
		numVaccines = VaccinesData.length;
	
		var n = 0;
		var VaccinesBox
		if (numVaccines==0)
		{
		var translation51 = '';

		if(language == 'th'){
		translation51 = 'No se encontraron datos';
		}else if(language == 'en'){
		translation51 = 'No Data Found';
		}
			VaccinesBox='<span>'+translation51+'</span>';
		}
		else
		{
			VaccinesBox='';
		}
		
		
		while (n<numVaccines){
			var del = VaccinesData[n].deleted;
			var VaccCode = VaccinesData[n].VaccCode;
			var VaccName = VaccinesData[n].VaccName;
			var AllerCode = VaccinesData[n].AllerCode;
			var AllerName = VaccinesData[n].AllerName;
			var intensity = VaccinesData[n].intensity;
			var dateEvent = VaccinesData[n].dateEvent;
			var ageEvent = VaccinesData[n].ageEvent;

			var rowid = VaccinesData[n].id;	
   
			if (VaccName == '')
			{
			translation31 = '';
			translation32 = '';
			translation33 = '';
			translation34 = '';
				if(language == 'th'){
		translation31 = 'Alérgico a';
		translation32 = 'desde';
		translation33 = 'de edad';
		translation34 = 'Edición';
		if(AllerName == 'Environmental'){
		AllerName = 'Ambiental';
		} else if(AllerName == 'Foods'){
		AllerName = 'Comidas';
		} else if(AllerName == 'Drugs'){
		AllerName = 'Medicamentos';
		} else if(AllerName == 'Other'){
		AllerName = 'Otros';
		}
		}else if(language == 'en'){
		translation31 = 'Allergic to';
		translation32 = 'since';
		translation33 = 'of age';
		translation34 = 'Editing';
		}
				var isAllergy = 1;
				var leftcolumn = translation31+' '+AllerName;
				var middlecolumn = translation32+' '+ageEvent+' '+translation33;
			
			if(del==0)
			{


			
			VaccinesBox += '<div class="InfoRow">';
					
			
					VaccinesBox += '<div style="width:210px; float:left; text-align:left;"><span class="PatName">'+leftcolumn+'</span></div>';
					VaccinesBox += '<div style="width:140px; float:left; text-align:left; color:#22aeff;"><span class="DrName">'+middlecolumn +' </span></div>';
				
			
			VaccinesBox += '</div>';
			
			}
			}
			n++;
		}
		$('#vitals-window').html(VaccinesBox);
		vitals_holder.dialog('open');
	}

	if(type == 'diag'){
		var queUrl ='getDiagnostics.php?IdUsu='+id;
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				DiagnosticData = data.items;
			}
		});
	
		numDiagnostics = DiagnosticData.length;
	
		var n = 0;
		var DiagnosticBox;
		if (numDiagnostics==0)
		{
		var translation51 = '';

		if(language == 'th'){
		translation51 = 'No se encontraron datos';
		}else if(language == 'en'){
		translation51 = 'No Data Found';
		}
			DiagnosticBox='<span>'+translation51+'</span>';
		}
		else
		{
			DiagnosticBox='';
		}
		
		while (n<numDiagnostics){
			var del = DiagnosticData[n].deleted;
			var dxname = DiagnosticData[n].dxname;
			var dxcode = DiagnosticData[n].dxcode;
			var sdate = DiagnosticData[n].sdate;
			var edate = DiagnosticData[n].edate;	
			var notes = DiagnosticData[n].notes;
			var rowid = DiagnosticData[n].id;	
if(del==0)
			{			
			DiagnosticBox += '<div class="InfoRow DiagnosticRow" id='+rowid+'>';
			
			
			
			var middleColumn = sdate;
			
			if(edate.length>0)
			{
				middleColumn = middleColumn + '-' + edate;
			}
			
			if(notes.length==0)
			{
				notes = 'No Notes Recorded';
			}	
			
					DiagnosticBox += '<div style="width:140px; float:left; text-align:left;cursor:pointer"><span class="PatName" style="white-space:nowrap">'+dxname.substr(0, 15)+'...</span></div>';
					DiagnosticBox += '<div style="width:190px; float:left; text-align:center; color:#22aeff;"><span class="DrName">'+middleColumn +' </span></div>';
					//DiagnosticBox += '<div class="EditDiagnostic" id="'+rowid+'" style="width:60px; float:right;margin-right:10px;"><a id="'+rowid+'"  class="btn" style="height: 15px; padding-top: 0px; margin-top: -5px; color:green;" lang="en">Edit</a></div>';
					//DiagnosticBox += '<div class="DeleteDiagnostic" id="'+rowid+'" style="width:60px; float:right;"><a id="'+rowid+'"  class="btn" style="height: 15px; padding-top: 0px; margin-top: -5px; color:red;" lang="en">'+translationdel+'</a></div>';
											
			
			DiagnosticBox += '</div>';
			
			DiagnosticBox += '<div class="InfoRow NotesRow" id=Note'+rowid;
			
			if(del==0)
			{
				DiagnosticBox += '<div style="width:100%; float:left; text-align:left;">'+notes+'</div>';
			}
			else
			{
				DiagnosticBox += '<div style="width:100%; float:left; text-align:left;"><strike>'+notes+'</strike></div>';
			}
			DiagnosticBox += '</div>';
			}
			n++;
		}
		$('#vitals-window').html(DiagnosticBox);
		vitals_holder.dialog('open');
	}
	
	if(type == 'habits'){
		var link = 'getHabitsInfo.php?IdUsu='+id;
    
    
		$.ajax({
           url: link,
           dataType: "html",
           async: true,
           success: function(data)
           {
				$('#vitals-window').html(data);
				vitals_holder.dialog('open');
           }
        });
	}
}



var create_message = $("#compose_modal").dialog({bgiframe: true, width: 600, height: 500, modal: true, resizable: false, autoOpen: false});
function createMessage(id, full_name)
{
    $("#message_id_holder").val(id);
    $("#message_name_holder").val(full_name);
    $("span#compose_message_recipient_label").text(full_name);
    
    $("#ComposeNewButton").css("display", "block");
    $("#ComposeMessageButton").css("display", "none");
    $("#compose_messages").css("display", "block");
    $("#compose_new").css("display", "none");
    $("#ComposeSendButton").css("display", "none");
    
    // load all of the messages between this doctor and patient
    $.post("get_personal_doctors_messages.php", {doctor: $("#MEDID").val(), patient: id, search: "", tofrom: 'to'}, function(data, status)
    {
        var d = JSON.parse(data);
        $("#compose_messages").empty();
        
        // number of new messages
        var num_new = 0;
        
        // if there is at least one message
        if(d.length > 0)
        {
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
                var html = '<div style="width: 96%; height: 21px; padding: 1%; padding-top: 5px; background-color: #FDFDFD; margin: auto; margin-top: 10px; margin-bottom: 10px; border: 1px solid '+border_color+'; border-radius: 5px; overflow: hidden; text-align: left; color: #888;" data-id="'+d[i].message_id+'">';
                html += '<div style="width: 50%; height: 25px; color: '+color+'; float: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"><span style="color: #444;">Subject: </span>';
                html += d[i].Subject;
                html += '</div><div style="width: 40%; height: 25px; color: '+color+'; float: left;"><span style="color: #444;">Date:</span> ';
                html += d[i].fecha;
                html += '</div><button data-replied="'+d[i].replied+'" style="float: right; background-color: transparent; border: 0px solid #FFF; margin-top: -3px; margin-right: 5px; outline: none;" class="personal_doctor_expand_message"><i class="icon-caret-down"></i></button>';
                html += '<div style="height: 120px; width: 100%; color: #555; font-size: 12px; overflow-y: auto; text-align: left;" >'+d[i].content+'</div>';
                html += '<button class="ComposeReply" style="width: 100%; height: 25px; background-color: #54bc00; color: #FFF; border-radius: 5px; border: 0px solid #FFF; outline: none;">Reply</button>';
                html += '</div>';

                // add the message to the container
                $("#compose_messages").append(html);
            }
        }
        // if there are no messages, tell the user ...
        else
        {
            var html = '<div style="width: 96%; height: 50px; padding: 1%; padding-top: 35px; background-color: #FDFDFD; margin: auto; margin-top: 10px; margin-bottom: 10px; border: 1px dashed #CCC; border-radius: 5px; overflow: hidden; text-align: center; color: #888;">There are no messages from this member.</div>';
            $("#compose_messages").append(html);
        }
        
        
    });
    
    create_message.dialog('open');

}


function createDetails()
{
    swal({title: "Under Construction",   text: "This module is currently under construction.",   imageUrl: "http://png-3.findicons.com/files/icons/990/vistaico_toolbar/256/under_construction.png" });
    
}

$('#ComposeSendButton').live('click',function(e)
                             {
    var compose_selected_user = -1;
    compose_selected_user = $("#message_id_holder").val();
    //console.log(compose_selected_user);
    if(compose_selected_user == -1)
    {
        swal({   title: "Error Sending Message",   text: "Please choose a recipient.",   type: "error",   confirmButtonText: "Ok" });
    }
    else if($("#compose_message_subject").val().length == 0)
    {
        swal({   title: "Error Sending Message",   text: "Please input a message subject.",   type: "error",   confirmButtonText: "Ok" });
    }
    else if($("#compose_message_content").val().length == 0)
    {
        swal({   title: "Error Sending Message",   text: "Please input a message.",   type: "error",   confirmButtonText: "Ok" });
    }
    else
    {


        $.post("updateMessage.php", {mes: 0, scenario: 'patient', type: 'send', IdMED: $("#MEDID").val(), IdRECEIVER: compose_selected_user, SUBJECT: $("#compose_message_subject").val(), MESSAGE: $("#compose_message_content").val(), message_type: 'patientnetwork'}, function(data, status)

        {
            create_message.dialog('close');
            swal({title: 'Done!', text: 'Your message has been sent to '+$("#message_name_holder").val()+'.', type: "success", confirmButtonText: "Ok"});
        });
    }
    e.preventDefault();
});
$('#ComposeCancelButton').live('click',function(e)
{
    create_message.dialog('close');
});
$('#ComposeNewButton').live('click', function()
{
    $("#ComposeNewButton").css("display", "none");
    $("#ComposeMessageButton").css("display", "block");
    $("#compose_messages").css("display", "none");
    $("#compose_new").css("display", "block");
    $("#ComposeSendButton").css("display", "block");
    $("#compose_message_content").val("");
    $("#compose_message_subject").val("");
});
$('#ComposeMessageButton').live('click', function()
{
    $("#ComposeNewButton").css("display", "block");
    $("#ComposeMessageButton").css("display", "none");
    $("#compose_messages").css("display", "block");
    $("#compose_new").css("display", "none");
    $("#ComposeSendButton").css("display", "none");
});
// this click event is used to expand and read messages from the personal doctor in the messages modal window
$("body").on('click', ".personal_doctor_expand_message", function()
{
    if($(this).children().eq(0).hasClass("icon-caret-down"))
    {
        // expand message
        $(this).children().eq(0).removeClass("icon-caret-down").addClass("icon-caret-up");
        $(this).parent().animate({height: '170px'}, 500/*{duration: 500, easing: 'easeInOutQuad'}*/);
        
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
        $(this).parent().animate({height: '21px'}, 500 /* {duration: 500, easing: 'easeInOutQuad'}*/);
    }
});
$("body").on('click', ".ComposeReply", function()
{
    $("#compose_message_subject").val("RE: " + $(this).parent().children().eq(0).text().substr(9));
    $("#ComposeNewButton").css("display", "none");
    $("#ComposeMessageButton").css("display", "block");
    $("#ComposeSendButton").css("display", "block");
    $("#compose_messages").css("display", "none");
    $("#compose_new").css("display", "block");
    $("#compose_message_content").val("");
});


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

function ShowTimeOutWarning()
{
    alert ('Session expired');
    var a=0;
    window.location = 'timeout.php';
}

function getScript(url)
{
    $.ajax(
    {
        url: url,
        dataType: "script",
        async: false
    });
}

function displaynotification(status,message){
    getScript('realtime-notifications/lib/gritter/js/jquery.gritter.min.js');
    var gritterOptions = {
        title: status,
        text: message,
        image:'images/Icono_H2M.png',
        sticky: false,
        time: '10000'
    };
    $.gritter.add(gritterOptions);

}


//setTimeout(function(){
//    $('#newinbox').trigger('click');},2000);

$(document).ready(function() {
    var NNot = 0;
        //parseInt($("#NNot").val());
    var NCon = 0;
        //parseInt($("#NCon").val());
    function headerStackFill(NNot, NCon) {
        //stacked bar tracking header

        //var NTra = parseInt($("#NTra").val());
        var max_width = 350;
        var numpatients = NNot+NCon;
        var conversion = max_width / numpatients;

        $( ".NNot" ).animate({width: (NNot*conversion)}, 500, function() { });
        $("#NNot_green").html(NNot);
        $( ".NCon" ).animate({width: (NCon*conversion)}, 500, function() { });
        $("#NCon_green").html(NCon);
        /*$(".NTra").width(NTra*conversion);
        $( ".NTra" ).animate({width: (NTra*conversion)}, 500, function() { });
        $("#NTra_green").html(NTra);*/

        $(".NNot_label").width(350/2);
        $(".NCon_label").width(350/2);
        //$(".NTra_label").width(450/3);

        $('#container_NNot').html('<i class="fa fa-chain-broken" style="color:#b8b8b8;"> </i> <span>Not Connected: <strong>'+NNot+'</strong></span>');

        $('#container_NCon').html('<i class="fa fa-link" style="color:#b8b8b8;"> </i> <span>Connected: <strong>'+NCon+'</strong></span>');
        //$('#container_NTra').html('<i class="fa fa-tag" style="color:#b8b8b8;"> </i> <span>Tracking: <strong>'+NTra+'</strong></span>');

        $(".phs_label").width(max_width);
        $("#num_patients").html(numpatients);

        //$('.NNot').textfill({maxFontPixels: 20});
        //$('.NCon').textfill({maxFontPixels: 20});
        //$('.NTra').textfill({maxFontPixels: 20});
    }
    
    $.ajax({
        url: 'PatientNetworkHeaderCalls.php',
        type: 'post',
        dataType: 'json',
        data:'idDoc='+$('#MEDID').val(),
        success: function(data) {
            $('p#TotPats span#H2M_Spin_Stream').text(data.req_doc_mem_cnt);
            var last_page = Math.ceil(parseInt(data.req_doc_rch_cnt) / 10);
            $('#CurrentPage').text('1 - '+last_page);
            $('input#last_page').val(last_page).trigger('change');
            $('span#trkCount').text(data.trkCount);
            if(data.trkCount == 0) $('#trackToggle').bootstrapSwitch('disabled',true);
            $('span#newPats').text(data.newPats);
            $('span#newActsUp').text(data.newActsUp);
            NNot = parseInt(data.req_doc_nRch_cnt);
            NCon = parseInt(data.req_doc_rch_cnt);
            headerStackFill(NNot, NCon);      
            $.each(data, function(k, v) {
                    var visible = (v > 0) ? 'visible' : 'hidden';
                    var cursor = (v > 0) ? 'pointer' : 'default';
                    $('#'+k).css('cursor', cursor);
                    $('#'+k+'_bubble').text(v)
                    $('#'+k+'_bubble').css('visibility', visible);
            });
            
            /*$('#trkCount').text(data.trkCount);
            $('#nActsCount').text(data.);
            $('#TotUpDrv').text(data.req_doc_rpts_cnt);
            $('#TotSum').text(data.req_doc_smry_cnt);
            $('#TotMsgv').text(data.req_doc_msg_cnt);
            $('#TotUpUsv').text(data.req_doc_prb_cnt);
            $('#TotAppoint').text(data.req_doc_appt_cnt);*/
            $('#WaitHeader').hide();
            $('#header-stackedBar').show();
        },
        error: function(xhr) {
            //console.log(xhr.responseText);
        }
    });
    
    var ConnectItem = 0;
    var Gotoflag = 0;
    setInterval(function(){
        Gotoflag = 0;
		if (ConnectItem == 0 && Gotoflag == 0) {
			ConnectItem = 1;
            Gotoflag=1;
			$("#ActivitySCROLL").animate({ scrollTop: 106 }, { duration: 700 } );
		}

		if (ConnectItem == 1 && Gotoflag == 0) {
			ConnectItem = 0;
            Gotoflag=1;
			$("#ActivitySCROLL").animate({ scrollTop: 0 }, { duration: 700 } );
		}
		
	},5000)
    
    var start = 0;
    var currPage = 1;
    var lastPage = '';
    $('input#last_page').change(function(){
        lastPage = $('input#last_page').val();
    });
    var numDisplay = 10;
    var phase = 1;
    var user;
    var doctor;
    var trackToggleFlag = false;
    
    //HEADER FILTERING
    var filter = '';
    $('span.filter').each(function() {
        $(this).click(function(e) {
            //EMPTY THE SEARCH TERM
            $('#SearchUserUSERFIXED').val('');
            if ($('#trackToggle').is(':checked')) {
                trackToggleFlag = true;
                $('#trackToggle').bootstrapSwitch('state',false);
            }
            var theId = $(this).attr('id')+'_bubble';
            if ($('#'+theId).css('visibility') == 'visible') {
                e.preventDefault(); 
                $('#TablaSents').empty();
                $('#loading_spinner').show();
                if ($(this).attr('id') == 'repUp') {
                    $('span.filter').not(this).removeClass('patient_row_button_active');
                    if($(this).hasClass('patient_row_button_active')) {
                        $(this).removeClass('patient_row_button_active');
                        $('#filterstatus').hide();
                        filter = '';
                        currPage = 1;
                        start = 0;
                    }
                    else {
                        $(this).addClass('patient_row_button_active');
                        $('#filterstatus').show().html('<i class="fa fa-filter" style="margin-right:5px; color:#A9A9A9"></i>New Report Updates Within 30 Days');
                        filter = 'repUp';  
                        currPage = 1;
                        start = 0;
                    }
                }
                if ($(this).attr('id') == 'sumUp') {
                    $('span.filter').not(this).removeClass('patient_row_button_active');
                    if($(this).hasClass('patient_row_button_active')) {
                        $(this).removeClass('patient_row_button_active');
                        $('#filterstatus').hide();
                        filter = '';
                        currPage = 1;
                        start = 0;
                    }
                    else {
                        $(this).addClass('patient_row_button_active');
                        $('#filterstatus').show().html('<i class="fa fa-filter" style="margin-right:5px; color:#A9A9A9"></i>New Summary Updates Within 30 Days');
                        filter = 'sumUp';
                        currPage = 1;
                        start = 0;
                    }
                }
                if ($(this).attr('id') == 'msgUp') {
                    $('span.filter').not(this).removeClass('patient_row_button_active');
                    if($(this).hasClass('patient_row_button_active')) {
                        $(this).removeClass('patient_row_button_active');
                        $('#filterstatus').hide();                    
                        filter = '';
                        currPage = 1;
                        start = 0;
                    }
                    else {
                        $(this).addClass('patient_row_button_active');
                        $('#filterstatus').show().html('<i class="fa fa-filter" style="margin-right:5px; color:#A9A9A9"></i>New Message Updates Within 30 Days');
                        filter = 'msgUp';
                        currPage = 1;
                        start = 0;
                    }
                }
                if ($(this).attr('id') == 'prbUp') {
                    $('span.filter').not(this).removeClass('patient_row_button_active');
                    if($(this).hasClass('patient_row_button_active')) {
                        $(this).removeClass('patient_row_button_active');
                        $('#filterstatus').hide();                    
                        filter = '';  
                        currPage = 1;
                        start = 0;
                    }
                    else {
                        $(this).addClass('patient_row_button_active');
                        $('#filterstatus').show().html('<i class="fa fa-filter" style="margin-right:5px; color:#A9A9A9"></i>New Probe Updates Within 30 Days');
                        filter = 'prbUp';
                        currPage = 1;
                        start = 0;

                    }
                }
                if ($(this).attr('id') == 'apptUp') {
                    $('span.filter').not(this).removeClass('patient_row_button_active');
                    if($(this).hasClass('patient_row_button_active')) {
                        $(this).removeClass('patient_row_button_active');
                        $('#filterstatus').hide();                    
                        filter = '';
                        currPage = 1;
                        start = 0;
                    }
                    else {
                        $(this).addClass('patient_row_button_active');
                        $('#filterstatus').show().html('<i class="fa fa-filter" style="margin-right:5px; color:#A9A9A9"></i>New Appointment Updates Within 30 Days');
                        filter = 'apptUp';
                        currPage = 1;
                        start = 0;
                    }     
                }
                getPatientList(filter);
                trackToggleFlag = false;
                console.log('filter: '+filter);
            }
        });        
    });
    
    //TOGGLE TRACKING
    $('input#trackToggle').bootstrapSwitch({
        'size': 'small',
        'onColor': 'warning',
        'offColor': 'default',
        'onText': 'ON',
        'offText': 'OFF',
        'labelText': 'Tracked',
        'labelWidth': 62,
        'handleWidth': 46
    });
    
    $('input#trackToggle').on('switchChange.bootstrapSwitch', function(e, s) {
        //EMPTY THE SEARCH TERM
        $('#SearchUserUSERFIXED').val('');
        $('#filterstatus').hide();
        $('span.filter').removeClass('patient_row_button_active');
        filter = '';
        if(s) {
            filter = 'trackUp';
            $('#filterstatus').show().html('<i class="fa fa-filter" style="margin-right:5px; color:#A9A9A9"></i>Currently Tracking Members');
        }
        if(!trackToggleFlag) {
            currPage = 1;
            start = 0;
            getPatientList(filter);
        }
        console.log('filter: '+filter);
    });
      
    //notifications
    //var pusher = new Pusher('d869a07d8f17a76448ed');
    //var channel_name=$('#MEDID').val();
    //var channel = pusher.subscribe(channel_name);
    
    var push = new Push($("#MEDID").val(), window.location.hostname + ':3955');
    
    push.bind('notification', function(data) 
    {
        displaynotification('New Message', data);
    });

    $("#Phone").intlTelInput();
    $("#Message").intlTelInput();

    $(window).bind('load', function(){
        $('#newinbox').trigger('click');
        //$('#BotonBusquedaSents').trigger('click');
        //getPatientList();

        //alert('clicked');
    });

    $('body').bind('mousedown keydown', function(event) {
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
    });

    /*function setGrabQuery()
	{
    setInterval(function() {
    		//alert ('in setInterval');
			//$('#BotonBusquedaPacCOMP').trigger('click');
            //$('#BotonBusquedaSents').trigger('click');

			//window.onload = function(){

            getPatientList();
			$('#BotonBusquedaProbe').trigger('click');
            $('#BotonBusquedaPending').trigger('click');
            $('#newinbox').trigger('click');
			$('#connect_spinner').css('display', 'none');
			//}

			//alert('called interval');
      }, 180000);
	  }
	  setGrabQuery();*/

    //getPatientList();
    $('#BotonBusquedaProbe').trigger('click');
    $('#BotonBusquedaPending').trigger('click');
    $('#newinbox').trigger('click');



    $('#newinbox').live('click',function(){
        var MEDID = $('#MEDID').val();
        var queUrl ='getInboxMessageUSER-DR.php?IdMED='+MEDID;
        ContentLoad = LanzaAjax (queUrl);
        $('#datatable_3').html(ContentLoad);
        $('#datatable_3').trigger('update');
    });

    $('#newoutbox').live('click',function(){
        var MEDID = $('#MEDID').val();
        var queUrl ='getOutboxMessageUSER-DR.php?IdMED='+MEDID;
        ContentLoad = LanzaAjax (queUrl);
        $('#datatable_4').html(ContentLoad);
        $('#datatable_4').trigger('update');

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
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
    $("#probe_method").change(function(){
		var user_id_for_probe = $("#probe_id_holder_for_purchase").val();
		var type = $("#probe_method").val();
		
			$.post('checkForReceiving.php', { user_id: user_id_for_probe, type: type })
			
			  .done(function( data ) {
				  
				  if(type == 1 || type == 2){
						var type_name = 'Phone';
					}else{
						var type_name = 'Email';
					}
				  
				  if(data == 0){
					  swal("This user does not have a "+type_name+" in our system. \n\n  Please add their information before continuing.");
				  }
			  });
			  });
    
   
*/


    //////////////////////////////////////////////////////////////////////////////////////////
    // PATIENT APPOINTMENTS

    var appt_data = null;
    var appointment_selected_user = 0;
    var new_appointment_type = 1;
    var appointment_holder = $("#make_appointment").dialog({bigframe: true, width: 660, height: 420, resize: false, modal: true, autoOpen: false, resizable: false});
    //function createAppointment(id)
    $("div[id^='patientAppointments_']").live('click', function()
                                              {
        var id = $(this).attr("id").split('_')[1];
        appointment_selected_user = id;
        //pullCalendar(0, id);

        // reload upcoming appointments information here
        $.get("get_appointments.php?doc_id="+$("#MEDID").val()+"&pat_id="+id, function(data, status)
        {
            //console.log(data);
            appt_data = JSON.parse(data);
            appointment_holder.dialog('open');
            refresh_appointments();
        });

    });

    function refresh_appointments()
    {
        var last_date_str = '';
        var last_time_slot_str = '';
        var last_date = null;
        var html = '';
        var count = 0;
        var start_time = null;
        var end_time = null;
        var start_hour = 0;
        var end_hour = 0;
        var start_m = 'AM';
        var end_m = 'AM';
        var sp_times = new Object();
        for(var i = 0; i < appt_data.length; ++i)
        {
            var new_date = false;
            var new_timeslot = false;

            if(appt_data[i]['date'] != last_date_str)
            {
                last_date_str = appt_data[i]['date'];
                last_date = new Date();
                last_date.setFullYear(parseInt(last_date_str.substr(0, 4)));
                last_date.setMonth(parseInt(last_date_str.substr(5, 2)) - 1);
                last_date.setDate(parseInt(last_date_str.substr(8, 2)));
                if(html.length > 0)
                    html += '<br/>';
                html += '<span style="text-align: center; font-size: 16px; color: #555;">';
                html += last_date.toDateString();
                html += '</span>';
                new_date = true;
                last_time_slot_str = '';
            }
            if(appt_data[i]['start_time'] != last_time_slot_str)
            {
                last_time_slot_str = appt_data[i]['start_time'];
                new_timeslot = true;
                count = 0;
                html += '<div style="width: 94%; text-align: center; margin: auto; background-color: #7EC1FF;'
                if(new_date)
                {
                    html += ' border-top-left-radius: 8px; border-top-right-radius: 8px;';
                }
                html += ' color: #FFF; font-size: 16px; font-weight: bold; padding: 5px;">';
                //8:00 AM - 10:00 AM
                start_time = appt_data[i]['start_time'].split(":");
                end_time = appt_data[i]['end_time'].split(":");
                start_hour = parseInt(start_time[0]);
                end_hour = parseInt(end_time[0]);
                start_m = 'AM';
                end_m = 'AM';
                if(start_hour > 11)
                {
                    start_m = 'PM';
                    if(start_hour > 12)
                    {
                        start_hour -= 12;
                    }
                }
                else if(start_hour == 0)
                {
                    start_hour = 12;
                    start_m = 'AM';
                }
                if(end_hour > 11)
                {
                    end_m = 'PM';
                    if(end_hour > 12)
                    {
                        end_hour -= 12;
                    }
                }
                else if(end_hour == 0)
                {
                    end_hour = 12;
                    end_m = 'AM';
                }
                html += start_hour+":"+start_time[1]+" "+start_m+" - "+end_hour+":"+end_time[1]+" "+end_m;
                html += '</div>';
            }
            html += '<div style="width: 93%; text-align: left; margin: auto; background-color: ';
            if(count % 2 == 1)
            {
                html += '#E3E3E3;';
            }
            else
            {
                html += '#F3F3F3;';
            }
            html += ' color: #000; font-size: 14px; padding: 1%; padding-left: 10px;';
            if((i < appt_data.length - 1 && appt_data[i + 1]['date'] != last_date_str) || i == appt_data.length - 1)
            {
                html += ' border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;';
            }
            html += '"><button id="';
            html += 'app_del_'+appt_data[i]['id']+'_'+i;
            html += '" style="width: 18px; height: 18px; float: right; color: #F00; padding: 0px; background-color: inherit; border: 0px solid #FFF; border-radius: 3px; outline: 0px;"><i class="icon-remove" style="width: 12px; height: 12px;"></i></button>';
            html += '<div style="width: 630px; height: 22px;">';
            html += '<div style="width: 175px; float: left;">';
            html += '<a href="patientdetailMED-new.php?IdUsu='+appt_data[i]['pat_id']+'" style="color: #46D542;">'+appt_data[i]['pat_name']+'</a></div>';
            html += '<div style="width: 140px; float: left; color: #777;">Set a specific time: </div>';
            html += '<input id="specific_time_'+appt_data[i]['id']+'_'+start_hour+':'+start_time[1]+start_m.toLowerCase()+'_'+end_hour+':'+end_time[1]+end_m.toLowerCase()+'" value="" type="text" style="width: 75px; padding: 0px; padding-left: 5px; margin-bottom: 0px; height: 20px; float: left;" ';
            if(appt_data[i]['specific_time'] != null)
            {
                //html += 'value="'+dat[i]['specific_time']+'" ';
                sp_times[(appt_data[i]['id'])] = appt_data[i]['specific_time'];
            }
            html += '/>';
            html += '<button class="app_save" style="height: 22px; width: 50px; background-color: inherit; border-radius: 2px; color: #22AEFF; border: 0px solid #FFF; outline: 0px;">Save</button>';
            html += '<button class="app_clear" style="height: 22px; width: 50px; background-color: inherit; border-radius: 2px; color: #D84840; border: 0px solid #FFF; outline: 0px;">Clear</button>';
            html += '</div></div>';
            ++count;
        }
        html += '<br/><br/>';
        if(appt_data.length >= 1)
        {
            $("#appointments_container").css('border', '1px solid #EEE');
            $("#appointments_container").css('background-color', '#FDFDFD');
            $("#appointments_container").css('color', '#999');
            $("#appointments_container").html(html);
        }
        else
        {
            $("#appointments_container").css('border', '1px dashed #DDD');
            $("#appointments_container").css('background-color', '#F8F8F8');
            $("#appointments_container").css('color', '#999');
            $("#appointments_container").html('<br/><br/><br/><br/><br/>You do not have any upcoming appointments with this member.<br/>To add an appointment, click "Add Appointment" below.');
        }

        var imported = document.createElement('script');
        imported.src = 'js/jquery.timepicker.js';
        imported.type = 'text/javascript';
        document.head.appendChild(imported);

        // set time after 500 ms because timepicker is taking too long to load for some strange reason.
        setTimeout(function(){

            $("input[id^='specific_time_']").each(function(index, value) 
                                                  {
                var info = $(this).attr("id").split("_");
                //console.log(info);
                $(this).timepicker({'step': 5, 'minTime': info[3], 'maxTime': info[4]});
                if(info[2] in sp_times)
                {
                    var date = new Date();
                    var date_info = sp_times[(info[2])].split(":");
                    date.setHours(parseInt(date_info[0]));
                    date.setMinutes(parseInt(date_info[1]));
                    $(this).timepicker('setTime', date);
                }
            });
            
            $("#add_appointment_time").timepicker({'step': 5});
        }, 500);
        $("#app_clear").off('click');
        $("input[id^='specific_time_']").off('change');
        $("button[id^='app_del_']").on('click');
        $(".app_clear").on('click', function()
                           {
            $(this).parent().children("input[id^='specific_time_']").val('');
            var info = $(this).parent().children("input[id^='specific_time_']").attr("id").split("_");
            $.post("update_appointment.php", {id: info[2], specific_time: 'n'}, function(data, status){console.log(data);});
        });
        $(".app_save").on('click', function()
        {
            $(this).html('<img src="images/load/24.gif" style=" />');
            var info = $(this).prev().attr("id").split("_");
            $.post("update_appointment.php", {id: info[2], specific_time: $(this).prev().val()}, function(data, status)
            {
                $(this).html('Save');
                appointment_holder.dialog('close');
                swal({   title: "Done!",   text: "Appointment Saved",   type: "success",   confirmButtonText: "Ok" });
            });

        });
        $("button[id^='app_del_']").on('click', function()
        {
            var item = $(this).parent();
            var info = $(this).attr("id").split("_");
            //var answer = confirm("Are you sure you want to cancel this appointment with member "+$(this).parent().children('div').children('div').children('a').eq(0).text()+"? This action cannot be undone.");
            appointment_holder.dialog('close');
            swal({   title: "Are you sure?",   text: "Are you sure you want to cancel this appointment with member "+$(this).parent().children('div').children('div').children('a').eq(0).text()+"? This action cannot be undone.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes",   cancelButtonText: "No",   closeOnConfirm: false,   closeOnCancel: false }, function(isConfirm)
                 {   
                if (isConfirm) 
                {     

                    $.get("delete_appointment.php?id="+info[2], function(d, status)
                    {


                        if(d == '1')
                        {
                            appt_data.splice(info[3], 1);
                            refresh_appointments();

                        }
                        swal("Deleted!", "The appointment has been deleted successfully.", "success");   
                    });

                } 
                else 
                {     
                    swal("Cancelled", "Deletion Cancelled", "error");   
                } 
            });



        });
        $("#add_appointment_new_button").on('click', function()
        {
            // set the default date to today
            var date = new Date();

            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();

            if (month < 10) month = "0" + month;
            if (day < 10) day = "0" + day;

            var today = year + "-" + month + "-" + day;       
            $("#add_appointment_date").attr("value", today);
            
            // set the default time to noon, the date doesn't matter
            $('#add_appointment_time').timepicker('setTime', new Date("12-12-2012 12:00:00"));
            
            // set the default type to video
            $("#new_appointment_video_button").css('background-color', '#22aeff');
            $("#new_appointment_phone_button").css('background-color', '#535353');
            new_appointment_type = 1;
            
            $("#add_appointments").css("display", "block");
            $("#appointments_container").animate({height: '220px'}, 500);
            $("#add_appointments").animate({height: '40px'}, 500);
        });
        $("#add_appointment_cancel_button").on('click', function()
        {
            $("#appointments_container").animate({height: '300px'}, 500);
            $("#add_appointments").animate({height: '0px'}, 500, function()
            {
                $("#add_appointments").css("display", "none");
            });
        });
        $("#add_appointment_add_button").one('click', function()
        {
            // convert time
            var time = $("#add_appointment_time").val();
            var time_m = time.substr(time.length - 2, 2);
            var time_info = time.substr(0, time.length - 2).split(":");
            time_info[0] = parseInt(time_info[0]);
            time_info[1] = parseInt(time_info[1]);
            if(time_m == 'pm' && time_info[0] != 12)
            {
                time_info[0] += 12;
            }
            else if(time_m == 'am' && time_info[0] == 12)
            {
                time_info[0] = 0;
            }
            var time_str = "";
            if(time_info[0] < 10)
                time_str += "0";
            time_str += time_info[0]+":";
            if(time_info[1] < 10)
                time_str += "0";
            time_str += time_info[1]+":00";
            
            $("#appointments_container").animate({height: '300px'}, 500);
            $("#add_appointments").animate({height: '0px'}, 500, function()
            {
                $("#add_appointments").css("display", "none");
                $.post("add_appointment.php", {medid: $("#MEDID").val(), patid: appointment_selected_user, date: $("#add_appointment_date").val(), time: time_str, video: new_appointment_type, type: 'doc'}, function(data,status)
                {
                    if(data != '-1')
                    {
                        $.get("send_appointment_email.php?id="+data+"&type=patient", function(data, status)
                        {
                        });
                        $.get("get_appointments.php?doc_id="+$("#MEDID").val()+"&pat_id="+appointment_selected_user, function(data, status)
                        {
                            appt_data = JSON.parse(data);
                            appointment_holder.dialog('open');
                            refresh_appointments();
                        });
                    }
                    
                });
            });
                
            
        });
        $("#new_appointment_video_button").on('click', function()
        {
            $("#new_appointment_video_button").css('background-color', '#22aeff');
            $("#new_appointment_phone_button").css('background-color', '#535353');
            new_appointment_type = 1;
        });
        $("#new_appointment_phone_button").on('click', function()
        {
            $("#new_appointment_phone_button").css('background-color', '#22aeff');
            $("#new_appointment_video_button").css('background-color', '#535353');
            new_appointment_type = 0;
        });

    }

    //////////////////////////////////////////////////////////////////////////////////////////


    //----------For Creating Probe Pop up------------------------------------------------

    $("#ProbeEditorButton").on('click', function()
                               {
        $("#probe_editor").dialog({width: 400, height: 800, bigframe: true});
    });
    //Set options for timezone 
    get_timezones('gettimezones.php');
    var tz = document.getElementById('Timezone');
    for(var i=0;i<timezones.length;i++)
    {
        tz.options[tz.options.length] = new Option(timezones[i].timezones,timezones[i].id);
    }


    $('#probe_time5').timepicker({ 'scrollDefaultNow': true });
    $('#connectMember_probe_time').timepicker({ 'scrollDefaultNow': true });

    //Set options for probe intervals
    var interval = document.getElementById('Interval');
    interval.options[interval.options.length] = new Option("Daily",1);
    interval.options[interval.options.length] = new Option("Weekly",7);
    interval.options[interval.options.length] = new Option("Monthly",30);
    interval.options[interval.options.length] = new Option("Yearly",365);
    //alert('clicking');
    $('#BotonBusquedaProbe').trigger('click');

    //-----------------------------------------------------------------------------

    $('.CFILAPAT').live('click',function(){
        var id = $(this).attr("id");
        window.location.replace('patientdetailMED-new.php?IdUsu='+id);
    });

    $('.CFILAPATPendingBot2').live('click',function(){
        var id = $(this).attr("id");
        var id2 = $(this).attr("id2");    
        var id3 = $(this).attr("id3");    
        conf=confirm("Do you want to revoke ?");
        if(conf){
            var IdMed = $('#MEDID').val();
            var cadena='RevokeLink.php?IdPatient='+id+'&IdDoctor='+IdMed+'&IdType='+id3;
            var RecTipo=LanzaAjax(cadena);
        }

    });

    $('.CENVELOPE').live('click',function(){
        var id = $(this).attr("id");
        //var id2 = $(this).attr("id2");
        //alert ('ENVELOPE Id= '+id+' Id2= ');
    });

    $('.BMessage').live('click',function(){
        var myClass = $(this).attr("id");
        var myClass2 = $(this).attr("id2");
        SendMsgOnClick (myClass,myClass2);
    });

    $('.BRevoke').live('click',function(){
        var id = $(this).attr("id");
        var id2 = $(this).attr("id2");
        //alert ('Id= '+id+' Id2= '+id2);
    });

    $('.CFILA').live('click',function(){
        var id = $(this).attr("id");
        // Get Doctor id and some info
        var cadena='getDoctorMessage.php?msgid='+id;
        // Mini-parser of Rectipo to extract multiple values
        var RecTipo=LanzaAjax(cadena);
        var n = RecTipo.indexOf(",");
        console.log(RecTipo);
        var IdDoctor = RecTipo.substr(0,n);
        var Remaining = RecTipo.substr(n+1,RecTipo.length);
        m = Remaining.indexOf(",");
        //var NameDoctor = Remaining.substr(0,m);
        //var SurnameDoctor = Remaining.substr(m+1,Remaining.length);
        var patient_fullname = $(this).next('td').html().split('.');
        var patient_name = patient_fullname[0];
        var patient_surname = patient_fullname[1];
        var mail_date = $(this).next('td').next('td').html();
        $("#IdDoctor").attr('value',IdDoctor);
        //throw "stop execution";

        //displaynotification('Message ID'+ id);


        $('input[type=checkbox][id^="reportcol"]').each(
            function () {
                $('input[type=checkbox][id^="reportcol"]').checked=false;
            });
        reportcheck.length = 0;
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
        $('#ToDoctor').html('From: '+patient_name+' '+patient_surname);
        $('#mailDate').html('Date: '+mail_date);
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
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    $('.CFILA_out').live('click',function(){
        var id = $(this).attr("id");
        //displaynotification('Message ID'+ id);
        $('input[type=checkbox][id^="reportcol"]').each(
            function () {
                $('input[type=checkbox][id^="reportcol"]').checked=false;
            });
        reportcheck.length=0;
        var patient_fullname = $(this).next('td').html().split('.');
        var patient_name = patient_fullname[0];
        var patient_surname = patient_fullname[1];
        var mail_date = $(this).next('td').next('td').html();
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
        $('#ToDoctor').html('To: '+capitalizeFirstLetter(patient_name)+' '+capitalizeFirstLetter(patient_surname));
        $('#mailDate').html('Date: '+mail_date);
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

    $("#Attach").live('click',function(){
        reportids='';

        $('input[type=checkbox][id^="reportcol"]').each(
            function () {
                var sThisVal = (this.checked ? "1" : "0");

                //sList += (sList=="" ? sThisVal : "," + sThisVal);
                if(sThisVal==1){
                    var idp=$(this).parents("div.attachments").attr("id");
                    //alert("Id "+idp+" selected"); 
                    reportcheck.push(this.id);
                    //messageid=messageid+idp+' ,';
                    reportids=reportids+idp+' ';

                    /*var cadena='setMessageStatus.php?msgid='+idp+'&delete=1';
				 LanzaAjax(cadena);*/
                }


            });
        //alert(reportids);
        var conf=false;
        if(reportids>'')
            conf=confirm("Confirm Attachments");

        if(conf){
            $("#Reply").trigger('click');
            $("#attachreportdiv").append('<i id="attachment_icon" class="icon-paper-clip" style="margin-left:10px"></i>');
            //alert(reportids);
        }else{
            reportids='';
            for (i = 0 ; i < reportcheck.length; i++ ){

                document.getElementById(reportcheck[i]).checked = false;

            }
            reportcheck.length=0;
            $("#Reply").trigger('click');
        }

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

    $("#BotonBusquedaPac").click(function(event) {
        var IdUs =156;
        var UserInput = $('#SearchUser').val();
        var UserEmail = $('#SearchEmail').val();
        var IdUsFIXED = $('#SearchIdUsFIXED').val();
        var MEDID = $('#MEDID').val();
        var queUrl ='getFullUsersLINK.php?Usuario='+UserInput+'&NReports=10&MEDID='+MEDID+'&Email='+UserEmail+'&IdUsFIXED='+IdUsFIXED;

        $('#TablaPac').load(queUrl);
        //$('#TablaPac').trigger('click');
        $('#TablaPac').trigger('update');

    });

    $("#BotonBusquedaMen").click(function(event) {
        var IdUs =156;
        var UserInput = $('#SearchUser').val();
        var MEDID = $('#MEDID').val();
        var queUrl ='getMessages.php?Usuario='+UserInput+'&NReports=10&MEDID='+MEDID;

        $('#TablaPac').load(queUrl);
        //$('#TablaPac').trigger('click');
        $('#TablaPac').trigger('update');

    });


    $("#BotonBusquedaPacCOMP").live('click',function() {
        var UserInput = $('#SearchUserT').val();
        var UserDOB = '';
        var IdMed = $('#MEDID').val();
        var queUrl ='getSearchUsers.php?Usuario='+UserInput+'&UserDOB='+UserDOB+'&IdDoc='+IdMed+'&NReports=4';
        ////console.log(queUrl);
        $('#TablaPac').load(queUrl);
        $('#TablaPac').trigger('update');
        //$('#BotonBusquedaSents').trigger('click');
        getPatientList();
    });     

    $("#BotonBusquedaMedCOMP").live('click',function() {
        var UserInput = $('#SearchDoctor').val();
        var UserDOB = $('#DoctorEmail').val();
        var queUrl ='getSearchDoctors.php?Doctor='+UserInput+'&DrEmail='+UserDOB+'&NReports=4';
        $('#TablaMed').load(queUrl);
        $('#TablaMed').trigger('update');
    }); 

    $("#BotonBusquedaPending").click(function(event) {
        var IdMed = $('#MEDID').val();
        var UserDOB = '';
        var queUrl ='getPatientsPending.php?Usuario=0&UserDOB='+UserDOB+'&IdDoc='+IdMed+'&NReports=3';
        ContentDyn = LanzaAjax(queUrl);

        ////console.log("From Pending patients"+ContentDyn);
        if (ContentDyn >'')
        {
            //$('#PendingTasks').show(); 
            // $('#TablaPacPending').html(ContentDyn);
            // $('#TablaPacPending').trigger('update');
        }
        else
        {
            $('#PendingTasks').hide(); 
        }
    });

    //$("#BotonBusquedaSents").live('click',function() {



    $("#probeTab").click(function(event) {
        //alert('clicked');
        $("#BotonBusquedaProbe").trigger('click');
    });
    $("#connectedpatients").click(function(event) {
        //$('#connectedpatients').live('click',function(){
        //$("#H2M_Spin_Stream_CP").show();
        //alert('clicked');
        //document.getElementById("TablaSents").innerHTML="<p>Loading</p>";
        //$('#TablaSents').trigger('update');
        //$('#Wait2').show(); 
        //document.getElementById("Wait2").style.display="block";
        $("#BotonBusquedaSents").trigger('click');

    });
    
    function getPatientList(filter) 
    {
        if(typeof(filter) === 'undefined') filter = '';
        var maxPerPage = 10;

        var queMED = $("#MEDID").val();
        var UserInput = $('#SearchUserUSERFIXED').val();


        var userSurname = $('#SearchUserUSERFIXED').val();
        var IdMed = $('#MEDID').val();
        var UserDOB = '';
        var queUrl ='getPatientsConnectedRedesign.php?Usuario='+userSurname+'&UserDOB='+UserDOB+'&IdDoc='+IdMed+'&start='+start+'&filter='+filter;
        ////console.log(queUrl);
        //ContentDyn = LanzaAjax(queUrl);
        var ContentDyn = "";
        $.ajax(
            {
                url: queUrl,

                success: function(data)
                {
                    //alert(data);
                    ContentDyn = data;
                    //alert('loaded' + ContentDyn);
                    $('#TablaSents').html(ContentDyn);
                    //$('#TablaSents').trigger('update');
                    //if (pases==1) $('#BotonBusquedaSents').trigger('update');
                    //$("#ConnectedPatientsLoader").hide();

                    
                    lastPage = $('#last_page').val();
                    updatePageDisplay();
                    
                    $('.probe_display').on('mouseenter', function()
                    {
                        var probe_notifications_width = (((5 - $(this).parent().children().length) * 10) + 60) - 2;
                        var element = $(this).index();
                        $(this).parent().children().each(function()
                        {
                            $(this).css('width', '8%');
                            $(this).children('div').eq(1).css('display', 'none');
                        });
                        $(this).css('width', probe_notifications_width+'%');
                        $(this).children('div').eq(1).css('display', 'block');
                    });
                    
                    $('.probe_chart_button').unbind('click');
                    $('.probe_chart_button').on('click', function()
                    {
                        console.log('Probe button pressed');
                        var info = $(this).attr('id').split('_');
                        var probe = info[1];
                        var question = info[2];
                        $(this).siblings().each(function()
                        {
                            if($(this).hasClass('probe_chart_button_selected'))
                                $(this).removeAttr('disabled');
                            $(this).removeClass('probe_chart_button_selected').addClass('probe_chart_button');
                        });
                        $(this).removeClass('probe_chart_button').addClass('probe_chart_button_selected');
                        $(this).attr('disabled', 'disabled');

                        var self = $(this).parent().parent().children().eq(0);
                        var graph_name = 'probe_graph_'+probe;
                        var question_name = 'probe_question_'+probe;
                        $('div[id^=\"'+graph_name+'\"]').css('display', 'none');
                        $('div[id^=\"'+question_name+'\"]').css('display', 'none');
                        $('#probe_graph_'+probe+'_'+question).css('display', 'block');
                        $('div[id^="probe_question_"]').css('display', 'none');
                        $('#probe_question_'+probe+'_'+question).css('display', 'block');
                        
                        $('#probe_question_label'+probe).html('');
                        $.post('get_probe_graph_data.php', {probeID: probe, question: question}, function(data, status)
                        {
                            var d = JSON.parse(data);
                            //console.log('****************************************************');
                            if(d.data.length > 0 && d.protocol_name != null)
                            {
                                console.log(d.data.length);
                                console.log(d);
                                if($('#probe_graph_'+probe+'_'+question).attr('loaded') != 1)
                                {
                                    $('#probe_graph_'+probe+'_'+question).html('<div style="width: 500px; height: 300px; text-align: center; margin: auto; margin-top: 225px;"><img src="images/load/29.gif" style="margin-top: 129px" height="42" width="42"/></div>');
                                    loadScript('js/h2m_probegraph-newdes.js', 'h2m_probegraph-newdes', function()
                                    {
                                        //console.log('IF: '+d.data.length);

                                        console.log("ATTRIBUTE: " + self.attr('loaded'));

                                        setTimeout(function()
                                        {
                                            $('#probe_graph_'+probe+'_'+question).H2M_ProbeGraph({probe_id: probe , data: d.data, probe_alerts: d.probe_alerts,height: 312, width: 850, units: d.units, protocol_name: d.protocol_name, protocol_description: d.protocol_description, question_unit: d.question_unit, title: d.question_title, question_description: d.question_description, min_value: d.min_value, max_value: d.max_value, min_days: d.min_days, max_days: d.max_days, max_scale: d.max_scale, min_scale: d.min_scale, inverted: d.inverted});
                                        }, 3000);
                                        $('#probe_graph_'+probe+'_'+question).attr('loaded', 1);
                                        console.log('loading probe graph...');

                                        
                                    });
                                }
                                $('#probe_question_'+probe+'_'+question).text(d.question);
                            }

                        });
                    });
                    $('div[id^="probe_question_"]').css('display', 'none');
                    /*$('.probe_chart_button').each(function()
                    {
                        var info = $(this).attr('id').split('_');
                        var probe = info[1];
                        var question = info[2];
                        if(question == 1)
                        {
                            //console.log('CLICKED');
                            $(this).trigger('click');
                        }
                    });*/
                    //alert(totalPatients);
                    $('#loading_spinner').hide();
                }
            });
    }
    $("#BotonBusquedaSents").click(function(event){
        currPage = 1;
        start = 0;
        getPatientList();
    });
    $("#BotonBusquedaSents").trigger('click');
    
    

    var pases = 0;
    function loadScript(url, name, callback)
    {
        // Adding the script tag to the head as suggested before
        if(document.getElementById(name) != null)
        {
            document.getElementById(name).remove();
            
        }
        
        setTimeout(function()
        {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = name;
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            //script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
        }, 500);
    }
    function load_probe_graph(element, id, question)
    {
        $.post('get_probe_graph_data.php', {probeID: id, question: question}, function(data, status)
        {
            var d = JSON.parse(data);
            //console.log('****************************************************');
            if(d.data.length > 0 && d.protocol_name != null)
            {
                //element.html('');
                console.log(d.data.length);
                console.log(d);
                loadScript('js/h2m_probegraph-newdes.js', 'h2m_probegraph-newdes', function()
                {
                    //console.log('IF: '+d.data.length);
                    if(element.attr('loaded') != 1)
                    {
                        console.log("ATTRIBUTE: " + element.attr('loaded'));
                        element.H2M_ProbeGraph({probe_id: id , data: d.data, probe_alerts: d.probe_alerts,height: 312, width: 850, units: d.units, protocol_name: d.protocol_name, protocol_description: d.protocol_description, question_unit: d.question_unit, title: d.question_title, question_description: d.question_description, min_value: d.min_value, max_value: d.max_value, min_days: d.min_days, max_days: d.max_days, max_scale: d.max_scale, min_scale: d.min_scale, inverted: d.inverted});
                        element.attr('loaded', 1);
                        console.log('loading probe graph...');
                    }
                    $('#probe_question_'+id+'_'+question).text(d.question);
                    if(question == 1)
                    {
                        $('#probe_question_'+id+'_1').css('display', 'block');
                    }
                });

            }
            else
            {
                //element.html('');
                //console.log(d.data.length);
                /*loadScript('js/h2m_probegraph.js', function()
                {
                    element.H2M_ProbeGraph({data: [], height: 200, width: 850, units: []});
                    $('#probe_question_'+id+'_'+question).text(d.question);
                });*/

            }

        });
    }
    $(".doctor_row_resize").live('click', function()
                                 {
        if($(this).hasClass("icon-resize-full"))
        {
            $(".doctor_row_wrapper").each(function()
                                          {
                if($(this).css("height") == '645px')
                {
                    $(this).animate({height:'86px'}, {duration: 500, queue: false});
                    $("#myTabContent").animate({height:'857px'}, {duration: 500, queue: false});
                }
            });
            $(".doctor_row").each(function()
            {
                if($(this).css("height") == '635px')   //This refers to line 222 (the container that holds the 3 graph lines)
                {
                    $(this).animate({height:'70px'}, {duration: 500, queue: false});
                    $(this).parent().parent().animate({height:'86px'}, {duration: 500, queue: false});
                    $(this).children('span').eq(0).removeClass("icon-resize-small").addClass("icon-resize-full");
                    $("#myTabContent").animate({height:'1107px'}, {duration: 500, queue: false});
                }
            });
            $(this).parent().children('.question_label').eq(0).trigger();
            $(this).removeClass("icon-resize-full").addClass("icon-resize-small");
            $(this).parent().animate({height:'635px'},  {duration: 500, queue: false});
            $(this).parent().parent().animate({height:'645px'}, {duration: 500, queue: false});
            $("#myTabContent").animate({height:'1452px'}, {duration: 500, queue: false});

            $(this).parent().find('div[id^=\"probe_graph_\"]').each(function()
            {
                //$(this).empty();
                var info = $(this).attr('id').split('_');
                var probe = info[2];
                var question = info[3];
                var self = $(this);
                if(question == 1)
                {
                    console.log('loading probe graph...');
                    $('#probebutton_'+probe+'_1').removeClass('probe_chart_button').addClass('probe_chart_button_selected');
                    $('#probebutton_'+probe+'_1').attr('disabled', 'disabled');
                    //load_probe_graph(self, probe, question);
                    $.post('get_probe_graph_data.php', {probeID: probe, question: question}, function(data, status)
                    {
                        var d = JSON.parse(data);
                        //console.log('****************************************************');
                        if(d.data.length > 0 && d.protocol_name != null)
                        {
                            console.log(d.data.length);
                            console.log(d);
                            if(self.attr('loaded') != 1)
                            {
                                self.html('<div style="width: 500px; height: 300px; text-align: center; margin: auto; margin-top: 225px;"><img src="images/load/29.gif" style="margin-top: 129px" height="42" width="42"/></div>');
                                loadScript('js/h2m_probegraph-newdes.js', 'h2m_probegraph-newdes', function()
                                {
                                    //console.log('IF: '+d.data.length);

                                    console.log("ATTRIBUTE: " + self.attr('loaded'));
                                    
                                    setTimeout(function()
                                    {
                                        self.H2M_ProbeGraph({probe_id: probe , data: d.data, probe_alerts: d.probe_alerts,height: 312, width: 850, units: d.units, protocol_name: d.protocol_name, protocol_description: d.protocol_description, question_unit: d.question_unit, title: d.question_title, question_description: d.question_description, min_value: d.min_value, max_value: d.max_value, min_days: d.min_days, max_days: d.max_days, max_scale: d.max_scale, min_scale: d.min_scale, inverted: d.inverted});
                                    }, 3500);
                                    self.attr('loaded', 1);
                                    console.log('loading probe graph...');

                                    $('#probe_question_'+probe+'_'+question).text(d.question);
                                    if(question == 1)
                                    {
                                        $('#probe_question_'+probe+'_1').css('display', 'block');
                                    }
                                });
                            }

                        }

                    });
                }



            });
        }
        else
        {
            $(this).removeClass("icon-resize-small").addClass("icon-resize-full");
            $(this).parent().animate({height:'70px'},  {duration: 500, queue: false});
            $(this).parent().parent().animate({height:'86px'}, {duration: 500, queue: false});
            $("#myTabContent").animate({height:'857px'}, {duration: 500, queue: false});
        }
    });
    
    
    
    
    
    
    if(load_patient != -1)
    {   
        setTimeout(function(){
            var maxPerPage = 10;
            currPage = 1;
            start = 0;
            $.get("getPatientsConnectedRedesign.php?SingleUser="+load_patient+'Usuario=&UserDOB=&IdDoc='+$("#MEDID").val()+'&start='+start, function(data, status)
            {
                $('#TablaSents').html(data);
                $('#TablaSents').trigger('update');
                if (pases==1) $('#BotonBusquedaSents').trigger('update');
                $("#ConnectedPatientsLoader").hide();
                lastPage = $('#last_page').val();
                updatePageDisplay();
                
                
                $("#onclick"+load_patient).children('.doctor_row_resize').eq(0).trigger('click');
                $('#probe_question_label'+probe).html('');
                
            });
        }, 500);
        //$('.external_graph_container').css('display','block');
    }



    $("#BotonBusquedaPermit").click(function(event) {
        var IdMed = $('#MEDID').val();
        var UserDOB = '';
        var queUrl ='getPermits.php?Doctor='+IdMed+'&DrEmail='+UserDOB+'&NReports=3';
        $('#TablaPermit').load(queUrl);
        $('#TablaPermit').trigger('update');
    });       

    $("#BotonInvite").click(function(event) {
        alert ('Invite member');
    });       

    $(".CFILASents").live('click',function() {
        var myClass = $(this).attr("id");

        /*
 	     var IdMed = $('#MEDID').val();
	     var UserDOB = '';
	     var queUrl ='getPermits.php?Doctor='+IdMed+'&DrEmail='+UserDOB+'&NReports=3';
    	 $('#TablaPermit').load(queUrl);
    	 $('#TablaPermit').trigger('update');
		 */
    });       

    $("#SendButton").live('click',function() {
        // Confirm
        var subcadena='';
        var CallPhone = 0;
        if ($('#c2').attr('checked')=='checked'){ 
            subcadena =' (will call phone number also)';
            CallPhone = 1; 
        }

        var r=confirm('Confirm sending request to '+paciente+'?   '+subcadena);
        if (r==true)
        {
            var IdDocOrigin = $('#MEDID').val();
            var NameDocOrigin = $('#IdMEDName').val() ;
            var SurnameDocOrigin = $('#IdMEDSurname').val() ;
            // Update database table (1 or 2) and handle communication with Referral
            var cadena = '/SendReferral.php?Tipo=1&IdPac='+IdPaciente+'&IdDoc='+IdDoctor+'&IdDocOrigin='+IdDocOrigin+'&NameDocOrigin='+NameDocOrigin+'&SurnameDocOrigin='+SurnameDocOrigin+'&ToEmail='+doctor[0].IdMEDEmail+'&From='+'&Leido=0&Push=0&estado=1'+'&CallPhone='+CallPhone;
            //alert (cadena);
            var RecTipo = LanzaAjax (cadena);

            //$('#BotonBusquedaSents').trigger('click');
            getPatientList();
            $('#TextoSend').html('');
            //alert (RecTipo);
            // Refresh table in this page accordingly
        }
    });     

    $(".CFILADoctor").live('click',function() {
        var myClass = $(this).attr("id");
        getMedCreator(myClass);
        destino = "Dr. "+doctor[0].Name+" "+doctor[0].Surname; 
        IdDoctor = doctor[0].id;
        //alert (destino);	
        TextoS ='<span style="color:grey;">Send </span><span style="color:#54bc00; font-size:30px;">   '+paciente+'   </span><span style="color:grey;"> to </span><span style="color:#22aeff; font-size:30px;">   '+destino+'   </span>';
        if (paciente>'' && destino>'') TextoS = TextoS + '<input type="button" class="btn btn-success" value="SEND" id="SendButton" style="margin-left:20px; margin-top:-15px;"><p><input type="checkbox" id="c2" name="cc"><label for="c2" style="margin-top:10px;"><span></span> Urgent (call phone)</label></p>';
        $('#TextoSend').html(TextoS);
    }); 	

    $(".CFILAMODALxxxxxxx").live('click',function() {
        var myClass = $(this).attr("id");
        alert (myClass);
        $('#messagecontent_inbox').attr('value','');
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

    $(".CFILAMODALIdent").live('click',function() {
        var myClass = $(this).attr("id");
        var myClass2 = $(this).attr("id2");
        SendMsgOnClick (myClass,myClass2);
    }); 	

    function SendMsgOnClick (id1,id2){
        //var myClass = $(this).attr("id");
        //var myClass2 = $(this).attr("id2");
        var myClass = id1;
        var myClass2 = id2;
        $('#IdUserSel').val(myClass);
        $('#IdUserSwitch').val(myClass2);

        getUserData(myClass);
        paciente = user[0].Name+" "+user[0].Surname; 
        emailpaciente = user[0].email; 
        phonepaciente = user[0].telefono; 
        if (!emailpaciente) {contenido2 = '<p><input id="TempoEmail" name="TempoEmail" type="text" class="last-input" placeholder="Email" title="Please insert temporary email" style="padding-left:10px; margin-top:5px; width:250px;" /></p>'; }else{ contenido2 = '<p>Email is '+emailpaciente+'</p>';} 
        if (!phonepaciente) {contenido3 = '<p><input id="TempoPhone" name="TempoPhone" type="text" class="last-input" placeholder="Phone number (inlude country code)" title="Please insert temporary phone" style="padding-left:10px; margin-top:5px; width:300px;" /></p>'; }else{ contenido3 = '<p>Phone number is '+phonepaciente+'</p>';}

        //alert (myClass2);
        switch (myClass2)
        {
            case 'conn':	$('#ContenidoModal2').html('<p>Please enter member email to send a connection request:</p><p><input id="ResPas" name="ResPas" type="text" class="last-input" placeholder="email" title="Please insert email" style="padding-left:10px; margin-top:5px; width:250px;" /></p><p><input id="TelefUser" name="TelefUser" type="text" class="last-input" placeholder="phone number (add country code)" title="Please insert phone number" style="padding-left:10px; margin-top:5px; width:300px;" /></p>');
                $('#BotonMod2').trigger('click');
                break;
            case 'invi':  	contenido1 ='<p>Please provide a temporary password for your member.</p><p><input id="TempoPas" name="TempoPas" type="text" class="last-input" placeholder="Temporary Password" title="Please insert temporary password" style="padding-left:10px; margin-top:5px; width:250px;" /></p>';
                contenido = contenido1+contenido2+contenido3;
                $('#ContenidoModal2').html(contenido);
                $('#BotonMod2').trigger('click');
                break;
            case 'msg':  	//contenido = contenido1+contenido2+contenido3;
                //$('#ContenidoModal2').html(contenido);
                $('#messagecontent_inbox').attr('value','');
                $('#subjectname_inbox').attr('value','');
                $("#ToDoctor").show();
                $('#ToDoctor').html('To: '+paciente);
                $('#subjectname_inbox').removeAttr("readonly");   
                $('#messagedetails').hide();
                $('#replymessage').show();
                $("#attachments").empty();
                $('#attachments').hide();
                $('#Reply').hide();
                $("#CloseMessage").hide();
                $('#Attach').hide();
                GlobalIdUser = myClass;
                $('#sendmessages_inbox').show();
                $('#attachreports').show();

                $('#message_modal').trigger('click');
                //$('#BotonMod2').trigger('click');
                break;
            default: //
                break;
        }

        //alert (myClass+' - '+myClass2);
        /*
	 	getUserData(myClass);
	 	paciente = user[0].Name+" "+user[0].Surname; 
	 	IdPaciente = user[0].Identif;
	    TextoS ='<span style="color:grey;">Send </span><span style="color:#54bc00; font-size:30px;">   '+paciente+'   </span><span style="color:grey;"> to </span><span style="color:#22aeff; font-size:30px;">   '+destino+'   </span>';
	    if (paciente>'' && destino>'') TextoS = TextoS + '<input type="button" class="btn btn-success" value="SEND" id="SendButton" style="margin-left:20px; margin-top:-15px;"><p><input type="checkbox" id="c2" name="cc"><label for="c2"  style="margin-top:10px;" ><span></span> Urgent (call phone)</label></p>';
		$('#TextoSend').html(TextoS);
		*/

    }

    $('#sendmessages_inbox').live('click',function(){
        var content = $('#messagecontent_inbox').val();
        var subject = $('#subjectname_inbox').val();
        var NameMed = $('#IdMEDName').val();
        var SurnameMed = $('#IdMEDSurname').val();
        var UserName = user[0].Name;
        var UserSurname = user[0].Surname; 

        alert('Your messsage has been sent to '+UserName+' '+UserSurname);

        if (subject < ' ')  subject='Message from your doctor.';
        //reportids = reportids.replace(/\s+$/g,' ');
        var IdPaciente = GlobalIdUser;
        var IdDocOrigin = $('#MEDID').val();
        var Receiver = 0;

        reportids = ' ';
        var IdDocOrigin = $('#MEDID').val();
        //alert ('IdPaciente: '+IdPaciente+' - '+'Sender: '+IdDocOrigin+' - '+'Attachments: '+reportids+' - '+'Receiver: '+IdDoctor+' - '+'Content: '+content+' - '+'subject: '+subject+' - '+'connection_id: 0');


        var cadena='sendMessageUSER.php?sender='+IdDocOrigin+'&receiver='+IdDoctor+'&patient='+IdPaciente+''+'&content='+content+'&subject='+subject+'&attachments='+reportids+'&connection_id=0&tofrom=from&type=patientnetwork';


        var RecTipo=LanzaAjax(cadena);
        //alert ('Answer of Messg Proc.?: '+RecTipo);
        $('#messagecontent_inbox').attr('value','');

        $('#subjectname_inbox').attr('value','');
        displaynotification('status',RecTipo);

        getUserData(IdPaciente);

        var cadena='push_serverUSER.php?FromDoctorName='+NameMed+'&FromDoctorSurname='+SurnameMed+'&FromDoctorId='+IdDocOrigin+'&Patientname='+UserName+'&PatientSurname='+UserSurname+'&IdUsu='+IdPaciente+'&message= New Message <br>From: Dr. '+NameMed+' '+SurnameMed+' <br>Subject: '+(subject).replace(/RE:/,'')+'&NotifType=1&channel='+IdPaciente;
        //alert(cadena);
        var RecTipo=LanzaAjax(cadena);
        //}
        reportids='';
        $("#attachment_icon").remove();

        $('#message_modal').trigger('click');

    });

    $('#CloseModal2').bind("click", function(){
        // Confirm
        var TelefTarget = $('#TelefUser').val();
        var subcadena='';
        var CallPhone = 0;
        if (TelefTarget > ' '){ 
            subcadena =' (will call phone number also)';
            CallPhone = 1; 
        }

        var UserInput =  $('#IdUserSel').val();
        var UserSwitch =  $('#IdUserSwitch').val();
        var TempoEmail =  $('#TempoEmail').val();
        var TempoPhone =  $('#TempoPhone').val();

        getUserData(UserInput);
        paciente = user[0].Name+" "+user[0].Surname; 
        emailpaciente = user[0].email; 
        phonepaciente = user[0].telefono; 

        switch (UserSwitch)
        {
            case 'conn':	EmailTarget = $('#ResPas').val();;
                emailsArray = EmailTarget.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                if (emailsArray == null || !emailsArray.length) 
                {
                    alert ('Please enter a valid email address');
                }
                else
                {
                    var r=confirm('Confirm sending connection request to member '+paciente+' ?   '+subcadena);
                    if (r==true)
                    {
                        var IdDocOrigin = $('#MEDID').val();
                        var NameDocOrigin = $('#IdMEDName').val() ;
                        var SurnameDocOrigin = $('#IdMEDSurname').val() ;
                        var cadena = 'SendPatientCL.php?Tipo=1&IdPac='+UserInput+'&IdDoc='+IdDocOrigin+'&IdDocOrigin='+IdDocOrigin+'&NameDocOrigin='+NameDocOrigin+'&SurnameDocOrigin='+SurnameDocOrigin+'&ToEmail='+EmailTarget+'&From='+'&Leido=0&Push=0&estado=1'+'&PhoneNumber='+TelefTarget+'&CallPhone='+CallPhone+'&TempoPass=void';
                        //alert (cadena);
                        var RecTipo = LanzaAjax (cadena);
                        //alert (RecTipo);
                    }
                }
                break;
            case 'invi':	PasswordTarget = $('#UTempoPass').val();
                if (!emailpaciente) emailpaciente = TempoEmail;
                if (!phonepaciente) phonepaciente = TempoPhone;
                subcadena =' (will send email to: '+emailpaciente+', and call phone number: '+phonepaciente+')';

                if (phonepaciente > '') CallPhone = '1';

                var r=confirm('Confirm sending invitation to member '+paciente+' ?   '+subcadena);
                if (r==true)
                {
                    var IdDocOrigin = $('#MEDID').val();
                    var NameDocOrigin = $('#IdMEDName').val() ;
                    var SurnameDocOrigin = $('#IdMEDSurname').val() ;
                    var cadena = 'SendPatientCL.php?Tipo=2&IdPac='+UserInput+'&IdDoc='+IdDocOrigin+'&IdDocOrigin='+IdDocOrigin+'&NameDocOrigin='+NameDocOrigin+'&SurnameDocOrigin='+SurnameDocOrigin+'&ToEmail='+emailpaciente+'&From='+'&Leido=0&Push=0&estado=1'+'&PhoneNumber='+phonepaciente+'&CallPhone='+CallPhone+'&TempoPass='+PasswordTarget;
                    //alert (cadena);
                    var RecTipo = LanzaAjax (cadena);
                }
                break;
        }   





    });   

    
   
    
    
    
    
    $("#PhaseNext").click(function(event) {

        if (GKnows == 1) {
            $('#UTempoPass').css('visibility','visible');

            $("#DivConnect").css("background-color","#f5f5f5");
            $("#SpanConnect").html("Already linked");
            $("#SpanConnect").css('color','black');
            $("#IconConnect").css("color","black");
            $("#IconConnect").html('<i class="icon-link icon-3x" ></i>');

            $("#DivInvite").css("background-color","#ddd");
            $("#SpanInvite").html("WILL SEND INVITATION");
            $("#SpanInvite").css('color','#54bc00');
            $("#IconInvite").css("color","#54bc00");
            $("#IconInvite").html('<i class="icon-tag icon-3x icon-spin" ></i>');
        }
        else
        {
            $('#UTempoPass').css('visibility','hidden');

            $("#DivConnect").css("background-color","#ddd");
            $("#SpanConnect").html("WILL SEND REQUEST");
            $("#SpanConnect").css('color','#22aeff');
            $("#IconConnect").css("color","#22aeff");
            $("#IconConnect").html('<i class="icon-link icon-3x icon-spin" ></i>');

            $("#DivInvite").css("background-color","#f5f5f5");
            $("#SpanInvite").html("Wait for permission");
            $("#SpanInvite").css('color','black');
            $("#IconInvite").css("color","black");
            $("#IconInvite").html('<i class="icon-tag icon-3x" ></i>');
        }
        if (phase < 2) 
        {
            var UserInput =  $('#IdPatient').val();
            if (UserInput<1)
            {
            }
            else
            {
                phase++; 
            }
        } else 
        {
            var TempoPassSEL = $('#UTempoPass').val();
            if (GKnows == 1 && TempoPassSEL < 8)
            {
                alert ('Please create a password (8 characters minimum)');
            }
            else
            {
                var TelefTarget = $('#UPhone').val();
                var subcadena='';
                var CallPhone = 0;
                if (TelefTarget > ' '){ 
                    subcadena =' (will call phone number also)';
                    CallPhone = 1; 
                }
                var UserInput =  $('#IdPatient').val();
                getUserData(UserInput);
                paciente = user[0].Name+" "+user[0].Surname; 
                emailpaciente = user[0].email; 
                phonepaciente = user[0].telefono; 

                //alert (UserInput);
                if (GKnows == 1) {
                    var UserSwitch =  'invi';
                }else  {
                    UserSwitch =  'conn'; 
                }
                var TempoEmail =  $('#UEmail').val();
                var TempoPhone =  $('#UPhone').val();


                switch (UserSwitch)
                {
                    case 'conn':	EmailTarget = TempoEmail;
                        emailsArray = EmailTarget.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                        if (emailsArray == null || !emailsArray.length) 
                        {
                            alert ('Please enter a valid email address');
                        }
                        else
                        {
                            var r=confirm('Confirm sending connection request to member '+paciente+' ?   '+subcadena);
                            if (r==true)
                            {
                                var IdDocOrigin = $('#MEDID').val();
                                var NameDocOrigin = $('#IdMEDName').val() ;
                                var SurnameDocOrigin = $('#IdMEDSurname').val() ;
                                var cadena = '/SendPatientCL.php?Tipo=1&IdPac='+UserInput+'&IdDoc='+IdDocOrigin+'&IdDocOrigin='+IdDocOrigin+'&NameDocOrigin='+NameDocOrigin+'&SurnameDocOrigin='+SurnameDocOrigin+'&ToEmail='+EmailTarget+'&From='+'&Leido=0&Push=0&estado=1'+'&PhoneNumber='+TelefTarget+'&CallPhone='+CallPhone+'&TempoPass=void';
                                //alert (cadena);
                                var RecTipo = LanzaAjax (cadena);
                                //alert (RecTipo);
                            }
                        }
                        break;
                    case 'invi':	PasswordTarget = $('#UTempoPass').val();
                        if (!emailpaciente) emailpaciente = TempoEmail;
                        if (!phonepaciente) phonepaciente = TempoPhone;
                        subcadena =' (will send email to: '+emailpaciente+', and call phone number: '+phonepaciente+')';

                        if (phonepaciente > '') CallPhone = '1';

                        var r=confirm('Confirm sending invitation to member '+paciente+' ?   '+subcadena);
                        if (r==true)
                        {
                            var IdDocOrigin = $('#MEDID').val();
                            var NameDocOrigin = $('#IdMEDName').val() ;
                            var SurnameDocOrigin = $('#IdMEDSurname').val() ;
                            var cadena = '/SendPatientCL.php?Tipo=2&IdPac='+UserInput+'&IdDoc='+IdDocOrigin+'&IdDocOrigin='+IdDocOrigin+'&NameDocOrigin='+NameDocOrigin+'&SurnameDocOrigin='+SurnameDocOrigin+'&ToEmail='+emailpaciente+'&From='+'&Leido=0&Push=0&estado=1'+'&PhoneNumber='+phonepaciente+'&CallPhone='+CallPhone+'&TempoPass='+PasswordTarget;
                            //alert (cadena);
                            var RecTipo = LanzaAjax (cadena);
                        }
                        break;
                }   
                $('#CloseModal').trigger('click');
                $('#SendButton').trigger('click');
            }
        } 
        var ancho = $("#header-modal").width()*(phase-1);
        switch (phase){
            case 1:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","#ccc");
                $("#att").css("color","#ccc");
                $("#addcom").css("color","#ccc");
                break;     
            case 2:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","rgb(61, 147, 224)");
                $("#att").css("color","#ccc");
                $("#addcom").css("color","#ccc");
                break;     
            case 3:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","rgb(61, 147, 224)");
                $("#att").css("color","rgb(61, 147, 224)");
                $("#addcom").css("color","#ccc");
                createPatientReportsNEW ();
                break;     
            case 4:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","rgb(61, 147, 224)");
                $("#att").css("color","rgb(61, 147, 224)");
                $("#addcom").css("color","rgb(61, 147, 224)");
                break; 
            default:    alert ('no phase detected');
                break;
        }
        $("#ContentScroller").animate({ scrollLeft: ancho}, 175);
    });

    $("#PhasePrev").click(function(event) {
        if (phase == 3) $("#Attach").trigger('click');
        if (phase >1) phase--; else 
        {
            // alert ('beginning of loop');    
        } 
        var ancho = $("#header-modal").width()*(phase-1);
        switch (phase){
            case 1:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","#ccc");
                $("#att").css("color","#ccc");
                $("#addcom").css("color","#ccc");
                break;     
            case 2:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","rgb(61, 147, 224)");
                $("#att").css("color","#ccc");
                $("#addcom").css("color","#ccc");
                break;     
            case 3:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","rgb(61, 147, 224)");
                $("#att").css("color","rgb(61, 147, 224)");
                $("#addcom").css("color","#ccc");
                createPatientReportsNEW ();
                break;     
            case 4:   $("#selpat").css("color","rgb(61, 147, 224)");
                $("#seldr").css("color","rgb(61, 147, 224)");
                $("#att").css("color","rgb(61, 147, 224)");
                $("#addcom").css("color","rgb(61, 147, 224)");
                break; 
            default:    alert ('no phase detected');
                break;
        }
        $("#ContentScroller").animate({ scrollLeft: ancho}, 175);
    });

    $("#BotonBusquedaPacNEW").click(function(event) {
        //wizard

        var search = $('#SearchUserT').val();
        var IdMed = $('#MEDID').val();
        var UserDOB = '';
        $('#Wait2').show();
        var queUrl ='getPatientsConnectedShort.php?Usuario='+search+'&UserDOB='+UserDOB+'&IdDoc='+IdMed+'&NReports=3';
        //alert(queUrl);


        $.ajax(
            {
                url: queUrl,
                dataType: "html",
                success: function(data)
                {

                    $('#TablaPacModal').html(data);
                    $('#TablaPacModal').trigger('update');
                    if (pases==1) $('#BotonBusquedaSents').trigger('update');
                    ////console.log('done');
                    $('#Wait2').hide();
                }
            });









        /*ContentDyn = LanzaAjax(queUrl);
		 //console.log('done');

         $('#TablaPacModal').html(ContentDyn);
    	 $('#TablaPacModal').trigger('update');
         if (pases==1) $('#BotonBusquedaSents').trigger('update');
		*/
    });       

    $('.CFILAPATModal').live('click',function(){
        var id = $(this).attr("id");
        var IdPaciente = id;
        $('#IdPatient').val(id);
        var conte = $(this).attr("id2");
        var Relat = $(this).attr("id3");
        var Knows = $(this).attr("id4");
        var PEmail = $(this).attr("id5");
        var PPhone = $(this).attr("id6");
        if (PEmail < '..') PEmail='';
        $('#UEmail').val(PEmail);
        $('#UPhone').val(PPhone);
        GRelType = Relat;
        GKnows = Knows;

        $('#PhaseNext').trigger('click');
        TextoS ='<span style="color:grey;">Selected </span><span style="color:#54bc00; font-size:30px;">   '+conte+'   </span><span style="color:#22aeff; font-size:20px;">   ('+IdPaciente+')  (Relat: '+Relat+')  (Knows: '+Knows+') </span>';
        //if (paciente>'' && destino>'') TextoS = TextoS + '';
        $('#TextoSend').html(TextoS);
    });


    function justtest()
    {
        alert ('Test ok');
    }

    function getBlocks(serviceURL) {
        $.ajax(
            {
                url: serviceURL,
                dataType: "json",
                async: false,
                success: function(data)
                {
                    blocks = data.items;
                    //$('#Wait1').hide(); 
                    //alert ("PASA");
                    //alert (employees);
                }
            });
    }        

    $(".CFILA").live('click',function() {
        /*	var myClass = $(this).attr("id");
     	var NombreEnt = $('#NombreEnt').val();
     	var PasswordEnt = $('#PasswordEnt').val();
     	//window.location.replace('patientdetail.php?Nombre='+NombreEnt+'&Password='+PasswordEnt+'&IdUsu='+myClass);
     	//alert (myClass);
        $('#BotonModal').trigger('click');
      */
    });

    $(".view-button").live('click',function() {
        var myClass = $(this).attr("id");
        $('#queId').attr("value",myClass);
        var NameMed = $('#IdMEDName').val();
        var SurnameMed = $('#IdMEDSurname').val();
        var PasswordEnt = $('#PasswordEnt').val();
        var MEDID = $('#MEDID').val();
        var MEDEmail = $('#IdMEDEmail').val();

        $('#BotonModal').trigger('click');
    });

    $("#ConfirmaLink").live('click',function() {
        var To = $('#queId').val();
        getUserData(To);

        if (user[0].email==''){
            var IdCreador = user[0].IdCreator;

            alert ('orphan user . Creator= '+IdCreador);

            getMedCreator(IdCreador);

            var NameMed = $('#IdMEDName').val();
            var SurnameMed = $('#IdMEDSurname').val();
            var From = $('#MEDID').val();
            var FromEmail = $('#IdMEDEmail').val();
            var Subject = 'Request conection from Dr. '+NameMed+' '+SurnameMed;

            var Content = 'Dr. '+NameMed+' '+SurnameMed+' is requesting to establish connection with your member named: '+user[0].Name+' '+user[0].Surname+' (UserId:  '+To+'). Please confirm, or just close this message to reject.';

            //alert (Content);
            var destino = "Dr. "+doctor[0].Name+" "+doctor[0].Surname; 
            var cadena = '/MsgInterno.php?Tipo=1&IdPac='+user[0].Identif+'&To='+doctor[0].id+'&ToEmail='+doctor[0].IdMEDEmail+'&From='+From+'&FromEmail='+FromEmail+'&Subject='+Subject+'&Content='+Content+'&Leido=0&Push=0&estado=1';

            //alert (cadena);
            var RecTipo = LanzaAjax (cadena);

            //alert (RecTipo);
        }
        else
        {
            var NameMed = $('#IdMEDName').val();
            var SurnameMed = $('#IdMEDSurname').val();
            var From = $('#MEDID').val();
            var FromEmail = $('#IdMEDEmail').val();
            var Subject = 'Request conection ';

            var Content = 'Dr. '+NameMed+' '+SurnameMed+' is requesting to establish connection with you (UserId:  '+To+'). Please confirm, or just close this message to reject.';

            var cadena = '/MsgInterno.php?Tipo=0&IdPac=0&To='+To+'&ToEmail='+user[0].email+'&From='+From+'&FromEmail='+FromEmail+'&Subject='+Subject+'&Content='+Content+'&Leido=0&Push=0&estado=1';

            //alert (cadena);
            var RecTipo = 'Temporal';
            $.ajax(
                {
                    url: cadena,
                    dataType: "html",
                    async: false,
                    complete: function(){ //alert('Completed');

                    },
                    success: function(data)
                    {
                        if (typeof data == "string") {
                            RecTipo = data;
                        }
                    }
                });

            //alert (RecTipo);	    
            //var Content = 'Dr. '+NameMed+' '+SurnameMed+' is requesting to establish connection with you (UserId:  '+To+'). Please click the button: </br><input type="button" href="www.inmers.com/ConfirmaLink?User='+To+'&Doctor='+From+'&Confirm='+RecTipo+'" class="btn btn-success" value="Confirm" id="ConfirmaLink" style="margin-top:10px; margin-bottom:10px;"> </br> to confirm, or just close this message to reject.';

            //EnMail(user[0].email, 'MediBANK Link Request', Content);  // NO SE USA AQUÍ, PERO SI FUNCIONA PERFECTAMENTE PARA ENVIAR MENSAJES DE EMAIL DESDE JAVASCRIPT
        }

        $('#CloseModal').trigger('click');
        $('#BotonBusquedaPac').trigger('click');

    });

    $("#prevPatients").click(function(event){
        console.log('filter: '+filter);
        //console.log(currPage);
        //console.log(lastPage);
        if(currPage > 1)
        {
            currPage--;
            start -= numDisplay;
            getPatientList(filter);
            updatePageDisplay();
        }
    });

    $("#nextPatients").click(function(event){
        console.log('filter: '+filter);
        //console.log(lastPage);
        if(currPage < lastPage)
        {
            currPage++;
            start += numDisplay;
            getPatientList(filter);
            updatePageDisplay();
        }
    })

    function updatePageDisplay()
    {
        document.getElementById("CurrentPage").innerHTML = currPage+" - "+lastPage;
        //document.getElementById("prevPatients").innerHTML = currPage;
    }

    $('#Wait1')
    .hide()  // hide it initially
    .ajaxStart(function() {
        //alert ('ajax start');
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    }); 

    $('#Wait3')
    .hide()  // hide it initially
    .ajaxStart(function() {
        //alert ('ajax start');
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    }); 

    $('#Wait4')
    .hide()  // hide it initially
    .ajaxStart(function() {
        //alert ('ajax start');
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    }); 

    /*
  	$("#datatable_1 tbody").click(function(event) {
  		alert ('click');
		$(oTable.fnSettings().aoData).each(function (){
			$(this.nTr).removeClass('row_selected');
		});
		$(event.target.parentNode).addClass('row_selected');
	});
  */
    //alert ('ok');


    /*
    setInterval(function() {


	 //  alert ('Redraw now');
	 // "bDestroy": true,
	 // "bRetrieve": true,


	$('#datatable_1').dataTable( {
		"bProcessing": true,
		"bDestroy": true,
		"sAjaxSource": "getBLOCKS.php"
	} );
						//location.reload();
   				 		//$('#loaddiv').fadeOut('slow').load('reload.php').fadeIn("slow");

   				 		}, 10000);  

  */  

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

    function EnMail (aQuien, Tema, Contenido)
    {
        var cadena = '/EnMail.php?aQuien='+aQuien+'&Tema='+Tema+'&Contenido='+Contenido;
        var RecTipo = 'Temporal';
        $.ajax(
            {
                url: cadena,
                dataType: "html",
                async: false,
                complete: function(){ //alert('Completed');
                },
                success: function(data)
                {
                    if (typeof data == "string") {
                        RecTipo = data;
                    }
                }
            });
        //alert (RecTipo);	    
    }




    $("#prev").live('click',function() {
        currpage=currpage-1;
        $('#BotonBusquedaProbe').trigger('click');
    });

    $("#next").live('click',function() {
        currpage=currpage+1;
        $('#BotonBusquedaProbe').trigger('click');
    });

    $(".SendMessage").live('click',function() {
        var myClass = $(this).attr("id");
        //		alert(myClass);
        var r = confirm("Are you sure you want to probe this member now ?");
        if (r == true)
        {
            var url = 'sendEmergencyProbe.php?probeID='+myClass;
            //console.log(url);
            var response = LanzaAjax(url);
            displaynotification("Probe Sent",response);

        }
        else
        {
            //x = "You pressed Cancel!";
        }



    });

    $(".RevokeProbe").live('click',function() {
        var myClass = $(this).attr("id");
        var url = 'revokeProbe.php?probeID='+myClass;
        var response = LanzaAjax(url);
        $('#BotonBusquedaProbe').trigger('click');
        displaynotification("Probe Revoked"," ");
    });

    $(".CannotProbe").live('click',function() {
        displaynotification("Cannot Probe","Member does not want to receive Probes.");
    });

    $(".RestartProbe").live('click',function() {
        var myClass = $(this).attr("id");
        var url = 'restartProbe.php?probeID='+myClass;
        var response = LanzaAjax(url);
        $('#BotonBusquedaProbe').trigger('click');
        displaynotification("Probe Restarted"," ");
    });

    $(".probePopUp").live('click',function() {

        var myClass=$(this).closest('div').attr('id');
        var url = 'getPatientContactInfo.php?idusu='+myClass;
        getusuariosdata(url);

        var quecolor='RED';
        $('#InfoIDPacienteBB').html('<span id="ETUSER" class="label label-info" style="font-size:18px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; margin-left:20px;">'+myClass+'</span><span class="label label-info" style="background-color:'+quecolor+'; font-size:14px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; margin-left:20px;">'+patient[0].idusfixedname+'</span>');	


        var url = 'getProbeHistory.php?patientID='+myClass;
        var RecTipo = LanzaAjax(url);
        $('#TablaProbeHistory').html(RecTipo);

        var responded = $('#ProbesResponded').val();
        var sent = $('#ProbesSent').val();
        var method = $('#ProbeMethod').val();

        var methodIcon ='';
        switch(parseInt(method))
        {
            case 1: methodIcon='<i class="icon-envelope icon-2x" style="color:#61a4f0;margin-left:20px" title="Probed via Email"></i>';
                break;
            case 2: methodIcon='<i class="icon-phone icon-2x" style="color:green;margin-left:20px" title="Probed via Phone Call"></i>';
                break;
            case 3: methodIcon='<i class="icon-comment icon-2x" style="color:gray;margin-left:20px" title="Probed via SMS"></i>';
                break;		
        }






        var per = responded/sent*100;




        $('#InfoIDPacienteStats').html('<span id="ETUSER" class="label label-info" style="background-color:#54bc00;font-size:18px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; ">'+per.toPrecision(3)+'% Answered</span><span>'+methodIcon+'</span>');			

        $('#TablaProbeHistory').trigger('update');

        $('#probeHistory').trigger('click');


        //alert(pid);
    });


    

    $("#CToggle").click(function(event) {
        $('#BotonBusquedaProbe').trigger('click');
    });

    

/*
    $('#createProbe').live('click',function(){	 


        var timezone = $('#Timezone').val();
        var time = $('#Time').val();
        var interval = $('#Interval').val();

        if(time=='')
        {
            alert('Please select appropriate time');
            return;
        }



        var selectedOption = $('#Method').val();

        var email=1;
        var phone=0;
        var message=0;

        var contactMedium = "";	
        switch(selectedOption)
        {
            case 'Email':email=1;
                phone=0;
                message=0;
                if(validateEmail($('#Email').val())==false)
                {
                    alert('Invalid Email');
                    return;
                }

                contactMedium = "1::"+$('#Email').val();
                break;
            case 'Phone':phone=1;
                email=0;
                message=0;

                //if($("#Phone").intlTelInput("isValidNumber")==false)
                //{
                //	alert('Invalid Phone Number');
                //	return;
                //}
                //else
                //{	
                //$('#Phone').val($('#Phone').val().replace(/-/g, '')); //remove dashes
                $('#Phone').val($('#Phone').val().replace(/\s+/g, '')); //remove spaces


                //}
                contactMedium = "2::"+$('#Phone').val();

                break;
            case 'Message':phone=0;
                email=0;
                message=1;

                //if($("#Message").intlTelInput("isValidNumber")==false)
                //{
                //alert('Invalid Phone Number');
                //return;
                //}
                //else
                //{
                //$('#Message').val($('#Message').val().replace(/-/g, '')); //remove dashes
                $('#Message').val($('#Message').val().replace(/\s+/g, '')); //remove spaces


                //}
                contactMedium = "2::"+$('#Message').val();
                break;
        }




        var intervalText ='';
        switch(interval)
        {
            case '1':intervalText='daily';break;
            case '7':intervalText='weekly';break;
            case '30':intervalText='monthly';break;
            case '365':intervalText='yearly';break;

        }



        var text = 'Are you sure you want '+patient[0].idusfixedname+' to be contacted '+intervalText+' at '+time + ' for health status feedback.';
        var r = confirm(text);
        if(r==true)
        {


            //return;
            var url='createProbe.php?idusu='+$('#patientID').val()+'&timezone='+timezone+'&time='+time+'&interval='+interval+'&email='+email+'&phone='+phone+'&message='+message+'&contact='+contactMedium+'&probeID='+$('#ProbeIDHidden').val();	
            //alert(url);
            var response = LanzaAjax(url);
            //alert(response);

            if(response=='success'){
                //alert('Probe Created Successfully');

                if($('#ProbeIDHidden').val()==-111)
                {			
                    displaynotification("Probe Created Successfully"," ");
                }
                else
                {
                    displaynotification("Probe Edited Successfully"," ");
                }
            }
            else {
                alert('Error Creating Probe');
            }
        }
        else
        {

        }
        $('#BotonBusquedaProbe').trigger('click');

    });
*/
    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 
    /*
	function validatePhone(inputtxt)
	{
		  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		  return phoneno.test(inputtxt);


	}*/

    $( "#Method" ).change(function() {

        changeMethod();
        /*var selectedOption = $('#Method').val();

		var emailRow = document.getElementById('EmailRow').style;
		var phoneRow = document.getElementById('PhoneRow').style
		var messageRow = document.getElementById('MessageRow').style
		switch(selectedOption)
		{
			case 'Email':		     
				 emailRow.display = 'table-row';
				 phoneRow.display = 'none';
				 messageRow.display = 'none';
				 break;
			case 'Phone':
				 emailRow.display = 'none';
				 phoneRow.display = 'table-row';
				 messageRow.display = 'none';		
				break;
			case 'Message':
				 emailRow.display = 'none';
				 phoneRow.display = 'none';
				 messageRow.display = 'table-row';	
				break;


		}*/


    });

    function changeMethod()
    {
        var selectedOption = $('#Method').val();

        var emailRow = document.getElementById('EmailRow').style;
        var phoneRow = document.getElementById('PhoneRow').style
        var messageRow = document.getElementById('MessageRow').style
        switch(selectedOption)
        {
            case 'Email':		     
                emailRow.display = 'table-row';
                phoneRow.display = 'none';
                messageRow.display = 'none';
                break;
            case 'Phone':
                emailRow.display = 'none';
                phoneRow.display = 'table-row';
                messageRow.display = 'none';		
                break;
            case 'Message':
                emailRow.display = 'none';
                phoneRow.display = 'none';
                messageRow.display = 'table-row';	
                break;


        }

    }


    function getusuariosdata(serviceURL) 
    {
        //retrieves patient idusfixedname,email and phone
        $.ajax(
            {
                url: serviceURL,
                dataType: "json",
                async: false,
                success: function(data)
                {
                    //alert('Data Fetched');
                    patient = data.items;
                }
            });
    }

    //retrieves probe information for given probeID
    function getprobedata(serviceURL) 
    {

        $.ajax(
            {
                url: serviceURL,
                dataType: "json",
                async: false,
                success: function(data)
                {
                    //alert('Data Fetched');
                    probe = data.items;
                }
            });
    }


    //Gets all rows from timezone table
    function get_timezones(serviceURL) 
    {
        $.ajax(
            {
                url: serviceURL,
                dataType: "json",
                async: false,

                success: function(data)
                {
                    timezones = data.items;

                }
            });
    }

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


    /* VERDES
#16ff00
#12cb00
#0e9a00
*/
    /* VARIOS COL
#54bc00
#ffdb14
#6cb1ff
*/
    
    
       

});  

window.onload = function(){		

    var PaquetesSI = parseInt($('#PaquetesSI').val());
    var PaquetesNO = parseInt($('#PaquetesNO').val());
    var PTotal = PaquetesSI + PaquetesNO;
    var porcenSI = Math.floor((PaquetesSI*100)/PTotal);
    var porcenNO = Math.floor((PaquetesNO*100)/PTotal);
    Morris.Donut({
        element: 'MiDonut',
        colors: ['#0fa200','#ff5d5d'],
        formatter: function (y) { return  y +' %' },
        data: [
            {label: "IN USE", value: porcenSI},
            {label: "Not used", value: porcenNO}
        ]
    });
};
