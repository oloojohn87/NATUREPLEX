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


function LoadDonuts(session_userid){
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
    };