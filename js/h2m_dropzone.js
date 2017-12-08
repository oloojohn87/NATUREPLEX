
var med_id = $('#MEDID').val();


$("input[type='image']").click(function() {
    $("input[id='fileToUpload2']").click();
});
	
jQuery("input[id='fileToUpload2']").change(function () {
    $("input[id='make_upload']").click();       
});
	
	
	var $j = jQuery.noConflict();
	
	var filelist = new Array();
	var datelist = new Array();
	var filecount=0;
	var upload_count =0;
	var num=0;
	var orig_file_array = new Array();
	var idpin_array = new Array();
	var files = new Array();
	var types=new Array();
	var curr_file=0;
	var pats = new Array();
	var availablePatientTags = new Array();
	var rep_date = new Array();
	var last_press;
	var last_step;
	var verified=false;
	var existing=true;
	var failed_uploads=0;
	
	var timeoutTime = 18000000;
	//var timeoutTime = 300000;  //5minutes
var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);


var active_session_timer = 60000; //1minute
var sessionTimer = setTimeout(inform_about_session, active_session_timer);

//This function is called at regular intervals and it updates ongoing_sessions lastseen time
function inform_about_session()
{
	$j.ajax({
		url: '/ongoing_sessions.php?userid='+$('#MEDID').val(),
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

	
	 function getpatients(serviceURL) 
	{
		$j.ajax(
		{
			url: serviceURL,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				patients = data.items;
			}
		});
	}   
	
	function renameFile(serviceURL,oldName,newName) 
		{
			$j.ajax(
			{
				url: serviceURL+'?oldName='+oldName+'&newName='+newName,
				dataType: "json",
				async: false,
				success: function(data)
				{
					//alert('Data Fetched');
					//patients = data.items;
				}
			});
		}   
	function getImageDimension(serviceURL) 
		{
			$j.ajax(
			{
				url: serviceURL,
				dataType: "json",
				async: false,
				success: function(data)
				{
					//alert('Data Fetched');
					//patients = data.items;
					//alert(data);
				}
			});
		}   
	window.onbeforeunload = confirmExit;
	function confirmExit()
	{
	
		switch(last_step)
		{
			case 1: if(upload_count!=filecount && filecount!=0)
					{
						return "Some of the reports are getting uploaded. Are you sure you want to exit this page?";
					}
					else if(upload_count==filecount && filecount!=0)
					{
						return "Uploaded Reports have not been verified yet. Are you sure you want to exit this page?";
					}
					break;
			case 2: if(curr_file !=idpin_array.length)
					{
						return "Some reports have not been verified. Are you sure you want to exit this page?";
					}
					else if(verified==false)
					{
						return "Changes have not been saved yet. Are you sure you want to exit this page?";
					}
					break;
		}
		
		
	}
		
		$j(window).load(function() {
		//alert("started");
		$j(".loader_spinner").fadeOut("slow");
		})
		
		
		//$('#wizard').smartWizard();
		//$("#myTab1").tabs('select',"TabDemographics");
		//$('#TabDemographics').show();
		var list = new Array();
	var curr_file=-1;
	var timeoutTime = 18000000;
	//var timeoutTime = 300000;  //5minutes
	var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
	

	/*$('#upload_avatar').uploadify({
		'method'   : 'post',
		'formData'     : {
					'timestamp' : '<?php echo $timestamp;?>',
					'token'     : '<?php echo md5('unique_salt' . $timestamp);?>'
				},
        'swf'      : 'js/uploadify/uploadify.swf',
        'uploader' : 'uploadify.php?pullfile=<?php echo $_GET['IdUsu']; ?>',
		'multi'    :  false,
        'onUploadSuccess' : function(file, data, response) {
		var split = data.split('|');
        //alert('The file was saved to: ' + split[0]);
		//if(split[1]=="1")
		//{
		//	alert("Kindly upload image of minimum dimensions 70X70");
		//	return;	
		//}
		$('#patientImageDiv').show();
		//if(split[0]=="fileError")
		//{
		//	alert("Please select a file belonging to one of the following types: jpeg,gif or png");
		//	$('#patientImage').attr('src','PatientImage/defaultDP.jpg');
		//	return;
		//}
		//else
		$('#patientImage').attr('src',split[0]);
		location.reload();
    }
    });*/
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////
	//THIS UPLOADS PROFILE IMAGE//
	
	function fileSelected() {
        var file = document.getElementById('fileToUpload2').files[0];
        if (file) {
          var fileSize = 0;
          if (file.size > 1024 * 1024)
            fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
          else
            fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

          document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
          document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
          document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
        }
      }

      function uploadFile2() {
        var fd = new FormData();
        fd.append("fileToUpload2", document.getElementById('fileToUpload2').files[0]);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "../uploadifyPatient.php?pulldoc="+med_id);
        xhr.send(fd);
      }

      function uploadProgress(evt) {
        if (evt.lengthComputable) {
          var percentComplete = Math.round(evt.loaded * 100 / evt.total);
          document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
        }
        else {
          document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }
      }

      function uploadComplete(evt) {
		/*document.getElementById("image_holder").src="../PatientImage/"+med_id+".jpg";
        //This refreshes image
        var profile_pic = document.getElementById('image_holder');
        profile_pic.src += "?rand2"+Math.random();*/
          
          
      }

      function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.");
      }

      function uploadCanceled(evt) {
        alert("The upload has been canceled by the user or the browser dropped the connection.");
      }
	  
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		
	$j(document).ready(function() {
			  
	  
		$j('body').bind('mousedown keydown', function(event) {
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
		});
		
		verified=false;
		document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
		$j('#wizard').hide();
		$j('#wizard').smartWizard({transitionEffect:'slideleft',onLeaveStep:leaveAStepCallback,onFinish:onFinishCallback,onShowStep:showstepcallback,enableFinishButton:false});
		//alert('loaded');
		setTimeout(function(){$j('#wizard').show();},100);
		
		function showstepcallback(obj)
		{
			//alert('here');
			var step_num = obj.attr('rel');
			if(parseInt(step_num) < parseInt(last_step))
			{
				//alert('inside');
				$j("#wizard").smartWizard('goToStep', last_step);
				//goToStep(last_step);
				return false;
			}
			return true;
		}
		
		function leaveAStepCallback(obj)
		{
			var step_num = obj.attr('rel');
			
			switch(parseInt(step_num))
			{
				case 1:	
						var patient_id;
					var patient_name = $j('#tags').val();
					if(existing==true){
					if(patient_name=="")
					{
						patient_id=0;
					}
					else
					{
						var index = pats.indexOf(patient_name);
						if(index==-1)
						{
							patient_id=0;
						}
						else
						{
							patient_id = index;
						}
					}
					$j('#patientid').val(patient_id);
					$j('#patientname').val(patient_name);
					}
				  	   if(parseInt($('#patientid').val())==0)
					   {
						   alert('Please press the save button to save your member and continue.');
						   return false;
					   }
						last_step=1;			
						return true;
						break;
				case 2: 
						if(idpin_array.length==0 && failed_uploads==0)
						{
							alert('Although you have already created your member, you must upload at least one file to continue.');
							return false;
						}
						else if(filecount != upload_count)
						{
							alert('Please wait while we upload all files');
							return false;
						}
						else
						{
							if(failed_uploads!=0)
							{
								alert("Some of your files were not uploaded correctly");
							}
							done_uploading();
						}
						last_step=2;
						return true;
						break;
				case 3: last_step=3;
						return false;
						break;
			
			
			}
			
		
			
			return true;
		}

		$(document).keydown(function(e){
			if (e.keyCode == 37) { 
			   //alert( "left pressed" );
			   previous_click();
			}
			else if(e.keyCode == 39)
			{
				//alert( "right pressed" );
				next_click();
			}
			return true;
		});

		
      function onFinishCallback()
	  {
		for(var i=0;i<idpin_array.length;i++)
		{
			var idpin = parseInt(idpin_array[i]);
			if(rep_date[idpin]=='')
			{
				alert('You have not verified all reports. Please verify all reports before clicking finishing');
				return;
			}
	   
		}
	   
		for(var i=0;i<idpin_array.length;i++)
		{
			var idpin = parseInt(idpin_array[i]);
			var type = types[idpin];
			var rdate = rep_date[idpin];
			var url = 'update_date.php?idpin='+idpin+'&tipo='+type+'&fecha='+rdate+'&user='+$('#patientid').val();
			var resp = LanzaAjax(url);
		 
		}
		//alert('All your changes have been saved');
		verified=true;
		
				
		// Section for sending TrayMessage to referral (if existing)
		patient_id = $j('#patientid').val();
		doctor_id = $j('#MEDID').val();
		//alert ('Doctor: '+doctor_id+' , Patient: '+patient_id);		
		var url = 'CheckReferral.php?patient_id='+patient_id+'&doctor_id='+doctor_id;
		// Mini-parser of Rectipo to extract multiple values
	    RecTipo = LanzaAjax (url);
		//alert (RecTipo);	
		var n = RecTipo.indexOf(",");
		var IdDoctorAdd = RecTipo.substr(0,n);
	    var Remaining = RecTipo.substr(n+1,RecTipo.length);
	    m = Remaining.indexOf(",");
		var NameDoctor = Remaining.substr(0,m);
	    var NamePatient = Remaining.substr(m+1,Remaining.length);
	    //throw "stop execution";
		//alert ('Id =  '+IdDoctorAdd+'  NameDr=  '+NameDoctor+' NAmePAtient= '+NamePatient);
		
		if (IdDoctorAdd > 0)
		{
			
			var url = 'MessageTray.php?patient_id='+patient_id+'&doctor_id='+doctor_id+'&Add_doctor_id='+IdDoctorAdd+'&MType=1&TMessage=&IconText=icon-folder-open-alt&SubText=NEW REPORT ('+NamePatient+')&MainText=By '+NameDoctor+'&ColorText=22aeff&LinkText=1115';
			
			//alert (url);
			RecTipo = LanzaAjax (url);
			//alert (RecTipo);
		}	
		//alert (RecTipo);	



		window.location.replace("MainDashboard.php");
      }
		
		
		
		
		
		
		
		
		
	/*	
		getpatients('getuserpatients.php');
		//alert(<?php echo $_SESSION['MEDID'];?>);
	
	
		for(var i=0;i<patients.length;i++)
		{
			availablePatientTags[i]=patients[i].idusfixedname;
			pats[patients[i].identif] = patients[i].idusfixedname;;
		}
	*/
			/*$j( "#tags" ).autocomplete({
				source: availablePatientTags,
				change: function( event, ui ) {
					//alert($('#tags').val());
					
					var patient_id;
					var patient_name = $j('#tags').val();
					if(patient_name=="")
					{
						patient_id=0;
					}
					else
					{
						var index = pats.indexOf(patient_name);
						if(index==-1)
						{
							patient_id=0;
						}
						else
						{
							patient_id = index;
						}
					}
					$j('#patientid').val(patient_id);
					$j('#patientname').val(patient_name);
					//alert('Set patient id to '+ $j('#patientid').val() );
				}
			});
  */

	
	});	
		
		Dropzone.options.myAwesomeDropzone1 = {
			//autoProcessQueue: false,	
			//previewTemplate: '<span class="label label-info" style="left:0px; margin-left:30px; font-size:30px;">Patient Creator</span>',
			maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone1 = this; 
				this.on("addedfile", function(file) {
					num=1;
					if($('#patientid').val() == 0)
					{
						myDropzone1.removeFile(file);
						alert('Please press the save button to save your patient and continue.');
						return;
					}
					//alert('File dropped on 1' + file.name);
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",60);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					//alert('sending file');
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone1.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
					//alert('file sent'+ str[2]);
					//var contenURL =   '<?php echo $domain ;?>/temp/<?php echo $_SESSION['MEDID'] ;?>/Packages_Encrypted/'+str[2];
					//var conten =  '<iframe id="ImagenN" style="border:1px solid #666CCC" title="PDF" src="'+contenURL+'" frameborder="1" scrolling="auto" height="850" width="600" ></iframe>';
					//$('#AreaConten').html(conten);
					
					
				});
				
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});
						
			}
		};
		
		Dropzone.options.myAwesomeDropzone2 = {
			//autoProcessQueue: false,	
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone2 = this; 
				this.on("addedfile", function(file) {
					num=2;
					if($('#patientid').val() == 0)
					{
						myDropzone2.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						 
						return;
					}
					//alert('file dropped on 2');
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",30);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone2.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});
					
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});		
			}
		};
		
		Dropzone.options.myAwesomeDropzone3 = {
			//autoProcessQueue: false,	
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone3 = this; 
				this.on("addedfile", function(file) {
					num=3;
					if($('#patientid').val() == 0)
					{
						myDropzone3.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						return;
					}
					//alert('file dropped on 3');
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",20);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone3.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					//alert(resp);
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});
				
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});
				
						
			}
		};
		
		Dropzone.options.myAwesomeDropzone4 = {
			//autoProcessQueue: false,
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone4 = this; 
				this.on("addedfile", function(file) {
					num=4;
					if($('#patientid').val() == 0)
					{
						myDropzone4.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						return;
					}
					//alert('File dropped on 4' + file.name);
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",1);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone4.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});

				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});	
			}
		};
		
		Dropzone.options.myAwesomeDropzone5 = {
			//autoProcessQueue: false,	
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			{
				myDropzone5 = this; 
				this.on("addedfile", function(file) {
					num=5;
					if($('#patientid').val() == 0)
					{
						myDropzone5.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						return;
					}
					//alert('File dropped on 5' + file.name);
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
				
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",76);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
				myDropzone5.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});
				
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});
				
						
			 }
		 };		
		
		Dropzone.options.myAwesomeDropzone6 = {
			//autoProcessQueue: false,
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone6 = this; 
				this.on("addedfile", function(file) {
					num=6;
					if($('#patientid').val() == 0)
					{
						myDropzone6.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						return;
					}
					//alert('File dropped on 6' + file.name);
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",74);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone6.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});
						
			}
		};
		
		Dropzone.options.myAwesomeDropzone7 = {
			//autoProcessQueue: false,	
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone7 = this; 
				this.on("addedfile", function(file) {
					num=7;
					if($('#patientid').val() == 0)
					{
						myDropzone7.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						return;
					}
					//alert('file dropped on 7');
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",77);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone7.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});
				
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});
				
						
			}
		};
		
		Dropzone.options.myAwesomeDropzone8 = {
			//autoProcessQueue: false,	
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone8 = this; 
				this.on("addedfile", function(file) {
					num=8;
					if($('#patientid').val() == 0)
					{
						myDropzone8.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						return;
					}
					//alert('file dropped on 8');
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",60);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone8.processQueue();
					
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});
				
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});
				
						
			}
		};
		
		Dropzone.options.myAwesomeDropzone9 = {
			//autoProcessQueue: false,	
            maxFilesize: 10,  
            acceptedFiles: ".doc,.docx,.png,.jpg,.tiff,.gif,.mov,.avi,.mp4,.mp3,.xml,.xls,.xlsx,.ppt,.pptx,.pdf",
			init: function() 
			{
				myDropzone9 = this; 
				this.on("addedfile", function(file) {
					num=9;
					if($('#patientid').val() == 0)
					{
						myDropzone9.removeFile(file);
						alert('Please press the save button to save your member and continue.');
						return;
					}
					//alert('file dropped on 9');
					$j('#filename').val(file.name);
					$j('#datepicker1').val('');
					//$('#BotonModal').trigger('click');
					
				});
				
				this.on("sending", function(file, xhr, formData) {
					//formData.append("repdate", $j('#datepicker1').val()); // Append all the additional input data of your form here!
					formData.append("idus",$('#patientid').val());
					formData.append("tipo",70);
					formData.append("id",filecount);
					orig_file_array[filecount] = file.name;
					filecount++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					myDropzone9.processQueue();
					
				});
				
				this.on("success",function(file,resp){
					//alert(resp);
					upload_count++;
					document.getElementById("upload_count_label").innerHTML = upload_count + '/' + filecount;
					var str = resp.split(";");
					//alert(str[0] + '  ' + str[1] + '  ' + str[2] + '  ' + str[3]);
					idpin_array[str[0]] = str[1];
					files[str[1]] = str[2];
					types[str[1]] = str[3];
				});
				
				this.on("error",function(file,errorMessage){
					failed_uploads++;
				});
				
						
			}
		};
		
		
		
		
		
		
		
		$j("#ConfirmaLink").live('click',function()
		{
			//filelist[filecount]= $j('#filename').val();
			//datelist[filecount]= $j('#datepicker1').val();
			//filecount++;
			$j('#CloseModal').trigger('click');
			switch(num)
			{
				case 1: myDropzone1.processQueue();
						break;
				case 2: myDropzone2.processQueue();
						break;
				case 3: myDropzone3.processQueue();
						break;
				case 4: //alert('calling 4');
						//alert(myDropzone4.getQueuedFiles().length);
						myDropzone4.processQueue();
						break;
				case 5: //alert(myDropzone5.getQueuedFiles().length);
						myDropzone5.processQueue();
						break;
				case 6: myDropzone6.processQueue();
						break;
				case 7: myDropzone7.processQueue();
						break;
				case 8: myDropzone8.processQueue();
						break;
				case 9: myDropzone9.processQueue();
						break;
			}
			
			
		});
		
		$j("#datepicker1" ).datepicker();
		$j("#datepicker2" ).datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
		
		/*	
		$j("#addPatient").live('click',function() 
		{
		
			//alert("clicked me");
			var fname = $j('#fname').val();
			var sname = $j('#sname').val();
			var initial = $j('#initial').val();
			var year = $j('#Year').val();
			var month = $j('#Month').val();
			var day = $j('#Day').val();
			
			var e = document.getElementById("Gender");
			var gender = parseInt(e.options[e.selectedIndex].value);
			
			if(fname.length==0)
			{
				alert("Enter First Name");
				return;
			}
			
			if(sname.length==0)
			{
				alert("Enter Surname");
				return;
			}
				
			var isnum = /^\d+$/.test(year);
			if(year.length!=4 || isnum==false)
			{
				alert("Enter Valid 4 digit year. eg : 1998");
				return;
			}
			
			var isnum1 = /^\d+$/.test(month);
			if(month.length==0 || month.length>2 || isnum1==false)
			{
				
				alert("Enter valid month : eg : 05");
				return;
			}
			else if(month.length==1)
			{
				month='0'+month;
			}
			
			if(parseInt(month)<0 || parseInt(month)>12)
			{
				alert("Invalid Month");
				return;
			}
			
			var isnum2 = /^\d+$/.test(day);
			if(day.length==0 || day.length>2 || isnum2==false)
			{
				
				alert("Enter valid day : eg : 07");
				return;
			}
			else if(day.length==1)
			{
				day='0'+day;
			}
			
			if(parseInt(day)<0 || parseInt(day)>31)
			{
				alert("Invalid Day");
				return;
			}
			
			
			
			var idusfixedname = fname.toLowerCase()+'.'+sname.toLowerCase();
			var idusfixed = year+month+day+gender+'1';
			
			var DirURL = 'dropzone_create_patient.php?idcreator=<?php echo $_SESSION['MEDID'];?>&idusfixed='+idusfixed+'&idusfixedname='+idusfixedname+'&name='+fname+'&surname='+sname+'&initial='+initial;
			console.log(DirURL);
			
		  $j.ajax({
           url: DirURL,
		   type: 'POST',
          // dataType: "html",
		  processData: false,
		  contentType:false,
		   //data: dataFile,
           async: false,
           complete: function(){ //alert('Completed');
                    },
           success: function(data) {
		   
				if(data == 'failure')
				{
					alert('Patient Already Exists');
					return;
				}
		   
				alert('here');
				var resp = ""
                    if (typeof data == "string") {
                                RecTipo = data;
								resp = RecTipo;
								//alert(resp);
                                }
				$j('#patientid').val(resp);
				$j('#patientname').val(idusfixedname);
				var oldName=<?php echo $_SESSION['MEDID'];?>+'.jpg';
				var newName=resp+'.jpg';
				renameFile('renameFile.php',oldName,newName);
				var url = 'create_emr_data.php?idp='+ resp + '&dob='+$j('#dp32').val() +'&gender='+gender + '&address='+$j('#address').val() + '&address2='+ $j('#address2').val() + '&city='+ $j('#city').val() + '&state='+ $j('#state').val() + '&country='+ $j('#country').val() + '&notes='+ $j('#notes').val() + '&fractures='+ $j('#fractures').val() + '&surgeries='+ $j('#surgeries').val() +  '&otherknown='+ $j('#otherknown').val() + '&obstetric='+ $j('#obstetric').val() + '&other='+ $j('#other').val() + '&fatheralive='+ father_alive + '&fcod='+ $j('#fcod').val() + '&faod='+ $j('#faod').val() + '&frd='+ $j('#frd').val() + '&motheralive='+ mother_alive + '&mcod='+ $j('#mcod').val() + '&maod='+ $j('#maod').val() + '&mrd='+ $j('#mrd').val() + '&srd=' + $j('#siblingsRD').val(); 
				resp = LanzaAjax(url);
				add_PastDX($j('#patientid').val());
				add_medication($j('#patientid').val());
				add_immunization($j('#patientid').val());
				add_allergy($j('#patientid').val());
				var url = 'h2pdf.php?id='+$j('#patientid').val();
				resp = LanzaAjax(url);
				alert('Patient created successfully.');
				existing=false;
				$j(".buttonNext").trigger('click');
               }
            });
		});
		
	*/
	
		$j('#fname').blur(function() {
			$j('#patientid').val(0);
		});
		
		$j('#sname').blur(function() {
			$j('#patientid').val(0);
		});
		
		$j('#Year').blur(function() {
			$j('#patientid').val(0);
		});
		
		$j('#Month').blur(function() {
			$j('#patientid').val(0);
		});
		
		$j('#Day').blur(function() {
			$j('#patientid').val(0);
		});
		
		$j("#BotonBusquedaSents").click(function(event) {
		 //alert('clicked');
 	     var IdMed = $j('#MEDID').val();
	     var UserDOB = '';
		 var UserInput = $j('#SearchUserUSERFIXED').val();
	     //alert(IdMed + '   ' + UserInput);
		 var queUrl ='getSearchUsers.php?Usuario='+UserInput+'&UserDOB='+UserDOB+'&IdDoc='+IdMed+'&NReports=2';
		 //var queUrl ='getSents.php?Doctor='+IdMed+'&DrEmail='+UserDOB+'&NReports=3';
    	 $j('#TablaSents').load(queUrl);
    	 $j('#TablaSents').trigger('update');
		 
    });       

        function LanzaAjax (DirURL)
		{
		var RecTipo = 'SIN MODIFICACIÓN';
	    $j.ajax(
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
		function done_uploading()
		{
			
			//curr_file=0;
			last_press='next';
			
			var temp=new Array();
			var j=0;
			for(var i=0;i<idpin_array.length;i++)
			{
				if(idpin_array[i]==null)
				{
					continue;
				}
				else
				{
					
					temp[j]=idpin_array[i];
					j++;
				}
			}
			
			idpin_array=new Array();
			for(var i=0;i<temp.length;i++)
			{
				idpin_array[i]=temp[i];
			}
			
			for(var i=0;i<idpin_array.length;i++)
			{
				rep_date[idpin_array[i]]='';
			}
			
			curr_file=0;	
			$j('#next').trigger('click');
			$j('#patient_name').disabled=true;
			//$('#BotonModal1').trigger('click');
			
		}
		
		
		function previous_click()
		{
			//alert(curr_file);
			if(curr_file==1 || curr_file==0 )
			{
				curr_file=0;
			}
			else
			{
				if(last_press == 'next')
				{
					curr_file = curr_file-2;
				}
				else
				{
					curr_file--;
				}
			}
			
			//alert('set to '+curr_file);
			var report_type = document.getElementById("reptype");
			
			var idpin = idpin_array[curr_file];
			var file_name = files[idpin];
			var type = types[idpin];
			$j('#idpin').val(idpin);
			$j('#datepicker2').val(convertDateFormat1(rep_date[idpin]));
			$j('#patient_name').val($('#patientname').val());
			
		
			var options = report_type.options;
			
			for (var i = 0;i < options.length; i++) 
			{
				//alert('Comparing ' + options[i].value + ' and ' + type );
				if (parseInt(options[i].value) == parseInt(type)) 
				{
					//alert('selecting '+ options[i].value);
					report_type.selectedIndex = i;
            
				}
			}
			
		
			//alert(idpin + '  ' + type);
			
			
			/*var ext = file_name.split('.')[1];
			
			if(ext=='jpg')
			{
				var contenURL =   '<?php echo $domain ;?>/temp/<?php echo $_SESSION['MEDID'] ;?>/Packages_Encrypted/'+file_name;
				var conten =  '<img id="ImageN" style="border:1px solid #666CCC; margin:0 auto; display:block;max-height:1500px;max-width:600px;"  src="'+contenURL+'" alt="">';
			}
			else
			{*/
				var contenURL =   '/temp/'+med_id+'/Packages_Encrypted/'+file_name;
				var conten =  '<iframe id="ImagenN" style="border:1px solid #666CCC" title="PDF" src="'+contenURL+'" alt="Loading" frameborder="1" scrolling="auto" height="850" width="600" ></iframe>';
			//}
			$j('#AreaConten').html(conten);			
			
			last_press='previous';
			document.getElementById("verified_count_label").innerHTML = curr_file+1 + '/' + idpin_array.length;
		}
		
		
		function next_click()
		{
			
			if(curr_file!=0)
			{
				
				if($('#datepicker2').val()=='')
				{
					alert('You did not select a date');
					return;
				}
		
			}
				
			if(last_press=='previous')
			{
				curr_file++;
			}
			
			if(curr_file == idpin_array.length)
			{
				if(curr_file==0)
				{
					alert('You have not uploaded any files');
					return;
				}
				alert('You have finished verifying all the files..Click Finish to Save your changes..');
				return;
			}
			
			
			var report_type = document.getElementById("reptype");
			
			
			//$('#datepicker2').val('');
			
			
			var idpin = idpin_array[curr_file];
			var file_name = files[idpin];
			var type = types[idpin];
			$j('#idpin').val(idpin);
			
			
			if(rep_date[idpin] == '')
			{
				if(curr_file != 0)
				{
					var prev_idpin = idpin_array[curr_file-1];
					$j('#datepicker2').val(convertDateFormat1(rep_date[prev_idpin]));
					$j('#datepicker2').trigger('change');
					
					//rep_date[curr_file] = convertDateFormat1(rep_date[prev_idpin]);
					//alert('Prev_ID = ' + prev_idpin + '  '+rep_date[prev_idpin]);
				}
			}
			else
			{
				$j('#datepicker2').val(convertDateFormat1(rep_date[idpin]));
			}
			
			
			
			
			$j('#patient_name').val($('#patientname').val());
						
			var options = report_type.options;
			
			for (var i = 0;i < options.length; i++) 
			{
				//alert('Comparing ' + options[i].value + ' and ' + type );
				if (parseInt(options[i].value) == parseInt(type)) 
				{
					//alert('selecting '+ options[i].value);
					report_type.selectedIndex = i;
            
				}
			}
			
		
			//alert(idpin + '  ' + type);
			var contenURL =   '/temp/'+med_id+'/Packages_Encrypted/'+file_name;
			var conten =  '<iframe id="ImagenN" style="border:1px solid #666CCC" title="PDF" src="'+contenURL+'" alt="Loading" frameborder="1" scrolling="auto" height="850" width="600" ></iframe>';
			$j('#AreaConten').html(conten);			
			curr_file++;
			last_press='next';
			document.getElementById("verified_count_label").innerHTML = curr_file + '/' + idpin_array.length;
		}
		
		$j('#reptype').change(function() {
			var idpin = parseInt($('#idpin').val());
			var report_type = document.getElementById("reptype");
			types[idpin] = report_type.options[report_type.selectedIndex].value;
			//alert('changed '+ idpin+'  '+types[idpin]);
		
		});
		
		$j('#gender').change(function() {
			var e = document.getElementById("gender");
			var gender = parseInt(e.options[e.selectedIndex].value);
			if(gender==1)
			{
				var elem = document.getElementById("obstetric");
				elem.value = 'N/A';
				elem.disabled=true;
				
			}
			else
			{
				var elem = document.getElementById("obstetric");
				elem.value = '';
				elem.disabled=false;
			}
			
		
		});
		
		$j('#datepicker2').change(function() {
				
			var idpin = $j('#idpin').val();
			rep_date[idpin] = convertDateFormat($j('#datepicker2').val());
			//alert('set ' + idpin + '   ' +rep_date[idpin]);
		});
		
		$j('#dp32').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
		
		$j('#DXStartDate').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
		
		$j('#DXEndDate').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
		
		$j('#MedicationStartDate').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
		
		
		
		$j('#MedicationEndDate').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
		
		$j('#IDate').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
		
		$j('#ADate').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
			changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
			
        $j('#CP_Date').datepicker({
			inline: true,
			nextText: '&rarr;',
			prevText: '&larr;',
			showOtherMonths: true,
			dateFormat: 'mm-dd-yy',
			dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			showOn: "button",
			buttonImage: "images/calendar-blue.png",
			buttonImageOnly: true,
            changeYear: true ,
			changeMonth: true,
			yearRange: '1900:c',
		});
        
		function openPastDXPopUp()
		{
			$j('#DXName').val('');
			$j('#icdcode').val('');
			$j('#DXStartDate').val('');
			$j('#DXEndDate').val('');
			$j('#BotonPastDX').trigger('click');
		}
		
		
		$j('#UpdatePastDX').live('click',function()
		{
			var table = document.getElementById('PastDX');
            var rowCount = table.rows.length;
			//alert(rowCount);
			 
			 var row = table.insertRow(rowCount);
			 
			 var cell1 = row.insertCell(0);
             cell1.innerHTML = '<center>'+$('#DXName').val()+'</center>';
			 
			 var cell2 = row.insertCell(1);
             cell2.innerHTML = '<center>'+$('#icdcode').val()+'</center>';
			 
			 var cell3 = row.insertCell(2);
             cell3.innerHTML = '<center>'+$('#DXStartDate').val() + '</center>';
			 
			 
			 var cell4 = row.insertCell(3);
             cell4.innerHTML = '<center>'+$('#DXEndDate').val()+'</center>';
			 
			//alert('Clicked Update PastDX');
		
		});
		
		function openMedicationPopUp()
		{
			$j('#DrugName').val('');
			$j('#DrugCode').val('');
			$j('#Dossage').val('');
			$j('#NumPerDay').val('');
			$j('#MedicationStartDate').val('');
			$j('#MedicatioEndDate').val('');
			$j('#BotonMedication').trigger('click');
		}
		
		
		$j('#UpdateMedication').live('click',function()
		{
			var table = document.getElementById('Medication');
            var rowCount = table.rows.length;
			//alert(rowCount);
			 
			 var row = table.insertRow(rowCount);
			 
			 var cell1 = row.insertCell(0);
             cell1.innerHTML = '<center>'+$('#DrugName').val()+'</center>';
			 
			 var cell2 = row.insertCell(1);
             cell2.innerHTML = '<center>'+$('#DrugCode').val()+'</center>';
			 
			 var cell3 = row.insertCell(2);
             cell3.innerHTML = '<center>'+$('#Dossage').val()+'</center>';
			 
			 var cell4 = row.insertCell(3);
             cell4.innerHTML = '<center>'+$('#NumPerDay').val()+'</center>';
			 
			 var cell5 = row.insertCell(4);
             cell5.innerHTML = '<center>'+$('#MedicationStartDate').val() + '</center>';
			 			 
			 var cell6 = row.insertCell(5);
             cell6.innerHTML = '<center>'+$('#MedicationEndDate').val()+'</center>';
		
		
			//alert('Clicked Update Medication');
		
		});
		
		function openImmunizationPopUp()
		{
			$j('#IName').val('');
			$j('#IDate').val('');
			$j('#IAge').val('');
			$j('#IReaction').val('');
			$j('#BotonImmunization').trigger('click');
		}
		
		
		$j('#UpdateImmunization').live('click',function()
		{
			var table = document.getElementById('Immunization');
            var rowCount = table.rows.length;
			//alert(rowCount);
			 
			 var row = table.insertRow(rowCount);
			 
			 var cell1 = row.insertCell(0);
             cell1.innerHTML = '<center>'+$('#IName').val()+'</center>';
			 
			 var cell2 = row.insertCell(1);
             cell2.innerHTML = '<center>'+$('#IDate').val()+'</center>';
			 
			 var cell3 = row.insertCell(2);
             cell3.innerHTML = '<center>'+$('#IAge').val() + '</center>';
			 
			 
			 var cell4 = row.insertCell(3);
             cell4.innerHTML = '<center>'+$('#IReaction').val()+'</center>';
			//alert('Clicked Update Immunization');
		
		});
		
		$j("#c2").click(function(event) {
	    	var cosa=chkb($("#c2").is(':checked'));
			if(cosa==1)
			{
				//alert('Father is alive');
				
				var element = document.getElementById('fcod');
				element.value = 'N/A';
				element.disabled=true;
				
				element = document.getElementById('faod');
				element.value = '';
				element.disabled=true;
			}
			else
			{
				//alert('Father is dead');
				var element = document.getElementById('fcod');
				element.value = '';
				element.disabled=false;
				
				element = document.getElementById('faod');
				element.value = '';
				element.disabled=false;
			}
		
		});
		
		$j("#c3").click(function(event) {
	    	var cosa=chkb($("#c3").is(':checked'));
			if(cosa==1)
			{
				//alert('Mother is alive');
				
				var element = document.getElementById('mcod');
				element.value = 'N/A';
				element.disabled=true;
				
				element = document.getElementById('maod');
				element.value = '';
				element.disabled=true;
			}
			else
			{
				//alert('Father is dead');
				var element = document.getElementById('mcod');
				element.value = '';
				element.disabled=false;
				
				element = document.getElementById('maod');
				element.value = '';
				element.disabled=false;
			}
		
		});
		
		function chkb(bool){
	    if(bool)
	    	return 1;
	    	return 0;
	   }
		
		function openAllergyPopUp()
		{
			$j('#AName').val('');
			$j('#AType').val('');
			$j('#ADate').val('');
			$j('#Description').val('');
			$j('#BotonAllergy').trigger('click');
		}
		
		
		$j('#UpdateAllergy').live('click',function()
		{
			var table = document.getElementById('Allergies');
            var rowCount = table.rows.length;
			//alert(rowCount);
			 
			 var row = table.insertRow(rowCount);
			 
			 var cell1 = row.insertCell(0);
             cell1.innerHTML = '<center>'+$('#AName').val()+'</center>';
			 
			 var cell2 = row.insertCell(1);
             cell2.innerHTML = '<center>'+$('#AType').val()+'</center>';
			 
			 var cell3 = row.insertCell(2);
             cell3.innerHTML = '<center>'+$('#ADate').val() + '</center>';
			 
			 
			 var cell4 = row.insertCell(3);
             cell4.innerHTML = '<center>'+$('#Description').val()+'</center>';
		
			//alert('Clicked Update Allergy');
		
		});
		
		// var _URL = window.URL || window.webkitURL;
		
		// $((document.getElementById('file'))[0].files[0]).change(function (e) {
			// var file, img;
			// if ((file = this.files[0])) {
				// img = new Image();
				// img.onload = function () {
					// alert(this.width + " " + this.height);
				// };
				// img.src = _URL.createObjectURL(file);
			// }
		// });
		
		
        function openCPPopUp()
		{
			$j('#CP_Date').val('');
			$j('#CP_Height').val('');
			$j('#CP_Weight').val('');
			$j('#CP_hbp').val('');
			$j('#CP_lbp').val('');
			update_flag = false;
			$j('#BotonCP').trigger('click');
		}
        
        $j('#UpdateCP').live('click',function()
		{
            var table = document.getElementById('CP');
            var rowCount = table.rows.length;
            
            var row = table.insertRow(rowCount);
            
            var cell1 = row.insertCell(0);
            cell1.innerHTML = '<center>'+$("#CP_Date").val()+'</center>';
            
            var cell2 = row.insertCell(1);
            cell2.innerHTML = '<center>'+$("#CP_Height").val()+'</center>';
            
            var cell3 = row.insertCell(2);
            cell3.innerHTML = '<center>'+$("#CP_Weight").val()+'</center>';
            
            var cell4 = row.insertCell(3);
            cell4.innerHTML = '<center>'+$("#CP_hbp").val()+'</center>';
            
            var cell5 = row.insertCell(4);
            cell5.innerHTML = '<center>'+$("#CP_lbp").val()+'</center>';
		
		});
        
		function convertDateFormat(input)
		{
			//Input : Date in mm-dd-yy Format
			//Output: Date in yy-mm-dd Format
			var str = input.split('-');
			return str[2] + '-' + str[0] + '-' + str[1];
		}
		
		function convertDateFormat1(input)
		{
			//Input : Date in yy-mm-dd Format
			//Output: Date in mm-dd-yy Format
			var str = input.split('-');
			return str[1] + '-' + str[2] + '-' + str[0];
		}
		
		
        var userId; //New variable included by Pallab for using later on in dropfiles
        function createPatient()
		{
            var fname = $j('#fname').val();
			var sname = $j('#surname').val();
			var initial = $j('#initial').val();
			var phone = $j('#new_user_phone').val();
			var email = $j('#new_user_email').val();
			
			
			var n = $j('#dp32').val().split('-');
			//alert(n);
			var year = n[2];
			var month = n[0];
			var day = n[1];
			
			var e = document.getElementById("gender");
			var gender = parseInt(e.options[e.selectedIndex].value);
			
			if(fname.length==0)
			{
				alert("Enter First Name");
				return;
			}
			
			if(sname.length==0)
			{
				alert("Enter Surname");
				return;
			}
			
			if(e.options[e.selectedIndex].value=='')
			{
				alert("Enter Gender");
				return;
			}
			
			//Below date validation commented by Pallab
            /*if($j('#dp32').val()=='')
			{
				alert("Enter Date");
				return;
			}*/
			
			/*var isnum = /^\d+$/.test(year);
			if(year.length!=4 || isnum==false)
			{
				alert("Enter Valid 4 digit year. eg : 1998");
				return;
			}
			
			var isnum1 = /^\d+$/.test(month);
			if(month.length==0 || month.length>2 || isnum1==false)
			{
				
				alert("Enter valid month : eg : 05");
				return;
			}
			else if(month.length==1)
			{
				month='0'+month;
			}
			
			if(parseInt(month)<0 || parseInt(month)>12)
			{
				alert("Invalid Month");
				return;
			}
			
			var isnum2 = /^\d+$/.test(day);
			if(day.length==0 || day.length>2 || isnum2==false)
			{
				
				alert("Enter valid day : eg : 07");
				return;
			}
			else if(day.length==1)
			{
				day='0'+day;
			}
			
			if(parseInt(day)<0 || parseInt(day)>31)
			{
				alert("Invalid Day");
				return;
			}
				*/
			
			
			var mother = document.getElementById('c3');
			var mother_alive = false;
			if(mother.checked)
			{
				mother_alive=true;
				
			}
			
			var father_alive = false;
			var father = document.getElementById('c2');
			if(father.checked)
			{
				father_alive = true;
			}
			//var resp = 1187;
			
			
			
			var idusfixedname = fname.toLowerCase()+'.'+sname.toLowerCase();
			var idusfixed = year+month+day+gender+'1';
			
		
		
		var DirURL = 'dropzone_create_patient.php?idcreator='+med_id+'&idusfixed='+idusfixed+'&idusfixedname='+idusfixedname+'&name='+fname+'&surname='+sname+'&initial='+initial+'&email='+email+'&phone='+phone;
			//var DirURL = 'checkFileUploaded.php';
			 //alert(DirURL);
		  $j.ajax({
           url: DirURL,
		   type: 'POST',
          // dataType: "html",
		  processData: false,
		  contentType:false,
		   // data: dataFile,
           async: false,
           complete: function(){ //alert('Completed');
                    },
           success: function(data) {
				//alert('Recieved Data :' + data);
				if(data == 'failure')
				{
					alert('Something went wrong!');
					return;
				}else{
					var r = confirm("We detected that there is already a user with those credentials.  Would you like to send an email requesting access to this member\'s records?"+data);
				}
		   
		   
				
                    if (typeof data == "string") {
                                userId = data;
                                RecTipo = data;
								resp = RecTipo;
								//alert('resp=' + resp);
                                }
				$j('#patientid').val(resp);
				$j('#patientname').val(idusfixedname);
				var oldName=med_id+'.jpg';
				var newName=resp+'.jpg';
				renameFile('renameFile.php',oldName,newName);
				var url = 'create_emr_data.php?idp='+ resp + '&dob='+convertDateFormat($j('#dp32').val()) +'&gender='+gender + '&address='+$j('#address').val() + '&address2='+ $j('#address2').val() + '&city='+ $j('#city').val() + '&state='+ $j('#state').val() + '&country='+ $j('#country').val() + '&notes='+ $j('#notes').val() + '&fractures='+ $j('#fractures').val() + '&surgeries='+ $j('#surgeries').val() +  '&otherknown='+ $j('#otherknown').val() + '&obstetric='+ $j('#obstetric').val() + '&other='+ $j('#other').val() + '&fatheralive='+ father_alive + '&fcod='+ $j('#fcod').val() + '&faod='+ $j('#faod').val() + '&frd='+ $j('#frd').val() + '&motheralive='+ mother_alive + '&mcod='+ $j('#mcod').val() + '&maod='+ $j('#maod').val() + '&mrd='+ $j('#mrd').val() + '&srd=' + $j('#siblingsRD').val()+ '&phone='+ $j('#phone').val() + '&insurance=' + $j('#insurance').val(); 
				//alert(url);
                
				//return;
				resp = LanzaAjax(url);
                add_changing_personal_history($j('#patientid').val());
				add_PastDX($j('#patientid').val());
				add_medication($j('#patientid').val());
				add_immunization($j('#patientid').val());
				add_allergy($j('#patientid').val());
				var url = 'h2pdf.php?id='+$j('#patientid').val();
				resp = LanzaAjax(url);
				//alert(resp);
				alert('Patient created successfully.');
				existing=false;
				$j(".buttonNext")[0].click()	;
               }
            })
		}
		
		
		//Added this code for changing personal history
		function add_changing_personal_history(idp)
		{
            var table = document.getElementById('CP');
            var rowCount = table.rows.length;
            
            for(var i=1; i<rowCount; i++)
			{
				var row = table.rows[i];
				var param  = '&height=' + row.cells[1].innerText + '&weight=' + row.cells[2].innerText+'&hbp=' + row.cells[3].innerText + '&lbp=' + row.cells[4].innerText + '&daterec=' + convertDateFormat(row.cells[0].innerText);
				var url = 'create_changing_personal_history.php?idp='+idp+param;
			var resp = LanzaAjax(url);
			}
		}
		
		
		function add_PastDX(idp)
		{
			var table = document.getElementById('PastDX');
            var rowCount = table.rows.length;
 
            for(var i=1; i<rowCount; i++)
			{
				var row = table.rows[i];
				var param = '&dxname=' + row.cells[0].innerText + '&icdcode=' + row.cells[1].innerText + '&dxstart=' + convertDateFormat(row.cells[2].innerText) + '&dxend=' + convertDateFormat(row.cells[3].innerText)   ;
				var url = 'create_pastdx_Entry.php?idp='+idp+param;
				//alert(url);
				var resp = LanzaAjax(url);
			}
		}
		
		
		
		function add_medication(idp)
		{
			var table = document.getElementById('Medication');
            var rowCount = table.rows.length;
 
            for(var i=1; i<rowCount; i++)
			{
				var row = table.rows[i];
				var param = '&drugname=' + row.cells[0].innerText + '&drugcode=' + row.cells[1].innerText + '&dossage=' + row.cells[2].innerText + '&numperday=' + row.cells[3].innerText + '&start=' + convertDateFormat(row.cells[4].innerText)  + '&end=' + convertDateFormat(row.cells[5].innerText) ;
				var url = 'create_medication_Entry.php?idp='+idp+param;
				//alert(url);
				var resp = LanzaAjax(url);
			}
		}
		
		function add_immunization(idp)
		{
			var table = document.getElementById('Immunization');
            var rowCount = table.rows.length;
 
            for(var i=1; i<rowCount; i++)
			{
				var row = table.rows[i];
				var param = '&name=' + row.cells[0].innerText + '&date=' + convertDateFormat(row.cells[1].innerText) + '&age=' + row.cells[2].innerText + '&reaction=' + row.cells[3].innerText ;
				var url = 'create_immunization_Entry.php?idp='+idp+param;
				//alert(url);
				var resp = LanzaAjax(url);
			}
		}
		
		function add_allergy(idp)
		{
			var table = document.getElementById('Allergies');
            var rowCount = table.rows.length;
 
            for(var i=1; i<rowCount; i++)
			{
				var row = table.rows[i];
				var param = '&name=' + row.cells[0].innerText + '&type=' + row.cells[1].innerText + '&date=' + convertDateFormat(row.cells[2].innerText) + '&description=' + row.cells[3].innerText ;
				var url = 'create_allergy_Entry.php?idp='+idp+param;
				//alert(url);
				var resp = LanzaAjax(url);
			}
		}
		
		function displayalertnotification(message){
  
			var gritterOptions = {
               title: 'status',
               text: message,
               sticky: false,
               time: '3000'
              };
			$j.gritter.add(gritterOptions);
    
		}

//Below piece of code inserted by Pallab for SKIP DROP FILES AND FINISH button in dropzone.php
$(document).ready(function()
{
    
                  
    $("#dropfiles").on('click',function()
    {    
        
        console.log("In dropfiles function");
        window.location.replace("patientdetailMED-new.php?IdUsu="+userId+"&checkout=yes");
    });
});
