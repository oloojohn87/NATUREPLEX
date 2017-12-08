<?php
session_start();
 require("environment_detail.php");
 require("displayExitClass.php");
 $dbhost = $env_var_db['dbhost'];
 $dbname = $env_var_db['dbname'];
 $dbuser = $env_var_db['dbuser'];
 $dbpass = $env_var_db['dbpass'];

$NombreEnt = $_SESSION['Nombre'];
$PasswordEnt = $_SESSION['Password'];
$MEDID = $_SESSION['MEDID'];
$UserID = $_SESSION['UserID'];
$Acceso = $_SESSION['Acceso'];
$privilege=$_SESSION['Previlege'];
$CustomLook=$_SESSION['CustomLook'];
if ($CustomLook=='COL') {
    header('Location:UserDashboardHTI.php');
    echo "<html></html>";  // - Tell the browser there the page is done
    flush();               // - Make sure all buffers are flushed
    ob_flush();            // - Make sure all buffers are flushed
    exit;                  // - Prevent any more output from messing up the redirect
}       
if ($Acceso != '23432')
{
$exit_display = new displayExitClass();

$exit_display->displayFunction(1);
die;
}

					// Connect to server and select databse.
$con = new PDO('mysql:host='.$dbhost.';dbname='.$dbname.';charset=utf8', ''.$dbuser.'', ''.$dbpass.'', array(PDO::ATTR_EMULATE_PREPARES => false, 
                                                                                                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

$result = $con->prepare("select pass from encryption_pass where id = (select max(id) from encryption_pass)");
$result->execute();
$row = $result->fetch(PDO::FETCH_ASSOC);
$enc_pass=$row['pass'];

$result = $con->prepare("SELECT * FROM usuarios where Identif=?");
$result->bindValue(1, $UserID, PDO::PARAM_INT);
$result->execute();

$count = $result->rowCount();
$row = $result->fetch(PDO::FETCH_ASSOC);
$success ='NO';
if($count==1){
	$success ='SI';
	
   /* $MedID = $row['id'];
	$MedUserEmail= $row['IdMEDEmail'];
	$MedUserName = $row['Name'];
	$MedUserSurname = $row['Surname'];
	$MedUserLogo = $row['ImageLogo'];
	$IdMedFIXED = $row['IdMEDFIXED'];
	$IdMedFIXEDNAME = $row['IdMEDFIXEDNAME']; */

    $UserID = $row['Identif'];
	$UserEmail= $row['email'];
	
			$current_encoding = mb_detect_encoding($row['Name'], 'auto');
			$UserName = iconv($current_encoding, 'ISO-8859-1', $row['Name']);

			$current_encoding = mb_detect_encoding($row['Surname'], 'auto');
			$UserSurname = iconv($current_encoding, 'ISO-8859-1', $row['Surname']); 
	
    $UserPhone = (htmlspecialchars($row['telefono']));
    //$UserLogo = $row['ImageLogo'];
    $IdUsFIXED = $row['IdUsFIXED'];
	
			$current_encoding = mb_detect_encoding($row['IdUsFIXEDNAME'], 'auto');
			$IdUsFIXEDNAME = iconv($current_encoding, 'ISO-8859-1', $row['IdUsFIXEDNAME']); 
	
    $Timezone = $row['timezone'];
    $Place = (htmlspecialchars($row['location']));
    $current_calling_doctor = '';
    $current_calling_doctor_name = '';
    if(isset($row['current_calling_doctor']))
    {
        $current_calling_doctor = $row['current_calling_doctor'];
        $doc_res = $con->prepare("SELECT Name,Surname FROM doctors WHERE id=?");
		$doc_res->bindValue(1, $current_calling_doctor, PDO::PARAM_INT);
		$doc_res->execute();
		
        $doc_row = $doc_res->fetch(PDO::FETCH_ASSOC);
        $current_calling_doctor_name = $doc_row['Name'].' '.$doc_row['Surname'];
    }
    $privilege=1;

    $IdDoctor = $row['IdInvite'];
    $resultD = $con->prepare("SELECT * FROM doctors where id=?");
	$resultD->bindValue(1, $IdDoctor, PDO::PARAM_INT);
	$resultD->execute();
	
	$rowD = $resultD->fetch(PDO::FETCH_ASSOC);
    $NameDoctor = (htmlspecialchars($rowD['Name']));
    $SurnameDoctor = (htmlspecialchars($rowD['Surname']));
	$DoctorEmail = (htmlspecialchars($rowD['IdMEDEmail']));
    //$MedUserRole = $row['Role'];
	//if ($MedUserRole=='1') $MedUserTitle ='Dr. '; else $MedUserTitle =' ';
    
    $plan = $row['plan'];
    $access = '';
    $original_access = '';
    if(isset($_SESSION['Original_User']))
    {
        $original_user = $_SESSION['Original_User'];
    }
    if(isset($_SESSION['Original_User_Access']))
    {
        $original_access = $_SESSION['Original_User_Access'];
    }
    if(isset($row['subsType']) && $row['subsType'] != null)
    {
        $access = $row['subsType'];
    }
    if($plan == 'FAMILY' && isset($row['ownerAcc']))
    {
        $user_accts = array();
        $resultD = $con->prepare("SELECT Name,Surname,Identif,email,relationship,subsType,floor(datediff(curdate(),DOB) / 365) as age FROM usuarios U INNER JOIN basicemrdata B where U.ownerAcc = ? AND U.Identif != ? AND U.Identif = B.IdPatient");
        $resultD->bindValue(1, $row['ownerAcc'], PDO::PARAM_INT);
        $resultD->bindValue(2, $row['Identif'], PDO::PARAM_INT);
        $resultD->execute();
        while($rowAcct = $resultD->fetch(PDO::FETCH_ASSOC))
        {
            $inf = array("Name" => $rowAcct['Name'].' '.$rowAcct['Surname'], "ID" => $rowAcct['Identif'], "email" => $rowAcct['email'], "age" => $rowAcct['age'], "Relationship" => $rowAcct['relationship'], "access" => $rowAcct['subsType']);
            array_push($user_accts, $inf);
        }
    }
    
       

    
    
}
else
{
$exit_display = new displayExitClass();

$exit_display->displayFunction(2);
die;
}


//BLOCKSLIFEPIN $result = mysql_query("SELECT * FROM blocks");
$result = $con->prepare("SELECT * FROM lifepin");
$result->execute();

?>
<!DOCTYPE html>
<html style="background: #F9F9F9;"><head>
    <meta charset="utf-8">
    <title lang="en">Inmers - Center Management Console</title>
    <link rel="icon" type="image/ico" href="favicon.ico"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Le styles -->
    <link href="css/style.css" rel="stylesheet">
    <link href="css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/jquery-ui-1.8.16.custom.css" media="screen"  />
    <link rel="stylesheet" href="css/fullcalendar.css" media="screen"  />
    <link rel="stylesheet" href="css/chosen.css" media="screen"  />
    <link rel="stylesheet" href="css/datepicker.css" >
    <link rel="stylesheet" href="css/colorpicker.css">
    <link rel="stylesheet" href="css/glisse.css?1.css">
    <link rel="stylesheet" href="css/jquery.jgrowl.css">
    <link rel="stylesheet" href="js/elfinder/css/elfinder.css" media="screen" />
    <link rel="stylesheet" href="css/jquery.tagsinput.css" />
    <link rel="stylesheet" href="css/demo_table.css" >
    <link rel="stylesheet" href="css/jquery.jscrollpane.css" >
    <link rel="stylesheet" href="css/validationEngine.jquery.css">
    <link rel="stylesheet" href="css/jquery.stepy.css" />
    <link rel="stylesheet" type="text/css" href="css/googleAPIFamilyCabin.css">
      <script type="text/javascript" src="js/42b6r0yr5470"></script>
	<link rel="stylesheet" href="css/icon/font-awesome.css">
 <!--   <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css" rel="stylesheet"> -->
    <link rel="stylesheet" href="css/bootstrap-responsive.css">
	<link rel="stylesheet" href="css/toggle-switch.css">
    <link rel="stylesheet" href="css/doctor_styles.css">
    <link rel="stylesheet" href="build/css/intlTelInput.css">
	
    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <!--[if lte IE 8]><script type="text/javascript" src="/js/excanvas.min.js"></script><![endif]-->
 
    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="/images/icons/favicon.ico">
	
	<!-- Create language switcher instance and set default language to en-->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" type="text/javascript"></script>
<script src="jquery-lang-js-master/js/jquery-cookie.js" charset="utf-8" type="text/javascript"></script>
<script src="jquery-lang-js-master/js/jquery-lang.js" charset="utf-8" type="text/javascript"></script>
<script type="text/javascript">
	var lang = new Lang('en');
	window.lang.dynamic('th', 'jquery-lang-js-master/js/langpack/th.json');


function delete_cookie( name ) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function setCookie(name,value,days) {
confirm('Would you like to switch languages?');
delete_cookie('lang');
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
	
	pageRefresh(); 
}

function setCookie2(name,value,days) {
//confirm('Would you like to switch languages?');
delete_cookie('lang');
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
	
	 
}

function pageRefresh(){
location.reload();
}

//alert($.cookie('lang'));

var langType = $.cookie('lang');

if(langType == 'th'){
var language = 'th';
}else{
var language = 'en';
}

if(langType == 'th'){
setTimeout(function(){
window.lang.change('th');
lang.change('th');
//alert('th');
}, 2000);
}else if(langType == 'en'){
setTimeout(function(){
window.lang.change('en');
lang.change('en');
//alert('th');
}, 2000);
} else {
setCookie('lang', 'en', 30);
}
</script>
	
    	<style>
		.ui-progressbar {
		position: relative;
		}
		.progress-label {
		position: absolute;
		left: 50%;
		top: 4px;
		font-weight: bold;
		text-shadow: 1px 1px 0 #fff;
		}
	</style>
	<style>
	#overlay {
	  background-color: none;
	  position: auto;
	  top: 0; right: 0; bottom: 0; left: 0;
	  opacity: 1.0; /* also -moz-opacity, etc. */
	  
    }
	#messagecontent {
	  white-space: pre-wrap;   
	}
	</style>
	  <style>
		#progressbar .ui-progressbar-value {
		background-color: #ccc;
		}
	  </style>

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

<!--Start of Zopim Live Chat Script-->
<script type="text/javascript">
window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
_.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
$.src='//v2.zopim.com/?2MtPbkSnwlPlIVIVYQMfPNXnx6bGJ0Rj';z.t=+new Date;$.
type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
</script>
<!--End of Zopim Live Chat Script-->  
    
    
  </head>

  <body style="background: #F9F9F9;">
    <!-- MODAL VIEW FOR DOCTOR DIRECTORY -->
    <!-- STYLES FOR THIS MODAL WINDOW ARE IN css/doctor_styles.css -->
    <!-- JAVSCRIPT CODE FOR THIS MODAL WINDOW IS IN js/doctor_search.js -->
    <div id="search_modal" title="Search Doctors" style="display:none; text-align:center; width: 900px; height: 700px; overflow: hidden;">
        <div style="width: 100%; height: 30px; margin-left: 15px;">
            <div style="float: left; margin-bottom: -25px; margin-top: 10px;">
                <button class="sort_button" id="name_button" style="border-top-left-radius: 5px; border-bottom-left-radius: 5px;" lang="en">
                   Name
                    <i class="icon-caret-up" style="margin-left: 3px;"></i>
                </button>
                <button class="sort_button" style="border-top-right-radius: 5px; border-bottom-right-radius: 5px;" id="rating_button" lang="en">
                   Rating
                    <i class="" style="margin-left: 3px;"></i>
                </button>
            </div>
            <div style="width: 670px; float: left; margin-left: 15px; margin-top: 10px; margin-bottom: -10px;">
                <div class="controls" style="float: left; width: 350px;">
                    <!--<div class="input-append">-->
                        <input class="span7" id="search_bar" style="float: left; width: 270px; border-top-right-radius: 0px; border-bottom-right-radius: 0px;" size="16" type="text">
                        <button class="search_bar_button" style="float: left;" id="search_bar_button" lang="en">Search</button>
                    <!--</div>-->
                </div>
                <div style="float: left; width:140px; margin-left: 10px;">
                    <div class="search_toggle"  style="width: 140px;" lang="en">
                        <button id="telemedicine_toggle_button" class="search_toggle_button" style="background-color: #22AEFF;" data-on="true" ></button>
                        Telemedicine
                    </div>
                </div>
                <div style="float: left; width:100px; margin-left: 20px;">
                    <div class="search_toggle" lang="en">
                        <button id="available_toggle_button" class="search_toggle_button" data-on="false" ></button>
                        Available
                    </div>
                </div>
                <div style="float: left; width:30px; margin-left: 20px; font-size: 20px;">
                    <button id="advanced_toggle_button" class="doctor_search_advanced_toggle_button" >
                        <i class="icon-cog" ></i>
                    </button>
                </div>
            </div>
            
        </div>
        <div id="doctor_search_advanced" style="width: 100%; margin-top: 50px; display: none;">
            <div style="width: 360px; height: 50px; margin: auto;">
            
                <div style="width: 100%; height; 25px; padding-top: 5px; margin-left: 15px; color: #767676; text-align: center;">
                    Speciality: 
                </div>
                <select name="search_speciality" id="search_speciality" style="float: left; width: 360px; margin-left: 15px;">
                    <option value="Any" selected>Any</option>
                    <option value="Allergy and Immunology">Allergist / Immunologist</option>
                    <option value="Anaesthetics">Aesthetician</option>
                    <option value="Cardiology">Cardiologist</option>
                    <option value="Cardiothoracic Surgery">Cardiothoracic Surgeon</option>
                    <option value="Child & Adolescent Psychiatry">Child & Adolescent Psychiatrist</option>
                    <option value="Clinical Neurophysiology">Clinical Neurophysiologist</option>
                    <option value="Dermato-Venereology">Dermato-Venereologist</option>
                    <option value="Dermatology">Dermatologist</option>
                    <option value="-Emergency Medicine">Emergency Medicine Specialist</option>
                    <option value="Endocrinology">Endocrinologist</option>
                    <option value="Gastroenterology">Gastroenterologist</option>
                    <option value="General Practice">General Practicioner</option>
                    <option value="General Surgery">General Surgeon</option>
                    <option value="Geriatrics">Geriatrician</option>
                    <option value="Gynaecology and Obstetrics">Gynaecologist / Obstetrician</option>
                    <option value="Health Informatics">Health Informatics Specialist</option>
                    <option value="Infectious Diseases">Infectious Disease Specialist</option>
                    <option value="Internal Medicine">Internal Medicine Specialist</option>
                    <option value="Interventional Radiology">Interventional Radiologist</option>
                    <option value="Microbiology">Microbiologist</option>
                    <option value="Neonatology">Neonatologist</option>
                    <option value="Nephrology">Nephrologist</option>
                    <option value="Neurology">Neurologist</option>
                    <option value="Neuroradiology">Neuroradiologist</option>
                    <option value="Neurosurgery">Neurosurgeon</option>
                    <option value="Nuclear Medicine">Nuclear Medicine Specialist</option>
                    <option value="Occupational Medicine">Occupational Medicine Specialist</option>
                    <option value="Oncology">Oncologist</option>
                    <option value="Ophthalmology">Ophthalmologist</option>
                    <option value="Oral and Maxillofacial Surgery">Oral and Maxillofacial Surgeon</option>
                    <option value="Orthopaedics">Orthopedician</option>
                    <option value="Otorhinolaryngology">Otorhinolaryngologist</option>
                    <option value="Paediatric Cardiology">Paediatric Cardiologist</option>
                    <option value="Paediatric Surgery">Paediatric Surgeon</option>
                    <option value="Paediatrics">Paediatrician</option>
                    <option value="Pathology">Pathologist</option>
                    <option value="Physical Medicine and Rehabilitation">Physical Medicine and Rehabilitation Specialist</option>
                    <option value="Plastic, Reconstructive and Aesthetic Surgery">Plastic, Reconstructive and Aesthetic Surgeon</option>
                    <option value="Pneumology">Pulmonologist</option>
                    <option value="Psychiatry">Psychiatrist</option>
                    <option value="Public Health">Public Health Specialist</option>
                    <option value="Radiology">Radiologist</option>
                    <option value="Radiotherapy">Radiotherapist</option>
                    <option value="Stomatology">Stomatologist</option>
                    <option value="Vascular Medicine">Vascular Medicine Specialist</option>
                    <option value="Vascular Surgery">Vascular Surgeon</option>
                    <option value="Urology">Urologist</option>
                </select>
            </div>
            <div style="width: 360px; margin: auto; height: 50px; margin-top: 25px;">
            
                <div style="width: 100%; height; 25px; padding-top: 5px; margin-left: 15px; color: #767676; text-align: center;" lang="en">
                    Country: 
                </div>
                <select id="country_search" name ="country_search" style="width: 360px; margin-left: 15px;"></select>
                </select>
            </div>
            <div style="width: 360px; margin: auto; height: 50px; margin-top: 25px;">
            
                <div style="width: 100%; height; 25px; padding-top: 5px; margin-left: 15px; color: #767676; text-align: center;" lang="en">
                    Region: 
                </div>
                <select id="region_search" name ="region_search" style="width: 360px; margin-left: 15px;"></select>
                </select>
            </div>
            <div style="width: 215px; margin: auto; margin-top: 30px;">
                <button class="doctor_search_advanced_button" lang="en">Update</button>
                <button class="doctor_search_advanced_button" style="margin-left: 15px;" lang="en">Reset</button>
            </div>
            <script type= "text/javascript" src = "js/countries.js"></script>
            <script language="javascript">
                populateCountries("country_search", "region_search");
            </script>
        </div>
        <div id="doctor_rows" style="width: 100%; margin-top: 30px; height: 510px;">
            <!--<div class="doctor_row">
                <img class="doctor_pic" src="identicon.php?size=25&hash='<?php echo md5( strtolower( trim( 'blima@inmers.us' ) ) ); ?>'" />
                <div class="doctor_main_label">
                    <div class="doctor_name"><span style="color: #22AEFF">Bruno</span> <span style="color: #00639A">Lima</span></div>
                    <div class="doctor_speciality">General Practicioner</div>
                    <div class="doctor_location">Texas, USA</div>
                </div>
                <div class="doctor_hospital_info">
                    <div class="doctor_stars">
                        <i class="icon-star" style="float: left; font-size: 12px; color: #666;"></i>
                        <i class="icon-star" style="float: left; font-size: 12px; color: #666;"></i>
                        <i class="icon-star" style="float: left; font-size: 12px; color: #666;"></i>
                        <i class="icon-star" style="float: left; font-size: 12px; color: #666;"></i>
                        <i class="icon-star-half" style="float: left; font-size: 12px; color: #666;"></i>
                    </div>
                    <div class="doctor_hospital_name">
                        Baylor Medical Center
                    </div>
                    <div class="doctor_hospital_address">
                        1000 Super Rd. Dallas, TX 75001
                    </div>
                </div>
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            <div class="doctor_row">
            
            </div>
            -->
        </div>
        <div id="doctors_search_page_buttons" style="width: 80px; height: 50px; margin-top: 25px; margin-left: auto; margin-right: auto; display: none;">
            <button id="doctors_page_button_left" class="doctors_page_button" disabled>
                <i class="icon-arrow-left"></i>
            </button>
            <button id="doctors_page_button_right" class="doctors_page_button" style="margin-left: 20px" disabled>
                <i class="icon-arrow-right"></i>
            </button>
        </div>
    </div>
    <!-- END MODAL VIEW FOR DOCTOR DIRECTORY -->
      
      
    <!-- MODAL VIEW FOR SUMMARY -->
    <div id="summary_modal" lang="en" title="Summary" style="display:none; text-align:center; width: 1000px; height: 660px; overflow: hidden;">
    </div>
    <!-- END MODAL VIEW FOR SUMMARY -->
      
    <!-- MODAL VIEW FOR SETUP -->
    <style>
        ::-webkit-scrollbar { 
            display: none; 
        }
    </style>
    <div id="setup_modal" title="SetUp" style="display:none; text-align:center; padding:20px; width: 600px; height: 310px;">
        <div id="setup_modal_container" style="width: 600px; height: 280px;">
            <h4 id="setup_title" style="width: 85%; text-align: center; margin-left: 15%;" lang="en">Change Password</h4>
            <div style="width: 15%; height:250px; float: left; margin-top: -30px;">
                <button id="setup_menu_1" accesskey=""style="background-color: #22AEFF; color: #FFF; width: 50px; height: 50px; font-size: 24px; border: 0px solid #FFF; outline: 0px; border-top-left-radius: 10px; border-top-right-radius: 10px; float: left;">
                    <i class="icon-lock"></i>
                </button>
                <button id="setup_menu_2" style="background-color: #FBFBFB; color: #22AEFF; width: 50px; height: 50px; font-size: 24px; border: 1px solid #E6E6E6; outline: 0px; float: left;">
                    <i class="icon-time"></i>
                </button>
                <button id="setup_menu_3" style="background-color: #FBFBFB; color: #22AEFF; width: 50px; height: 50px; font-size: 24px; border: 1px solid #E6E6E6; outline: 0px; float: left;">
                    <i class="icon-credit-card"></i>
                </button>
                <button id="setup_menu_4" style="background-color: #FBFBFB; color: #22AEFF; width: 50px; height: 50px; font-size: 24px; border: 1px solid #E6E6E6; outline: 0px; float: left;">
                    <i class="icon-map-marker"></i>
                </button>
                <button id="setup_menu_5" style="background-color: #FBFBFB; color: #22AEFF; width: 50px; height: 50px; font-size: 24px; border: 1px solid #E6E6E6; outline: 0px;float: left;">
                    <i class="icon-phone"></i>
                </button>
                <button id="setup_menu_6" style="background-color: #FBFBFB; color: #22AEFF; width: 50px; height: 50px; font-size: 24px; border: 1px solid #E6E6E6; outline: 0px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; float: left;">
                    <i class="icon-key"></i>
                </button>
            </div>
            <div style="width: 85%; height: 200px; float: left;">
                <div id="setup_page_1">
                    <div style="width: 100%; height: 40px;">
                        <div style="float: left; margin-top: 6px; margin-bottom: -6px; color: #777; width: 200px; text-align: left;" lang="en">Type current password: </div>
                        <input id="pw1" type="password" style="float: left; height: 15px; width: 200px; padding: 7px; color: #444;" value="" />
                        <button id="change_password_validate_button" style="width: 75px; height: 30px; background-color: #52D859; color: #FFF; border-radius: 7px; border: 0px solid #FFF; float: left; margin-left: 10px; outline: 0px;">Validate</button>
                    </div>
                    <div id="change_password_validated_section" style="display: none;">
                        <div style="width: 100%; height: 40px;">
                            <div style="float: left; margin-top: 6px; margin-bottom: -6px; color: #777; width: 200px; text-align: left;" lang="en">Type new password: </div>
                            <input id="pw2" type="password" style="float: left; height: 15px; width: 200px; padding: 7px; color: #444;" value="" />
                        </div>
                        <div style="width: 100%; height: 40px;">
                            <div style="float: left; margin-top: 6px; margin-bottom: -6px; color: #777; width: 200px; text-align: left;" lang="en">Retype new password: </div>
                            <input id="pw3" type="password" style="float: left; height: 15px; width: 200px; padding: 7px; color: #444;" value="" />
                            <button id="change_password_finish_button" style="width: 75px; height: 30px; background-color: #52D859; color: #FFF; border-radius: 7px; border: 0px solid #FFF; float: left; margin-left: 10px; outline: 0px;">Finish</button>
                        </div>
                    </div>
                </div>
                <div id="setup_page_2" style="display: none;">
                    <select class="timezonepicker" id="timezone_picker" size="8" style="display:block; margin-top: 0px; width: 100%;">
                      <option value="-12.0">(GMT -12:00) Eniwetok, Kwajalein</option>
                      <option value="-11.0">(GMT -11:00) Midway Island, Samoa</option>
                      <option value="-10.0">(GMT -10:00) Hawaii</option>
                      <option value="-9.0">(GMT -9:00) Alaska</option>
                      <option value="-8.0">(GMT -8:00) Pacific Time (US &amp; Canada)</option>
                      <option value="-7.0">(GMT -7:00) Mountain Time (US &amp; Canada)</option>
                      <option value="-6.0">(GMT -6:00) Central Time (US &amp; Canada), Mexico City</option>
                      <option value="-5.0" selected>(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima</option>
                      <option value="-4.0">(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz</option>
                      <option value="-3.5">(GMT -3:30) Newfoundland</option>
                      <option value="-3.0">(GMT -3:00) Brazil, Buenos Aires, Georgetown</option>
                      <option value="-2.0">(GMT -2:00) Mid-Atlantic</option>
                      <option value="-1.0">(GMT -1:00 hour) Azores, Cape Verde Islands</option>
                      <option value="0.0">(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                      <option value="1.0">(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris</option>
                      <option value="2.0">(GMT +2:00) Kaliningrad, South Africa</option>
                      <option value="3.0">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</option>
                      <option value="3.5">(GMT +3:30) Tehran</option>
                      <option value="4.0">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</option>
                      <option value="4.5">(GMT +4:30) Kabul</option>
                      <option value="5.0">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</option>
                      <option value="5.5">(GMT +5:30) Bombay, Calcutta, Madras, New Delhi</option>
                      <option value="5.75">(GMT +5:45) Kathmandu</option>
                      <option value="6.0">(GMT +6:00) Almaty, Dhaka, Colombo</option>
                      <option value="7.0">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>
                      <option value="8.0">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</option>
                      <option value="9.0">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</option>
                      <option value="9.5">(GMT +9:30) Adelaide, Darwin</option>
                      <option value="10.0">(GMT +10:00) Eastern Australia, Guam, Vladivostok</option>
                      <option value="11.0">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</option>
                      <option value="12.0">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</option>
                    </select>
                    <button id="timezone_button" style="width: 100%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #22AEFF;">
                        Update
                    </button>
                </div>
                <div id="setup_page_3" style="display: none;">
                    <style>
                        .credit_card_row{
                            background-color: #FBFBFB;
                            color: #222;
                            border: 1px solid #E6E6E6;
                            width: 96%;
                            height: 35px;
                            padding: 4px;
                        }
                    </style>
                    <div id="credit_cards_container" style="width: 70%; margin-left: auto; margin-right: auto; height: 135px; overflow: scroll;">
                    </div>
                    <div style="margin-top: 10px; width: 70%; margin-left: auto; margin-right: auto;">
                        <script>
                        function isNumberKey(evt)
                        {
                            var charCode = (evt.which) ? evt.which : event.keyCode
                            if (charCode > 31 && (charCode < 48 || charCode > 57))
                                return false;
                            return true;
                        }    
                        </script>
                        <input type="text" onkeypress="return isNumberKey(event)" id="credit_card_number" maxLength="16" placeholder="Enter card number" style="width: 220px; height: 20px; float: left; border-radius: 5px;">
                        <input id="credit_card_csv_code" type="text" onkeypress="return isNumberKey(event)" id="csv_code" maxLength="3" placeholder="CSV" style="width: 85px; height: 20px; margin-left: 18px; float: left; border-radius: 5px;">
                        <div style="color: #969696; width: 80px; float: left; text-align: left; padding-left: 5px; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border: 1px solid #CACACA; height: 23px; padding-top: 5px; border-right: 0px solid #FFF;" lang="en">Exp. Date:</div>
                        <input id="credit_card_exp_date" type="month" style="width: 135px; height: 20px; float: left; font-size: 12px; border-radius: 0px; border-left: 0px solid #FFF; border-top-right-radius: 5px; border-bottom-right-radius: 5px;" />
                        <button id="add_card_button" style="width: 100px; height: 30px; background-color: #52D859; border-radius: 0px; border: 0px solid #FFF; color: #FFF; float: left; outline: 0px; margin-left: 18px; border-radius: 5px;" lang="en">Add Card</button>
                    </div>
                </div>
                <div id="setup_page_4" style="display: none;">
                    <div class="formRow" style="margin-left: 50px; margin-top: 20px;">
                        <label lang="en">Country: </label>
                        <div class="formRight">
                            <select id="country_setup" name ="country_setup"></select>
                        </div>
                    </div>
                    <div class="formRow" style="margin-left: 50px; visibility: hidden;">
                        <label lang="en">Region: </label>
                        <div class="formRight">
                            <select name ="state_setup" id ="state_setup"></select>
                        </div>
                    </div>
                    <script language="javascript">
                        populateCountries("country_setup", "state_setup");
                    </script>
                    <button id="location_button" style="width: 45%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #22AEFF; margin-top: 45px;" lang="en">
                        Update
                    </button>
                </div>
                <div id="setup_page_5" style="display: none;">
                    <div class="formRow" style="margin-left: 50px; margin-top: 20px; margin-bottom: 40px;">
                        <label lang="en">Phone: </label>
                        <div class="formRight">
                            <input id="setup_phone" type="text" name="phone" class="intermediate-input validate[required, funcCall[checkPhoneFormat]] span" placeholder="phone" title="Please insert your phone number including country code(just numbers, no special characters or punctuation signs)" style="width: 300px;"/>
                        </div>
                    </div>
                    <div class="formRow" style="margin-left: 50px; margin-top: 10px; margin-bottom: 20px;">
                        <label lang="en">Email: </label>
                        <div class="formRight">
                            <input type="text" id="setup_email" name ="email" style="width: 290px;" />
                        </div>
                    </div>

                    <button id="contact_button" style="width: 45%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #22AEFF; margin-top: 45px;" lang="en">
                        Update
                    </button>
                </div>
                <div id="setup_page_6" style="display: none;">
                    <div style="width: 300px; text-align: center; margin: auto; margin-top: 5px; margin-bottom: 10px;">
                        <label lang="en">Your current subscription is: <span style="color: #22AEFF;"><?php echo $plan; ?></span></label>
                    </div>
                    <?php
                        if($plan == 'FREE')
                        {
                            echo '<button id="upgrade_premium_button" style="width: 60%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #54bc00; margin: auto; margin-top: 20px;" lang="en">Change To Premium ($8.00 / Month)</button>';
                        }
                        if($plan == 'FREE' || $plan == 'PREMIUM')
                        {
                            echo '<button id="upgrade_family_button" style="width: 60%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #54bc00; margin: auto; margin-top: 20px;" lang="en">Change To Family ($14.00 / Month)</button>';
                        }
                        if($plan == 'FAMILY' && ($access == 'Owner' || $access == 'Admin'))
                        {
                    ?>
                    
                    <!-- Family Account management will only be loaded if the current account's subscription is 'FAMILY' -->
                    <div id="family_members" style="width: 500px; height: 200px; background-color: #FFF;">
                        <style>
                            .family_member_row{
                                width: 100%;
                                height: 26px;
                                margin-bottom: 8px;
                            }
                        </style>
                        <div style="width: 100%; height: 150px; overflow: scroll;" id="family_users">
                        <?php
                            for($i = 0; $i < count($user_accts); $i++)
                            {
                                if($user_accts[$i]['access'] != 'Owner')
                                {
                                    echo '<div id="family_member_row_'.$user_accts[$i]['ID'].'" class="family_member_row">';
                                    echo '<div style="width: 20%; height: 26px; float: left;">'.$user_accts[$i]['Name'].'</div>';
                                    echo '<div style="width: 20%; height: 26px; float: left; color: #22AEFF;">'.ucwords($user_accts[$i]['Relationship']).'</div>';
                                    echo '<div style="width: 20%; height: 26px; float: left; color: #54bc00; ';
                                    if($user_accts[$i]['access'] == 'Owner' || $user_accts[$i]['access'] == 'Admin')
                                    {
                                        echo 'font-weight: bold;';
                                    }
                                    echo '">'.$user_accts[$i]['access'].'</div>';
                                    echo '<button id="family_member_edit_'.$user_accts[$i]['ID'].'" style="width: 15%; margin-left: 5%; height: 26px; float: left; color: #FFF; background-color: #54bc00; border-radius: 5px; outline: none; border: 0px solid #FFF;">Edit</button>';
                                    echo '<button id="family_member_delete_'.$user_accts[$i]['ID'].'" style="width: 15%; margin-left: 5%; height: 26px; float: left; color: #FFF; background-color: #D84840; border-radius: 5px; outline: none; border: 0px solid #FFF;">Delete</button>';
                                    echo '</div>';
                                }
                            }
                            
                        ?>
                            
                        </div>
                        <button id="add_family_member_button" style="width: 45%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #54bc00; margin-top: 20px;" lang="en">
                            Add Family Member
                        </button>
                    
                    </div>
                    <div id="edit_family_member" style="width: 500px; height: 200px; background-color: #FFF; display: none;">
                        <style>
                            #edit_family_member input{
                                border-radius: 0px;
                                height: 18px;
                                width: 200px;
                                margin: 0px;
                                box-shadow: 0px 0px 0px #FFF;
                                outline: none;
                            }
                            #edit_family_member select{
                                border-radius: 0px;
                                height: 26px;
                                width: 212px;
                                margin: 0px;
                                margin-top: 15px;
                                border: 1px solid #CCC;
                                box-shadow: 0px 0px 0px #FFF;
                                outline: none;
                            }
                        </style>
                        <div style="width: 100%; height: 150px;">
                            <div style="width: 50%; height: 150px; float: left;">
                                <input type="text" placeholder="Name" id="family_member_name" style="border-top-left-radius: 5px; border-top-right-radius: 5px;" />
                                <input type="text" placeholder="Surname" id="family_member_surname" />
                                <div style="width: 40px; height: 22px; border: 1px solid #CCC; border-right: 0px solid #FFF; color: #999; float: left; margin-left: 18px; padding-left: 5px; padding-top: 4px;">DOB: </div>
                                
                                <input type="date" id="family_member_dob" style="width: 155px; float: left; border-left: 0px solid #FFF;" />
                                <input type="text" placeholder="Phone number" id="family_member_phone" class="intermediate-input validate[required, funcCall[checkPhoneFormat]] span" style="border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;" />
                                
                                
                                <select id="family_member_gender" style="margin-top: 8px;">
                                    <option value="none">Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div style="width: 50%; height: 150px; float: left;">
                                <input type="password" placeholder="Password" id="family_member_password" style="border-top-left-radius: 5px; border-top-right-radius: 5px;" />
                                <input type="password" placeholder="Retype Password" id="family_member_password2" />
                                <input type="text" placeholder="Email" id="family_member_email" />
                                
                                <input type="text" placeholder="Birth order (if twin)" id="family_member_order" style="border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;" />
                                
                                
                                <select id="family_member_relationship">
                                    <option value="none">Relationship to owner</option>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Husband">Husband</option>
                                    <option value="Wife">Wife</option>
                                    <option value="Son">Son</option>
                                    <option value="Daughter">Daughter</option>
                                </select>
                            </div>
                        </div>
                        <button id="edit_family_member_cancel_button" style="width: 15%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #D84840; margin-top: 20px; float: right; margin-right: 20px;" lang="en">
                            Cancel
                        </button>
                        <button id="edit_family_member_done_button" style="width: 15%; height: 30px; border-radius: 5px; border: 0px solid #FFF; outline: 0px; color: #FFF; background-color: #54bc00; margin-top: 20px; margin-right: 10px; float: right;" lang="en">
                            Done
                        </button>
                        
                        <button id="give_admin_privileges" style="height: 16px; width: 16px; background-color: #F8F8F8; border: 1px solid #CCC; padding: 0px; float: left; outline: 0px; border-radius: 16px; margin-top: 22px; margin-left: 20px;">
                            <input type="hidden" value="0" />
                            <div style="width: 10px; height: 10px; margin-left: 2px; border-radius: 10px; background-color: #54bc00;" ></div>
                        </button>
                        <span style="float: left; text-align: center; margin-left: 10px; margin-top: 20px;">Give Admin Privileges</span>
                    
                    </div>
                    
                    <?php } ?>
                </div>
            </div>
            
        </div>
        
        <div id="setup_modal_notification_container" style="width: 600px; height: 30px; margin-left: 25px; opacity: 0.0;">
            <div id="setup_modal_notification" style="height: 30px; padding-top: 10px; width: 500px; background-color: #888; border-radius: 20px; margin-left: 50px; position: relative;"></div>
        </div> 
    </div>
      
      
      <!-- MODAL VIEW TO FIND DOCTOR -->
    <div id="find_doctor_modal" title="Find Doctor" style="display:none; text-align:center; padding:20px;">
        <div id="Talk_Section_1" style="display: block;">
            <!--<input type="text" style="width: 90%; margin-top: 15px; margin-bottom: 15px; height: 20px; color: #CACACA; padding: 5px;" placeholder="Search for a doctor..." value="" />-->
            <style>
                .recent_doctor_button{
                        height: 50px; 
                        width: 50px; 
                        margin: auto; 
                        color: #FFFFFF; 
                        background-color: #22AEFF;
                        outline: 0px;
                    }
                .recent_doctor_button_selected{
                        border: 1px solid #22aeff;
                        background-color: #22aeff; 
                        color: #FFF;
                        padding: 3px; 
                        width: 80%; 
                        margin: auto; 
                        height: 25px;
                        outline: 0px;
                    }
                .find_doctor_button
                {
                    width: 100px;
                    height: 30px;
                    border-radius: 7px;
                    font-size: 14px;
                    color: #FFFFFF;
                    border: 0px solid #FFF;
                    float: right;
                    margin-top: 3px;
                    margin-left: 10px;
                    outline: 0px;
                }
                .square_blue_button
                {
                    width: 110px;
                    height: 110px;
                    border-radius: 7px;
                    font-size: 14px;
                    color: #FFFFFF;
                    background-color: #22aeff;
                    border: 0px solid #FFF;
                    outline: 0px;
                    margin-top: 55px;
                    margin-left: 15px;
                    margin-right: 15px;
                    
                }
                .square_blue_button_disabled
                {
                    width: 110px;
                    height: 110px;
                    border-radius: 7px;
                    font-size: 14px;
                    color: #FFFFFF;
                    border: 0px solid #FFF;
                    outline: 0px;
                    margin-top: 55px;
                    margin-left: 15px;
                    margin-right: 15px;
                    background-color: #D4F0FF;
                    cursor: default;
                }
                .step_circle
                {
                    background-color: #909090;
                    padding-top: 5px;
                    padding-left: 2px;
                    width: 28px;
                    height: 25px;
                    border: 1px solid #909090;
                    border-radius: 15px;
                    color: #FFFFFF;
                    font-weight: bold;
                    float: left;
                    font-size: 12px;
                    <!--margin-right: 10px;-->
                }
                .step_bar
                {
                    background-color: #909090;
                    margin-top: 14px;
                    width: 10px;
                    height: 3px;
                    border: 1px solid #909090;
                    float: left;
                }
                .lit
                {
                    background-color: #52D859;
                    border: 1px solid #52D859;
                }
                .yes_no_button{
                    width: 60px;
                    height: 40px;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #FFFFFF;
                    background-color: #22aeff;
                    border: 0px solid #FFF;
                    outline: 0px;
                    margin-top: 40px;
                    margin-left: 10px;
                    margin-right: 10px;
                }
            </style>
            <div style="width: 100%; height: 35px; margin-top: -5px; margin-left: -5px;">
                <p id="find_doctor_label" style="font-size: 18px; color: #CACACA; font-style: italic; float: right;"></p>
                <div id="step_circle_1" class="step_circle lit">1</div>
                    <div id="step_bar_1" class="step_bar"></div>
                <div id="step_circle_2" class="step_circle">2</div>
                    <div id="step_bar_2" class="step_bar"></div>
                <div id="step_circle_3" class="step_circle">3</div>
                    <div id="step_bar_3" class="step_bar"></div>
                <div id="step_circle_4" class="step_circle">4</div>
                    <div id="step_bar_4" class="step_bar"></div>
                <div id="step_circle_5" class="step_circle">5</div>
                    <div id="step_bar_5" class="step_bar"></div>
                <div id="step_circle_6" class="step_circle"><i class="icon-ok" style="font-size: 20px;"></i></div>
            </div>
            <div id="find_doctor_container" style="width: 100%; margin-top: 10px; height: 250px;">
                <div stlye="width: 100%; height: 250px;" id="find_doctor_main">
                    <button lang="en" id="find_doctor_now_button" class="square_blue_button<?php 
                                $res = $con->prepare("SELECT id FROM doctors WHERE telemed=1 AND in_consultation=0");
								$res->execute();
                                $num_rows = $res->rowCount();
                                if($num_rows == 0)
                                {
                                    echo "_disabled";
                                }
                            ?>">
                        <div style="margin-bottom: -8px;"><i class="icon-bolt" style="font-size: 40px;"></i></div>
                        <br/><span lang="en">Call Now</span>
                    </button>
                    <button lang="en" id="find_doctor_my_doctors_button" class="square_blue_button<?php 
                        $res = $con->prepare("SELECT most_recent_doc FROM usuarios WHERE Identif=?");
						$res->bindValue(1, $UserID, PDO::PARAM_INT);
						$res->execute();
						
                        $row = $res->fetch(PDO::FETCH_ASSOC);
                        $str = $row['most_recent_doc'];
                        if(strlen($str) < 3)
                        {
                            echo "_disabled";
                        }?>">
                        <div style="margin-bottom: -8px;"><i class="icon-user-md" style="font-size: 40px;"></i></div>
                        <br/><span lang="en">My Doctors</span>
                    </button>
                    <button lang="en" id="find_doctor_appointment_button" class="square_blue_button">
                        <div style="margin-bottom: -8px;"><i class="icon-calendar" style="font-size: 40px;"></i></div>
                        <br/><span lang="en">Appointment</span>
                    </button>
                </div>
                
                <!-- My Doctors Pages -->
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_my_doctors_1">
                    <?php 
                        $result = $con->prepare("SELECT most_recent_doc FROM usuarios where Identif=?");
						$result->bindValue(1, $UserID, PDO::PARAM_INT);
						$result->execute();
						
                        $count = $result->rowCount();
                        $row = $result->fetch(PDO::FETCH_ASSOC);
                        $str = $row['most_recent_doc'];
                        $str = str_replace(array("[", "]"), "", $str);
                        $ids = explode(",", $str);
                
                        date_default_timezone_set ("GMT");
                        $date = new DateTime('now');
                        for($i = 0; $i < count($ids); $i++)
                        {
                            $doc_result = $con->prepare("SELECT Name,Surname,phone,location FROM doctors WHERE id=? AND telemed=1 AND in_consultation=0");
							$doc_result->bindValue(1, $ids[$i], PDO::PARAM_INT);
							$doc_result->execute();

                            if($doc_result->rowCount() > 0)
                            {
                                $doc_row = $doc_result->fetch(PDO::FETCH_ASSOC);
                                $result2 = $con->prepare("SELECT * FROM timeslots WHERE doc_id=?");
								$result2->bindValue(1, $ids[$i], PDO::PARAM_INT);
								$result2->execute();
								
                                $found = false;
                            
                                while(($row2 = $result2->fetch(PDO::FETCH_ASSOC)) && !$found)
                                {
                                    $start = new DateTime($row2['week'].' '.$row2['start_time']);
                                    $end = new DateTime($row2['week'].' '.$row2['end_time']);
                                    $date_interval = new DateInterval('P'.$row2['week_day'].'D');
                                    $time_interval = new DateInterval('PT'.intval(substr((htmlspecialchars($row2['timezone'])), strlen((htmlspecialchars($row2['timezone']))) - 8, 2)).'H'.intval(substr((htmlspecialchars($row2['timezone'])), strlen((htmlspecialchars($row2['timezone']))) - 5, 2)).'M');
                                    if(substr($row2['timezone'], 0 , 1) != '-')
                                    {
                                        $time_interval->invert = 1;
                                    }
                                    $start->add($date_interval);
                                    $end->add($date_interval);
                                    $start->add($time_interval);
                                    $end->add($time_interval);
                                    if($start <= $date && $end >= $date)
                                    {
                                        // doctor is available
                                        $found = true;
                                        break;
                                    }
                                    
                                }
                                echo '<button id="recdoc_'.$ids[$i].'_'.(htmlspecialchars($doc_row['phone'])).'_'.(htmlspecialchars($doc_row['Name'])).'_'.(htmlspecialchars($doc_row['Surname'])).'_'.(htmlspecialchars($doc_row['location']));
                                if($found)
                                {
                                    echo '_Available';
                                }
                                echo '" class="square_blue_button" style="width: 100px; height: 100px; margin-left: 3px; margin-right: 3px; padding: 0px;">Doctor<br/>'.(htmlspecialchars($doc_row['Name'])).' '.(htmlspecialchars($doc_row['Surname'])).'</button>';
                            }
                        }
                    ?>
                </div>
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_my_doctors_2">
                    <div style="width: 100%; height: 75px;">
                        
                        <p style="float: right; margin-top: 5px; margin-right: 50px;">
						   <input type="checkbox" id="in_location_checkbox">
            			   <label for="in_location_checkbox"><span></span></label>
                        </p>
                        <p style="text-align: left; margin-top: 30px; margin-bottom: -30px; margin-left: 50px;" id="doctor_location_text" lang="en">Doctor Janme Doe is in <strong>TEXAS</strong>.<br/>Please confirm that you are in <strong>TEXAS</strong> as well.</p>
                    </div>
                    <div style="width: 90%; margin-left: 10%; height: 50px; margin-top: 7px;">
                        <p style="text-align: left; float: left;" lang="en">Video or phone consultation?</p>
                        
                        <div style="width: 100px; height: 30px; border-radius: 3px; background-color: #535353; float: left; margin-left:105px; margin-top: -6px;">
                            <button style="width: 50px; height: 30px; border-top-left-radius: 3px; border-bottom-left-radius: 3px; background-color: #22aeff; border: 0px solid #FFF; color: #FFF; float: left; outline: 0px;" id="find_doctor_video_button_2">
                                <i class="icon-facetime-video"></i>
                            </button>
                            <button style="width: 50px; height: 30px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; background-color:  #535353; border: 0px solid #FFF; color: #FFF; float: left; outline: 0px;" id="find_doctor_phone_button_2">
                                <i class="icon-phone"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_my_doctors_3">
                    <p style="margin-top: 30px; margin-bottom: -30px;" id="doctor_oncall_text" lang="en">Doctor Jane Doe is ON CALL NOW!<br/>Would you like to connect now?</p>
                    <button class="yes_no_button" id="connect_now_yes" lang="en">Yes</button>
                    <button class="yes_no_button" id="connect_now_no" lang="en">No</button>
                </div>
                <!-- End My Doctors Pages -->
                
                <!-- Appointment Pages -->
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_appointment_1">
                    <div style="width: 100%; height: 140px;">
                        <p lang="en">Which area will you be calling from?</p>
                        <div class="formRow" style="margin-left: 50px;">
                            <label lang="en">Country: </label>
                            <div class="formRight">
                                <select id="country" name ="country"></select>
                            </div>
                        </div>
                        <div class="formRow" style="margin-left: 50px; display: none;">
                            <label lang="en">Region: </label>
                            <div class="formRight">
                                <select name ="state" id ="state"></select>
                            </div>
                        </div>
                    </div>
                    <div style="width: 90%; margin-left: 10%; height: 50px; margin-top: 7px;">
                        <p style="text-align: left; float: left;" lang="en">Video or phone consultation?</p>
                        
                        <div style="width: 100px; height: 30px; border-radius: 3px; background-color: #535353; float: left; margin-left:80px; margin-top: -6px;">
                            <button style="width: 50px; height: 30px; border-top-left-radius: 3px; border-bottom-left-radius: 3px; background-color: #22aeff; border: 0px solid #FFF; color: #FFF; float: left; outline: 0px;" id="find_doctor_video_button">
                                <i class="icon-facetime-video"></i>
                            </button>
                            <button style="width: 50px; height: 30px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; background-color:  #535353; border: 0px solid #FFF; color: #FFF; float: left; outline: 0px;" id="find_doctor_phone_button">
                                <i class="icon-phone"></i>
                            </button>
                        </div>
                    </div>
                    
                    
                    <script language="javascript">
                        populateCountries("country", "state");
                    </script>
                </div>
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_appointment_2">
                    <button id="find_doctor_general_practicioner" class="square_blue_button" style="float: right; margin-top: 15px;">
                        <div style="margin-bottom: -8px;"><i class="icon-user-md" style="font-size: 40px;"></i></div>
                        <br/><span lang="en">General Practicioner</span>
                    </button>
                    <div style="width: 400px; height: 140px;">
                        <select name="speciality" id="speciality" size="6" style="float: left; width: 360px; margin-top: 15px;">
                            <option value="Allergy and Immunology">Allergist / Immunologist</option>
                            <option value="Anaesthetics">Aesthetician</option>
                            <option value="Cardiology">Cardiologist</option>
                            <option value="Cardiothoracic Surgery">Cardiothoracic Surgeon</option>
                            <option value="Child & Adolescent Psychiatry">Child & Adolescent Psychiatrist</option>
                            <option value="Clinical Neurophysiology">Clinical Neurophysiologist</option>
                            <option value="Dermato-Venereology">Dermato-Venereologist</option>
                            <option value="Dermatology">Dermatologist</option>
                            <option value="-Emergency Medicine">Emergency Medicine Specialist</option>
                            <option value="Endocrinology">Endocrinologist</option>
                            <option value="Gastroenterology">Gastroenterologist</option>
                            <option value="General Surgery">General Surgeon</option>
                            <option value="Geriatrics">Geriatrician</option>
                            <option value="Gynaecology and Obstetrics">Gynaecologist / Obstetrician</option>
                            <option value="Health Informatics">Health Informatics Specialist</option>
                            <option value="Infectious Diseases">Infectious Disease Specialist</option>
                            <option value="Internal Medicine">Internal Medicine Specialist</option>
                            <option value="Interventional Radiology">Interventional Radiologist</option>
                            <option value="Microbiology">Microbiologist</option>
                            <option value="Neonatology">Neonatologist</option>
                            <option value="Nephrology">Nephrologist</option>
                            <option value="Neurology">Neurologist</option>
                            <option value="Neuroradiology">Neuroradiologist</option>
                            <option value="Neurosurgery">Neurosurgeon</option>
                            <option value="Nuclear Medicine">Nuclear Medicine Specialist</option>
                            <option value="Occupational Medicine">Occupational Medicine Specialist</option>
                            <option value="Oncology">Oncologist</option>
                            <option value="Ophthalmology">Ophthalmologist</option>
                            <option value="Oral and Maxillofacial Surgery">Oral and Maxillofacial Surgeon</option>
                            <option value="Orthopaedics">Orthopedician</option>
                            <option value="Otorhinolaryngology">Otorhinolaryngologist</option>
                            <option value="Paediatric Cardiology">Paediatric Cardiologist</option>
                            <option value="Paediatric Surgery">Paediatric Surgeon</option>
                            <option value="Paediatrics">Paediatrician</option>
                            <option value="Pathology">Pathologist</option>
                            <option value="Physical Medicine and Rehabilitation">Physical Medicine and Rehabilitation Specialist</option>
                            <option value="Plastic, Reconstructive and Aesthetic Surgery">Plastic, Reconstructive and Aesthetic Surgeon</option>
                            <option value="Pneumology">Pulmonologist</option>
                            <option value="Psychiatry">Psychiatrist</option>
                            <option value="Public Health">Public Health Specialist</option>
                            <option value="Radiology">Radiologist</option>
                            <option value="Radiotherapy">Radiotherapist</option>
                            <option value="Stomatology">Stomatologist</option>
                            <option value="Vascular Medicine">Vascular Medicine Specialist</option>
                            <option value="Vascular Surgery">Vascular Surgeon</option>
                            <option value="Urology">Urologist</option>
                        </select>
                    </div>
                </div>
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_appointment_3">
                    <br/><br/><br/><br/>
                    <p id="not_found_text" style="color: #FF3730; font-weight: bold; text-align: center;" lang="en">Sorry, we could not find<br/>any general practicioners in your area.</p>
                </div>
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_time">
                    <style>
                        .days_button{
                            width: 47px;
                            height: 50px;
                            font-size: 14px;
                            color: #FFFFFF;
                            background-color: #22AEFF;
                            border: 0px solid #FFF;
                            outline: 0px;
                            margin-top: 55px;
                            margin-right: 2px;
                            float: left;
                        }
                        .day_selected{
                            background-color: #1673A5;
                        }
                        .day_disabled{
                            cursor: default;
                            background-color: #B3E4FF;
                        }
                        .slots_button{
                            width: 125px;
                            height: 30px;
                            font-size: 14px;
                            color: #FFFFFF;
                            background-color: #FF8C2C;
                            border: 0px solid #FFF;
                            outline: 0px;
                            margin-bottom: 2px;
                            float: right;
                        }
                        .slot_selected{
                            background-color: #AA5D1D;
                        }
                        .slot_disabled{
                            cursor: default;
                            background-color: #FFDABC;
                        }
                    </style>
                    <div style="height: 100%; float: right; margin-top: -20px; width: 20px;">
                        <i class="icon-chevron-left" id="time_selector_1" style="display: none;"></i>
                    </div>
                    <div style="width: 23%; height: 100%; float: right; margin-top: -20px;">
                        <button class="slots_button" id="8_10_am" style="border-top-left-radius: 4px; border-top-right-radius: 4px;">8 to 10 am</button>
                        <button class="slots_button" id="10_12">10 to 12 pm</button>
                        <button class="slots_button" id="12_2">12 to 2 pm</button>
                        <button class="slots_button" id="2_4">2 to 4 pm</button>
                        <button class="slots_button" id="4_6">4 to 6 pm</button>
                        <button class="slots_button" id="6_8">6 to 8 pm</button>
                        <button class="slots_button" id="8_10_pm" style="border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">8 to 10 pm</button>
                    </div>
                    <div style="width: 70%; height: 75px; float: left;">
                        <button class="days_button" id="sun" style="border-top-left-radius: 4px; border-bottom-left-radius: 4px;">Sun<br/>
                            <?php $today = new DateTime('now'); $today_dow = intval($today->format('N')); $dow = 0;
                            if($today_dow > $dow)
                            {
                                $date_interval = new DateInterval('P'.strval((7 - $today_dow) + $dow).'D');
                                $today->add($date_interval);
                            }
                            else if($today_dow < $dow)
                            {
                                $date_interval = new DateInterval('P'.strval($dow - $today_dow).'D');
                                $today->add($date_interval);
                                
                            }
                            echo '<span style="font-size: 10px;">'.$today->format('d M').'</span>';
                            echo '<input type="hidden" value="'.$today->format('Y-m-d').'" />';
                            ?>
                        <input type="hidden" value="" />
                        <input type="hidden" value="" />
                        </button>
                        <button class="days_button" id="mon" lang="en">Mon<br/>
                            <?php $today = new DateTime('now'); $today_dow = intval($today->format('N')); $dow = 1;
                            if($today_dow > $dow)
                            {
                                $date_interval = new DateInterval('P'.strval((7 - $today_dow) + $dow).'D');
                                $today->add($date_interval);
                            }
                            else if($today_dow < $dow)
                            {
                                $date_interval = new DateInterval('P'.strval($dow - $today_dow).'D');
                                $today->add($date_interval);
                                
                            }
                            echo '<span style="font-size: 10px;">'.$today->format('d M').'</span>';
                            echo '<input type="hidden" value="'.$today->format('Y-m-d').'" />';
                            ?>
                        <input type="hidden" value="" />
                        <input type="hidden" value="" />
                        </button>
                        <button class="days_button" id="tues" lang="en">Tues<br/>
                            <?php $today = new DateTime('now'); $today_dow = intval($today->format('N')); $dow = 2;
                            if($today_dow > $dow)
                            {
                                $date_interval = new DateInterval('P'.strval((7 - $today_dow) + $dow).'D');
                                $today->add($date_interval);
                            }
                            else if($today_dow < $dow)
                            {
                                $date_interval = new DateInterval('P'.strval($dow - $today_dow).'D');
                                $today->add($date_interval);
                                
                            }
                            echo '<span style="font-size: 10px;">'.$today->format('d M').'</span>';
                            echo '<input type="hidden" value="'.$today->format('Y-m-d').'" />';
                            ?>
                        <input type="hidden" value="" />
                        <input type="hidden" value="" />
                        </button>
                        <button class="days_button" id="wed" lang="en">Wed<br/>
                            <?php $today = new DateTime('now'); $today_dow = intval($today->format('N')); $dow = 3;
                            if($today_dow > $dow)
                            {
                                $date_interval = new DateInterval('P'.strval((7 - $today_dow) + $dow).'D');
                                $today->add($date_interval);
                            }
                            else if($today_dow < $dow)
                            {
                                $date_interval = new DateInterval('P'.strval($dow - $today_dow).'D');
                                $today->add($date_interval);
                                
                            }
                            echo '<span style="font-size: 10px;">'.$today->format('d M').'</span>';
                            echo '<input type="hidden" value="'.$today->format('Y-m-d').'" />';
                            ?>
                        <input type="hidden" value="" />
                        <input type="hidden" value="" />
                        </button>
                        <button class="days_button" id="thur" lang="en">Thur<br/>
                            <?php $today = new DateTime('now'); $today_dow = intval($today->format('N')); $dow = 4;
                            if($today_dow > $dow)
                            {
                                $date_interval = new DateInterval('P'.strval((7 - $today_dow) + $dow).'D');
                                $today->add($date_interval);
                            }
                            else if($today_dow < $dow)
                            {
                                $date_interval = new DateInterval('P'.strval($dow - $today_dow).'D');
                                $today->add($date_interval);
                                
                            }
                            echo '<span style="font-size: 10px;">'.$today->format('d M').'</span>';
                            echo '<input type="hidden" value="'.$today->format('Y-m-d').'" />';
                            ?>
                        <input type="hidden" value="" />
                        <input type="hidden" value="" />
                        </button>
                        <button class="days_button" id="fri" lang="en">Fri<br/>
                            <?php $today = new DateTime('now'); $today_dow = intval($today->format('N')); $dow = 5;
                            if($today_dow > $dow)
                            {
                                $date_interval = new DateInterval('P'.strval((7 - $today_dow) + $dow).'D');
                                $today->add($date_interval);
                            }
                            else if($today_dow < $dow)
                            {
                                $date_interval = new DateInterval('P'.strval($dow - $today_dow).'D');
                                $today->add($date_interval);
                                
                            }
                            echo '<span style="font-size: 10px;">'.$today->format('d M').'</span>';
                            echo '<input type="hidden" value="'.$today->format('Y-m-d').'" />';
                            ?>
                        <input type="hidden" value="" />
                        <input type="hidden" value="" />
                        </button>
                        <button class="days_button" id="sat" style="border-top-right-radius: 4px; border-bottom-right-radius: 4px;" lang="en">Sat<br/>
                            <?php $today = new DateTime('now'); $today_dow = intval($today->format('N')); $dow = 6;
                            if($today_dow > $dow)
                            {
                                $date_interval = new DateInterval('P'.strval((7 - $today_dow) + $dow).'D');
                                $today->add($date_interval);
                            }
                            else if($today_dow < $dow)
                            {
                                $date_interval = new DateInterval('P'.strval($dow - $today_dow).'D');
                                $today->add($date_interval);
                                
                            }
                            echo '<span style="font-size: 10px;">'.$today->format('d M').'</span>';
                            echo '<input type="hidden" value="'.$today->format('Y-m-d').'" />';
                            ?>
                        <input type="hidden" value="" />
                        <input type="hidden" value="" />
                        </button>
                    </div>
                    <div style="height: 75px; width: 70%; float: left; margin-top: 30px; margin-left: 0px;">
                        <i class="icon-chevron-up" id="day_selector_1" style="float: left; display: none;"></i>
                    </div>
                    
                </div>
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_receipt">
                    <ul style="color: #22AEFF; margin-top: 50px; margin-left: 120px;">
                        <li style="text-align: left;"><span lang="en">Receipt:</span> <strong>HTI - CR102388</strong></li>
                        <li style="text-align: left;" lang="en"><strong lang="en">Video Consultation</strong></li>
                        <li style="text-align: left;" lang="en">With a <strong>General Practicioner</strong></li>
                        <li style="text-align: left;" lang="en">next <strong>Thursday</strong> between <strong>12 and 2 pm</strong></li>
                    </ul>
                </div>
                <!-- End Appointment Pages -->
                
                <div style="width: 100%; height: 235px; padding-top: 15px; display: none;" id="find_doctor_confirmation">
                    <p style="color: #22AEFF; margin-top: 50px;" lang="en">
                        <strong lang="en">Thank you!</strong><br/><strong lang="en">Your consultation appointment is confirmed</strong><br/><span lang="en">Please be ready at the selected date and time, and follow the instructions that we sent you.</span>
                    </p>
                </div>
            </div>
            <div style="width: 100%; height: 40px; margin-top: 10px;">
                <button id="find_doctor_cancel_button" class="find_doctor_button" style="background-color: #D84840; float:left; margin-left: 0px;" lang="en">Cancel</button>
                <button id="find_doctor_close_button" class="find_doctor_button" style="background-color: #52D859; display: none; margin-left: auto; margin-right: auto; float: none;" lang="en">Close</button>
                <button id="find_doctor_next_button" class="find_doctor_button" style="background-color: #52D859;" lang="en">Next</button>
                <button id="find_doctor_previous_button" class="find_doctor_button" style="background-color: #22aeff;" lang="en">Previous</button>
            </div>
            <!--<div id="recent_doctors_section" style="display: block;">
                
                <span style="font-size: 16px; color: #555">Your Recent Doctors</span>
                <div id="recent_doctors" style="margin-bottom: 10px;">
                    <?php 
                        /*$result = mysql_query("SELECT most_recent_doc FROM usuarios where Identif='$UserID'");
                        $count=mysql_num_rows($result);
                        $row = mysql_fetch_array($result);
                        $str = $row['most_recent_doc'];
                        $str = str_replace(array("[", "]"), "", $str);
                        $ids = explode(",", $str);
                
                        date_default_timezone_set ("GMT");
                        $date = new DateTime('now');
                        for($i = 0; $i < count($ids); $i++)
                        {
                            $doc_result = mysql_query("SELECT Name,Surname,phone FROM doctors WHERE id=".$ids[$i]." AND telemed=1 AND in_consultation=0");


                            if(mysql_num_rows($doc_result) > 0)
                            {
                                $doc_row = mysql_fetch_array($doc_result);
                                $result2 = mysql_query("SELECT * FROM timeslots WHERE doc_id=".$ids[$i]);
                                $found = false;
                            
                                while(($row2 = mysql_fetch_assoc($result2)) && !$found)
                                {
                                    $start = new DateTime($row2['week'].' '.$row2['start_time']);
                                    $end = new DateTime($row2['week'].' '.$row2['end_time']);
                                    $date_interval = new DateInterval('P'.$row2['week_day'].'D');
                                    $time_interval = new DateInterval('PT'.intval(substr($row2['timezone'], strlen($row2['timezone']) - 8, 2)).'H'.intval(substr($row2['timezone'], strlen($row2['timezone']) - 5, 2)).'M');
                                    if(substr($row2['timezone'], 0 , 1) != '-')
                                    {
                                        $time_interval->invert = 1;
                                    }
                                    $start->add($date_interval);
                                    $end->add($date_interval);
                                    $start->add($time_interval);
                                    $end->add($time_interval);
                                    if($start <= $date && $end >= $date)
                                    {
                                        // doctor is available
                                        $found = true;
                                        break;
                                    }
                                    
                                }
                                if($found)
                                {
                                    echo '<button id="'.$ids[$i].'_'.$doc_row['phone'].'_'.$doc_row['Name'].'_'.$doc_row['Surname'].'" class="recent_doctor_button" style="';
                                    if($i == 0)
                                    {
                                        echo 'border-top-left-radius: 10px; border-top-right-radius: 10px; ';
                                    }
                                    if($i == (count($ids) - 1))
                                    {
                                        echo 'border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; ';
                                    }
                                    echo '">Doctor '.$doc_row['Name'].' '.$doc_row['Surname'].'</button>';
                                    
                                    
                                    
                                }
                            }
                        }*/
                    ?>
                </div>
                
                <p style="text-align: center">Or</p>
                <br/>
            </div>
            <div style="width: 100%; height: 40px; margin-left: 15px;">
                <label style="float: left;">Find me a(n) </label>
                <select style="float: left; width: 72%; margin-top: -5px; margin-left: 20px;" name="speciality" id="speciality">
                    <option value="Allergy and Immunology">Allergist / Immunologist</option>
                    <option value="Anaesthetics">Aesthetician</option>
                    <option value="Cardiology">Cardiologist</option>
                    <option value="Cardiothoracic Surgery">Cardiothoracic Surgeon</option>
                    <option value="Child & Adolescent Psychiatry">Child & Adolescent Psychiatrist</option>
                    <option value="Clinical Neurophysiology">Clinical Neurophysiologist</option>
                    <option value="Dermato-Venereology">Dermato-Venereologist</option>
                    <option value="Dermatology">Dermatologist</option>
                    <option value="-Emergency Medicine">Emergency Medicine Specialist</option>
                    <option value="Endocrinology">Endocrinologist</option>
                    <option value="Gastroenterology">Gastroenterologist</option>
                    <option value="General Practice" selected>General Practice Doctor</option>
                    <option value="General Surgery">General Surgeon</option>
                    <option value="Geriatrics">Geriatrician</option>
                    <option value="Gynaecology and Obstetrics">Gynaecologist / Obstetrician</option>
                    <option value="Health Informatics">Health Informatics Specialist</option>
                    <option value="Infectious Diseases">Infectious Disease Specialist</option>
                    <option value="Internal Medicine">Internal Medicine Specialist</option>
                    <option value="Interventional Radiology">Interventional Radiologist</option>
                    <option value="Microbiology">Microbiologist</option>
                    <option value="Neonatology">Neonatologist</option>
                    <option value="Nephrology">Nephrologist</option>
                    <option value="Neurology">Neurologist</option>
                    <option value="Neuroradiology">Neuroradiologist</option>
                    <option value="Neurosurgery">Neurosurgeon</option>
                    <option value="Nuclear Medicine">Nuclear Medicine Specialist</option>
                    <option value="Occupational Medicine">Occupational Medicine Specialist</option>
                    <option value="Oncology">Oncologist</option>
                    <option value="Ophthalmology">Ophthalmologist</option>
                    <option value="Oral and Maxillofacial Surgery">Oral and Maxillofacial Surgeon</option>
                    <option value="Orthopaedics">Orthopedician</option>
                    <option value="Otorhinolaryngology">Otorhinolaryngologist</option>
                    <option value="Paediatric Cardiology">Paediatric Cardiologist</option>
                    <option value="Paediatric Surgery">Paediatric Surgeon</option>
                    <option value="Paediatrics">Paediatrician</option>
                    <option value="Pathology">Pathologist</option>
                    <option value="Physical Medicine and Rehabilitation">Physical Medicine and Rehabilitation Specialist</option>
                    <option value="Plastic, Reconstructive and Aesthetic Surgery">Plastic, Reconstructive and Aesthetic Surgeon</option>
                    <option value="Pneumology">Pulmonologist</option>
                    <option value="Psychiatry">Psychiatrist</option>
                    <option value="Public Health">Public Health Specialist</option>
                    <option value="Radiology">Radiologist</option>
                    <option value="Radiotherapy">Radiotherapist</option>
                    <option value="Stomatology">Stomatologist</option>
                    <option value="Vascular Medicine">Vascular Medicine Specialist</option>
                    <option value="Vascular Surgery">Vascular Surgeon</option>
                    <option value="Urology">Urologist</option>
                </select>
            </div>
            <button style="width: 200px; heightL 30px; background-color: #22aeff; color: #FFF; border: 0px solid #FFF; margin: auto; margin-top: 15px; border-radius: 7px; outline: 0px;" id="find_doctor_button">Next</button>
-->
        </div>
        <div id="Talk_Section_2" style="display: none;">
            <button style="width: 200px; heightL 30px; background-color: #22aeff; color: #FFF; border: 0px solid #FFF; margin: auto; margin-top: 15px; margin-left: 20px; border-radius: 7px; outline: 0px; float: left;" id="video_call_button" lang="en">Video Call</button>
            <button style="width: 200px; heightL 30px; background-color: #22aeff; color: #FFF; border: 0px solid #FFF; margin: auto; margin-top: 15px; margin-right: 20px; border-radius: 7px; outline: 0px; float: right;" id="phone_call_button" lang="en">Phone Call</button>
           
            
        </div>
        <div id="Talk_Section_3" style="display: none;">
            <br/>
            <p lang="en">No doctors are available at this time. Please try again later.</p>
           
            
        </div>
        <div id="Talk_Section_4" style="display: none;">
            <br/>
            <p lang="en">We are now calling your doctor, please wait...</p>
           
            
        </div>
    </div>
    <!-- END MODAL VIEW TO FIND DOCTOR -->

<input type="hidden" id="NombreEnt" value="<?php echo $NombreEnt; ?>">
<input type="hidden" id="PasswordEnt" value="<?php echo $PasswordEnt; ?>">
<input type="hidden" id="UserHidden">

	<!--Header Start-->
	<div class="header" >
     	<input type="hidden" id="USERID" Value="<?php echo $UserID; ?>">	
    	<input type="hidden" id="MEDID" Value="<?php if(isset($MedID)) echo $MedID; ?>">	
    	<input type="hidden" id="IdMEDEmail" Value="<?php if(isset($MedUserEmail)) echo $MedUserEmail; ?>">	
    	<input type="hidden" id="IdMEDName" Value="<?php if(isset($MedUserName)) echo $MedUserName; ?>">	
    	<input type="hidden" id="IdMEDSurname" Value="<?php if(isset($MedUserSurname)) echo $MedUserSurname; ?>">	
    	<input type="hidden" id="IdMEDSurname" Value="<?php if(isset($MedUserSurname)) echo $MedUserSurname; ?>">	
    	<input type="hidden" id="IdMEDLogo" Value="<?php if(isset($MedUserLogo)) echo $MedUserLogo; ?>">
        <input type="hidden" id="USERNAME" Value="<?php echo $UserName; ?>">	
        <input type="hidden" id="USERSURNAME" Value="<?php echo $UserSurname; ?>">	
        <input type="hidden" id="USERPHONE" Value="<?php echo $UserPhone; ?>">	
        <input type="hidden" id="CURRENTCALLINGDOCTOR" Value="<?php echo $current_calling_doctor; ?>">	
        <input type="hidden" id="CURRENTCALLINGDOCTORNAME" Value="<?php echo $current_calling_doctor_name; ?>" />
  		
           <a href="index.html" class="logo"><h1>Health2me</h1></a>
		   
		   <div style="float:left;">
		   <a href="#en" onclick="setCookie('lang', 'en', 30); return false;"><img src="images/icons/english.png"></a>
		   </br>
			<a href="#sp" onclick="setCookie('lang', 'th', 30); return false;"><img src="images/icons/spain.png"></a>
			</div>
           
           <div class="pull-right">
           
            
           <!--Button User Start-->
		   <div class="btn-group pull-right" >
           
            <a class="btn btn-profile dropdown-toggle" id="button-profile" data-toggle="dropdown" href="#">
              <span class="name-user"><strong lang="en">Welcome</strong> <?php echo $UserName.' '.$UserSurname; ?></span> 
             <?php 
             $hash = md5( strtolower( trim( $UserEmail ) ) );
             $avat = 'identicon.php?size=29&hash='.$hash;
			?>	
              <span class="avatar" style="background-color:WHITE;"><img src="<?php echo $avat; ?>" alt="" ></span> 
              <span class="caret"></span>
            </a>
            <div class="dropdown-menu" id="prof_dropdown">
            <div class="item_m"><span class="caret"></span></div>
            <ul class="clear_ul" >
			<li>
			 <?php if ($privilege==1)
					echo '<a href="UserDashboard.php" lang="en">';
				   else if($privilege==2)
					echo '<a href="patients.php" lang="en">';
			 ?>
                
			<i class="icon-globe"></i> <span lang="en">Home</span></a></li>
            <?php
                // If this is a family subscription, load all of the users in the drop down menu
                if($plan == 'FAMILY' && count($user_accts) > 0 && ($original_access == 'Owner' || $original_access == 'Admin'))
                {
                    $count = count($user_accts);
                    echo '<div id="family_members_dropdown">';
                    for($i = 0; $i < $count; $i++)
                    {
                        echo '<li><a href="#" class="change_user_dropdown_button" id="user_'.$user_accts[$i]['ID'].'_'.$user_accts[$i]['email'].'_'.$user_accts[$i]['age'].'_dropdown" lang="en">';
                        echo '<i class="icon-user"></i> '.$user_accts[$i]['Name'].'</a></li>';
                    }
                    echo '</div>';
                }
            ?>
              
<!--              <li><a href="medicalConfiguration.php"><i class="icon-cog"></i> Settings</a></li>-->
              <li><a href="logout.php" lang="en"><i class="icon-off"></i> Sign Out</a></li>
            </ul>
            </div>
          </div>
          <!--Button User END-->  
          
          </div>
    </div>
    <!--Header END-->

<!-- Start of code inserted from userdashboard-new-pallab.php -->
<!-- Start of code for displaying modal window for Send buttton-->
<div id="modal_send" title= "Send Reports Link" style="display:none; text-align:center; padding:10px;">
    
        <form lang="en">
         Doctor's Email: <input type = "text" id="EmailID" width ="80" value='' />
        </form>
    
        <!-- add stream here -->
        <div style="width: 95%; margin: auto; height: 300px; overflow: scroll; text-align: center; margin-top: 30px; margin-bottom: 20px;" id="sendStreamContainer">
            <div style="width: 52px; height: 42px; margin-left: auto; margin-right: auto; margin-top: 100px;">
                <img src="images/load/29.gif"  alt="">
            </div>
            Loading Reports
        </div>
    
    
    
    
        <button id="CaptureEmail2Send2Doc" style="border:0px;border-radius:6px;height: 24px; width:50px; color:#FFF; background-color:#22aeff;float:bottom; margin-top:20px;" lang="en">Send</button>
    
</div>
<!-- End of code for displaying modal window for Send buttton-->

<!-- Start of code for displaying modal window for Request button -->

<div id="modal_request" title ="Request Reports" style="display:none; text-align:center; padding:10px;">
    
        <form>
         <span style="" lang="en">Email of Doctor</span> <input type = "text" id = "EmailIDRequestPage" style="width:250px">
        </form>
        
     <!--  <div style="text-align: top;margin-top:20px">
           <!--<form>-->
        <!--    <span style="" lang="en">Message</span> <textarea name = "Message" id = "MessageForDoctor" style="height:100px;width:300px;" ></textarea>      
           <!--</form>-->
       <!-- </div> -->
        
        <div> 
            <button id="CaptureEmail2Request2Doc"  style="border:0px;color:#FFF;border-radius:6px;height: 40px; width:138px;margin-top:20px;margin-right:40px;margin-left:40px;background-color:#22aeff;" lang="en">Request Reports</button>
        </div>
        
    
</div>

<!-- End of code for displaying modal window for Request button -->   
<!-- End of code inserted from userdashboard-new-pallab.php -->
 
   	 <!--- VENTANA MODAL  This has been added to show individual message content which user click on the inbox messages ---> 
   	 <button id="message_modal" data-target="#header-message" data-toggle="modal" class="btn btn-warning" style="display: none;" lang="en">Modal with Header</button> 
   	  <div id="header-message" class="modal hide" style="display: none;" aria-hidden="true">
         <div class="modal-header" lang="en">
             <button class="close" type="button" data-dismiss="modal">×</button>
                  <span lang="en">Message Details</span>
         </div>
         <div class="modal-body">
         <div class="formRow" style=" margin-top:-10px; margin-bottom:10px;">
             <span id="ToDoctor" style="color:#2c93dd; font-weight:bold;" lang="en">TO <?php echo 'Dr. '.$NameDoctor.' '.$SurnameDoctor; ?></span><input type="hidden" id="IdDoctor" value='<?php echo $IdDoctor; ?>'/>
         </div>
         <textarea  id="messagedetails" class="span message-text" style="height:200px;" name="message" rows="1"></textarea>
         
		 <form id="replymessage" class="new-message">
                   <div class="formRow">
                        <label lang="en">Subject: </label>
                        <div class="formRight">
                            <input type="text" id="subjectname_inbox" name="name"  class="span"> 
                        </div>
                   </div>
				   <div class="formRow">
						<label lang="en">Attachments: </label>
						<div id="attachreportdiv" class="formRight">
							<input type="button" class="btn btn-success" value="Attach Reports" id="attachreports">
						</div>
				   </div>
                   <div class="formRow">
                        <label lang="en">Message:</label>
                        <div class="formRight tooltip-top" style="height:120px;">
                            <textarea  id="messagecontent_inbox" class="span message-text" name="message" style="height:90px;" rows="1"></textarea>
                            
                            <div class="clear"></div>
                        </div>
                   </div>
            </form>
			<div id="attachments" style="display:none">
			
			
			
			</div>
		 </div>
         <input type="hidden" id="Idpin">
        <!-- <input type="hidden" id="docId" value="<?php if(isset($IdMed)) echo $IdMed; ?>"/> -->
         <input type="hidden" id="userId" value="<?php if(isset($IdUsu)) echo $IdUsu; ?>" />
         <div class="modal-footer">
		     <input type="button" class="btn btn-info" value="Send messages" id="sendmessages_inbox">
             <input type="button" class="btn btn-success" value="Attach" id="Attach">	
	         <input type="button" class="btn btn-success" value="Reply" id="Reply">			 
	         <a href="#" class="btn btn-primary" data-dismiss="modal" id="CloseMessage" lang="en">Close</a>
         </div>
      </div>  
	  <!--- VENTANA MODAL  ---> 	
      
      <!--- VENTANA MODAL NUMERO 2 ---> 
   	  <!--<button id="BotonModal" data-target="#header-modal" data-toggle="modal" class="btn btn-warning" style="display: none;">Modal with Header</button>-->
   	  <div id="header-modal2" class="modal hide" style="display: none; height:470px;" aria-hidden="true">
         <div class="modal-header">
             <button class="close" type="button" data-dismiss="modal">×</button>
                 <h4 lang="en">Upload New Report</h4>
                 <input type="hidden" id="URLIma" value="zero"/>
         </div>
         
         <div class="modal-body" id="ContenidoModal2" style="height:320px;">
             <div  id="RepoThumb" style="width:70px; float:right; -webkit-box-shadow: 3px 3px 14px rgba(25, 25, 25, 0.5); -moz-box-shadow:3px 3px 14px rgba(25, 25, 25, 0.5); box-shadow:3px 3px 14px rgba(25, 25, 25, 0.5);"></div>
           <div class="ContenDinamico2">
        
           <!-- <a href="#" class="btn btn-success" id="ParseReport" style="margin-top:10px; margin-bottom:10px;">Parse this report now.</a> -->

           		<form action="upload_fileUSER.php?queId=<?php echo $UserID ?>&from=0" method="post" enctype="multipart/form-data">
	           		<label for="file" lang="en">Report:</label>
	           		<input type="file" class="btn btn-success" name="file" id="file" style="margin-right:20px;"><br>


            </div>  

         </div>
         <div class="modal-footer">
	         <!--<input type="button" class="btn btn-success" value="Confirm" id="ConfirmaLink">--->
             <!--<a href="#" class="btn btn-success" data-dismiss="modal" id="GrabaDatos">Update Data</a>-->
             <input type="submit" class="btn btn-success" name="submit" value="Submit">
             <a href="#" class="btn btn-primary" data-dismiss="modal" id="CloseModal" lang="en" >Close</a>
             
             	</form>

         </div>
       </div>
	  <!--- VENTANA MODAL NUMERO 2  ---> 
 
    <!--Content Start-->
	<div id="content" style="background: #F9F9F9; padding-left:0px;">
    
    	    
	 <!--SpeedBar Start--->
     <div class="speedbar">
     <div class="speedbar-content">
     <ul class="menu-speedbar">
		
         <?php if ($privilege==1)
				 echo '<li><a href="UserDashboard.php" class="act_link" lang="en">Dashboard</a></li>';
		 ?>
    	 <li><a href="patientdetailMED-new.php?IdUsu=<?php echo $UserID;?>"  lang="en">Medical Records</a></li>
 <!--        <li><a href="medicalConfiguration.php">Configuration</a></li>-->
         <li><a href="logout.php" style="color:yellow;" lang="en">Sign Out</a></li>
     </ul>

     
     </div>
     </div>
     <!--SpeedBar END-->
     
     <style>
        #tickerwrapper{margin:0px; padding:0px;width:300px;}
         #tickerwrapper ul li{padding:5px;text-align:left}
         #tickerwrapper .container{width:300px;height:60px;overflow:hidden; float:left;display:inline-block}  
         div.H2MInText{
                        padding:0px; 
                        font-size:12px; 
                        font-family: "Arial";
                        text-align:left; 
                        color:grey; 
                        display:table-cell; 
                        vertical-align:middle;
                        padding-left:20px;
                        width:50%;  
                          
                        }
                    
        div.H2MTray{
                        width:300px; 
                        height:50px; 
                        border:1px solid #cacaca; 
                        border-radius:5px; 
                        display:table;
                        margin:0px;
                        padding: 10px;
                        background-color: #F8F8F8;
                        float:right;
                        margin-bottom: 20px;
                        vertical-align: top;
                        margin-right: 50px;
                     }
     </style>     
     
     <!--CONTENT MAIN START-->
     <div class="content">
     <div class="grid" class="grid span4" style="width:1000px; height:675px; margin: 0 auto; margin-top:30px; padding-top:30px;">
 		     <div class="row-fluid" style="height:200px;">	            
                      <div style="margin:15px; padding-top:0px;">
                             <span class="label label-success" style="left:0px; margin-left:10px; margin-top:0px; font-size:30px;" lang="en">User Dashboard</span>
                             <div class="clearfix" style="margin-bottom:20px;"></div>
                             <?php
                                          $hash = md5( strtolower( trim( $UserEmail ) ) );
                                          $avat = 'identicon.php?size=75&hash='.$hash;
                                            ?>	
                             <img src="<?php echo $avat; ?>" style="float:right; margin-right:40px; font-size:18px; padding:5px 10px 5px 10px; font-family: “Andale Mono”, AndaleMono, monospace; box-shadow: 3px 3px 15px #CACACA;"/>
                          <style>
                            div.RowNotif{      
                                  width: 100%;
                                  height: 25px;
                                  position: relative;
                                  line-height: 25px;
                                  border: 0px solid #cacaca;
                                  margin-top:3px;
                            }
                            span.TextNot{
                                float: left;
                                margin-left: 10px;  
                                font-size: 14px;
                            }
                            span.To{
                                color:grey;
                            }
                            span.Who{
                                color:#22aeff;
                                width:158px;
                            }
                            span.When{
                                color:grey;
                                width: 120px;
                                text-align: center;
                            }
                              
                          </style>  
                          
                            <div id="TrackNotifications" style="border:0px solid #cacaca; width:450px; height:100px; float:right; margin-right:50px; position:relative; overflow: auto;"></div>
 
                            <div style="display:inline-block; line-height: 200%; width: 250px;">
                            <?php if($plan == 'FAMILY' && count($user_accts) > 0 && ($original_access == 'Owner' || $original_access == 'Admin')) { ?>
                             <div style="width: 40px; height: 22px; float: right; margin-top: -5px; margin-right: -15px; margin-bottom: 5px; z-index: 2; position: relative;">
                                 <button style="border: 0px solid #FFF; height: 22px; outline: 0px; background-color: #FFF;" id="select_users_button">
                                    <i class="icon-caret-down" style="color: #22AEFF; font-size: 22px; height: 22px;"></i>
                                 </button>
                             </div>
                             <?php } ?>
                             <span id="NombreComp" style="font: bold 24px Arial, Helvetica, sans-serif; color: #3D93E0; cursor: auto; margin-left:20px; "><?php echo $UserName;?>  <?php echo $UserSurname;?></span>
                            <?php

                                if($plan == 'FAMILY' && count($user_accts) > 0 && ($original_access == 'Owner' || $original_access == 'Admin'))
                                {
                                    echo '<div id="select_users" style="font: bold 18px Arial, Helvetica, sans-serif; margin-left:20px; margin-bottom: -'.strval((count($user_accts) * 30) + 14).'px; height: '.strval(count($user_accts) * 30).'px; padding: 7px; z-index: 3; position: relative; background-color: #555; border-radius: 5px; display: none;">';
                                    echo '<div style="height: 22px; width: 30px; margin: auto; font-size: 22px; color: #555; margin-top: -22px;"><i class="icon-caret-up"></i></div>';
                                    $count = count($user_accts);
                                    for($i = 0; $i < $count; $i++)
                                    {
                                        echo '<button id="user_'.$user_accts[$i]['ID'].'_'.$user_accts[$i]['email'].'_'.$user_accts[$i]['age'].'" class="user_button" style="width: 100%; height: 30px; background-color: #22AEFF; outline: 0px; border: 1px solid #555; color: #FFF;';
                                        if($i == 0)
                                        {
                                            echo ' border-top-left-radius: 5px; border-t