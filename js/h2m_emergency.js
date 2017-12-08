$( document ).ready(function() {
    console.log( "ready!" );
	//getDiagnostics(4);
	var $user_id=$("#UserHidden").val();
	
	getHabitsData($user_id);
	getFamilyHistoryData($user_id);		//Load HTML into Family
	getImmunoAllergyData($user_id);
	getDiagnosticHistoryInfo($user_id);
	var $translationdel='';
	function getDiagnostics(toShow)
	{
	
		var queUrl ='getDiagnostics.php';
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
		console.log( "Num Diagnostics : "+numDiagnostics );
		var n = 0;
		var DiagnosticBox='';
		/*if (numDiagnostics==0)
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
		}*/
		if (numDiagnostics == 0) {
			DiagnosticBox += '<div class="diagnostic">No Recorded Medical Conditions</div>';	
		}
		while (n<numDiagnostics){
			var del = DiagnosticData[n].deleted;
			var dxname = DiagnosticData[n].dxname;
			var dxcode = DiagnosticData[n].dxcode;
			var sdate = DiagnosticData[n].sdate;
			var edate = DiagnosticData[n].edate;	
			var notes = DiagnosticData[n].notes;
			var rowid = DiagnosticData[n].id;	
			console.log( "n: "+dxname);
			DiagnosticBox += '<div class="diagnostic"><span>'+dxname+'</span></div>';	
			if(del==0)
	
			{	
		
			/*DiagnosticBox += '<div id='+rowid+'>';
			
			
			var middleColumn = sdate;
			
			if(edate.length>0)
			{
				middleColumn = middleColumn + '-' + edate;
			}
			
			if(notes.length==0)
			{
				notes = 'No Notes Recorded';
			}	
			
			
			if(rowid==toShow)
			{
				DiagnosticBox += '<div style="width:10px; float:left; text-align:left;"><i class="icon-chevron-down"></i></div>';*/
			}
			

			
		/*			DiagnosticBox += '<div style="width:140px; float:left; text-align:left;cursor:pointer"><span class="PatName">'+dxname.substr(0, 30)+'</span></div>';
					DiagnosticBox += '<div style="width:190px; float:left; text-align:center; color:#22aeff;"><span class="DrName">'+middleColumn +' </span></div>';

										
			
			DiagnosticBox += '</div>';
			
			DiagnosticBox += '<div class="InfoRow NotesRow" id=Note'+rowid;
			if(rowid==toShow)
			{
				DiagnosticBox += '>';
			}
			else
			{
				DiagnosticBox += ' style="display:none">';
			}
			
			if(del==0)
			{
				DiagnosticBox += '<div style="width:100%; float:left; text-align:left;">'+notes+'</div>';
			}
			else
			{
				DiagnosticBox += '<div style="width:100%; float:left; text-align:left;"><strike>'+notes+'</strike></div>';
			}
			DiagnosticBox += '</div>';
			}*/
			n++;
		}
		$('#DiagnosticContainer').html(DiagnosticBox);

	}
	
	function getHabitsData($user_id)
	{
		var link = 'getHabitsData.php?id='+$user_id;
    
		$.ajax({
           url: link,
           dataType: "html",
           async: true,
           success: function(data)
           {
				$('#HabitsInfo').html(data);
           }
        });
	
	}
	function getRelatives()
	{
		var queUrl ='getRelatives.php';
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
		var RelativesBox='';
		var translationdel='';
		
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
			
			console.log("Relative Name : "+relativename);
			console.log("Relative Type : "+relativetype);
			console.log("Relative Disease : "+disease);
			console.log("Disease Group : "+diseasegroup);
			console.log("ICD10 : "+ICD10);
			console.log("ICD9 : "+ICD9);
			console.log("Age event : "+ageevent);
			
			
			var middlecolumn = disease + ' @ '+ageevent;
			if(del==0)
			{
			RelativesBox += '<div class="InfoRow">';
			
			
			RelativesBox += '<div style="width:180px; float:left; text-align:left;"><span class="PatName">'+relativename+'</span></div>';
			RelativesBox += '<div style="width:150px; float:left; text-align:left; color:#22aeff;"><span class="DrName">'+middlecolumn +' </span></div>';
			RelativesBox += '<div class="EditFamilyHistory" id="'+rowid+'" style="width:60px; float:right;height:30px;margin-right:10px;"><a id="'+rowid+'"  class="btn" style="height: 15px; padding-top: 0px; margin-top: -5px; color:green;" lang="en">Edit</a></div>';
			RelativesBox += '<div class="DeleteRelative" id="'+rowid+'" style="width:60px; float:right;height:30px;"><a id="'+rowid+'"  class="btn" style="height: 15px; padding-top: 0px; margin-top: -5px; color:red;" lang="en">'+translationdel+'</a></div>';
			
			
			RelativesBox += '</div>';
			}
			n++;
		}
		$('#RelativesContainer').html(RelativesBox);
	    
	}

	function getFamilyHistoryData($user_id)
	{
		var link = 'getFamilyHistoryData.php?id='+$user_id;
    
    
		$.ajax({
           url: link,
           dataType: "html",
           async: true,
           success: function(data)
           {
				$('#FamilyHistoryInfo').html(data);
				var myElement = document.querySelector("#FamilyHistoryInfo");
				//myElement.style.display = "block";
				//alert('done');
           }
        });
	
	}
	
	function getVaccines()
	{
		var queUrl ='getVaccines.php';
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
		var VaccinesBox='';
		
		today = new Date();
		eventd = new Date(2010,05,01); // remember this is equivalent to 06 01 2010
		dob = new Date(2003,8,11); // remember this is equivalent to 06 01 2010

		a = calcDate(eventd,dob)
		
		while (n<numVaccines){
			var del = VaccinesData[n].deleted;
			var VaccCode = VaccinesData[n].VaccCode;
			var VaccName = VaccinesData[n].VaccName;
			var AllerCode = VaccinesData[n].AllerCode;
			var AllerName = VaccinesData[n].AllerName;
			var intensity = VaccinesData[n].intensity;
			var dateEvent = VaccinesData[n].dateEvent;
			var ageEvent = VaccinesData[n].ageEvent;
			/*console.log(del);
			console.log(VaccCode);
			console.log(AllerCode);
			console.log(AllerName);
			console.log(intensity);
			console.log(dateEvent);
			console.log(ageEvent);*/
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
			VaccinesBox += '<div style="width:150px; float:left; text-align:left; color:#22aeff;"><span class="DrName">'+middlecolumn +' </span></div>';
			//VaccinesBox += '<div class="EditVaccine" id="'+rowid+'" style="width:60px; float:right;margin-right:10px;"><a id="'+rowid+'"  class="btn" style="height: 15px; padding-top: 0px; margin-top: -5px; color:green;" lang="en">Edit</a></div>';
			//VaccinesBox += '<div class="DeleteVaccine" id="'+rowid+'" style="width:60px; float:right;"><a id="'+rowid+'"  class="btn" style="height: 15px; padding-top: 0px; margin-top: -5px; color:red;" lang="en"></a></div>';
						
			VaccinesBox += '</div>';
			}
			}
			n++;
	
		}
		$('#VaccinesContainer').html(VaccinesBox);
	    //alert (RelativesBox);
	    
	}
});

	function printDiv(divName) {
     	var printContents = document.getElementById(divName).innerHTML;
     	var originalContents = document.body.innerHTML;

     	document.body.innerHTML = printContents;

     	window.print();

     	document.body.innerHTML = originalContents;
	}
	function getImmunoAllergyData($user_id)
	{
		var link = 'getImmunoAllergyData.php?id='+$user_id;
    
    
		$.ajax({
           url: link,
           dataType: "html",
           async: true,
           success: function(data)
           {
				$('#ImmunizationAllergyInfo').html(data);
				var myElement = document.querySelector("#ImmunizationAllergyInfo");
				//$('#H2M_SpinA').css('visibility','hidden');
				//myElement.style.display = "block";

           }
        });

	
	}
function getDiagnosticHistoryInfo($user_id)
	{
		var link = 'getDiagnosticData.php?id='+$user_id;
    
    
		$.ajax({
           url: link,
           dataType: "html",
           async: true,
           success: function(data)
           {


				$('#DiagnosticHistoryInfo').html(data);
				var myElement = document.querySelector("#DiagnosticHistoryInfo");
				myElement.style.display = "block";
				//alert('done');
           }
        });

	
	}
function calcDate(date1,date2) {
	    var diff = Math.floor(date1.getTime() - date2.getTime());
	    var day = 1000* 60 * 60 * 24;
	
	    var days = Math.floor(diff/day);
	    var months = Math.floor(days/31);
	    var years = Math.floor(months/12);
	
	    var message = date2.toDateString();
	    message += " was "
	    message += days + " days " 
	    message += months + " months "
	    message += years + " years ago \n"
		    
	    var cadena = Array();
	    cadena[0] = days;
	    cadena[1] = months;
	    cadena[2] = years;
	    
		return cadena;
		
	    }
