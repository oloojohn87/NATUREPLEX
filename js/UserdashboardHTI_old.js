$(document).ready(function() {   
    var timeoutTime = 18000000;
	//var timeoutTime = 300000;  //5minutes
	var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);


	var active_session_timer = 60000; //1minute
	var sessionTimer = setTimeout(inform_about_session, active_session_timer);

    var reportcheck = new Array();
    
    //GET SESSION VARIABLES WITH AJAX
    domain = get_domain();
    session_medid=get_session_variable('MEDID');
    session_userid=get_session_variable('UserID');
  
    function LanzaAjax (DirURL)
    {
		var RecTipo = 'SIN MODIFICACIÓN';
        
	    $.ajax(
           {
           url: DirURL,
           dataType: "html",
           async: false,
           complete: function(){ 
                    },
           success: function(data) {
                    if (typeof data == "string") {
                                RecTipo = data;
                                }
                     }
            });
		return RecTipo;
    } 

    function get_domain() {
        
        url='../sessions.php?domain=';
        var RecTipo=LanzaAjax(url);  
        return RecTipo;
    }    
    function get_session_variable(session_variable)
    {
        
        url=domain+'/sessions.php?session_var='+session_variable;
        var RecTipo=LanzaAjax(url);  
        return RecTipo;
    }    
    
    
	//This function is called at regular intervals and it updates ongoing_sessions lastseen time
	function inform_about_session()
	{  
		$.ajax({
			url: domain+'/ongoing_sessions.php?userid='+session_medid,
			success: function(data){
		          
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
    
	

	
	setInterval(function() {
    		$('#newinbox').trigger('click');
      }, 10000);

    function displaynotification(status,message){
  
        var gritterOptions = {
			   title: status,
			   text: message,
			   image:'images/Icono_H2M.png',
			   sticky: false,
			   time: '3000'
			  };
	   $.gritter.add(gritterOptions);
	
    }

    function getUserData(UserId) {
 	var cadenaGUD = domain+'/GetUserData.php?UserId='+session_userid;
    $.ajax(
           {
           url: cadenaGUD,
           dataType: "json",
           async: false,
           success: function(data)
           {
           user = data.items;
           }
           });
    }

    function getMedCreator(UserId) {
 	var cadenaGUD = domain+'/GetMedCreator.php?UserId='+session_userid;
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

        
       
        
        if($("#CURRENTCALLINGDOCTOR").val() != '' && $("#CURRENTCALLINGDOCTOR").val() != '0' && $("#CURRENTCALLINGDOCTOR").val() != '-1')
        {
            $("#video_consultation_text").text("You have a video consultation appointment with Doctor " + $("#CURRENTCALLINGDOCTORNAME").val() + ".");
            $("#telemed_notificator").css("display", "block");
        }
        $("#telemed_connect_button").live("click", function()
        {
            window.open("telemedicine_patient.php?MED="+$("#CURRENTCALLINGDOCTOR").val()+"&PAT="+$("#USERID").val()+"&show=0","Telemedicine","height=585,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
        });
        $("#telemed_deny_button").live("click", function()
        {
            $("#telemed_notificator").slideUp();
            $.post("reset_appointment.php", {pat_id: $("#USERID").val()}, function(){});
        });
	///WORKS ABOVE
    $('#LoadCanvas1').css('display','none');
    $('#LoadCanvas2').css('display','none');
    LoadDonuts();
   
  
 	
    
    function LoadDonuts(){
	//var timerId = setTimeout(function() { 

        var UserID = session_userid;
		
		var AdminData = 0;
		// Ajax call to retrieve a JSON Array **php return array** 
//		$.post("GetConnectedLight.php", {User: queMED, NReports: 3, Group: group}, function(data, status)
		var queUrl = 'GetSummaryData.php?User='+UserID;
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				ConnData = data.items;
			}
		});
		
	
	  AdminData = ConnData[0].Data;
	  PastDx = ConnData[1].Data;
	  Medications = ConnData[2].Data;
	  Allergies = ConnData[3].Data;
	  Family = ConnData[4].Data;
	  Habits = ConnData[5].Data;
	  
	  //alert ('AdminData: '+AdminData+'   Admin Latest Update: '+ConnData[0].latest_update+'   Admin Doctor: '+ConnData[0].doctor_signed+' ***********   '+'DxData: '+ConnData[1].Data+'   Dx Latest Update: '+ConnData[1].latest_update+'   Dx Doctor: '+ConnData[1].doctor_signed+' ');

	  // SUMMARY GRAPH
	  var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');

      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = 75;
      var startAngle = 0 - (Math.PI/2);
      var counterClockwise = false;
	  
	  var ColSeg = new Array();
	  var SizSeg = new Array();
	  var ImgSeg = new Array();
	  var MaxValue = new Array();
	  var UIValue = new Array();
	  var NameSeg1 = new Array();
	  var NameSeg2 = new Array();
	  
	  ColSeg[1] = '#54bc00';
	  MaxValue[1] = 5;
	  UIValue[1] = 10;
	  if (AdminData > MaxValue[1]) {SizSeg[1] = UIValue[1]} else {SizSeg[1] = (AdminData * UIValue[1] / MaxValue[1])};
	  //alert (SizSeg[1]+' - '+MaxValue[1]+' - '+UIValue[1]+' - '+AdminData);
	  ImgSeg[1] = 'Admin';
	  NameSeg1[1] = 'Admin';
	  NameSeg2[1] = 'Data';
	 
	  ColSeg[2] = '#f39c12';
	  UIValue[2] = 10;
	  if (Allergies > 0) SizSeg[2] = 10; else SizSeg[2]=0;
	  ImgSeg[2] = 'Immuno';
	  NameSeg1[2] = 'Immun';
	  NameSeg2[2] = 'Allergy';
	  
	  ColSeg[3] = '#2c3e50';
	  MaxValue[3] = 5;
	  UIValue[3] = 40
	  if (PastDx > 0) SizSeg[3] = 40; else SizSeg[3]=0;
	  //SizSeg[3] = 40;
	  ImgSeg[3] = 'History';
	  NameSeg1[3] = 'Perso';
	  NameSeg2[3] = 'History';
	  
	  ColSeg[4] = '#18bc9c';
	  SizSeg[4] = 15;
	  UIValue[4] = 15;
	  if (Medications > 0) SizSeg[4] = 15; else SizSeg[4]=0;
	  ImgSeg[4] = 'Medication';
	  NameSeg1[4] = 'Drugs';
	  NameSeg2[4] = 'Meds';
	  	  
	  ColSeg[5] = '#e74c3c';
	  SizSeg[5] = 15;
	  UIValue[5] = 15;
	  if (Family > 0) SizSeg[5] = 15; else SizSeg[5]=0;
	  ImgSeg[5] = 'Family';
	  NameSeg1[5] = 'Family';
	  NameSeg2[5] = 'History';
	  
	  ColSeg[6] = '#3498db';
	  SizSeg[6] = 10;
	  UIValue[6] = 10;
	  if (Habits > 0) SizSeg[6] = 10; else SizSeg[6]=0;
	  ImgSeg[6] = 'Habits';
	  NameSeg1[6] = 'Habits';
	  NameSeg2[6] = 'Life';


	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)
	  // Get points for Label Positioning
	  var side = new Array();
	  var rightPoints = 0;
	  var leftPoints = 0;
	  var orderside = 1;
	  var maxside = new Array();
	  var XBoxSize = 70;
	  var YBoxSize = 20;
	  var XBox = 0;
	  var YBox = 0;
	  var Swaped = new Array();

	  var n = 1;
	  var CumData = 0;
	  var midPos = Array();
	  startAngle = 0 - (Math.PI/2);
	  while (n < 7)
	  {
	  	  endAngle = startAngle + TranslateAngle(SizSeg[n],100);
	      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,100));
	      midPos[n] = midAngle;

		 halfsegment = SizSeg[n] / 2; 
	  	 //console.log ('N:  '+n+'       SizSeg: '+SizSeg[n]+'   Halfsegment:  '+halfsegment)
	  	 CumData = CumData + SizSeg[n];
	  	 //console.log ('N:  '+n+'       CumData: '+CumData+'   Halfsegment:  '+halfsegment)
	  	 if ((CumData - halfsegment) < 50 ) {
	  	 		side[n] = 'Right'; 
	  	 		rightPoints++;
	  	 	}else 
	  	 	{
	  	 		side[n] = 'Left';
	  	 		leftPoints++;
	  	 	}

	      startAngle = endAngle;
	      lastAngle = endAngle;
	  	 n++;
	  }
	  console.log ('Right:'+rightPoints+'    Left:'+leftPoints);
	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)

	  var SummaryData = 0;
	  
      context.lineWidth = 35;
	  startAngle = 0 - (Math.PI/2);
	  var lastAngle = 0;
	  var divisor = 1;
	      	    
	  var n = 1;
	  var leftorderside = 0;
	  while (n < 7)
	  {
	  	  SummaryData = SummaryData + SizSeg[n];
	      context.beginPath();
	      ColorRGB = hexToRgb(ColSeg[n]);
	      // Opacity value reflects how recent data is
	      var Opac = Math.random();
	      var Opac = 1;
	      SegColor = 'rgba('+ColorRGB.r+','+ColorRGB.g+','+ColorRGB.b+','+Opac+')';
	      
	      // Draw the segments
 	      context.beginPath();
	      context.strokeStyle = SegColor;
	      context.lineCap = 'butt';
	      endAngle = startAngle + TranslateAngle(SizSeg[n],100);
	      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,100));
	      midPos[n] = midAngle;
		  context.lineWidth = 35;
	      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	      context.stroke();
 	      //context.closePath();
 	      //context.restore();
 	      
	      // Draw icons into segments
	      var posx = x + (radius * Math.cos (midAngle)) - 12;     
	      var posy = y + (radius * Math.sin (midAngle)) - 12;
	      var borx = x + ((radius+(35/2)) * Math.cos (midAngle));   // Coordinates of the edge of the circle at its center
	      var bory = y + ((radius+(35/2)) * Math.sin (midAngle));   // Coordinates of the edge of the circle at its center
		  var imageObj=document.getElementById(ImgSeg[n]);
		  if (SizSeg[n] > 4) context.drawImage(imageObj, posx, posy,25,25);
	     

				  //  *********************    Labels Section   MAIN PART  *************************************************
				  //side = 'Left';
				  if (n <= rightPoints ) orderside = n; else orderside = n - rightPoints;
				   				  
				  //console.log('N: '+n+'  side: '+side[n]+'  left: '+leftPoints+'    right:  '+rightPoints+' ');
				  
				  // XBox and YBox are the coordinates of the "virtual" box than contains the label
				  if (side[n] == 'Left') {
					  	leftorderside++;
					  	XBox = 10 ; 
					  	divisor = (y*2) / (leftPoints+1);
					  	//console.log('y:  '+(y*2)+'     divisor: '+divisor+'    YBox: '+YBox+'    Arrival Segment: '+(6 - (n - leftPoints + 1 )));
					    // Invert arrival of line to segment for left side points
					    Swaped[n] = 6 - (n - leftPoints + 1 ); 
					    Swaped[n] = n; 
					    borx = x + ((radius+(35/2)) * Math.cos (midPos[Swaped[n]]));
					    bory = y + ((radius+(35/2)) * Math.sin (midPos[Swaped[n]]));
					  	YBox = (y*2) - (divisor * leftorderside);
					  	// Vertical Difference between Box and Edge here:
					  	//VerticalDiff = YBox - bory;
					  	//if (Math.abs(VerticalDiff) > 50) YBox = YBox - (VerticalDiff/2);
				  	}
				  else 
				  	{
					  	XBox = ((x) - (radius/2) + 20);
					  	XBox = 280;
					  	divisor = (y*2) / (rightPoints+1);
					  	YBox = divisor * orderside;
						Swaped[n] = n; 
						// Vertical Difference between Box and Edge here:
					  	VerticalDiff = YBox - bory;
					  	console.log('Diff: '+VerticalDiff+'     YBox: '+YBox+'     bory:'+bory);
					  	if (Math.abs(VerticalDiff) > 40) YBox = YBox - (VerticalDiff/2);
				  }
				  
			      // Virtual Box for the Label
				  

				  
				  // Label Text
				  
				  context.font = "10px Arial";
			      context.fillStyle = '#b6b6b6';
				  context.fillText(NameSeg1[Swaped[n]],XBox,YBox+8);
				  context.fillText(NameSeg2[Swaped[n]],XBox,YBox+8+10);
			     
			      
			      // Divisory Line
			      
			      context.beginPath();
				  context.lineWidth = 3;
				  context.strokeStyle = ColSeg[Swaped[n]];
				  context.lineCap = 'round';
		 	      context.moveTo(XBox +35, YBox);
			      context.lineTo(XBox +35, YBox+20);
			      context.stroke();
				  
				  // Section Percentage
				  
				  context.font = "bold 12px Arial";
			      context.fillStyle = 'grey';
			      percentSeg = parseInt (100 * (SizSeg[Swaped[n]] / UIValue[Swaped[n]]));
				  if (percentSeg == 100) labelSeg = 'OK'; else labelSeg = percentSeg + '%';
				  context.fillText(labelSeg,XBox+40,YBox+3+10);
			      //context.stroke();

				  // Connecting Line			      
			      context.beginPath();
				  context.strokeStyle = '#cacaca';
				  context.lineWidth = 2;
				  if (side[n] == 'Left') 
				  {
				  	X1 = XBox +40 + 30; 
				  	XMiddle = borx - ((borx-X1)/2);
				  }
				  else 
				  {
				  	X1 = XBox - 5;
				  	XMiddle = X1 - ((X1 - borx)/2);
			      }
			      Y1 = YBox+3+10-5;
				  YMiddle = bory + ((Y1-bory)/2);
		 	      YMiddle = bory ;
		 	      context.moveTo(X1, Y1); 
			      //context.lineTo(XMiddle,YMiddle);
			      //context.lineTo(borx,bory);
			      context.bezierCurveTo(XMiddle,YMiddle,XMiddle,YMiddle,borx,bory);
			      context.stroke();

				  context.lineCap = 'butt';
			      
				  //  *********************    Labels Section   MAIN PART  *************************************************
	     
	     
	      startAngle = endAngle;
	      lastAngle = endAngle;
	      n++;
	  }
 	      // Draw Inner Circle
 	      context.beginPath();
		  context.fillStyle = '#22aeff';
	      context.lineWidth = 1;
		  context.arc(x, y, radius-20, (-Math.PI/2), (Math.PI*2), counterClockwise);
	      context.fill();
	      context.stroke();
		  context.lineWidth = 35;

 		  // Draw Main Text
		  var font = '30pt Lucida Sans Unicode';
		  var message = SummaryData+' %';
		  context.fillStyle = '#22aeff';
		  context.fillStyle = 'white';
		  context.textAlign = 'left';
		  context.textBaseline = 'top'; // important!
		  context.font = font;
		  var w = context.measureText(message).width;
		  var TextH = GetCanvasTextHeight(message,font);
		  context.fillText(message, x-(w/2), y-(TextH));

		  
		  //Draw "Missing" segment
 	      context.beginPath();
	      ColorRGB = hexToRgb('#C0C0C0');
	      // Opacity value reflects how recent data is
	      var Opac = 0.2;
	      SegColor = 'rgba('+ColorRGB.r+','+ColorRGB.g+','+ColorRGB.b+','+Opac+')';
		  context.strokeStyle = SegColor;
 	      var MissingSize = 100 - SummaryData;
	      endAngle = startAngle + TranslateAngle(MissingSize,100);
	      midAngle = startAngle + (TranslateAngle(MissingSize/2,100));
		  context.lineWidth = 35;
	      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	      context.stroke();

		  //Draw external border to existing group of segments
		  context.beginPath();
	      startAngle = 0 - (Math.PI/2);
	      endAngle = lastAngle;
	      context.strokeStyle = '#585858';
		  context.lineWidth = 2;
	      context.arc(x, y, radius+17, startAngle, endAngle, counterClockwise);
	      context.stroke();
	      context.beginPath();
	      context.arc(x, y, radius-17, startAngle, endAngle, counterClockwise);
	      context.stroke();
	      context.beginPath();
	      var posx = x + ((radius-18) * Math.cos (startAngle));
	      var posy = y + ((radius-18) * Math.sin (startAngle));
	      var posx2 = x + ((radius+18) * Math.cos (startAngle));
	      var posy2 = y + ((radius+18) * Math.sin (startAngle));
		  context.moveTo(posx,posy);
	      context.lineTo(posx2,posy2);
	      var posx = x + ((radius-18) * Math.cos (lastAngle));
	      var posy = y + ((radius-18) * Math.sin (lastAngle));
	      var posx2 = x + ((radius+18) * Math.cos (lastAngle));
	      var posy2 = y + ((radius+18) * Math.sin (lastAngle));
		  context.moveTo(posx,posy);
	      context.lineTo(posx2,posy2);
	      context.stroke();	
		  
 
 	  // REPORTS GRAPH
 	  // Get Basic Icons and Colors for every type of report
 	  	var RepData = Array();
		// Ajax call to retrieve a JSON Array **php return array** 
		var queUrl = 'GetReportSet.php';
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				RepData = data.items;
			},
 	       error: function (xhr, ajaxOptions, thrownError) {
	        	alert(xhr.status);
				alert(thrownError);
	       }

		});
 	  //
 	  // Get Report Data for this user
 	  	var RepNumbers = Array();
		// Ajax call to retrieve a JSON Array **php return array** 
		var queUrl = 'GetReportNumbers.php?User='+UserID;
		$.ajax(
		{
			url: queUrl,
			dataType: "json",
			async: false,
			success: function(data)
			{
				//alert('Data Fetched');
				RepNumbers = data.items;
			},
 	       error: function (xhr, ajaxOptions, thrownError) {
	        	alert(xhr.status);
				alert(thrownError);
	       }

		});
 	  //
 	  

	  var canvas = document.getElementById('myCanvas2');
      var context = canvas.getContext('2d');
      var x = canvas.width / 2;
      var y = canvas.height / 2;
      var radius = 85;
      var widthSegment = 15;
      var startAngle = 0 - (Math.PI/2);
      var counterClockwise = false;

 	  ColSeg.length = 0;
	  SizSeg.length = 0;
	  ImgSeg.length = 0;
	  
	  var qx = 1;
	  var TotalRep = 0;
	  while (qx < 10){
		  ColSeg[qx] = RepData[qx-1].color;
		  SizSeg[qx] = RepNumbers[qx-1].number;
		  NameSeg1[qx] = RepData[qx-1].title.substring(0, 4);
		  NameSeg2[qx] = RepData[qx-1].abrev;
		  TotalRep = TotalRep + parseInt(SizSeg[qx]);
		  qx++;
	  }
	  
	  ImgSeg[1] = 'R1';
	  ImgSeg[2] = 'R2';
	  ImgSeg[3] = 'R3';
	  ImgSeg[4] = 'R4';
	  ImgSeg[5] = 'R5';
	  ImgSeg[6] = 'R6';
	  ImgSeg[7] = 'R7';
	  ImgSeg[8] = 'R8';
	  ImgSeg[9] = 'R9';
	  ImgSeg[10] = 'R10';
     
	  var MaxSegments = 10;
	  var MaxReports = TotalRep;
     
      context.lineWidth = widthSegment;
	  startAngle = 0 - (Math.PI/2);


	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)
	  // Get points for Label Positioning
	  var side = new Array();
	  var rightPoints = 0;
	  var leftPoints = 0;
	  var orderside = 1;
	  var maxside = new Array();
	  var XBoxSize = 70;
	  var YBoxSize = 20;
	  var XBox = 0;
	  var YBox = 0;
	  var Swaped = new Array();

	  var n = 1;
	  var sections = 0;
	  var CumData = 0;
	  var midPos = Array();
	  while (n <= MaxSegments)
	  {
	  if (SizSeg[n]>0)
		  {
		  	  endAngle = startAngle + TranslateAngle(SizSeg[n],100);
		      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,100));
		      midPos[n] = midAngle;
	
		  	 CumData = parseInt(CumData + parseInt(SizSeg[n]));
		  	 MidPoint = CumData - (parseInt(SizSeg[n])/2);
		  	 if (MidPoint <= (TotalRep/2) ) {
		  	 		side[n] = 'Right'; 
		  	 		rightPoints++;
		  	 	}else 
		  	 	{
		  	 		side[n] = 'Left';
		  	 		leftPoints++;
		  	 	}
	
			  //console.log ('Cummulated Number of Reports: '+parseInt(CumData)+'                    TotalReports/2: '+(TotalRep/2)+' ');
			  //console.log ('n: '+n+'  Size:'+SizSeg[n]+'      side:'+side[n]+'       midPos: '+midPos[n]+'             Angle Start:'+startAngle+'    Angle End: '+endAngle);

		      startAngle = endAngle;
		      lastAngle = endAngle;

			  
			  sections++;
			  
		  }
		  n++;
	  }
	 // console.log ('Total: '+sections+'     Right: '+rightPoints+'    Left: '+leftPoints);
	  //  *********************    Labels Section PART 1 (Review, calculate positions and swap array)

	      	    
	  var n = 1;
	  startAngle = 0 - (Math.PI/2);

	  while (n <= MaxSegments)
	  {
	      context.beginPath();
	      SegColor = ColSeg[n];
	      sections = 0;
	      if (SizSeg[n]>0){
		      sections++;
		      // Draw the segments
		      context.strokeStyle = SegColor;
		      endAngle = startAngle + TranslateAngle(SizSeg[n],MaxReports);
		      midAngle = startAngle + (TranslateAngle(SizSeg[n]/2,MaxReports));
			  context.lineWidth = widthSegment;
		      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
		      context.stroke();
	
		      // Draw badges at inner part of segments
			  var SizeBadge = 30;
			  var PointAngle = radius-(widthSegment/2)-(SizeBadge/2);
		      var posx = x + (PointAngle  * Math.cos (midAngle)) - (SizeBadge/2);
		      var posy = y + (PointAngle  * Math.sin (midAngle)) - (SizeBadge/2);
			  var imageObj=document.getElementById(ImgSeg[n]);
			  context.drawImage(imageObj, posx, posy,SizeBadge,SizeBadge);
	
				  //  *********************    Labels Section   MAIN PART  *************************************************
				  //side = 'Left';
			      var borx = x + ((radius+(widthSegment/2)) * Math.cos (midAngle));   // Coordinates of the edge of the circle at its center
			      var bory = y + ((radius+(widthSegment/2)) * Math.sin (midAngle));   // Coordinates of the edge of the circle at its center
				  if (sections <= rightPoints ) orderside = sections; else orderside = sections - rightPoints;
				   				  
				  //console.log('N: '+n+'  side: '+side[n]+'  left: '+leftPoints+'    right:  '+rightPoints+' ');
				  
				  // XBox and YBox are the coordinates of the "virtual" box than contains the label
				  if (side[n] == 'Left') {
					  	XBox = 10 ; 
					  	divisor = (y*2) / (leftPoints+1);
					    // Invert arrival of line to segment for left side points
					    Swaped[n] = 6 - (n - leftPoints + 1 ); 
					    if (Swaped[n]==0) Swaped[n]=1;
					    Swaped[n] = n; 
					    //borx = x + ((radius+(35/2)) * Math.cos (midPos[Swaped[n]]));
					    //bory = y + ((radius+(35/2)) * Math.sin (midPos[Swaped[n]]));
					  	YBox = divisor * orderside;
					  	// Vertical Difference between Box and Edge here:
					  	VerticalDiff = YBox - bory;
					  	if (Math.abs(VerticalDiff) > 2) YBox = YBox - (VerticalDiff/2);
					  	//console.log('Order: '+n+'   '+side[n]+' (Left y):  '+(y*2)+'     divisor: '+divisor+'    YBox: '+YBox+'   XBox:  '+XBox+'   Swaped: '+ Swaped[n]+ ' n =  '+n+'  orderside: '+orderside);
				  	}
				  else 
				  	{
					  	XBox = ((x) - (radius/2) + 20);
					  	XBox = 280;
					  	divisor = (y*2) / (rightPoints+1);
					  	YBox = divisor * orderside;
						Swaped[n] = n; 
						// Vertical Difference between Box and Edge here:
					  	VerticalDiff = YBox - bory;
					  	if (Math.abs(VerticalDiff) > 2) YBox = YBox - (VerticalDiff/2);
					  	//console.log('Order: '+n+'   '+side[n]+' (Right y):  '+(y*2)+'     divisor: '+divisor+'    YBox: '+YBox+'   XBox:  '+XBox+'   Swaped: '+ Swaped[n]+ ' n =  '+n+'  orderside: '+orderside);
				  
				  }
				  
	
				  
				  // Label Text
				  
				  context.font = "10px Arial";
			      context.fillStyle = '#b6b6b6';
				  context.fillText(NameSeg1[Swaped[n]],XBox,YBox+8);
				  context.fillText(NameSeg2[Swaped[n]],XBox,YBox+8+10);
			     
			      
			      // Divisory Line
			      
			      context.beginPath();
				  context.lineWidth = 3;
				  context.strokeStyle = ColSeg[Swaped[n]];
				  context.lineCap = 'round';
		 	      context.moveTo(XBox +35, YBox);
			      context.lineTo(XBox +35, YBox+20);
			      context.stroke();
				  
				  // Section Percentage
				  
				  context.font = "bold 14px Arial";
			      context.fillStyle = 'grey';
			      //percentSeg = parseInt (100 * (SizSeg[Swaped[n]] / UIValue[Swaped[n]]));
				  percentSeg = SizSeg[Swaped[n]];
				  if (percentSeg == 100) labelSeg = 'OK'; else labelSeg = percentSeg + '';
				  context.fillText(labelSeg,XBox+40,YBox+5+10);
			      //context.stroke();

				  // Connecting Line			      
			      context.beginPath();
				  context.strokeStyle = '#cacaca';
				  context.lineWidth = 2;
				  if (side[n] == 'Left') 
				  {
				  	X1 = XBox +40 + 30; 
				  	XMiddle = borx - ((borx-X1)/2);
				  }
				  else 
				  {
				  	X1 = XBox - 5;
				  	XMiddle = X1 - ((X1 - borx)/2);
			      }
			      Y1 = YBox+3+10-5;
				  YMiddle = bory + ((Y1-bory)/2);
		 	      YMiddle = bory ;
		 	      context.moveTo(X1, Y1); 
			      //context.lineTo(XMiddle,YMiddle);
			      //context.lineTo(borx,bory);
			      context.bezierCurveTo(XMiddle,YMiddle,XMiddle,YMiddle,borx,bory);
			      context.stroke();

				  context.lineCap = 'butt';
			      
				  //  *********************    Labels Section   MAIN PART  *************************************************


	          //realn ++;

		      startAngle = endAngle;
	      }
		  n++;
	  }

 	      // Draw Inner Circle
 	      context.beginPath();
		  context.fillStyle = '#54bc00';
	      context.lineWidth = 1;
		  context.arc(x, y, radius-50, (-Math.PI/2), (Math.PI*2), counterClockwise);
	      context.fill();
          context.strokeStyle = "grey";
	      context.stroke();
		  context.lineWidth = 35;

 		  // Draw Main Text
		  //var font = '30pt Lucida Sans Unicode';
          var font = '28pt Arial';
		  var message = MaxReports+'';
		  context.fillStyle = '#54bc00';
		  context.fillStyle = 'white';
		  context.textAlign = 'left';
		  context.textBaseline = 'top'; // important!
		  context.font = font;
		  var w = context.measureText(message).width;
		  var TextH = GetCanvasTextHeight(message,font);
		  context.fillText(message, x-(w/2), y-(TextH-7));
 

 	//}, 500)
	};//END LOAD DONUTS



	$('body').bind('mousedown keydown', function(event) {
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
    });
	
	var Canvas1State = 0;
	
     //Add code for new summary box -start
       $('#PHSLabel').live('click',function(){
	if (Canvas1State == 0)	{
		$('#PHSLabel').html('See Graph');
		var contentAlt = '';
		

		
		var bestDate = Date.parse(ConnData[0].latest_update);		
		var sourceDate = '';
		var textDate = '';
		var titleU = '';
		var k = 0;
		while (k < 5)
		{
			thisDate = Date.parse(ConnData[k].latest_update);
			if (thisDate >= bestDate) 
				{ 
					bestDate = thisDate;	
					sourceDate = ConnData[k].latest_update;
					//thisVerified = Date.parse(ConnData[k].doctor_signed);
					//if (thisVerified > -1) { bestVerified = ConnData[k].doctor_signed; }		
				}		
			k++;
		} 
		var translation = '';
		var translation2 = '';
		var translation3 = '';
		var translation4 = '';
		var translation5 = '';
		
		if(language == 'th'){
		translation = 'Última actualización en';
		translation2 = 'dias';
		translation3 = 'semana';
		translation4 = 'meses';
		translation5 = 'años';
		}else if(language == 'en'){
		translation = 'Latest update on';
		translation2 = 'days';
		translation3 = 'weeks';
		translation4 = 'months';
		translation5 = 'years';
		}
		
		titleU =  translation+' '+ sourceDate.substr(0, 10);			
		var todayDate = new Date();
		var ageDate = todayDate - bestDate;
		var DiffDays = parseInt(ageDate / (1000*60*60*24)) ;
		var DiffWeeks = parseInt(ageDate / (1000*60*60*24*7)) ;
		var DiffMonths = parseInt(ageDate / (1000*60*60*24*30)) ;
		var DiffYears = parseInt(ageDate / (1000*60*60*24*365)) ;
		if (DiffDays < 14) textDate = DiffDays+' '+translation2;
		if (DiffWeeks >= 2) textDate = DiffWeeks+' '+translation3;
		if (DiffWeeks >= 8) textDate = DiffMonths+' '+translation4;
		if (DiffMonths >= 13) textDate = DiffYears+' '+translation5;
		
		//alert ('Best Date: '+sourceDate+'  Now is: '+todayDate.getHours()+':'+todayDate.getMinutes()+' Diff in minutes: ' + ageDate / (1000*60)  );
		//alert ('Days: '+DiffDays+'   Weeks: '+DiffWeeks+'    Months: '+DiffMonths+'   Years: '+DiffYears+'   ');
		//alert (textDate);		
		var updated = DiffWeeks;
		if (updated > 1) 
			{
			var translation = '';

		if(language == 'th'){
		translation = 'Actualizar';
		}else if(language == 'en'){
		translation = 'Update';
		}
		
				contentTime = 'Summary is '+textDate+' old'; 
				iconTime = '<button id="UpdateSumm" class="find_doctor_button" style="float:right; display: block; background-color: rgb(82, 216, 89); width:80px; margin-top:-3px;">'+translation+'</button>';
			}
		else
			{
			var translation = '';

		if(language == 'th'){
		translation = 'Actualizado';
		}else if(language == 'en'){
		translation = 'Updated';
		}
				contentTime = translation;
				iconTime = '<i class="icon-check icon-2x" style="float:left;"></i>';
			}
		if (DiffYears > 4) 
			{
			var translation = '';
			var translation2 = '';

		if(language == 'th'){
		translation = 'Actualizar';
		translation2 = 'Resumen nunca actualizado';
		}else if(language == 'en'){
		translation = 'Update';
		translation2 = 'Summary never updated';
		}
		
				contentTime = translation2; 
				iconTime = '<i class="icon-exclamation icon-2x" style="float:left; color:rgb(216, 72, 64);"></i><button id="UpdateSumm" class="find_doctor_button" style="float:right; display: block; background-color: rgb(82, 216, 89); width:80px; margin-top:-3px;">'+translation+'</button>';
			}
		
		
		var verified = -1;
		var bestVerified = -1;
		var bestDate = Date.parse('1975-01-01 00:00:00');		
		var VerifiedDate = bestDate;
		var title = '';
			
		var k = 0;
		while (k < 5)
		{
			thisVerified = ConnData[k].doctor_signed;
			thisDate = Date.parse(ConnData[k].latest_update);
			console.log(' K='+k+'   Doctor:'+k+'  Date:'+k+'');
			if (thisVerified > -1 && (thisDate >= bestDate) ) 
				{ 
					bestDate = thisDate;	
					bestVerified = ConnData[k].doctor_signed; 
					VerifiedDate = ConnData[k].latest_update; 
				}		
			k++;
		}

        //ribbonText = '';
		if (bestVerified > -1)
		{
		var translation = '';
		var translation2 = '';
		var translation3 = '';

		if(language == 'th'){
		translation = 'Verificar';
		tranlation2 = 'Verificado por';
		translation3 = 'en';
		}else if(language == 'en'){
		translation = 'Verify';
		tranlation2 = 'Verified by';
		translation3 = 'on';
		}
			namedoctor = LanzaAjax ('/getDoctorName.php?IdDoctor='+bestVerified);
			contentVerif = translation;// by '+namedoctor;
            var offset = new Date().getTimezoneOffset();
            var formattedDate = moment(VerifiedDate).add('minutes',(offset*-1)).fromNow();
			title =  translation2+' '+namedoctor+' '+ formattedDate;
			iconVerif = '<i class="icon-check icon-2x"></i>';				
		}
		else
		{
			
			var translation = '';

		if(language == 'th'){
		translation = 'Verificar';
		contentVerif = 'No Verificado'; 
		}else if(language == 'en'){
		translation = 'Verify';
		contentVerif = 'Not Verified'; 
		}
			iconVerif = '<i class="icon-exclamation icon-2x" style="float:left; color:rgb(216, 72, 64);"></i><button id="VerifyDoctor" class="find_doctor_button" style="float:right; display: block; background-color: rgb(34, 174, 255); width:80px; margin-top:-3px;">'+translation+'</button>';			
		}
		
		var complete = 0;
		var segments = 0;
		var iconComplet = '<i class="icon-check icon-2x"></i>';
		var k = 0;
		while (k < 5)
		{
			complete += parseInt(ConnData[k].Data);
			if (ConnData[k].Data > 0 ) segments++;
			k++;
		}
		if (segments < 4) iconComplet = '<i class="icon-exclamation icon-2x" style="float:left; color:rgb(216, 72, 64);"></i>';			

			var translation = '';

		if(language == 'th'){
		translation = 'eventos registrados';
		}else if(language == 'en'){
		translation = 'events registered';
		}
        
 	    AdminData = ConnData[0].Data;
	    PastDx = ConnData[1].Data;
	    Medications = ConnData[2].Data;
	    Immuno = ConnData[3].Data;
	    Family = ConnData[4].Data;
	    Habits = ConnData[5].Data;
	    Allergies = ConnData[6].Data;
                           
        contentAlt += '	               <style>';
        contentAlt += '	                div.SumBox{';
        contentAlt += '	                    float:left; ';
        contentAlt += '	                    position: absolute; ';
        contentAlt += '	                    z-index: 10; ';
        contentAlt += '	                    box-shadow: inset 0px 0px 2px 0px whitesmoke;';
        contentAlt += '	                }';
        contentAlt += '	                div.SumBox:hover {         ';
        contentAlt += '	                    opacity: 0.8;                ';
        contentAlt += '	                }                                ';
        contentAlt += '	                ';
        contentAlt += '	                img.SumBoxIcon{';
        contentAlt += '	                    position:absolute;';
        contentAlt += '	                    width:30px;';
        contentAlt += '	                    height:30px;';
        contentAlt += '	                    top: 50%;';
        contentAlt += '	                    left: 50%;';
        contentAlt += '	                    transform: translate(-50%, -50%);';
        contentAlt += '	                    font-size: 20px;';
        contentAlt += '	                    color: grey;';
        contentAlt += '	                    z-index:460;';

        contentAlt += '	                }';
        contentAlt += '	';
        contentAlt += '	                div.BannerIcon{     ';
        contentAlt += '	                    border: 1px solid #cacaca;       ';
        contentAlt += '	                    width: 15px;       ';
        contentAlt += '	                    height: 15px;      ';
        contentAlt += '	                    border-radius: 10px;       ';
        contentAlt += '	                    position: absolute;        ';
        contentAlt += '	                    left: 50%;       ';
        contentAlt += '	                    top: 50%;         ';
        contentAlt += '	                    z-index: 440;          ';
        contentAlt += '	                    margin-left: 8px;      ';
        contentAlt += '	                    margin-top: -18px;     ';
        contentAlt += '	                    color: #cacaca;     ';
        contentAlt += '	                    font-size: 12px;';
        contentAlt += '	                    text-align: center;     ';
        contentAlt += '	                    font-weight: bold;     ';
        contentAlt += '	                    line-height: 15px;     ';
        contentAlt += '	                }';

		//THIS DETERMINES IF USER IS MAC OR WINDOWS
var mactest=navigator.userAgent.indexOf("Mac")!=-1;

if (mactest)
{
//alert('mac');
var box1 = 'top:50%;left:45%;';
var box2 = 'top:50%;left:45%;';
var box3 = 'top:43%;left:48%;';
var box4 = 'top:43%;left:43%;';
var box5 = 'top:45%;left:45%;';
var box6 = 'top:48%;left:45%;';
var box7 = 'top:45%;left:40%;';
} else {
var box1 = 'top:40%;left:35%;';
var box2 = 'top:40%;left:40%;';
var box3 = 'top:30%;left:35%;';
var box4 = 'top:30%;left:32%;';
var box5 = 'top:30%;left:27%;';
var box6 = 'top:25%;left:35%;';
var box7 = 'top:25%;left:25%;';
}

        contentAlt += '	                    ';
        contentAlt += '	                </style>  ';
        contentAlt += '	                <div style="background-color:white; z-index:999; position:absolute; left:0%; top:0%; width:100%; height:10px;"></div>  ';
        contentAlt += '	                <div style="background-color:white; z-index:999; position:absolute; left:320px; top:0%; width:50px; height:100%;"></div>  ';
        
        contentAlt += '	                <div id="SumGraph2" style="width: 275px; height: 165px; margin-top: 10px; margin-left: 45px; border:0px solid #cacaca; position:relative; cursor: pointer; border-radius:10px;">';
        contentAlt += '	                  ';
        contentAlt += '	                    <div class="SumBox" style="width:45%; height:45%; top:0%; left:0%; background-color:#54bc00; border-top-left-radius:10px;">';
        contentAlt += '	                       <img style="'+box1+'" class="SumBoxIcon" src="images/icons/Adminx2_svg.png" />';
        if (AdminData > 0)      contentAlt += '	                       <div class="BannerIcon" >'+AdminData+'</div>';
        contentAlt += '	                    </div>        ';                              
        contentAlt += '	                    <div class="SumBox" style="width:55%; height:45%; top:0%; left:45%; background-color:#2C3E50;  border-top-right-radius:10px;">';
        contentAlt += '	                        <img style="'+box2+'" class="SumBoxIcon" src="images/icons/historyx2_svg.png" />';
        if (PastDx > 0)         contentAlt += '	                        <div class="BannerIcon" >'+PastDx+'</div>';
        contentAlt += '	                    </div>     ';       
        contentAlt += '	                    <div class="SumBox" style="width:30%; height:30%; top:45%; left:0%; background-color:#18BC9C;">';
        contentAlt += '	                        <img style="'+box3+'" class="SumBoxIcon" src="images/icons/medicationx2_svg.png" />';
        if (Medications > 0)     contentAlt += '	                        <div class="BannerIcon" >'+Medications+'</div>';
        contentAlt += '	                   </div>  ';                 
        contentAlt += '	                    <div class="SumBox" style="width:40%; height:30%; top:45%; left:30%; background-color:#E74C3C;">';
        contentAlt += '	                        <img style="'+box4+'" class="SumBoxIcon" src="images/icons/familyx2_svg.png" />';
        if (Family > 0)          contentAlt += '	                        <div class="BannerIcon" >'+Family+'</div>';
        contentAlt += '	                  </div>         ';   
        //contentAlt += '	                        <div style="width:calc(40% - 3px); height:calc(30% - 3px); top:calc(45% + 1px); left:calc(30% + 1px); border:1px solid white; position:absolute; z-index:490;"></div>';
        contentAlt += '	                    <div class="SumBox" style="width:30%; height:55%; top:45%; left:70%; background-color:#3498DB;  border-bottom-right-radius:10px;">';
        contentAlt += '	                       <img style="'+box5+'" class="SumBoxIcon" src="images/icons/habitsx2_svg.png" />';
        if (Habits > 0)         contentAlt += '	                        <div class="BannerIcon" >'+Habits+'</div>';
        contentAlt += '	                   </div>            ';
        //contentAlt += '	                        <div style="width:calc(30% - 3px); height:calc(55% - 3px); top:calc(45% + 1px); left:calc(70% + 1px); border:1px solid white; position:absolute; z-index:490;  border-bottom-right-radius: 10px;"></div>';
        contentAlt += '	                    <div class="SumBox" style="width:50%; height:25%; top:75%; left:0%; background-color:#F39C12;  border-bottom-left-radius:10px;">';
        contentAlt += '	                        <img style="'+box6+'" class="SumBoxIcon" src="images/icons/immunox2_svg.png" />';
        if (Immuno > 0)         contentAlt += '	                        <div class="BannerIcon" >'+Immuno+'</div>';
        contentAlt += '	                  </div>    ';        
        contentAlt += '	                    <div class="SumBox" style="width:20%; height:25%; top:75%; left:50%; background-color:#F39C12;">';
        contentAlt += '	                        <img style="'+box7+'" class="SumBoxIcon" src="images/icons/allergyx2_svg.png" />';
        if (Allergies > 0)      contentAlt += '	                        <div class="BannerIcon" >'+Allergies+'</div>';
        contentAlt += '	                   </div>      ';         
        if (bestVerified > -1){
        contentAlt += '	                    <div class="ribbon-banner" id="ribbon-verified" href="#" style="display: block; width:220px; right:-63px; top:22px; background-color:#DB3469;"><span class="ribbon-lgtext">Verified</span><br> <span class="ribbon-smtext" style="font-size:8px;">'+title+'<span class="ribbon-lgtext"></span></span></div>';
        };
        contentAlt += '	';
        contentAlt += '	                  </div> ';
                          


		
		$('#ALTCanvas1').html(contentAlt);
		$('#ALTCanvas1').animate({"height":"200px"}, 1000);
		$('#PHSLabel').css('background-color','rgb(82, 216, 89)');
		Canvas1State = 1;
	}else
	{
		$('#PHSLabel').html('See Status');
		$('#PHSLabel').css('background-color','rgb(74, 134, 54)');
		$('#ALTCanvas1').animate({"height":"0px"}, 1000);
		Canvas1State = 0;
// rgb(82, 216, 89); // see graph
//		rgb(74, 134, 54);
	}
	
	});
    

        
    $('#myCanvas,#ALTCanvas1').live('click',function(){
		var myClass = $('#USERID').val();
        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" scrolling="no" style="width:1000px;height:690px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true});
		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});

    $('#editPatient').live('click',function(){
        var userID = $('#USERID').val();
		window.location.replace('patientdetailMED-new.php?IdUsu='+userID); // Changed the url value from patientdetailMED-newUSER.php to patientdetailMED-new.php
    });        
        
	$('#ButtonReview').live('click',function(){
		var myClass = $('#USERID').val();

        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true}).onclose(function(data,success)
           {
             $.post("SavePatientSummaryAsPDF.php",{IdUsu: session_userid},function(data,success)
               {
              });
           
           }); // Onclosing of the dialog frame the patient updated data is database and a pdf is generated

		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});

	$('#UpdateSumm').live('click',function(){
		var myClass = $('#USERID').val();
		window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});

	$('#VerifyDoctor').live('click',function(){
		 //stopPropagation();
		 $("#Talk").trigger("click");
	});

	$('#myCanvas').mousemove(function(e) {
	    var pos = findPos(this);
	    var x = e.pageX - pos.x;
	    var y = e.pageY - pos.y;
	    var coord = "x=" + x + ", y=" + y;
	    var c = this.getContext('2d');
	    var p = c.getImageData(x, y, 1, 1).data; 
	    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	    $('#status').html(coord + "<br>" + hex + " - ");
	});

	$('#myCanvas2').live('click',function(){
		var myClass = $('#USERID').val();
		window.location.replace('patientdetailMED-new.php?IdUsu='+myClass);
	});


    $(window).bind('load', function(){
        $('#newinbox').trigger('click');
    });
 
	$('#BotMessages').live('click',function(){
        $('#compose_message').trigger('click');
	});
	
	$('#newinbox').live('click',function(){
       //alert('trigger');
	   var queUrl ='<?php echo $domain;?>/getInboxMessageUSER.php?IdMED=<?php echo $MEDID;?>&patient=<?php echo $UserID;?>';
	   //alert (queUrl);
       $('#datatable_3').load(queUrl);
	   $('#datatable_3').trigger('update');
           
   });
   
    $('#newoutbox').live('click',function(){
      //alert('trigger');
	   var queUrl ='<?php echo $domain;?>/getOutboxMessageUSER.php?IdMED=<?php echo $MEDID;?>&patient=<?php echo $UserID;?>';
	   $('#datatable_4').load(queUrl);
	   $('#datatable_4').trigger('update');
           
   });
    
    $('#SearchDirectory').live('click', function()
    {		
		var Codes = GetICD10Code('Append');
		var longit = Object.keys(Codes).length;	   	   
		//alert ('Retrieved '+longit+' items. Example at [0].description: '+Codes[0].description);
		
	});
    $("#setup_phone").intlTelInput();
    $.post("get_user_info.php", {id: $("#USERID").val()}, function(data, status)
    {
        var info = JSON.parse(data);
        $("#timezone_picker option[value='" + info['timezone'] + "']").attr('selected', 'selected');
        if(info.hasOwnProperty('location') && info['location'].length > 0)
        {
            setTimeout(function(){
                $("#country_setup").val(info['location']);
                $("#country_setup").change();
            }, 800);
        }
        if(info.hasOwnProperty('location2') && info['location2'].length > 0)
        {
            setTimeout(function(){
                $("#state_setup").val(info['location2']);
                $("#state_setup").change();
            }, 900);
        }
        if(info.hasOwnProperty('email') && info['email'].length > 0)
        {
            $("#setup_email").val(info['email']);
        }
        if(info.hasOwnProperty('phone') && info['phone'].length > 0)
        {
            $("#setup_phone").val("+" + info['phone']);
        }
    });
    
    $('#timezone_picker').on('change', function()
    {
        console.log('clicked');
    });
        
        
    $('#MedHistory').live('click',function(){
		var myClass = $('#USERID').val();
        $("#summary_modal").html('<iframe src="medicalPassport.php?modal=1&IdUsu='+myClass+'" width="1000" height="660" scrolling="no" style="width:1000px;height:660px; margin: 0px; border: 0px solid #FFF; outline: 0px; padding: 0px; overflow: hidden;"></iframe>');
        $("#summary_modal").dialog({bigframe: true, width: 1050, height: 690, resize: false, modal: true});
		//window.location.replace('medicalPassport.php?IdUsu='+myClass);
	});       
        
    $('#timezone_button').on('click', function()
    {
        $.post("update_user.php", {id: $("#USERID").val(), timezone: $("#timezone_picker").val().toString()}, function(data, status){});
        $("#setup_modal_notification").css("background-color", "#52D859");
        $("#setup_modal_notification").html('<p style="color: #fff;">Timezone Changed Successfully!</p>');
        $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
            setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
        }});
        timezone_changed = $("#timezone_picker").val();
    });    
    $('#location_button').on('click', function()
    {
        $.post("update_user.php", {id: $("#USERID").val(), location: $("#country_setup").val(), location2: $("#state_setup").val()}, function(data, status){});
        $("#setup_modal_notification").css("background-color", "#52D859");
        $("#setup_modal_notification").html('<p style="color: #fff;">Location Changed Successfully!</p>');
        $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
            setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
        }});
        country_changed = $("#country_setup").val();
        state_changed = $("#state_setup").val();
        
    });
    $('#contact_button').on('click', function()
    {
        $.post("update_user.php", {id: $("#USERID").val(), email: $("#setup_email").val(), phone: $("#setup_phone").val()}, function(data, status)
        {
            console.log(data);
            if(data.length > 0)
            {
                $("#setup_modal_notification").css("background-color", "#D5483A");
                $("#setup_modal_notification").html('<p style="color: #fff;">'+data+'</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            }
            else
            {
                $("#setup_modal_notification").css("background-color", "#52D859");
                $("#setup_modal_notification").html('<p style="color: #fff;">Contact Information Changed Successfully!</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            }
        });
        
    });
        
    $('button[id^="setup_menu_"]').on('click', function()
    {
        $('button[id^="setup_menu_"]').each(function(index)
        {
            $(this).css('background-color', '#FBFBFB');
            $(this).css('color', '#22AEFF');
            $(this).css('border', '1px solid #E6E6E6');
        });
        $('div[id^="setup_page_"]').each(function(index)
        {
            $(this).css('display', 'none');
        });
        var this_id = $(this).attr('id').split('_')[2];
        
        $(this).css('background-color', '#22AEFF');
        $(this).css('color', '#FFF');
        $(this).css('border', '0px solid #E6E6E6');
        $("#setup_page_"+this_id).css('display', 'block');
        if(this_id == '1')
       {
            // password
            $('#setup_title').text("Change Password");
        }
        else if(this_id == '2')
        {
            // timezone
            $('#setup_title').text("Set Timezone");
        }
        else if(this_id == '3')
        {
            // credit card
            $('#setup_title').text("Manage Credit Cards");
        }
        else if(this_id == '4')
        {
            // location
            $('#setup_title').text("Set Location");
        }
        else if(this_id == '5')
        {
            // location
            $('#setup_title').text("Set Contact Information");
        }
    });
        
    var state_changed = "";
    var country_changed = "";
    var timezone_changed = "";    
    $('#SetUp').live('click', function()
    {
        

        
        $("#change_password_validated_section").css("display", "none");
        $("#pw1").val("");
        $("#pw2").val("");
        $("#pw3").val("");
        $("#setup_modal_notification_container").css("margin-top", "0px");
        $("#setup_modal").dialog({bigframe: true, width: 640, height: 400, resize: false, modal: true});
        
        
        

        var country = geoplugin_countryName();
        var region ="";
        if (country == "United States") {
            country = "USA";
        }   

        var place = "<?php echo $Place;?>";
        
        location_array = place.split(",");
        if (location_array.length ==2) {
            region = location_array[0].trim();
            country = location_array[1].trim();


        } else if ((location_array.length == 1)&& (location != "")) {
            
            country = place.trim();
        }   
        
        //if the country has already been changed
        if (country_changed != "") {
            country = country_changed;   
        }    
        if (country_changed != "") {
            region = state_changed;   
        }    
        
        $("#country_setup").val(country);			 
	    $("#country_setup").change();
        
        $("#state_setup").val(region);			 
	    $("#state_setup").change();
        
        var timezone = "<?php echo $Timezone;?>";
        
        timezone_array = timezone.split(":");
        timezone_format = timezone_array[0];
        timezone_format=parseInt(timezone_format, 10)+".0";

        if (timezone_changed != "") {
            timezone_format = timezone_changed;   
        }    
        $("#timezone_picker").val(timezone_format);
        $("#timezone_picker").change();
        
        
    });
        
    $("#change_password_validate_button").live('click', function()
    {
        $.post("validate_password.php", {pat_id: $("#USERID").val(), pw: $("#pw1").val()}, function(data, status)
        {
            if(data == '1' && $("#change_password_validated_section").css("display") == 'none')
            {
                $("#change_password_validated_section").slideDown();
                
            }
            else
            {
                $("#setup_modal_notification").css("background-color", "#D5483A");
                $("#setup_modal_notification").html('<p style="color: #fff;">Password Incorrect</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            }
        });

    });
    $("#change_password_finish_button").live('click', function()
    {
        if($("#pw2").val() == $("#pw3").val())
        {
            $("#pw1").val("");
            $("#change_password_validated_section").slideUp();
            $.post("update_patient.php", {new_pw: $("#pw2").val(), pat_id: $("#USERID").val()}, function(data, status)
            {
                $("#pw2").val("");
                $("#pw3").val("");
                $("#setup_modal_notification").css("background-color", "#52D859");
                $("#setup_modal_notification").html('<p style="color: #fff;">Password Changed Successfully!</p>');
                $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                    setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
            });
        }
        else
        {
            $("#setup_modal_notification").css("background-color", "#D5483A");
            $("#setup_modal_notification").html('<p style="color: #fff;">Passwords Did Not Match</p>');
            $("#setup_modal_notification_container").animate({opacity: '1.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {
                setTimeout(function(){$("#setup_modal_notification_container").animate({opacity: '0.0'}, {duration: 1000, easing: 'easeInOutQuad', complete: function() {}});}, 2000);
                }});
        }
    });

    var doctor_to_connect = '';
    var type_of_doctor_to_find = '';
    var find_doctor_page = 0;
    var selected_doctor_available = 0;
    var selected_doctor_info = '';
    var time_selected = -1;
    var day_selected= -1;
    var date_selected = '';
    var consultation_type = 2;
    var zones = null;
    var selected_timezone = "00:00:00";
        
    $("#country").on('change', function()
    {
        // the following code is to show the region select menu if the country is USA.
        if($(this).val() == 'USA')
        {
            $("#state").parent().parent().css('display', 'block');
        }
        else
        {
            $("#state").parent().parent().css('display', 'none');
        }
    });
    $("#country_setup").on('change', function()
    {
        // the following code is to show the region select menu if the country is USA.
        if($(this).val() == 'USA')
        {
            $("#state_setup").parent().parent().css('visibility', 'visible');
        }
        else
        {
            $("#state_setup").parent().parent().css('visibility', 'hidden');
        }
    });  
        
    $('#Talk').live('click', function()
    {	
        doctor_to_connect = '';
        type_of_doctor_to_find = '';
        $('.recent_doctor_button_selected').attr("class", "recent_doctor_button");
        $("#Talk_Section_1").css("display", "block");
        $("#Talk_Section_2").css("display", "none");
        $("#Talk_Section_3").css("display", "none");
        $("#Talk_Section_4").css("display", "none");
   
        $("#find_doctor_modal").dialog({bgiframe: true, width: 550, height: 413, resize: false, modal: true});
        $("#step_bar_1").attr("class", "step_bar");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle");
        $("#step_bar_2").attr("class", "step_bar");
        $("#step_circle_3").attr("class", "step_circle");
        $("#step_bar_3").attr("class", "step_bar");
        $("#step_circle_4").attr("class", "step_circle");
        $("#step_bar_4").attr("class", "step_bar");
        $("#step_circle_5").attr("class", "step_circle");
        $("#step_bar_5").attr("class", "step_bar");
        $("#step_circle_6").attr("class", "step_circle");
        $("#find_doctor_label").text("");
        $("#find_doctor_next_button").css("display", "block");
        $("#find_doctor_previous_button").css("display", "block");
        $("#find_doctor_cancel_button").css("display", "block");
        $("#find_doctor_close_button").css("display", "none");
        $('#find_doctor_my_doctors_1').css("display", "none");
        $('#find_doctor_my_doctors_2').css("display", "none");
        $('#find_doctor_appointment_1').css("display", "none");
        $('#find_doctor_appointment_2').css("display", "none");
        $('#find_doctor_appointment_3').css("display", "none");
        $('#find_doctor_time').css("display", "none");
        $('#find_doctor_receipt').css("display", "none");
        $('#find_doctor_confirmation').css("display", "none");
        $('#time_selector_1').css("display", "none");
        $('#day_selector_1').css("display", "none");
        $('#find_doctor_main').css("display", "block");
        find_doctor_page = 0;
        
    });
        
    function getDay(i)
    {
        if(i == 1)
        {
            return "Sunday";
        }
        else if(i == 2)
        {
            return "Monday";
        }
        else if(i == 3)
        {
            return "Tuesday";
        }
        else if(i == 4)
        {
            return "Wednesday";
        }
        else if(i == 5)
        {
            return "Thursday";
        }
        else if(i == 6)
        {
            return "Friday";
        }
        else if(i == 7)
        {
            return "Saturday";
        }
    }
    function getSlot(i)
    {
        if(i == 1)
        {
            return "8:00 AM and 10:00 AM";
        }
        else if(i == 2)
        {
            return "10:00 AM and 12:00 PM";
        }
        else if(i == 3)
        {
            return "12:00 PM and 2:00 PM";
        }
        else if(i == 4)
        {
            return "2:00 PM and 4:00 PM";
        }
        else if(i == 5)
        {
            return "4:00 PM and 6:00 PM";
        }
        else if(i == 6)
        {
            return "6:00 PM and 8:00 PM";
        }
        else if(i == 7)
        {
            return "8:00 PM and 10:00 PM";
        }
    }
    function getSlotStartTime(i)
    {
        if(i == 1)
        {
            return "08:00:00";
        }
        else if(i == 2)
        {
            return "10:00:00";
        }
        else if(i == 3)
        {
            return "12:00:00";
        }
        else if(i == 4)
        {
            return "14:00:00";
        }
        else if(i == 5)
        {
            return "16:00:00";
        }
        else if(i == 6)
        {
            return "18:00:00";
        }
        else if(i == 7)
        {
            return "20:00:00";
        }
    }
    function getSlotEndTime(i)
    {
        if(i == 1)
        {
            return "10:00:00";
        }
        else if(i == 2)
        {
            return "12:00:00";
        }
        else if(i == 3)
        {
            return "14:00:00";
        }
        else if(i == 4)
        {
            return "16:00:00";
        }
        else if(i == 5)
        {
            return "18:00:00";
        }
        else if(i == 6)
        {
            return "20:00:00";
        }
        else if(i == 7)
        {
            return "22:00:00";
        }
    }
    function resetDateTimeSelector()
    {
        $("#sun").removeClass("day_selected");
        $("#mon").removeClass("day_selected");
        $("#tues").removeClass("day_selected");
        $("#wed").removeClass("day_selected");
        $("#thur").removeClass("day_selected");
        $("#fri").removeClass("day_selected");
        $("#sat").removeClass("day_selected");

        $("#8_10_am").removeClass("slot_selected");
        $("#10_12").removeClass("slot_selected");
        $("#12_2").removeClass("slot_selected");
        $("#2_4").removeClass("slot_selected");
        $("#4_6").removeClass("slot_selected");
        $("#6_8").removeClass("slot_selected");
        $("#8_10_pm").removeClass("slot_selected");
        
        time_selected = -1;
        day_selected= -1;
        date_selected = '';
        $("#day_selector_1").css("display", "none");
        $("#time_selector_1").css("display", "none");
    }
    $("#find_doctor_next_button").live('click', function()
    {
        // commented out to skip step 2 for Llama al Doctor
 if(find_doctor_page == 30 || find_doctor_page == 21 || find_doctor_page == 10)
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#find_doctor_label").text("Select Time");
            if(find_doctor_page == 30 || find_doctor_page == 10)
            {
                
                // find a doctor
                if(find_doctor_page == 10 || find_doctor_page == 30)
                {
                    var speciality = "General Practice";
                    if(find_doctor_page != 10 && find_doctor_page != 30 && $("#speciality").val() != null)
                    {
                        speciality = $("#speciality").val();
                    }
                    var loc_1 = $("#country").val();
                    var loc_2 = '';
                    if($("#state").val().length > 0 && $("#state").val() != '-1')
                    {
                        loc_2 = $("#state").val() + ", " + $("#country").val();
                    }
                    var mba = true;
                    if(find_doctor_page == 31)
                    {
                        mba = false;
                    }
                    $.post("find_doctor.php", {type: speciality, location_1: loc_1, location_2: loc_2, must_be_available: mba}, function(data, status)
                    {
                        if(data != 'none')
                        {
                            var info = JSON.parse(data);
                            selected_doctor_info = "recdoc_"+info['id']+"_"+info['phone']+"_"+info['name']+"_"+info['location'];
                            console.log(selected_doctor_info);
                            $.post("getDoctorAvailableTimeranges.php", {id: info['id']}, function(data2, status)
                            {
                                console.log(data2);
                                var info = JSON.parse(data2);
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
                                if(find_doctor_page == 30)
                                {
                                    find_doctor_page = 32;
                                    resetDateTimeSelector();
                                    $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
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
                                    $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed and will start IMMEDIATELY.</strong></p></div>');
                                    $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
                                    $("#step_bar_4").attr("class", "step_bar lit");
                                    $("#step_circle_5").attr("class", "step_circle lit");
                                    $("#find_doctor_label").text("Confirmation");
                                }
                            });
                        }
                        else
                        {
                            // tell user the doctor could not be found in their area
                            if(find_doctor_page == 31)
                            {
                                find_doctor_page = 35;
                            }
                            else
                            {
                                find_doctor_page = 15;
                            }
                            $("#find_doctor_next_button").css("display", "none");
							if(language == 'th'){
							translation = 'Lo siento, no hemos podido encontrar ningún</br>médico general en tu area.';
							}else if(language == 'en'){
							translation = "Sorry, we could not find any<br/>general practicioners in your area.";
							}
                            $("#not_found_text").html(translation);
                            $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_appointment_3').fadeIn(300)}); 
                            $("#step_bar_3").attr("class", "step_bar");
                            $("#step_circle_4").attr("class", "step_circle");
							if(language == 'th'){
							translation = 'Seleccionar Especialidad';
							}else if(language == 'en'){
							translation = 'Select Speciality';
							}
                            $("#find_doctor_label").text(translation);
                        }
                    });
                }
                else
                {
                    $("#step_bar_3").attr("class", "step_bar");
                    $("#step_circle_4").attr("class", "step_circle");
						if(language == 'th'){
						translation = 'Seleccionar Especialidad';
						}else if(language == 'en'){
						translation = 'Select Speciality';
						}
                    $("#find_doctor_label").text(translation);
                }
                
            }
            if(find_doctor_page == 21)
            {
                if(selected_doctor_available == 0)
                {
                    
                    if($('#in_location_checkbox').is(":checked"))
                    {
                        find_doctor_page = 22;
                        resetDateTimeSelector();
                        $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
                    }
                    else
                    {
                        $("#step_bar_3").attr("class", "step_bar");
                        $("#step_circle_4").attr("class", "step_circle");
						if(language == 'th'){
						translation = 'Seleccionar Tipo';
						}else if(language == 'en'){
						translation = 'Select Type';
						}
                        $("#find_doctor_label").text(translation);
                    }
                }
                else
                {
                    
                    if($('#in_location_checkbox').is(":checked"))
                    {
                        find_doctor_page = 25;
                        $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_my_doctors_3').fadeIn(300)});
                    }
                    else
                    {
                        $("#step_bar_3").attr("class", "step_bar");
                        $("#step_circle_4").attr("class", "step_circle");
						if(language == 'th'){
						translation = 'Seleccionar Tipo';
						}else if(language == 'en'){
						translation = 'Select Type';
						}
                        $("#find_doctor_label").text(translation);
                    }
                }
            }
        }
        else if(find_doctor_page == 32 || find_doctor_page == 22)
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar lit");
            $("#step_circle_5").attr("class", "step_circle lit");
            $("#find_doctor_label").text("Confirmation");
            if(find_doctor_page == 32)
            {
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
                html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">next <strong>'+getDay(day_selected)+'</strong> between <strong>'+getSlot(time_selected)+'</strong></li></ul></div>';
                $("#find_doctor_receipt").html(html);
                $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed.</strong><br/>Please be ready at the selected day and time, and follow the instructions that we sent to you</p></div>');
                find_doctor_page = 33;
                $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
            }
            else if(find_doctor_page == 22 && time_selected != -1 && day_selected != -1)
            {
                find_doctor_page = 23;
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
                html += 'Consultation</strong></li><li style="text-align: left;">With Dr. <strong>'+ info[3] + ' ' + info[4] + '</strong></li><li style="text-align: left;">next <strong>'+getDay(day_selected)+'</strong> between <strong>'+getSlot(time_selected)+'</strong></li></ul></div>';
                $("#find_doctor_receipt").html(html);
                $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed.</strong><br/>Please be ready at the selected day and time, and follow the instructions that we sent to you</p></div>');
                $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
            }
            else
            {
                $("#step_bar_4").attr("class", "step_bar");
                $("#step_circle_5").attr("class", "step_circle");
                $("#find_doctor_label").text("Select Time");
            }
            
        }
        else if(find_doctor_page == 33 || find_doctor_page == 23 || find_doctor_page == 26 || find_doctor_page == 12)
        {
            if(find_doctor_page == 33)
            {
                find_doctor_page = 34;
                var info = selected_doctor_info.split("_");
                console.log(date_selected);
                var type = 1;
                if(consultation_type != 1)
                {
                    type = 0;
                }
                $.post("add_appointment.php", {medid: info[1], patid: $("#USERID").val(), date: date_selected, start_time: getSlotStartTime(time_selected), end_time: getSlotEndTime(time_selected), video: type, timezone: selected_timezone}, function(data,status)
                {
                    if(data != '-1')
                    {
                        $.get("send_appointment_email.php?id="+data+"&type=patient", function(data, status)
                        {
                            $.get("send_appointment_email.php?id="+data+"&type=doctor", function(data, status){});
                        });
                    }
                });
            }
            if(find_doctor_page == 23)
            {
                find_doctor_page = 24;
                var info = selected_doctor_info.split("_");
                console.log(date_selected);
                var type = 1;
                if(consultation_type != 1)
                {
                    type = 0;
                }
                $.post("add_appointment.php", {medid: info[1], patid: $("#USERID").val(), date: date_selected, start_time: getSlotStartTime(time_selected), end_time: getSlotEndTime(time_selected), video: type, timezone: selected_timezone}, function(data,status)
                {
                    if(data != '-1')
                    {
                        $.get("send_appointment_email.php?id="+data+"&type=patient", function(data, status)
                        {
                            $.get("send_appointment_email.php?id="+data+"&type=doctor", function(data, status){});
                        });
                    }
                });
            }
            if(find_doctor_page == 26 || find_doctor_page == 12)
            {
                if(find_doctor_page == 26)
                {
                    find_doctor_page = 27;
                }
                else
                {
                    find_doctor_page = 13;
                }
                
                // start appointment now with selected doctor
                var info = selected_doctor_info.split("_");
                
                // NO VIDEO FOR HTI USERS
    
                    $.post("start_telemed_phonecall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[2], doc_id: info[1], pat_id: $("#USERID").val(), doc_name: (info[3] + ' ' + info[4]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status){console.log(data);});
                //}
            }
            $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_confirmation').fadeIn(300)});
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar lit");
            $("#step_circle_5").attr("class", "step_circle lit");
            $("#step_bar_5").attr("class", "step_bar lit");
            $("#step_circle_6").attr("class", "step_circle lit");
            $("#find_doctor_label").text("");
            $("#find_doctor_next_button").css("display", "none");
            $("#find_doctor_previous_button").css("display", "none");
            $("#find_doctor_cancel_button").css("display", "none");
            $("#find_doctor_close_button").css("display", "block");
        }
    });
    $("#find_doctor_previous_button").live('click', function()
    {
        if(find_doctor_page == 23 || find_doctor_page == 33)
        {
            if(find_doctor_page == 23)
            {
                find_doctor_page = 22;
            }
            else if(find_doctor_page == 33)
            {
                find_doctor_page = 32;
            }
            resetDateTimeSelector();
            $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
            $("#find_doctor_label").text("Select Time");
        }
        else if(find_doctor_page == 22 || find_doctor_page == 32 || find_doctor_page == 12)
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
			if(language == 'th'){
			translation = 'Seleccionar Tipo';
			}else if(language == 'en'){
			translation = 'Select Type';
			}
            $("#find_doctor_label").text(translation);
            if(find_doctor_page == 22)
            {
                if(selected_doctor_available == 0)
                {
                    find_doctor_page = 21;
                    $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_my_doctors_2').fadeIn(300)});
                }
                else
                {
                    find_doctor_page = 25;
                    $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_my_doctors_3').fadeIn(300)});
                    $("#find_doctor_label").text("Select Time");
                    $("#step_bar_3").attr("class", "step_bar lit");
                    $("#step_circle_4").attr("class", "step_circle lit");
                }
                
            }
            
            else if(find_doctor_page == 32 || find_doctor_page == 12)
            {
                if(find_doctor_page == 32)
                {
                    find_doctor_page = 30;
                    $('#find_doctor_time').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
					if(language == 'th'){
					translation = 'Seleccionar Tipo';
					}else if(language == 'en'){
					translation = 'Select Type';
					}
                    $("#find_doctor_label").text(translation);
                    $("#step_bar_2").attr("class", "step_bar");
                    $("#step_circle_3").attr("class", "step_circle");
                }
                else
                {
                    find_doctor_page = 10;
                    $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
					if(language == 'th'){
					translation = 'Seleccionar Tipo';
					}else if(language == 'en'){
					translation = 'Select Type';
					}
                    $("#find_doctor_label").text(translation);
                    $("#step_bar_2").attr("class", "step_bar");
                    $("#step_circle_3").attr("class", "step_circle");
                }
            }
        }
        else if(find_doctor_page == 21 || find_doctor_page == 31 || find_doctor_page == 11)
        {
            if(find_doctor_page == 21)
            {
                $('#find_doctor_my_doctors_2').fadeOut(300, function(){$('#find_doctor_my_doctors_1').fadeIn(300)});
                find_doctor_page = 20;
                $("#find_doctor_label").text("Select Doctor");
                
            }
            else if(find_doctor_page == 31)
            {
                find_doctor_page = 30;
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
				if(language == 'th'){
				translation = 'Seleccionar Tipo';
				}else if(language == 'en'){
				translation = 'Select Type';
				}
                $("#find_doctor_label").text(translation);
            }
            else
            {
                find_doctor_page = 10;
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
				if(language == 'th'){
				translation = 'Seleccionar Tipo';
				}else if(language == 'en'){
				translation = 'Select Type';
				}
                $("#find_doctor_label").text(translation);
            }
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar");
            $("#step_circle_3").attr("class", "step_circle");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
        }
        else if(find_doctor_page == 20 || find_doctor_page == 30 || find_doctor_page == 10)
        {
            if(find_doctor_page == 20)
            {
                $('#find_doctor_my_doctors_1').fadeOut(300, function(){$('#find_doctor_main').fadeIn(300)});
            }
            else if(find_doctor_page == 30 || find_doctor_page == 10)
            {
                $('#find_doctor_appointment_1').fadeOut(300, function(){$('#find_doctor_main').fadeIn(300)});
            }
            find_doctor_page = 0;
            $("#step_bar_1").attr("class", "step_bar");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle");
            $("#step_bar_2").attr("class", "step_bar");
            $("#step_circle_3").attr("class", "step_circle");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
            $("#find_doctor_label").text("");
        }
        else if(find_doctor_page == 25)
        {
            $('#find_doctor_my_doctors_3').fadeOut(300, function(){$('#find_doctor_my_doctors_2').fadeIn(300)});
            find_doctor_page = 21;
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar");
            $("#step_circle_4").attr("class", "step_circle");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
			if(language == 'th'){
			translation = 'Seleccionar Tipo';
			}else if(language == 'en'){
			translation = 'Select Type';
			}
            $("#find_doctor_label").text(translation);
        }
        else if(find_doctor_page == 26)
        {
            $('#find_doctor_receipt').fadeOut(300, function(){$('#find_doctor_my_doctors_3').fadeIn(300)});
            find_doctor_page = 25;
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#step_bar_2").attr("class", "step_bar lit");
            $("#step_circle_3").attr("class", "step_circle lit");
            $("#step_bar_3").attr("class", "step_bar lit");
            $("#step_circle_4").attr("class", "step_circle lit");
            $("#step_bar_4").attr("class", "step_bar");
            $("#step_circle_5").attr("class", "step_circle");
            $("#find_doctor_label").text("Select Time");
        }
        else if(find_doctor_page == 35)
        {
            $('#find_doctor_appointment_3').fadeOut(300, function(){$('#find_doctor_appointment_2').fadeIn(300)});
            find_doctor_page = 31;
            $("#find_doctor_next_button").css("display", "block");
        }
        else if(find_doctor_page == 15)
        {
            $('#find_doctor_appointment_3').fadeOut(300, function(){$('#find_doctor_appointment_1').fadeIn(300)});
            find_doctor_page = 10;
            $("#find_doctor_next_button").css("display", "block");
        }
    });
    $("#find_doctor_cancel_button").live('click', function()
    {
        $("#find_doctor_modal").dialog("close");
    });
    $("#find_doctor_close_button").live('click', function()
    {
        $("#find_doctor_modal").dialog("close");
    });
    $("#find_doctor_now_button").live('click',function()
    {
        // GEOLOCATION
        //alert("Your location is: " + geoplugin_countryName() + ", " + geoplugin_region() + ", " + geoplugin_city());
        var country = geoplugin_countryName();
        if (country == "United States") {
            country = "USA";
        }    
		$("#country").val(country);	
	    $("#country").change();
        
        if(country== 'USA')
        {
            $("#state").parent().parent().css('display', 'block');
        }
        else
        {
            $("#state").parent().parent().css('display', 'none');
        }
	    //populateCountries("country", "state");
	    var zone = geoplugin_region();
	    var district = geoplugin_city();
		$("#state").val(district);			 
	    $("#state").change();
        // GEOLOCATION
    
        if(!$(this).hasClass("square_blue_button_disabled"))
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_appointment_1").fadeIn(300)});
            find_doctor_page = 10;
			if(language == 'th'){
			translation = 'Seleccionar Tipo';
			}else if(language == 'en'){
			translation = 'Select Type';
		}
            $("#find_doctor_label").text(translation);
        }
    });
    $("#find_doctor_appointment_button").live('click',function()
    {
        // GEOLOCATION
        //alert("Your location is: " + geoplugin_countryName() + ", " + geoplugin_region() + ", " + geoplugin_city());
        var country = geoplugin_countryName();
        if (country == "United States") {
            country = "USA";
        }    
		$("#country").val(country);	
	    $("#country").change();
        if(country== 'USA')
        {
            $("#state").parent().parent().css('display', 'block');
        }
        else
        {
            $("#state").parent().parent().css('display', 'none');
        }
	    //populateCountries("country", "state");
	    var zone = geoplugin_region();
	    var district = geoplugin_city();
		$("#state").val(district);			 
	    $("#state").change();
        // 

        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_appointment_1").fadeIn(300)});
        find_doctor_page = 30;
		if(language == 'th'){
		translation = 'Seleccionar Tipo';
		}else if(language == 'en'){
		translation = 'Select Type';
		}
        $("#find_doctor_label").text(translation);
    });
    $("#find_doctor_my_doctors_button").live('click',function()
    {
        if(!$(this).hasClass("square_blue_button_disabled"))
        {
            $("#step_bar_1").attr("class", "step_bar lit");
            $("#step_circle_1").attr("class", "step_circle lit");
            $("#step_circle_2").attr("class", "step_circle lit");
            $("#find_doctor_main").fadeOut(300, function(){$("#find_doctor_my_doctors_1").fadeIn(300)});
            find_doctor_page = 20;
            $("#find_doctor_label").text("Select Doctor");
        }
    });
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
    $("[id^='recdoc_']").live('click', function()
    {
        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#step_bar_2").attr("class", "step_bar lit");
        $("#step_circle_3").attr("class", "step_circle lit");
        $("#find_doctor_my_doctors_1").fadeOut(300, function(){$("#find_doctor_my_doctors_2").fadeIn(300)});
        find_doctor_page = 21;
        if($(this).attr("id").search("Available") != -1)
        {
            selected_doctor_available = 1;
        }
        else
        {
            selected_doctor_available = 0;
        }
		var translation = '';
		
		
		if(language == 'th'){
		translation = 'Seleccionar Tipo';
		}else if(language == 'en'){
		translation = 'Select Type';
		}
        $("#find_doctor_label").text(translation);
        var info = $(this).attr("id").split("_");
        selected_doctor_info = $(this).attr("id");
        $("#doctor_location_text").html("Doctor " + info[3] + " " + info[4] + " is in <strong>" + info[5] + "</strong>.<br/>Please confirm that you are in <strong>" + info[5] + "</strong> as well.");
        $("#doctor_oncall_text").html("Doctor " + info[3] + " " + info[4] + " is ON CALL NOW!<br/>Would you like to connect now?");
        $.post("getDoctorAvailableTimeranges.php", {id: info[1]}, function(data, status)
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
    });
    $("#find_doctor_video_button").live('click', function()
    {
        $("#find_doctor_video_button").css('background-color', '#22aeff');
        $("#find_doctor_phone_button").css('background-color', '#535353');
        consultation_type = 1;
    });
    $("#find_doctor_phone_button").live('click', function()
    {
        $("#find_doctor_phone_button").css('background-color', '#22aeff');
        $("#find_doctor_video_button").css('background-color', '#535353');
        consultation_type = 2;
    });
    $("#find_doctor_video_button_2").live('click', function()
    {
        $("#find_doctor_video_button_2").css('background-color', '#22aeff');
        $("#find_doctor_phone_button_2").css('background-color', '#535353');
        consultation_type = 1;
    });
    $("#find_doctor_phone_button_2").live('click', function()
    {
        $("#find_doctor_phone_button_2").css('background-color', '#22aeff');
        $("#find_doctor_video_button_2").css('background-color', '#535353');
        consultation_type = 2;
    });
    $("#connect_now_yes").live('click', function()
    {
        find_doctor_page = 26;
        $('#find_doctor_my_doctors_3').fadeOut(300, function(){$('#find_doctor_receipt').fadeIn(300)});
        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#step_bar_2").attr("class", "step_bar lit");
        $("#step_circle_3").attr("class", "step_circle lit");
        $("#step_bar_3").attr("class", "step_bar lit");
        $("#step_circle_4").attr("class", "step_circle lit");
        $("#step_bar_4").attr("class", "step_bar lit");
        $("#step_circle_5").attr("class", "step_circle lit");
        $("#find_doctor_label").text("Confirmation");
        var info = selected_doctor_info.split("_");
        var html = '<ul style="color: #22AEFF; margin-top: 50px; margin-left: 120px;"><li style="text-align: left;">Receipt: <strong>HTI - CR102388</strong></li><li style="text-align: left;"><strong>';
        console.log($("#find_doctor_video_button_2").css("background-color"));
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
        $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed<br/> and will start IMMEDIATELY.</strong></p></div>');
        
    });
    $("#connect_now_no").live('click', function()
    {
        find_doctor_page = 22;
        resetDateTimeSelector();
        $('#find_doctor_my_doctors_3').fadeOut(300, function(){$('#find_doctor_time').fadeIn(300)});
        $("#step_bar_1").attr("class", "step_bar lit");
        $("#step_circle_1").attr("class", "step_circle lit");
        $("#step_circle_2").attr("class", "step_circle lit");
        $("#step_bar_2").attr("class", "step_bar lit");
        $("#step_circle_3").attr("class", "step_circle lit");
        $("#step_bar_3").attr("class", "step_bar lit");
        $("#step_circle_4").attr("class", "step_circle lit");
        $("#find_doctor_label").text("Select Time");
    });
        
    $("#find_doctor_general_practicioner").live('click', function()
    {
        var loc_1 = $("#country").val();
        var loc_2 = '';
        if($("#state").val().length > 0 && $("#state").val() != '-1')
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
            
            
            if(data != 'none')
            {
                var info = JSON.parse(data);
                selected_doctor_info = "recdoc_"+info['id']+"_"+info['phone']+"_"+info['name']+"_"+info['location'];
                console.log(selected_doctor_info);
                $.post("getDoctorAvailableTimeranges.php", {id: info['id']}, function(data, status)
                {
                    console.log(data);
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
                        $("#find_doctor_confirmation").html('<p style="color: #22AEFF; margin-top: 50px;"><strong>Thank you!</strong><br/><strong>Your consultation appointment is confirmed and will start IMMEDIATELY.</strong></p></div>');
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
		var translation = '';
		
		
		if(language == 'th'){
		translation = 'Lo siento, no hemos podido encontrar ningún</br>médico general en tu area.';
		
		}else if(language == 'en'){
		translation = "Sorry, we could not find any<br/>general practicioners in your area.";
		
		}
                $("#not_found_text").html(translation);
                $('#find_doctor_appointment_2').fadeOut(300, function(){$('#find_doctor_appointment_3').fadeIn(300)}); 
                $("#find_doctor_next_button").css("display", "none");
            }
        });
        
    });
        
    function selectDay(day)
    {
        $("#sun").removeClass("day_selected");
        $("#mon").removeClass("day_selected");
        $("#tues").removeClass("day_selected");
        $("#wed").removeClass("day_selected");
        $("#thur").removeClass("day_selected");
        $("#fri").removeClass("day_selected");
        $("#sat").removeClass("day_selected");
        $("#"+day).addClass("day_selected");
    }
    function selectTime(slot)
    {
        $("#8_10_am").removeClass("slot_selected");
        $("#10_12").removeClass("slot_selected");
        $("#12_2").removeClass("slot_selected");
        $("#2_4").removeClass("slot_selected");
        $("#4_6").removeClass("slot_selected");
        $("#6_8").removeClass("slot_selected");
        $("#8_10_pm").removeClass("slot_selected");
        $("#"+slot).addClass("slot_selected");
    }
    $("#8_10_am").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 1;
            selected_timezone = zones[0];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "10px");
            selectTime("8_10_am");
        }
    });
    $("#10_12").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 2;
            selected_timezone = zones[1];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "42px");
            selectTime("10_12");
        }
    });
    $("#12_2").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 3;
            selected_timezone = zones[2];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "74px");
            selectTime("12_2");
        }
    });
    $("#2_4").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 4;
            selected_timezone = zones[3];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "106px");
            selectTime("2_4");
        }
    });
    $("#4_6").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 5;
            selected_timezone = zones[4];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "138px");
            selectTime("4_6");
        }
    });
    $("#6_8").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 6;
            selected_timezone = zones[5];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "170px");
            selectTime("6_8");
        }
    });
    $("#8_10_pm").live('click', function()
    {
        if(!$(this).hasClass("slot_disabled"))
        {
            time_selected = 7;
            selected_timezone = zones[6];
            $("#time_selector_1").css("display", "block");
            $("#time_selector_1").css("margin-top", "202px");
            selectTime("8_10_pm");
        }
    });
        
    function disableAllSlots()
    {
        $("#8_10_am").addClass("slot_disabled");
        $("#10_12").addClass("slot_disabled");
        $("#12_2").addClass("slot_disabled");
        $("#2_4").addClass("slot_disabled");
        $("#4_6").addClass("slot_disabled");
        $("#6_8").addClass("slot_disabled");
        $("#8_10_pm").addClass("slot_disabled");
    }
        
    $("#sun").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 1;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "20px");
            selectDay("sun");
            var info = $("#sun").children("input").eq(1).val().substr(1, $("#sun").children("input").eq(1).val().length - 2).split(",");
            zones = $("#sun").children("input").eq(2).val().substr(1, $("#sun").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#sun").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
            
        }
    });
    $("#mon").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 2;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "68px");
            selectDay("mon");
            var info = $("#mon").children("input").eq(1).val().substr(1, $("#mon").children("input").eq(1).val().length - 2).split(",");
            zones = $("#mon").children("input").eq(2).val().substr(1, $("#mon").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#mon").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#tues").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 3;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "116px");
            selectDay("tues");
            var info = $("#tues").children("input").eq(1).val().substr(1, $("#tues").children("input").eq(1).val().length - 2).split(",");
            zones = $("#tues").children("input").eq(2).val().substr(1, $("#tues").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#tues").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#wed").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 4;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "164px");
            selectDay("wed");
            var info = $("#wed").children("input").eq(1).val().substr(1, $("#wed").children("input").eq(1).val().length - 2).split(",");
            zones = $("#wed").children("input").eq(2).val().substr(1, $("#wed").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#wed").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#thur").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 5;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "212px");
            selectDay("thur");
            var info = $("#thur").children("input").eq(1).val().substr(1, $("#thur").children("input").eq(1).val().length - 2).split(",");
            zones = $("#thur").children("input").eq(2).val().substr(1, $("#thur").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#thur").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#fri").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 6;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "260px");
            selectDay("fri");
            var info = $("#fri").children("input").eq(1).val().substr(1, $("#fri").children("input").eq(1).val().length - 2).split(",");
            zones = $("#fri").children("input").eq(2).val().substr(1, $("#fri").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#fri").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    $("#sat").live('click', function()
    {
        if(!$(this).hasClass("day_disabled"))
        {
            day_selected = 7;
            $("#day_selector_1").css("display", "block");
            $("#day_selector_1").css("margin-left", "308px");
            selectDay("sat");
            var info = $("#sat").children("input").eq(1).val().substr(1, $("#sat").children("input").eq(1).val().length - 2).split(",");
            zones = $("#sat").children("input").eq(2).val().substr(1, $("#sat").children("input").eq(2).val().length - 2).split(",");
            date_selected = $("#sat").children("input").eq(0).val();
            disableAllSlots();
            for(var k = 0; k < info.length; k++)
            {
                if(info[k] == '0')
                    $("#8_10_am").removeClass("slot_disabled");
                else if(info[k] == '1')
                    $("#10_12").removeClass("slot_disabled");
                else if(info[k] == '2')
                    $("#12_2").removeClass("slot_disabled");
                else if(info[k] == '3')
                    $("#2_4").removeClass("slot_disabled");
                else if(info[k] == '4')
                    $("#4_6").removeClass("slot_disabled");
                else if(info[k] == '5')
                    $("#6_8").removeClass("slot_disabled");
               else  if(info[k] == '6')
                    $("#8_10_pm").removeClass("slot_disabled");
            }
        }
    });
    
  
        
        
    $('#find_doctor_button').live('click', function()
    {
        if(doctor_to_connect.length > 0 || type_of_doctor_to_find.length > 0)
        {
            var info = doctor_to_connect.split("_");
            $.post("find_doctor.php", {type: type_of_doctor_to_find, id: info[0]}, function(data, status)
            {
                if(data == 'none')
                {
                    $('#find_doctor_modal').dialog('option', 'title', 'No Doctors Found');
                    $("#Talk_Section_1").fadeOut("Slow", function(){$("#Talk_Section_3").fadeIn("slow");});
                    $("#find_doctor_modal").dialog("widget").animate({width: '550px', height: '130px'}, {duration: 500, step: 
                        function()
                        {
                            $("#dialog").dialog('option', 'position', 'center');
                        }
                    });
                }
                else
                {
                    var doc = JSON.parse(data);
                    var name = doc.name;
                    name = name.replace("_", " ");
                    doctor_to_connect = doc.id + "_" + doc.phone + "_" + doc.name;
                    $('#find_doctor_modal').dialog('option', 'title', 'Doctor ' + name);
                    $("#Talk_Section_1").fadeOut("Slow", function(){$("#Talk_Section_2").fadeIn("slow");});
                    $("#find_doctor_modal").dialog("widget").animate({width: '550px', height: '130px'}, {duration: 500, step: 
                        function()
                        {
                            $("#dialog").dialog('option', 'position', 'center');
                        }
                    });
                }
            });
        }
        
    });
    $('.recent_doctor_button').live('click', function()
    {
        $('.recent_doctor_button_selected').attr("class", "recent_doctor_button");
        $(this).attr("class", "recent_doctor_button_selected");
        doctor_to_connect = $(this).attr("id");
        type_of_doctor_to_find = '';
    });
    $("#speciality").change(function()
    {
        doctor_to_connect = '';
        type_of_doctor_to_find = $(this).val();
    });
    $('#phone_call_button').live('click',function(e)
    {
        //$("#find_doctor_modal").dialog("close");
        var info = doctor_to_connect.split("_");
        $('#find_doctor_modal').dialog('option', 'title', 'Calling Doctor ' + info[2]);
        $("#Talk_Section_2").fadeOut("Slow", function(){$("#Talk_Section_4").fadeIn("slow");});
        $.post("start_telemed_phonecall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[1], doc_id: info[0], pat_id: $("#USERID").val(), doc_name: (info[2] + ' ' + info[3]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status)
        {
            console.log(data);
        });
    });
    $('#video_call_button').live('click',function(e)
     {
        $("#find_doctor_modal").dialog("close");
         var info = doctor_to_connect.split("_");
        $.post("start_telemed_videocall.php", {pat_phone: $("#USERPHONE").val(), doc_phone: info[1], doc_id: info[0], pat_id: $("#USERID").val(), doc_name: (info[2] + ' ' + info[3]), pat_name: ($("#USERNAME").val() + ' ' + $("#USERSURNAME").val())}, function(data, status)
        {
            console.log(data);
            if(data == 1)
            {
                var info = doctor_to_connect.split("_");
                window.open("telemedicine_patient.php?MED=" + info[0] + "&PAT=" + $("#USERID").val(),"Telemedicine","height=650,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes");
            }
            else
            {
                alert("There was an error. Please try again later");
            }
        });
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
                              
    $('#sendmessages_inbox').live('click',function(){
         var IdPaciente = session_userid;
         var FullNamePaciente = $('#NombreComp').html();
         //alert (FullNamePaciente);
         IdDoctor = $("#IdDoctor").attr('value');
         var content = $('#messagecontent_inbox').val();
         var subject=$('#subjectname_inbox').val();;
         //reportids = reportids.replace(/\s+$/g,' ');
         var IdDocOrigin = IdDoctor;
         var IdDoctor = IdDoctor;
         var Receiver = 0;
         reportids = ' ';
         //alert ('IdPaciente: '+IdPaciente+' - '+'Sender: '+IdDocOrigin+' - '+'Attachments: '+reportids+' - '+'Receiver: '+IdDoctor+' - '+'Content: '+content+' - '+'subject: '+subject+' - '+'connection_id: 0');
         var cadena='sendMessageUSER.php?sender='+IdDocOrigin+'&receiver='+IdDoctor+'&patient='+IdPaciente+''+'&content='+content+'&subject='+subject+'&attachments='+reportids+'&connection_id=0&tofrom=to';
         var RecTipo=LanzaAjax(cadena);
         
         $('#messagecontent_inbox').attr('value','');
         $('#subjectname_inbox').attr('value','');
         displaynotification('status',RecTipo);
         getUserData(IdPaciente);
         var UserName = user[0].Name;
         var UserSurname = user[0].Surname; 
         
         getMedCreator(IdDoctor);
         var NameMed = doctor[0].Name;
         var SurnameMed = doctor[0].Surname; 
         
         var cadena='push_serverUSER.php?FromDoctorName='+UserName+'&FromDoctorSurname='+UserSurname+'&FromDoctorId='+IdDoctor+'&Patientname='+UserName+'&PatientSurname='+UserSurname+'&IdUsu='+IdPaciente+'&message= New Message <br>From: '+UserName+' '+UserSurname+' <br>Subject: '+(subject).replace(/RE:/,'')+'&NotifType=1&channel='+IdDoctor+'&Selector=2';
         //alert(cadena);
         var RecTipo=LanzaAjax(cadena);
         
         //}
         reportids='';
         $("#attachment_icon").remove();
    
        
        //alert ('Answer of Messg Proc.?: '+RecTipo);
         $('#message_modal').trigger('click');  //Close the modal window
});
     
    $('.CFILA').live('click',function(){
       var id = $(this).attr("id");
       // Get Doctor id and some info
       var cadena='getDoctorMessage.php?msgid='+id;
       var RecTipo=LanzaAjax(cadena);
       var n = RecTipo.indexOf(",");
	   var IdDoctor = RecTipo.substr(0,n);
       var Remaining = RecTipo.substr(n+1,RecTipo.length);
       m = Remaining.indexOf(",");
	   var NameDoctor = Remaining.substr(0,m);
       var SurnameDoctor = Remaining.substr(m+1,Remaining.length);
       $("#IdDoctor").attr('value',IdDoctor);
       //throw "stop execution";
       
       //displaynotification('Message ID'+ id);
	   
       
       $('input[type=checkbox][id^="reportcol"]').each(
        function () {
		 $('input[type=checkbox][id^="reportcol"]').checked=false;
		});
	   reportcheck.length=0;
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
       $('#ToDoctor').html('To: '+NameDoctor+' '+SurnameDoctor);
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
	
	   
   });
        
    $('.CFILA_out').live('click',function(){
       var id = $(this).attr("id");
	   //displaynotification('Message ID'+ id);
	   $('input[type=checkbox][id^="reportcol"]').each(
        function () {
		 $('input[type=checkbox][id^="reportcol"]').checked=false;
		});
	   reportcheck.length=0;
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
   
    var isloaded=false;   //This variable is to make sure the page loads the report only once.
   
  
   
    $('#attachreports').live('click',function(){
   
    $('input[type=checkbox][id^="reportcol"]').each(
     function () {
				var sThisVal = (this.checked ? "1" : "0");
				if(sThisVal==1){
				reportcheck.push(this.id);
				}
				
	});

	$("#attachments").empty();
	createPatientReports();
	//isloaded=true;
	//}
	setTimeout(function(){
	for (i = 0 ; i < reportcheck.length; i++ ){
				
		document.getElementById(reportcheck[i]).checked = true;
				
	}},400);
   $("#attachment_icon").remove();
   $('#sendmessages_inbox').hide();
   $('#replymessage').hide();
   $(this).hide();   
   $('#attachments').show();
   $('#Attach').show();
   $("#Reply").attr('value','Back');
   $("#Reply").show();
   
   
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

     
   
        
        
        
        
        
        
    $("#SearchUser").typeWatch({
				captureLength: 1,
				callback: function(value) {
					$("#BotonBusquedaPac").trigger('click');
					//alert('searching');
				}
	});
	$("#RetrievePatient").click(function(event) {
   		 $('#BotonBusquedaPac').trigger('click');
   	});
    $("#BotonBusquedaPac").click(function(event) {
     		var queMED = $("#MEDID").val();
    	    var UserInput = $('#SearchUser').val();
    	    //alert(UserInput);

    	    //alert (longit);
    	     
			var onlyGroup=0;
			if ($('#RetrievePatient').is(":checked")){
			onlyGroup=1;
			}else{
			onlyGroup=1;
			}
		   
    	     if(UserInput===""){
			    UserInput=-111;
			 }
			// alert(UserInput);
    	    var queUrl ='getFullUsersMED.php?Usuario='+UserInput+'&IdMed='+queMED+'&Usuario='+UserInput+'&Group='+onlyGroup;
			//alert(queUrl);
    	    $('#TablaPac').load(queUrl);
    	    //$('#TablaPac').trigger('click');
    	    $('#TablaPac').trigger('update');
  	    
    });

    $("#BotonBusquedaPacCOMP").click(function(event) {
    	    var IdUs =156;
    	    var UserInput = $('#SearchUserYCOMP').val();
                                  
    	    var serviceURL = '<?php echo $domain;?>/getpines.php' + '?Usuario=' + UserInput; 
    	    getLifePines(serviceURL);
    	    var longit = Object.keys(pines).length;	
    	    //alert (longit);
    	    var queUrl ='getFullUsers.php?Usuario='+UserInput+'&NReports='+longit;
    	    $('#TablaPacCOMP').load(queUrl);
    	    //$('#TablaPac').trigger('click');
    	    $('#TablaPacCOMP').trigger('update');
    });
	
	

	$('#BotPassbook').live('click',function(){
	  $("#modalContents").dialog({bgiframe: true, height: 1000, height: 340, modal: true});
	});

	$('#ButtonSkype').live('click',function(){
	 $('#modalContents').dialog( "close" );
	});

	$('#ButtonWeemo').live('click',function(){
		$.ajax({
			 url: '<?php echo $domain?>/weemo_test.php?calleeID=<?php echo $DoctorEmail;?>',
			 method: 'get',
				success: function(data){
				var htmlContent = data;
				var e = document.createElement('div');
				e.setAttribute('style', 'display: none;');
				e.innerHTML = htmlContent;
				document.body.appendChild(e);
				eval(document.getElementById("runscript").innerHTML);
			  }
		 });
		$('#modalContents').dialog( "close" );
	});
     
	$('#telemedicine').live('click',function(){
	 // e.preventDefault();
	  $("#modalContents").dialog({bgiframe: true, height: 140, modal: true});
	 });


     $('#TablaPacCOMP').bind('click', function() {
      alert($(this).text());
      });

	    
 	$('#datatable_1').dataTable( {
		"bProcessing": true,
		"bDestroy": true,
		"bRetrieve": true,
		"sAjaxSource": "getBLOCKS.php"
	} );
    
    $('#Wait1')
    .hide()  // hide it initially
    .ajaxStart(function() {
        //alert ('ajax start');
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    }); 

    $('#datatable_1 tbody').click( function () {
    // Alert the contents of an element in a SPAN in the first TD    
    alert( $('td:eq(0) span', this).html() );
    } );
 
    //});        
    
     
    function getLifePines(serviceURL) {
    $.ajax(
           {
           url: serviceURL,
           dataType: "json",
           async: false,
           success: function(data)
           {
           pines = data.items;
           }
           });
     }        

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
	
	  

  
    function TranslateAngle(x,maxim){
	    var y = (x * Math.PI * 2) / maxim;
	    return parseFloat(y);
    }
    
    function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
	}
	
	function GetICD10Code(searchW)
	{		
		var queUrl ='https://api.aqua.io/codes/beta/icd10.json?utf8=%E2%9C%93&q%5Bdescription_cont%5D='+searchW;	
		var ICDCodes = '';	
		var ICDArr = Array();	
		$.ajax({
			dataType: "json",
			url: queUrl,
			async:false,
			success: function(ajaxresult)
			{
				ICDCodes = ajaxresult;
				var ICDArr = ajaxresult[0];	
			},
            error: function(data, errorThrown){
               alert(errorThrown);
              }
         });
		return ICDCodes;
	}

    
    function GetCanvasTextHeight(text,font){
    var fontDraw = document.createElement("canvas");

    var height = 100;
    var width = 100;

    // here we expect that font size will be less canvas geometry
    fontDraw.setAttribute("height", height);
    fontDraw.setAttribute("width", width);

    var ctx = fontDraw.getContext('2d');
    // black is default
    ctx.fillRect(0, 0, width, height);
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.font = font;
    ctx.fillText(text/*'Eg'*/, 0, 0);

    var pixels = ctx.getImageData(0, 0, width, height).data;

    // row numbers where we first find letter end where it ends 
    var start = -1;
    var end = -1;

    for (var row = 0; row < height; row++) {
        for (var column = 0; column < width; column++) {

            var index = (row * width + column) * 4;

            // if pixel is not white (background color)
            if (pixels[index] == 0) {
                // we havent met white (font color) pixel
                // on the row and the letters was detected
                if (column == width - 1 && start != -1) {
                    end = row;
                    row = height;
                    break;
                }
                continue;
            }
            else {
                // we find top of letter
                if (start == -1) {
                    start = row;
                }
                // ..letters body
                break;
            }

        }

    }

    return end - start;
    };//END GET CANVAS TEXT HEIGHT
	
	function findPos(obj) {
	    var curleft = 0, curtop = 0;
	    if (obj.offsetParent) {
	        do {
	            curleft += obj.offsetLeft;
	            curtop += obj.offsetTop;
	        } while (obj = obj.offsetParent);
	        return { x: curleft, y: curtop };
	    }
	    return undefined;
	}

	function rgbToHex(r, g, b) {
	    if (r > 255 || g > 255 || b > 255)
	        throw "Invalid color component";
	    return ((r << 16) | (g << 8) | b).toString(16);
	}
				 		
//Start of code inserted from userdashboard-new-pallab.php
    // Start of code for display of modal window for Send button
    $("#Send2Doc").on('click',function(){
		$("#modal_send").dialog({bigframe: true, width: 400, height: 200, modal: false});
	});
    //End of code for display of modal window of Send button
    
    //Start of code for OK button in Send page
    $("#CaptureEmail2Send2Doc").on('click',function(){
		var emailId = $("#EmailID").val();
        var user = session_userid;
        $.get("ValidateSendEmailDoc.php?emailId="+emailId+"&user="+user,function(data,status)
              {
              console.log(data);
              });
        
	$("#modal_send").dialog("close");
    });
    //End of code  for OK button in Send page
        
    //Start of code for display of modal window for Request button
    $("#Request").on('click',function(){
		$("#modal_request").dialog({bigframe: true, width: 550, height: 300, modal: false});
	});
    //End of code for display of modal windown for Request button
    
    // Start of Code for Request Reports button
    $("#CaptureEmail2Request2Doc").on('click',function(){
        
        var emailId = $("#EmailIDRequestPage").val();
        var messageForDoc = "'"+$("#MessageForDoctor").val()+"'";
        var user = session_userid;
        $.get("RequestReportsFromExternalDoc.php?emailId="+emailId+"&user="+user+"&message="+messageForDoc,function(data,status)
              {
              //alert(data);
              });
        $("#modal_request").dialog("close");
        });
    // End of code for Request Reports button
    // End of code inserted from userdashboard-new-pallab.php	
    //turn on the graph
    $('#PHSLabel').trigger('click');
});
