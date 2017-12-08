$(document).ready(function() {
    
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
                            time: '3000'
                         };
    $.gritter.add(gritterOptions);

}

//var pusher = new Pusher('d869a07d8f17a76448ed');
//var channel_name=$('#MEDID').val();
//var channel = pusher.subscribe(channel_name);
    
var push = new Push($("#MEDID").val(), window.location.hostname + ':3955');
    
push.bind('notification', function(data) 
{
    displaynotification('New Message', data);
});
    
$(".loader_spinner").fadeOut("slow");
var IdMed = $('#MEDID').val();


var timeoutTime = 18000000;
	//var timeoutTime = 300000;  //5minutes
	var timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);


	var active_session_timer = 60000; //1minute
	var sessionTimer = setTimeout(inform_about_session, active_session_timer);

	//This function is called at regular intervals and it updates ongoing_sessions lastseen time
	function inform_about_session()
	{
		$.ajax({
			url: '<?php echo $domain?>/ongoing_sessions.php?userid='+IdMed,
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
	
	$('body').bind('mousedown keydown', function(event) {
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(ShowTimeOutWarning, timeoutTime);
    });
	
    
	$('#loadpatientstats').load('getpatientpercentagerefered.php?docid='+IdMed,function(){
        
       
    
        var translation = '';

            if(language == 'th'){
            translation = '% Referidos a Mi';
            }else if(language == 'en'){
            translation = '% Refered to me';
            }	

        var quePorcentaje = $('#quePorcentaje').val();
        //alert('quePorcentaje'+quePorcentaje);
        var g = new JustGage({
                id: "gauge", 
                value: quePorcentaje, 
                min: 0,
                max: 100,
                title: " ",
                label: translation
        });   
        
        $('#stats_icon').hide();
       
    });

	

 	setTimeout(function(){
 		//alert("triggered!");
 		$('#BotonBusquedaPac').trigger('click');
 	},200);


 	//New changes for fetching patient details 10 records at a time- Debraj
    
    function searchMember() {
        $('#searchUserGrid').show();
        //$('#Wait1').hide(); 
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
            windowSize=standardsize;
         }

         if(searchAllPatientCounter>1){
            //LIMIT=LIMIT+10;
            OFFSET=OFFSET+10;
         }

        var queUrl ='getFullUsersMEDNEW.php?Usuario='+UserInput+'&IdMed='+queMED+'&Group='+onlyGroup+'&OFFSET='+OFFSET+'&LIMIT=10';


        //$("#stream_indicator").css("display", "block");
        $('#Wait1').show(); 
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


                           }

                         },
               error: function(data){
                     $('#TablaPac').html(RecTipo);
               }

            });

            setTimeout(function(){ 
                //$("#stream_indicator").css("display", "none");
                $('#Wait1').hide();  
            },1000);

            //$('#TablaPac').trigger('update');

      },200);
    }

 	//$('#TablePac').append();
 	var searchAllPatientCounter=0;

 	//var LIMIT=10;
 	var OFFSET=0;
 	var standardsize=$(window).height()/3;		//This depends on the size of the window
    
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
	});

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
            
    
        //Start of new code added by Pallab for Search By Location
        $("#SearchByLocation").click(function(event) {
            
            //$('#Wait1').hide(); 
     		var queMED = $("#MEDID").val();
    	    var UserInput = $('#SearchUser').val();
            var location = $('#SearchUserByLocation').val();
    	  
           
			var onlyGroup=0;
			if ($('#RetrievePatient').is(":checked")){
			onlyGroup=1;
			}else{
			onlyGroup=1; //Chnaged the value from 1 to 0
			}
		   
    	     if(UserInput===""){
			    UserInput=-111;
			 }
			// alert(UserInput);
            var queUrl ='getFullUsersMEDNEW_SearchLocation.php?Usuario='+UserInput+'&IdMed='+queMED+'&Location='+location+'&Group='+onlyGroup;
    	   
            
            $("#stream_indicator").css("display", "block");
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
								        $('#TablaPac').html(RecTipo);
                                
                                        //alert('done');
                                       
										
							   }
										
							 },
				   error: function(data){
						 $('#TablaPac').html(RecTipo);
				   }
					
				});
				
                setTimeout(function(){ $("#stream_indicator").css("display", "none");},1000);
				 //$('#Wait1').hide();  
                //$('#TablaPac').trigger('update');
		
		  },500);
           
			
  	    
    });
        //End of new code added by Pallab for Search by Location

     $(".CFILA").live('click',function() {
     	var myClass = $(this).attr("id");
		var queMED = $("#MEDID").val();
		document.getElementById('UserHidden').value=myClass;
		//alert(document.getElementById('UserHidden').value);
		window.location.replace('patientdetailMED-new.php?IdUsu='+myClass);
		//alert("Here");
     	//window.location.replace('patientdetailMED.php');
		}); 
  
     /*
     $('#TablaPac').bind('click', function() {
          	
          	var NombreEnt = $('#NombreEnt').val();
            var PasswordEnt = $('#PasswordEnt').val();
                                   
          	window.location.replace('patientdetail.php?Nombre='+NombreEnt+'&Password='+PasswordEnt);

//      alert($(this).text());
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
    
    
    $( document ).ajaxStart(function() {
        //alert ('ajax start');
       $('#Wait1').show();
    });
    $( document ).ajaxStop(function() {
        $('#Wait1').hide();
    }); 

    $('#datatable_1 tbody').click( function () {
    // Alert the contents of an element in a SPAN in the first TD    
    alert( $('td:eq(0) span', this).html() );
    } );*/
    
    $('#Wait1').hide();  // hide it initially
 
    });  