<?php
include("userConstructClass.php");
$user = new userConstructClass();
$user->pageLinks('dropzone_short.php');

require_once("environment_detailForLogin.php");

 $dbhost = $env_var_db['dbhost'];
 $dbname = $env_var_db['dbname'];
 $dbuser = $env_var_db['dbuser'];
 $dbpass = $env_var_db['dbpass'];
 
 					// Connect to server and select databse.
$con = new PDO('mysql:host='.$dbhost.';dbname='.$dbname.';charset=utf8', ''.$dbuser.'', ''.$dbpass.'', array(PDO::ATTR_EMULATE_PREPARES => false, 
                                                                                                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
  
$patient_id = $_GET['IdUsu'];

// Meter tipos en un Array
     $sql=$con->prepare("SELECT * FROM tipopin");
     $q = $sql->execute();
     
     $Tipo[0]='N/A';
     while($row=$sql->fetch(PDO::FETCH_ASSOC)){
     	$Tipo[$row['Id']]=$row['NombreEng'];
     	$TipoAB[$row['Id']]=$row['NombreCorto'];
     	$TipoColor[$row['Id']]=$row['Color'];
     	$TipoIcon[$row['Id']]=$row['Icon'];
     	
     	$TipoColorGroup[$row['Agrup']]=$row['Color'];
     	$TipoIconGroup[$row['Agrup']]=$row['Icon'];
     }

	 $query = $con->prepare("select * from emr_config where userid = ?");
	 $query->bindValue(1, $user->med_id, PDO::PARAM_INT);
	 
	 
$result = $query->execute();
$row = $query->fetch(PDO::FETCH_ASSOC); 


$pat = $con->prepare("select idusfixedname from usuarios where identif=?");
$pat->bindValue(1, $patient_id, PDO::PARAM_INT);
$pat->execute();

$pat_name=$pat->fetch(PDO::FETCH_ASSOC);
$patient_name = $pat_name['idusfixedname'];
			
			
			
			
?>  
	<script src='js/dropzone.min.js'></script>
	<script src="js/jquery-1.9.1-autocomplete.js"></script>
	<script src="js/jquery-ui-autocomplete.js"></script>
    
    <script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-37863944-1']);
  _gaq.push(['_setDomainName', 'health2.me']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
	
</script>

  </head>
  <body>
<div class="loader_spinner"></div>
<!--------------------------------------------------------------------------------------------------HIDDEN INPUTS-------------------------------------------------------------------------->
     	<input type="hidden" id="MEDID" Value="<?php echo $user->med_id; ?>">	
    	<input type="hidden" id="IdMEDEmail" Value="<?php echo $user->doctor_email; ?>">	
    	<input type="hidden" id="IdMEDName" Value="<?php echo $user->doctor_first_name; ?>">	
    	<input type="hidden" id="IdMEDSurname" Value="<?php echo $user->doctor_last_name; ?>">	
    	<input type="hidden" id="IdMEDLogo" Value="<?php echo $MedUserLogo; ?>">	
     	<input type="hidden" id="USERDID" Value="<?php echo $patient_id; ?>">	
		<input type="hidden" id="patientid" Value="<?php echo $patient_id; ?>">
		<input type="hidden" id="patientname" Value="<?php echo $patient_name; ?>" >
<!-----------------------------------------------------------------------------------------------END OF HIDDEN INPUTS----------------------------------------------------------------------->
      <link rel='stylesheet' href='css/bootstrap-dropdowns.css'>
        <style>
            .addit_button{
                background: transparent;
                color: whitesmoke;
                text-shadow: none;
                border: 1px solid #E5E5E5;
                font-size: 12px !important;
                height: 20px;
                line-height: 12px;      
            }
            .addit_caret{
               border-top: 4px solid whitesmoke;
               margin-top: 3px !important;
               margin-left: 5px !important;
            }  
        </style>
	<!--Header Start-->
	<div class="header" >
    	
           <a href="index.html" class="logo"><h1>health2.me</h1></a>
		   
		   <div style="margin-top:11px;float:left; margin-left:50px;" class="btn-group">
                      <button id="lang1" type="button" class="btn btn-default dropdown-toggle addit_button" data-toggle="dropdown">
                        Language <span class="caret addit_caret"></span>
                      </button>
                      <ul class="dropdown-menu" role="menu">
                        <li><a href="#en" onclick="setCookie('lang', 'en', 30); return false;">English</a></li>
                        <li><a href="#sp" onclick="setCookie('lang', 'th', 30); return false;">Espa&ntilde;ol</a></li>
                        <li><a href="#tu" onclick="setCookie('lang', 'tu', 30); return false;">T&uuml;rk&ccedil;e</a></li>
                        <li><a href="#hi" onclick="setCookie('lang', 'hi', 30); return false;">हिंदी</a></li>
                      </ul>
                </div>
            <!--
             <script>
               var langType = $.cookie('lang');

                if(langType == 'th')
                {
                    var language = 'th';
                    $("#lang1").html("Espa&ntilde;ol <span class=\"caret addit_caret\"></span>");
                }
                else if(langType == 'tu')
                {
                    var language = 'tu';
                    $("#lang1").html("T&uuml;rk&ccedil;e <span class=\"caret addit_caret\"></span>");
                }
                 else if(langType == 'hi')
                {
                    var language = 'hi';
                    $("#lang1").html("हिंदी <span class=\"caret addit_caret\"></span>");
                }
                else{
                    var language = 'en';
                    $("#lang1").html("English <span class=\"caret addit_caret\"></span>");
                }
            </script>
-->
           <div class="pull-right">
           
            
           <!--Button User Start-->
		   <div class="btn-group pull-right" >
           
            <a class="btn btn-profile dropdown-toggle" id="button-profile" data-toggle="dropdown" href="#">
              <span class="name-user"><strong>Welcome</strong> Dr, <?php echo $user->doctor_first_name.' '.$user->doctor_last_name; ?></span> 
             <?php 
             $hash = md5( strtolower( trim( $user->doctor_email ) ) );
             $avat = 'identicon.php?size=29&hash='.$hash;
			?>	
              <span class="avatar" style="background-color:WHITE;"><img src="<?php echo $avat; ?>" alt="" ></span> 
              <span class="caret"></span>
            </a>
            <div class="dropdown-menu" id="prof_dropdown">
            <div class="item_m"><span class="caret"></span></div>
            <ul class="clear_ul" >
              <li><a href="MainDashboard.php"><i class="icon-globe"></i> Home</a></li>
              
              <li><a href="medicalConfiguration.php"><i class="icon-cog"></i> Settings</a></li>
              <li><a href="logout.php"><i class="icon-off"></i> Sign Out</a></li>
            </ul>
            </div>
          </div>
          <!--Button User END-->  
          
          </div>
    </div>
    <!--Header END-->

    <!--Content Start-->
	<div id="content" style="padding-left:0px;">

	  
	  <!--- VENTANA MODAL  ---> 
	  
	  <!--- VENTANA MODAL  for Records Board---> 
   	  <!--<button id="BotonModal1" data-target="#header-modal1" data-toggle="modal" class="btn btn-warning" style="display: none;">Modal with Header</button>
   	  <div id="header-modal1" class="modal hide" style="display:none;height:700px;width:1380px;margin-left:-700px;margin-top:-350px" aria-hidden="true">
         <div class="modal-header">
             <button class="close" type="button" data-dismiss="modal">×</button>
                  Report Verification
         </div>
         <div class="modal-body" style="height:700px">
			 <p>Patient Name :  <input type="text" id="patient_name" >
			    Report Type  :  <select name="reptype" id="reptype" >
									<option value="60">Summary and Demographics</option>
									<option value="30">Doctors Notes</option>
									<option value="20">Laboratory</option>
									<option value="1">Imaging</option>
									<option value="76">Pat. Notes</option>
									<option value="74">Pictures</option>
									<option value="77">Superbill</option>
									<option value="70">Other</option>
								</select>
			</p>
             <p>Please enter a Report Date : 
			 <input type="text" id="datepicker2" ></p>
			<input type="button" style="margin-top:100px" id="previous" value="Previous">
			 <input type="button" style="margin-top:100px" id="next" value="Next" onClick="next_click();">
			<div class="grid-content" id="AreaConten">
             		<img id="ImagenAmp" src="">
            </div>
			
		 </div>
		 
         <input type="hidden" id="idpin">
         <!--<div class="modal-footer" >
	         <input type="button" class="btn btn-success" value="Confirm" id="ConfirmaLink">
			 <a href="#" class="btn btn-primary" data-dismiss="modal" id="CloseModal">Close</a>
         </div>
      </div>  
	  <!--- VENTANA MODAL for Records Board ---> 


	  <!--SpeedBar Start--->
     <div class="speedbar">
     <div class="speedbar-content">
     <ul class="menu-speedbar">
		
    	 <li><a href="MainDashboard.php">Home</a></li>
		 <li><a href="dashboard.php" >Dashboard</a></li>
    	 <li><a href="patients.php" class="act_link">Patients</a></li>
		 <?php if ($user->doctor_privilege==1)
		 {
				 echo '<li><a href="medicalConnections.php" >Doctor Connections</a></li>';
				 echo '<li><a href="PatientNetwork.php" >Patient Network</a></li>';
		 }
		 ?>
         <li><a href="medicalConfiguration.php">Configuration</a></li>
         <li><a href="logout.php" style="color:yellow;">Sign Out</a></li>
     </ul>

     
     </div>
     </div>
     <!--SpeedBar END-->
     
     
     <!--CONTENT MAIN START-->
	 <div class="content">
		<!-- Pop up PastDX Start-->
			<button id="BotonPastDX" data-target="#header-modal" data-toggle="modal" class="btn btn-warning" style="display: none;">Modal with Header</button>
				<div id="header-modal" class="modal hide" style="display: none; height:300px; width:400px; margin-left:-200px;" aria-hidden="true">
				<div class="modal-header">
					<button class="close" type="button" data-dismiss="modal">×</button>
					<div id="InfB" >
	                 	<h4>Past Diagnostics</h4>
					</div>
        		</div>
         		<div class="modal-body" id="ContenidoModal" style="height:150px;">
					<center>
					<table style="background:transparent; height:150px;" >
						<tr>
							<td style="height:24px;">Diagnostic Name : </td>
							<td style="height:24px;"><input id="DXName"  /></td>
						</tr>
								
						<tr>
							<td style="height:24px;">ICD Code:</td>
							<td style="height:24px; "> <input id="icdcode" ></td> 
						</tr>
					
						<tr >
							<td style="height:24px">Start Date: </td>
							<td style="height:24px;"><input id="DXStartDate"  /></td>
						</tr>
						
						<tr>
							<td style="height:24px;">End Date: </td>
							<td style="height:24px;"><input id="DXEndDate"/></td>
						</tr>
					
					</table>
					</center>
					
					
				</div>
				<div class="modal-footer">
			
					<a href="#" class="btn btn-success" data-dismiss="modal" id="UpdatePastDX">Update Data</a>
					<a href="#" class="btn btn-primary" data-dismiss="modal" id="CloseModal">Close</a>
				</div>
			</div>  
			<!--Pop up PastDX End-->
			
			
			<!-- Pop up Medication Start-->
			<button id="BotonMedication" data-target="#header-modal1" data-toggle="modal" class="btn btn-warning" style="display: none;">Modal with Header</button>
				<div id="header-modal1" class="modal hide" style="display: none;  width:400px; margin-left:-200px;" aria-hidden="true">
				<div class="modal-header">
					<button class="close" type="button" data-dismiss="modal">×</button>
					<div id="InfB" >
	                 	<h4>Medication</h4>
					</div>
        		</div>
         		<div class="modal-body" id="ContenidoModal" style="height:300px;">
					<center>
					<table style="background:transparent; height:300px;" >
						<tr>
							<td style="height:24px;">Drug Name : </td>
							<td style="height:24px;"><input id="DrugName"  /></td>
						</tr>
								
						<tr>
							<td style="height:24px;">Drug Code:</td>
							<td style="height:24px; "> <input id="DrugCode" ></td> 
						</tr>
						
						<tr>
							<td style="height:24px;">Dossage : </td>
							<td style="height:24px;"><input id="Dossage"  /></td>
						</tr>
								
						<tr>
							<td style="height:24px;">Number per Day:</td>
							<td style="height:24px; "> <input id="NumPerDay" ></td> 
						</tr>
					
						<tr >
							<td style="height:24px">Start Date: </td>
							<td style="height:24px;"><input id="MedicationStartDate"  /></td>
						</tr>
						
						<tr>
							<td style="height:24px;">Stop Date: </td>
							<td style="height:24px;"><input id="MedicationEndDate"/></td>
						</tr>
					
					</table>
					</center>
					
					
				</div>
				<div class="modal-footer">
			
					<a href="#" class="btn btn-success" data-dismiss="modal" id="UpdateMedication">Update Data</a>
					<a href="#" class="btn btn-primary" data-dismiss="modal" id="CloseModal">Close</a>
				</div>
			</div>  
			<!--Pop up Medication End-->
			
			<!-- Pop up Immunization Start-->
			<button id="BotonImmunization" data-target="#header-modal2" data-toggle="modal" class="btn btn-warning" style="display: none;">Modal with Header</button>
				<div id="header-modal2" class="modal hide" style="display: none;  width:400px; margin-left:-200px;" aria-hidden="true">
				<div class="modal-header">
					<button class="close" type="button" data-dismiss="modal">×</button>
					<div id="InfB" >
	                 	<h4>Immunization</h4>
					</div>
        		</div>
         		<div class="modal-body" id="ContenidoModal" style="height:200px;">
					<center>
					<table style="background:transparent; height:200px;" >
						<tr>
							<td style="height:24px;">Name : </td>
							<td style="height:24px;"><input id="IName"  /></td>
						</tr>

						<tr >
							<td style="height:24px">Date: </td>
							<td style="height:24px;"><input id="IDate"  /></td>
						</tr>
						
						<tr>
							<td style="height:24px;">Age :</td>
							<td style="height:24px; "> <input id="IAge" ></td> 
						</tr>
						
						<tr>
							<td style="height:24px;">Reaction :</td>
							<td style="height:24px; "> <input id="IReaction" ></td> 
						</tr>
					</table>
					</center>
					
					
				</div>
				<div class="modal-footer">
			
					<a href="#" class="btn btn-success" data-dismiss="modal" id="UpdateImmunization">Update Data</a>
					<a href="#" class="btn btn-primary" data-dismiss="modal" id="CloseModal">Close</a>
				</div>
			</div>  
			<!--Pop up Immunization End-->
			
			
			<!-- Pop up Allergy Start-->
			<button id="BotonAllergy" data-target="#header-modal3" data-toggle="modal" class="btn btn-warning" style="display: none;">Modal with Header</button>
				<div id="header-modal3" class="modal hide" style="display: none;  width:400px; margin-left:-200px;" aria-hidden="true">
				<div class="modal-header">
					<button class="close" type="button" data-dismiss="modal">×</button>
					<div id="InfB" >
	                 	<h4>Allergy</h4>
					</div>
        		</div>
         		<div class="modal-body" id="ContenidoModal" style="height:200px;">
					<center>
					<table style="background:transparent; height:200px;" >
						<tr>
							<td style="height:24px;">Allergy Name : </td>
							<td style="height:24px;"><input id="AName"  /></td>
						</tr>

						<tr >
							<td style="height:24px">Type: </td>
							<td style="height:24px;"><input id="AType"  /></td>
						</tr>
						
						<tr>
							<td style="height:24px;">Date Recorded :</td>
							<td style="height:24px; "> <input id="ADate" ></td> 
						</tr>
						
						<tr>
							<td style="height:24px;">Description :</td>
							<td style="height:24px; "> <input id="Description" ></td> 
						</tr>
					</table>
					</center>
					
					
				</div>
				<div class="modal-footer">
			
					<a href="#" class="btn btn-success" data-dismiss="modal" id="UpdateAllergy">Update Data</a>
					<a href="#" class="btn btn-primary" data-dismiss="modal" id="CloseModal">Close</a>
				</div>
			</div>  
			<!--Pop up Allergy End-->

	 
	      
	     <div class="grid" class="grid span4" style="width:1150px; margin: 0 auto; margin-top:30px; padding-top:30px;">

		 <span class="label label-info" style="left:0px; margin-left:30px; font-size:30px;">Dropzone</span>
         <div style="margin:10px; margin-top:20px;" >     
			<table align="center" border="0" cellpadding="0" cellspacing="0">
			<tr><td> 
			<!-- Smart Wizard -->
        
			<div id="wizard" class="swMain" style="display:none;width:1100px">
				
				<ul>
					
					<li><a href="#step-1">
						<label class="stepNumber">1</label>
						<span class="stepDesc">
						Step 1<br />
						<small>Drop Files</small>
						</span>
					</a></li>
					<li><a href="#step-2">
						<label class="stepNumber">2</label>
						<span class="stepDesc">
						Step 2<br />
						<small>Verify Details</small>
						</span>                   
					</a></li>
  				</ul>
				
  			
				
				<div id="step-1">
					<h2 class="StepTitle">Drop Files <label align="right" id="upload_count_label" style="color:red;"></label></h2>	
					<center>
						<table style="margin-top:10px;">
						<tr>
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;margin-top:0px">
								<center></center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone1" style="background:green;height:30px; width:auto; overflow:auto;margin-top:0px"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[6] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Demographics</center></form>
							</div>
							</td>
			
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;margin-top:0px;  opacity:1;">
								<center></center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone2" style="background:<?php echo $TipoColorGroup[3] ?>; height:30px; width:auto;overflow:auto; margin-top:0px; text-align:center;"><center style=" font-size:22px; opacity:1;"><i class="<?php echo $TipoIconGroup[3] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Doctors Notes</center></form>
							</div>
							</td>
			
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;margin-top:0px">
								<center></center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone3" style="background:<?php echo $TipoColorGroup[2] ?>; height:30px; width:auto; overflow:auto; margin-top:0px; opacity:1; text-align:center;"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[2] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Laboratory</center></form>
							</div>
							</td>
						</tr>
		
				
						<tr>
							<td>
							<div id="dropzone" style="background: #cacaca; height:30px; width:290px;">
								<center>Imaging</center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone4" style="background:<?php echo $TipoColorGroup[1] ?>;height:30px; width:auto; overflow:auto;margin-top:200px; text-align:center;"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[1] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Imaging</center></form>
							</div>
							</td>
			
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;">
								<center>Pat. Notes</center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone5" style="background:<?php echo $TipoColorGroup[8] ?>; height:30px; width:auto; overflow:auto; margin-top:200px"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[8] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Pat. Notes</center></form>
							</div>
							</td>
			
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;">
								<center>Pictures</center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone6" style="background:<?php echo $TipoColorGroup[7] ?>; height:30px; width:auto; overflow:auto; margin-top:200px"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[7] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Pictures</center></form>
							</div>
							</td>
						</tr>
		
						<tr>
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;">
								<center>SuperBill</center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone7" style="background:<?php echo $TipoColorGroup[9] ?>;height:30px; width:auto; overflow:auto;margin-top:410px"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[9] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Superbill</center></form>
							</div>
							</td>
			
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;">
								<center>Summary</center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone8" style="background:<?php echo $TipoColorGroup[6] ?>; height:30px; width:auto;overflow:auto;  margin-top:410px"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[6] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Summary</center></form>
							</div>
							</td>
			
							<td>
							<div id="dropzone" style="background: #F9F9F9; height:30px; width:290px;">
								<center>Other</center>
								<form action="upload_dropzone.php" method="post" class="dropzone" id="myAwesomeDropzone9" style="background:<?php echo $TipoColorGroup[4] ?>; height:30px; width:auto; overflow:auto;  margin-top:410px"><center style="color:white; font-size:22px;"><i class="<?php echo $TipoIconGroup[4] ?> icon-2x" style="color:white;"></i>&nbsp;&nbsp;Other</center></form>
							</div>
							</td>
						</tr>
		
		
					</table>
					</center>
				</div>                      
				<div id="step-2">
					<h2 class="StepTitle">Report Verification<label align="right" id="verified_count_label" style="color:red;"></label></h2>	
					<center>
					<br>
							<p>Patient Name :  <input type="text" id="patient_name" disabled>
							Report Type  :  <select name="reptype" id="reptype" >
									<option value="60">Summary and Demographics</option>
									<option value="30">Doctors Notes</option>
									<option value="20">Laboratory</option>
									<option value="1">Imaging</option>
									<option value="76">Pat. Notes</option>
									<option value="74">Pictures</option>
									<option value="77">Superbill</option>
									<option value="70">Other</option>
								</select>
							</p>
							<p>Please enter a Report Date : 
							<input type="text" id="datepicker2" ></p>
							<input type="hidden" id="idpin">
							<table>
								<tr>
									
									<td><input type="button"  id="previous" value = "Previous" onClick="previous_click();"></td>
									<td><div class="grid-content" id="AreaConten">
											<img id="ImagenAmp" src="">
										</div>
									</td>
									
									<td><input type="button"  id="next"   value="Next" onClick="next_click();"></td>
							    </tr>
							</table>
					</center>
				</div>
  			
			</div>
			<!-- End SmartWizard Content -->  		
 		
			</td></tr>
			</table>
		</div>

        
  
     </div>
     <!--CONTENT MAIN END-->
     
	 </div> 
    </div>
    <!--Content END-->
   <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    
	
	<script src="js/jquery.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
	
    <script type="text/javascript" src="js/h2m_dropzone_short.js"></script>


    <script src="js/bootstrap.min.js"></script>
    <script src="js/bootstrap-datepicker.js"></script>
    <script src="js/bootstrap-colorpicker.js"></script>
    <script src="js/google-code-prettify/prettify.js"></script>
   
    <script src="js/jquery.flot.min.js"></script>
    <script src="js/jquery.flot.pie.js"></script>
    <script src="js/jquery.flot.orderBars.js"></script>
    <script src="js/jquery.flot.resize.js"></script>
    <script src="js/graphtable.js"></script>
    <script src="js/fullcalendar.min.js"></script>
    <script src="js/chosen.jquery.min.js"></script>
    <script src="js/autoresize.jquery.min.js"></script>
    <script src="js/jquery.tagsinput.min.js"></script>
    <script src="js/jquery.autotab.js"></script>
    <script src="js/elfinder/js/elfinder.min.js" charset="utf-8"></script>
	<script src="js/tiny_mce/tiny_mce.js"></script>
    <script src="js/validation/languages/jquery.validationEngine-en.js" charset="utf-8"></script>
	<script src="js/validation/jquery.validationEngine.js" charset="utf-8"></script>
    <script src="js/jquery.jgrowl_minimized.js"></script>
    <script src="js/jquery.dataTables.min.js"></script>
    <script src="js/jquery.mousewheel.js"></script>
    <script src="js/jquery.jscrollpane.min.js"></script>
    <script src="js/jquery.stepy.min.js"></script>
    <script src="js/jquery.validate.min.js"></script>
    <script src="js/raphael.2.1.0.min.js"></script>
    <script src="js/justgage.1.0.1.min.js"></script>
	<script src="js/glisse.js"></script>
    <script src="js/morris.js"></script>
    
	<script src="js/application.js"></script>
	<script type="text/javascript" src="js/jquery.tooltipster.js"></script>

	<script src="realtime-notifications/lib/gritter/js/jquery.gritter.min.js"></script>
	<link href="realtime-notifications/lib/gritter/css/jquery.gritter.css"rel="stylesheet" type="text/css" />
	
<!--<script type="text/javascript" src="js/jquery-2.0.0.min.js"></script>-->
<script type="text/javascript" src="js/jquery.smartWizard.js"></script>

	

  </body>
</html>