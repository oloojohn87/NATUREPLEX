

	
$(document).ready(function() {
        var plan_selected = 0;
        Stripe.setPublishableKey("pk_test_YBtrxG7xwZU9RO1VY8SeaEe9");
        var cookieValue = $.cookie("inmers_hti");
        if (cookieValue == "main") {
            $('link[rel=stylesheet][href="css/loginCol.css"]').remove();
        }
        if($.browser.msie)
        {
            window.open('ie_error.html','_self',false);
        }
            
        $('.tooltip').tooltipster();
    
        $("#Year,#Month, #Day, #Gender, #OrderOB,#Vname,#Vsurname,#XPassword,#XPassword2,#email,#phone,#accesscode").bind("focusin",function(){
        
             removehighlightederrorfield($(this));
        
        });
       
        $('#Year').bind("focusout", function(){
	     CheckValor(1900,2020,$(this));
	     getIdUsFIXED();  		
   		});
        $('#Month').bind("focusout", function(){
	     CheckValor(1,12,$(this));
	     getIdUsFIXED();  		
   		});
        $('#Day').bind("focusout", function(){
	     CheckValor(1,31,$(this));
	     getIdUsFIXED();  		
   		});
        $('#Gender').bind("focusout change", function(){
  	      	var dato = $("#Gender").val();
	      	if (dato!='0' && dato!='1'){ alarma ('Please select appropriate gender','#Gender')}else{alarma ('','#Gender')}
	     getIdUsFIXED(); 
	      		
   		});
        $('#OrderOB').bind("focusout", function(){
            
	   	     CheckValor(0,5,$(this));
	   	     getIdUsFIXED();  		
   		});   
   		$('#Vname').bind("focus", function(){
	      	var dato = $("#Gender").val();
	      	if (dato!='0' && dato!='1'){ alarma ('Please select appropriate gender','#Gender')}
	      	return('abc');
   		});	

   		$('#Vname').bind("focusout", function(){
         CheckValorTipo(12,$(this));
         getIdUsFIXEDNAME();
   		});	
   		$('#Vsurname').bind("focusout", function(){
         CheckValorTipo(12,$(this));
	     getIdUsFIXEDNAME();
   		});			    
    
        $('#XPassword').bind("focusout", function(){
	     CheckValorTipo(11,$(this));
   		});
        $('#XPassword2').bind("focusout", function(){
	     CheckPass('#XPassword','#XPassword2');
	     CheckValorTipo(11,$(this));
   		});
      
        $('#email').bind("focusout", function(){
	     $('#IDRESERV').html($(this).val());
	     //CheckValorTipo(13,$(this));
         CheckValorTipo(15,$(this));    
	     /*if($('#ValorGlobal').val()!='-1'){
               
                alert('second validation');
                CheckPrevio (1,$(this));
            }*/
         });
  		
   		$('#accesscode').bind("focusout", function(){
			CheckValorTipo(14,$(this));
	     
   		});			
		
        //Phone number validation
        $("#phone").intlTelInput();
            
        $('#phone').bind("focusout", function(){
            
           // alert('validating Phone Number');
        
            if($("#phone").intlTelInput("isValidNumber")==false)
            {
                //alert('Invalid Phone Number');
                //$('#Phone').focus();
                //return;
                alarma ('Invalid Phone Number','#phone');
                $('#ValorGlobal').val('-1');
            }
            else
            {	
                //$('#Phone').val($('#Phone').val().replace(/-/g, '')); //remove dashes
                $('#phone').val($('#phone').val().replace(/\s+/g, '')); //remove spaces
                $('#ValorGlobal').val('0')
            }
        
        
        });
    
            var checktermscondition=0;
            //Adding terms and condition check box validation
            $('input[type=checkbox][id^="checkcol_terms"]').live('click',function() {
                // this represents the checkbox that was checked
	
               if($(this).is(':checked')){

                   checktermscondition=1;
                   alarma('You have read and agree to the terms of service and privacy policy','464');
               }else{

                    checktermscondition=0;
               }

            });
        $('.to_register').bind("click", function(){
              
                var cookieValue = $.cookie("inmers_hti");
                if (cookieValue == "col") {
                      url='http://www.hellodoctor.us/register';
                      window.location.assign(url);
                }    
                
        });
    
        function stripeResponseHandler(status, response) 
        {
        
            if (response.error) 
            {
                //console.log("There was an error with the credit card");
                //var mensagem = 'There was a problem with the credit card information.';     
			    //alert (mensagem);
			    var card_token = response.id;
                $("#CreditCardToken").val(response.id);
                console.log("Card Token: " + $("#CreditCardToken").val());
                $("#FormSU").submit();
            }
            else
            {
                var card_token = response.id;
                $("#CreditCardToken").val(response.id);
                console.log("Card Token: " + $("#CreditCardToken").val());
                $("#FormSU").submit();
            }
        }

        $('#BotonEnviaF').bind("click", function(){
	        var dato= 0;
	        var todos = 0;
	        
	        /*$('#Year').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#Month').trigger('focusout');
	       	dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#Day').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#Gender').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#OrderOB').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#Vname').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#Vsurname').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#XPassword2').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#XPassword').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        $('#email').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            $('#phone').trigger('focusout');
            dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            $('#accesscode').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}*/
            $('#Year').trigger('focusout');
	        dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
	        if(dato!=0){
                $('#Month').trigger('focusout');
	       	    dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#Day').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#Gender').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#OrderOB').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#Vname').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#Vsurname').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#XPassword2').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#XPassword').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#email').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#phone').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
            if(dato!=0){
                $('#accesscode').trigger('focusout');
                dato = $('#ValorGlobal').val(); if (dato!=0) {todos=1;}
            }
			
	        //if (todos!=1){$('#BotonMod').trigger('click');}
            if (todos!=1){
                if(checktermscondition==0){

                    alert('Please read the terms & privacy policy agreement and click the checkbox to finalise your account creation process with Health2Me','');

                }else{
                    console.log(plan_selected);
                    if(plan_selected != 0)
                    {
                        // validate credit card
                        var date = $('#credit_card_exp_date').val().split("-");
                        Stripe.card.createToken({
                            number: $('#credit_card_number').val(),
                            cvc: $('#credit_card_cvc').val(),
                            exp_month: date[1],
                            exp_year: date[0]
                        }, stripeResponseHandler);
                        
                    }
                    else
                    {
                        $("#FormSU").submit();
                        setTimeout(function(){
                        //$('#BotonMod').trigger('click');
                        //alert('A confirmation email has been sent, please check your email to confirm your account credentials.');
                        },1000);
                    }
                }
            
            }
    	});

        $('#GrabaDatos').bind("click", function(){
	        $('#FormSU').method="post";
			$('#FormSU').submit();
	    });
    
       
    
        $('#SignIn').bind("click", function(){
            
            $("#spin-icon").show();
            
            var url='validatelogin.php';
            
            setTimeout(function(){
                $.post( "validateloginUSER.php",{ Nombre: $("#Nombre").val(), Password: $("#loginPass").val()}).done(function( data ) {
                    console.log(data);
                    $("#spin-icon").hide();
                    if (data=='1'){


                        $('#FormLOGIN').method="post";
                        $('#FormLOGIN').submit();                
                    }else{
                        $( "#login_user" ).effect('shake', {distance: 60},90);
                        //alarma('Invalid userid or password','');
                    }
                });
            },500);
            
           // $('#FormLOGIN').method="post";
			//$('#FormLOGIN').submit();
                          
                          
        });
    
      //Added code to detect enter key in input fields while signIn
       $('#Nombre,#loginPass').keypress(function (e) {
             var key = e.which;
             
             if(key == 13)  // the enter key code
              {
                 //alert('key press'+key);
                $('#SignIn').trigger("click");
                 return false;  
              }
         });
        
        

        $('#ForgotPassword').bind("click", function(){ 
            
            $(".MsgStatus2").html('');
            $(".MsgStatus2").height(0);
            $('#ContenidoModal2').show();
            $('#Proceed').show();
            $('#CloseModal2').hide();
	     	$('#ContenidoModal2').html('<p>Please enter your email to reset password:</p><p><span><input id="ResPas" name="ResPas" type="text" class="last-input" placeholder="email" title="Please insert your email" style="padding-left:10px; margin-top:5px;" /></span><span id="icon_ok" style="margin-left:25px;color:#58b820;display:none;"><span style="margin-right:10px">Email Found</span><i class="icon-ok-circle icon-2x"></i></span><span id="icon_error" style="margin-left:25px;color:#f54f4f;display:none;"><span style="margin-right:10px">Invalid Email</span><i class="icon-remove-circle icon-2x"></i></span></p>');
          
	        $('#BotonMod2').trigger('click');
	        
        });
        
            var queEmail='';var RecTipo='';
            var loc1='';var subca1='';var queTip='';
            var loc2='';var subca2='';var IdUsFIXED='';
            var loc3='';var subca3='';var IdUsFIXEDNAME='';
            var loc4='';var subca4='';var IdUsRESERV='';
            
            var currentValue=''; var flag='0';
        
       /* $('#ResPas').keypress(function(){
            
             
                 queEmail = $(this).val();

                 alert(queEmail);

                if(flag=='1' && currentValue!=queEmail){
                    flag='0';
                }

                if(flag=='0'){
                 currentValue=queEmail;
                 flag='1';
                 var cadena = '/CheckPrevio2Pac.php?valor='+queEmail+'&queTipo=1';
                 RecTipo = LanzaAjax (cadena);

                 loc1 =   RecTipo.indexOf("#");
                 subca1 = RecTipo.substr(loc1+1);
                 queTip = RecTipo.substr(0, loc1);

                 loc2 =   subca1.indexOf("#");
                 subca2 = subca1.substr(loc2+1);
                 IdUsFIXED = subca1.substr(0, loc2);

                 loc3 =   subca2.indexOf("#");
                 subca3 = subca2.substr(loc3+1);
                 IdUsFIXEDNAME = subca2.substr(0, loc3);

                 loc4 =   subca3.indexOf("#");
                 subca4 = subca3.substr(loc4+1);
                 IdUsRESERV = subca3.substr(0, loc4);
                }

                 if((queTip==0)||(queTip>1)){
                     $('#icon_ok').hide();
                     $('#icon_error').show();
                 }else{
                     $('#icon_error').hide();
                     $('#icon_ok').show();
                 }
        
        });*/
   	   
   	    $('#Proceed').bind("click", function(){
            
                 queEmail = $('#ResPas').val();
                 var cadena = '/CheckPrevio2Pac.php?valor='+queEmail+'&queTipo=1';
                 RecTipo = LanzaAjax (cadena);
            /*
                 loc1 =   RecTipo.indexOf("#");
                 subca1 = RecTipo.substr(loc1+1);
                 queTip = RecTipo.substr(0, loc1);

                 loc2 =   subca1.indexOf("#");
                 subca2 = subca1.substr(loc2+1);
                 IdUsFIXED = subca1.substr(0, loc2);

                 loc3 =   subca2.indexOf("#");
                 subca3 = subca2.substr(loc3+1);
                 IdUsFIXEDNAME = subca2.substr(0, loc3);

                 loc4 =   subca3.indexOf("#");
                 subca4 = subca3.substr(loc4+1);
                 IdUsRESERV = subca3.substr(0, loc4);
                 */
            var queTip = parseInt(RecTipo);
    
	        /*
	        alert (RecTipo);
	        alert (queTip);
	        alert (IdUsFIXED);
		    alert (IdUsFIXEDNAME);
		    alert (IdUsRESERV);
            */
            
             //$('#ResPas').trigger('focusout');
	        
             
	        if (queTip==0)
	        {//alert ('Patient not found in database. Please try with another email address.');
                $('#icon_error').show();
                setTimeout(function() {nxtstep(queTip);},800);
            }
	        else
	        {
		        if (queTip>1){//alert ('More than one user for that email address. Please contact health2.me support.');
                        $('#icon_error').show();
                         setTimeout(function() {nxtstep(queTip);},800);
                        }
	        else{
                
                
                $('#icon_ok').show();
                nxtstep(queTip);
		        // ENVIO DE EMAIL DE RECORDATORIO
                
	         	}
	        }
	        
	        
        });
        $("#wrapper_user a").on('click', function()
        {
            if($(this).attr("href") == '#toplan')
            {
				plan_selected = 2;
                console.log("Go to register");
                $("#plan").animate({marginLeft: '-500px', opacity: '0.0'}, {duration: 400, easing: 'easeInOutQuad', complete: function()
                {
                    $("#plan").css("margin-left", "0px");
                    $("#plan").css("display", "none");
                }});
                $("#register_user").css("display", "block");
                $("#register_user").animate({opacity: '1.0'}, {duration: 400, easing: 'easeInOutQuad'});
            }
            else if($(this).attr("href") == '#toregister')
            {
                console.log("Go to register");
                $("#plan").animate({marginLeft: '-500px', opacity: '0.0'}, {duration: 400, easing: 'easeInOutQuad', complete: function()
                {
                    $("#plan").css("margin-left", "0px");
                    $("#plan").css("display", "none");
                }});
                $("#register_user").css("display", "block");
                $("#register_user").animate({opacity: '1.0'}, {duration: 400, easing: 'easeInOutQuad'});
            }
            else if($(this).attr("href") == '#tologin')
            {
                console.log("Go to login");
                $("#register_user").animate({marginLeft: '-500px', opacity: '0.0'}, {duration: 400, easing: 'easeInOutQuad', complete: function()
                {
                    $("#register_user").css("margin-left", "300px");
                    $("#register_user").css("display", "none");
                }});
                $("#login_user").css("display", "block");
                $("#login_user").animate({opacity: '1.0'}, {duration: 400, easing: 'easeInOutQuad'});
            }
        });
    
    
        $("#plan a").on('click', function()
        {
            if($(this).attr("id") == 'free_plan')
            {
                console.log('free plan selected');
                $("#billing_section").css("display", "none");
                plan_selected = 0;
            }
            else if($(this).attr("id") == 'premium_plan')
            {
                console.log('premium plan selected');
                $("#billing_section").css("display", "block");
                plan_selected = 1;
                $("#Plan").val(1);
            }
            else if($(this).attr("id") == 'family_plan')
            {
                console.log('family plan selected');
                $("#billing_section").css("display", "block");
                plan_selected = 2;
            }
            $("#PlanValue").val(plan_selected);
            console.log($("#PlanValue").val());
        });
            
            
         function nxtstep(val){
              setTimeout(function() {
               $('#ContenidoModal2').hide();
               $('#Proceed').hide();
               $('#CloseModal2').show();
                           
              if(val==0){
                   showstatus('Patient not found in database. Please try with another email address.');
              }else if(val>1){
                  
                   showstatus('More than one user for that email address. Please contact health2.me support.');
              }else{
                    var cadena = '/ResetUserPac.php?email='+queEmail;
                        //alert (cadena);
                        var RecTipo2 = LanzaAjax (cadena);
                        //alert(RecTipo2);
                        //var mensaje = 'Email already exist';
                         showstatus(RecTipo2);
              }
                

                             
                         }, 50);
         }
            
   	    $('#Wait1')
   	    	.hide()  // hide it initially
   	    	.ajaxStart(function() {
	   	    	//alert ('ajax start');
	   	    	$('#Wait1').show();
	   	    	$(this).show();
	   	    	})
	   	    .ajaxStop(function() {
		   	    $(this).hide();
		}); 
   	 function validateEmail(emailid) {
         
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if( !emailReg.test( emailid )|| emailid == '' ) {
            return false;
        } else {
            return true;
        }
     }	
     function CheckValor(minimo, maximo,selector){
	     var dato = $(selector).val();
	     var quevalor = dato;
	     var pasa = 1;
	     if (!form_input_is_numeric(dato)){
		     var mensaje = 'Value not numeric';
		     alarma (mensaje,selector);
		     quevalor = '';
		     pasa = 0;
		     $('#ValorGlobal').val('-1');
            highlighterrorfield(selector);
	     }

	     if (dato>maximo){
		     var mensaje = 'Value too high';
		     alarma (mensaje,selector);
		     quevalor = '';
		     pasa =0;
		     $('#ValorGlobal').val('-1');
            highlighterrorfield(selector);
	     }	

	     if (dato<minimo){
		     var mensaje = 'Value too low';
		     alarma (mensaje,selector);
		     quevalor = '';
		     pasa =0;
		     $('#ValorGlobal').val('-1');
             highlighterrorfield(selector);
	     }	

	     if (pasa==1) {alarma('',selector); $('#ValorGlobal').val('0'); }
	     $(selector).val(quevalor);
	 }
     
     function CheckValorTipo(tipo,selector){
	     var dato = $(selector).val();
	     var quevalor = dato;
	     var pasa = 1;
	     if (tipo>10){
		     switch (tipo){
				 case 11: if (dato.length<8)   // 11: COMPRUEBA QUE LA LONGITUD SEA AL MENOS DE 8 CARACTERES
				 		  {
				 		  var mensaje = 'Value must be at least 8 characters long';
			     		  alarma (mensaje,selector);
			     		  quevalor = '';
			     		  pasa = 0;
			     		  $('#ValorGlobal').val('-1');
                          highlighterrorfield(selector);
			     		  }
			     		  break;
				 case 12: if (dato.length<2)   // 12: COMPRUEBA QUE LA LONGITUD SEA AL MENOS DE 2 CARACTERES
				 		  {
				 		  var mensaje = 'Value must be at least 2 characters long';
			     		  alarma (mensaje,selector);
			     		  quevalor = '';
			     		  pasa = 0;
			     		  $('#ValorGlobal').val('-1');
			     		  highlighterrorfield(selector);
                          }
			     		  break;
				 case 13: if (dato.length<6)   // 13: COMPRUEBA QUE LA LONGITUD SEA AL MENOS DE 6 CARACTERES
				 		  {
				 		  var mensaje = 'Value must be at least 6 characters long';
			     		  alarma (mensaje,selector);
			     		  quevalor = '';
			     		  pasa = 0;
			     		  $('#ValorGlobal').val('-1');
                          highlighterrorfield(selector);
			     		  }
			     		  break;
				 case 14: var RecTipo=LanzaAjax ("CheckPrivateCode.php?code="+dato);
						  if(RecTipo=='false'){
							var mensaje = 'Invalid Access Code';
						    alarma(mensaje,selector);
							quevalor='';
							pasa=0;
							$('#ValorGlobal').val('-1');
                            highlighterrorfield(selector);
						  }
						  break;
                 case 15: if (validateEmail(dato)==false)   // check for valid email format
				 		  { 
                          //alert('validation falied');
				 		  var mensaje = 'Value must be a valid email format';     
			     		  alarma (mensaje,selector);
			     		  quevalor = '';
			     		  pasa = 0;
			     		  $('#ValorGlobal').val('-1');
                          highlighterrorfield(selector);
			     		  }
                          break;
			     default: var mensaje = 'Unknown error';
			     		  alarma (mensaje,selector);
			     		  quevalor = '';
			     		  pasa = 0; 
			     		  $('#ValorGlobal').val('-1');
			     		  break;		  
			     
		     }
	     }

	     if (pasa==1) {alarma('',selector); $('#ValorGlobal').val('0'); }
	     $(selector).val(quevalor);
	 }

     function CheckPass(selector1,selector2){
     	var dato1 = $(selector1).val();
        var dato2 = $(selector2).val(); 
        if (dato1 != dato2)
        {
	       	 var mensaje = 'Values must be the same';
		     alarma (mensaje,selector1);
		     alarma (mensaje,selector2);
             highlighterrorfield(selector1);
             highlighterrorfield(selector2);
		     quevalor = '';
			 $('#ValorGlobal').val('-1');
             highlighterrorfield(selector);
        }	     else{
		     alarma ('',selector1);
		     alarma ('',selector2);
		     $('#ValorGlobal').val('0'); 
	     }

     	//var dato = pass1.length; 
      
	 }
	
	 /*function CheckPrevio(tipo,selector){
	     var dato = $(selector).val();
	     var quevalor = dato;
	     var pasa = 1;
	     
	     var queTipo=1;
	     var cadena = 'CheckPrevioPac.php?valor='+dato+'&queTipo='+queTipo;
	     var RecTipo = LanzaAjax (cadena);
	    
	     //alert (RecTipo);
	     
	     if (RecTipo>0){
		     var mensaje = 'Patient/Value already exists';
		     alarma (mensaje,selector);
		     quevalor = '';
		     pasa = 0;
		     $('#ValorGlobal').val('-1');
	     }

	     if (pasa==1) {alarma('',selector); $('#ValorGlobal').val('0'); }
	     $(selector).val(quevalor);
	 }*/
            
      function CheckPrevio(tipo,selector){
	     var dato = $(selector).val();
	     var quevalor = dato;
	     var pasa = 1;
	     
	     var queTipo=1;
        if (dato != ''){
	     var cadena = 'CheckPrevioPac.php?valor='+dato+'&queTipo='+queTipo;
	     var RecTipo = LanzaAjax (cadena);
	    
             if (RecTipo>0){
                 var mensaje = 'Email already exists';
                 alarma (mensaje,selector);
                 quevalor = '';
                 pasa = 0;
                 $('#ValorGlobal').val('-1');
                  highlighterrorfield(selector);
             }
       
            
        }else {
          pasa=1;
         }
	     if (pasa==1) {alarma('',selector); $('#ValorGlobal').val('0'); }
	     $(selector).val(quevalor);
	 }
    
    
    
     function highlighterrorfield(selectr){
         // alert('error'); 
         $(selectr).css('border', '2px solid rgb(232, 58, 60)'); 
    
     }
    
    function removehighlightederrorfield(selectr){
         // alert('error'); 
         $(selectr).css('border', ''); 
    
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


	 function alarma(mensaje,selector)
	 {
	/* if (mensaje=='') { var tama = '0px'; $(selector).css ('background-color','white'); }else { var tama = '40px'; $(selector).css ('background-color','#FFF8DC'); }
	 
	 $('.MsgAlarma2').animate({
		    height: tama
		      }, 500, function() {
			      $(".MsgAlarma2").html('<p style="font-size:18px; color:white; margin:10px; top:10px; position:relative;">'+mensaje+'</p>');
		});*/
         
          $("#error_msg").html('');
          $("#close_error_bar").show();
         
          if(selector=='464'){
            $('#error_bar').css('background-color','#0590d0');
          }
         
           if (mensaje=='') {
           }else{
                    $("#error_msg").html('<p style="font-size:18px; color:white;text-align:center">'+mensaje+'</p>')
                  
                    if(selector=='464'){
                        
                         $("#close_error_bar").hide();   
                    }
               
                  //else{
                        
                    
                      /*  $('#error_bar').slideDown('slow', function () {
                        // Animation complete.
                        });*/
                   // }
               
                         $('#error_bar').fadeIn('slow');
                         $('#error_bar').fadeOut(2000);

                    $('html,body').animate({
                            scrollTop: $("#error_bar").offset().top},
                    'slow');
            }
	 }
    
    
     $("#close_error_bar").bind("click", function(){
     

         //$("#error_bar").slideUp('slow');
         //$("#error_msg").html('');
     
     });
           
            
    
	 function showstatus(statusmsg){
         
         //if (statusmsg=='') { var tama = '0px'; $(selector).css ('background-color','white'); }else { var tama = '40px'; $(selector).css ('background-color','#FFF8DC'); }
     
        if (statusmsg=='') { var tama = '0px';}else{ var tama = '60px';}
         
        
         $('.MsgStatus2').animate({
		    height: tama
		      }, 500, function() {
			      $(".MsgStatus2").html('<p style="font-size:18px; color:white; margin:10px; top:10px; position:relative;">'+statusmsg+'</p>');
		});
     
     }

     function getIdUsFIXED(){
    		var year = $("#Year").val();
    		var month = $("#Month").val();
    		var day = $("#Day").val();
    		
    		var fnacnum = year+FormatNumberLength(month, 2)+FormatNumberLength(day, 2);
    		var gender = chkb($("#Gender").is(':checked'));
   		
    		var gender = $("#Gender").val();
    		var orderOB = $("#OrderOB").val();
    		if (gender==0){ gender='0';}
    		if (orderOB==0){ orderOB='0';}
   		
    		var VIdUsFIXED = fnacnum+gender+orderOB;
   			$('#VIdUsFIXED').html(VIdUsFIXED);
   			$('#VIdUsFIXED2').html(VIdUsFIXED);
   			$('#VIdUsFIXEDINSERT').val(VIdUsFIXED);
   		
    	}
 
     function getIdUsFIXEDNAME(){
    		var vname = $("#Vname").val().toLowerCase().replace(".","").replace(" ","");
    		var vsurname = $("#Vsurname").val().toLowerCase().replace(".","").replace(" ","");
    		
    		var VIdUsFIXEDNAME = vname+'.'+vsurname;
    		$('#VIdUsFIXEDNAME').html(VIdUsFIXEDNAME);
    		$('#VIdUsFIXEDNAME2').html(VIdUsFIXEDNAME);
    		$('#VIdUsFIXEDNAMEINSERT').val(VIdUsFIXEDNAME);
    	}

    function chkb(bool){
	    if(bool)
	    	return 1;
	    	return 0;
	   }
	 
	function form_input_is_numeric(input){
		   return !isNaN(input);
		   }
      
	function FormatNumberLength(num, length) {
    	var r = "" + num;
    	while (r.length < length) {
        	r = "0" + r;
        	}
        return r;
        }
    
    var parameters = window.location.href.split('?');
    var temp = parameters[1].split('&');
    var notesAndSummary = temp[0].split('=')[1];
    var consultationId = temp[1].split('=')[1];
    if(temp[0].split('=')[0]=='NotesAndSummary'){    
           flag=1;
    }
    if(parameters[1].length != 0 && flag==1)
    {
        $.post("get_consultation_patient.php", {id: consultationId}, function(data, status)
        {
            $("#Nombre").val(data);
            $("#Nombre").prop('readonly', true);
            $("#inputs").append('<input type="hidden" value="'+notesAndSummary+'" name="notesAndSummary" id="notesAndSummary"/>');
            $("#inputs").append('<input type="hidden" value="'+consultationId+'"name="consultationId" id="consultationId"/>');
        });
    }
        
    //Code for checking whether NotesAndSummary flag is set or not. If set adding the hidden input fields to the form of loginUSER.php - Pallab
    //$("#SignIn").on('click', function()
    //{
       
       
       
    //});  
       

    });

   
