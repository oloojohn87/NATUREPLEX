<?php
 //   echo '<table><tr><td>TEST</td></tr></table>';
 
 require("environment_detail.php");
 $dbhost = $env_var_db['dbhost'];
 $dbname = $env_var_db['dbname'];
 $dbuser = $env_var_db['dbuser'];
 $dbpass = $env_var_db['dbpass'];

$tbl_name="doctors"; // Table name

$link = mysql_connect("$dbhost", "$dbuser", "$dbpass")or die("cannot connect");
mysql_select_db("$dbname")or die("cannot select DB");	

$queUsu = $_GET['Doctor'];
$UserDOB = $_GET['DrEmail'];
$NReports = $_GET['NReports'];
$Username=empty($_GET['Username'])   ? 99 : $_GET['Username'];
$Todoc=empty($_GET['ToDoc']) ? -1:$_GET['ToDoc'];

$ArrayPacientes = array();
if($Username!='99'){
$numeral=0;
$patient_result=mysql_query("Select * from Usuarios where Surname like '%$Username%' or name like '%$Username%' or IdUsFIXEDNAME like '%$Username%'");

	while($row= mysql_fetch_array($patient_result)){
		$ArrayPacientes[$numeral]=$row['Identif'];
		$numeral++;
	}
}

if($Todoc==-1){
$query="SELECT * FROM doctorslinkdoctors WHERE IdMED = '$queUsu' ORDER BY IdMED2 DESC";
}else{
$query="SELECT * FROM doctorslinkdoctors WHERE IdMED = '$queUsu' and IdMED2='$Todoc' ORDER BY IdMED2 DESC";
}
//echo $query;
//echo '<br>';
$result = mysql_query($query);

	echo  '<table class="table table-mod" id="TablaSents" style="height:100px; width:600px; overflow-y:hidden; table-layout: fixed; border: 1px SOLID #CACACA;">';
	echo '<thead><tr >
    <th style="width:300px;">Patient and Doctor</th>
    <th style="width:320px;">Status</th>
    <th style="width:60px;">Linked?</th>
    <th style="width:100px;">Tools</th>
    </tr></thead>';
	echo '<tbody>';

while ($row = mysql_fetch_array($result)) {

$referral_date=$row['Fecha'];

$referral_id = $row['id'];
$result2B = mysql_query("select stage,datevisit from referral_stage where referral_id='$referral_id'");
$row2B = mysql_fetch_array($result2B);
$referral_stage=$row2B['stage'];
$last_date=$row2B['datevisit'];
       
$seekthis = $row['IdMED2'];
$IdReferral = $row['IdMED2'];     
$result2 = mysql_query("SELECT * FROM doctors WHERE id = '$seekthis' ");
$emailD2='';
$NameD2='';
$SurnameD2='';

while ($row2 = mysql_fetch_array($result2)) {
	$NameD2 = empty($row2['Name'])? '' : $row2['Name'];
	$SurnameD2 = empty($row2['Surname'])? '' : $row2['Surname'];
	
	if($NameD2=='' and $SurnameD2==''){
	$emailD2=$row2['IdMEDEmail'];
	}
	$RoleD2 = $row2['Role'];
	$TreatD2 = '';
	if ($RoleD2 == '1') $TreatD2 = 'Dr.';
}
$seekthis = $row['IdPac'];
$IdPatient = $row['IdPac']; 

//Changes for filtering the patient name
if($Username!='99'){
	if(!in_array($IdPatient, $ArrayPacientes)){
			continue;
	} 
}

$result2 = mysql_query("SELECT * FROM usuarios WHERE Identif = '$seekthis' ");

while ($row2 = mysql_fetch_array($result2)) {
	$NameP = $row2['Name'];
	$SurnameP = $row2['Surname'];
    $idP = $row2['Identif'];
}

$validated = '<a href="#"><span class="label label-success" style="left:0px; margin-left:0px; margin-top:20px; margin-bottom:5px; font-size:14px; background-color:red;">NO</span></a>';
if ($row['estado']==2) $validated = '<a href="#"><span class="label label-info" style="left:0px; margin-left:0px; margin-top:20px; margin-bottom:5px; font-size:14px; background-color: #31B404;">YES</span></a>';
//echo '<tr id="'.$row['id'].'" style="height:10px; line-height:0;">';
//echo '<td>'.date("F j, Y",strtotime($row['Fecha'])).'</td>';
//echo '<td>'.$NameP.' '.$SurnameP.'</td>';
$nomDoc = 'empty';
if($NameD2=='' and $SurnameD2==''){
    $nomDoc = $emailD2;
    //$nomDoc = 'Dr. email';
}else{
    $nomDoc =  $TreatD2.$NameD2.' '.$SurnameD2;
    //$nomDoc = 'Dr. Name Surname';
}

//echo '<td style="text-align:center;">YES</td>';
//echo '<td style="text-align:center;">'.$validated.'</td>';
/*
if ($row['estado']==2)
{
	echo '<td class="CFILASents" id="'.$row['id'].'"><div id="BotRevoke" style="margin-left:0px; margin-top:0px; float:left; " class="pull-left"><a href="#" class="btn" title="Send Invitation" style="width:80px;"><i class="icon-remove"></i>Revoke</a> </div></td>';
}else
{
	echo '<td class="CFILASents" id="'.$row['id'].'"><div id="BotCancel" style="margin-left:0px; margin-top:0px; float:left; " class="pull-left"><a href="#" class="btn" title="Send Invitation" style="width:80px;"><i class="icon-remove-sign" ></i>Cancel</a> </div></td>';
}
*/
$switchA='LetterCircleOFF';
$switchB='LetterCircleOFF';
$switchC='LetterCircleOFF';
$switchD='LetterCircleOFF';
$daystovisit='n/a';
    
switch ($referral_stage){
	case -1:$switchA='LetterCircleRED';
			break;
    case 1: $switchA='LetterCircleON';
            break;
    case 2: $switchA='LetterCircleON';
            $switchB='LetterCircleON';
            break;
    case 3: $switchA='LetterCircleON';
            $switchB='LetterCircleON';
            $switchC='LetterCircleON';
            break;
    case 4: $switchA='LetterCircleON';
            $switchB='LetterCircleON';
            $switchC='LetterCircleON';
            $switchD='LetterCircleON';
            break;
    default:$whatever=0;
            break;
}   
    
$dayscolor = '#cacaca';
$text_time='Time-Waiting';
if ($referral_stage > 1)
{
    $dayscolor = 'grey';
    $current_date = date("Y-m-d");
    //$current_date = $referral_date;
    $current_date = date("Y-m-d");
    $db_date = $last_date;//date("Y-m-d");
    //echo ' ***: '.$current_date.' / '.$db_date;
    //$diff = abs(strtotime($current_date) - strtotime($db_date));
    $diff = abs(strtotime($current_date) - strtotime($referral_date));
    $daystovisit = floor ($diff /  (60*60*24));
    if ($referral_stage == 4) {$dayscolor='orange'; $text_time='Time-to-Visit';}
}
 
//$tbl_name="MESSAGES"; // Table name
//$link = mysql_connect("$dbhost", "$dbuser", "$dbpass")or die("cannot connect");
//mysql_select_db("$dbname")or die("cannot select DB");	

$IdMED= $queUsu;
$patientid=$IdPatient;
//echo "SELECT * FROM message_infrasture WHERE receiver_id='$IdMED' and patient_id='$patientid' and status='read' ORDER BY fecha DESC" ;
$resultMC = mysql_query("SELECT * FROM message_infrasture WHERE receiver_id='$IdMED' and patient_id='$patientid' and status='new' ORDER BY fecha DESC");
$countMC=mysql_num_rows($resultMC);    

$visible_baloon = 'hidden';
$color_envelope = '#cacaca';    
if ($countMC>0) {$visible_baloon = 'visible'; $color_envelope='#22aeff';}
if (strlen($nomDoc) >18) $AddNom = '.. '; else $AddNom='';    
if (strlen($NameP.' '.$SurnameP) >18) $AddNomP = '.. '; else $AddNomP='';    
//New design for rows (sandbox)    
echo '<tr class="ROWREF" id="'.$idP.'" style="height:10px; line-height:0;">';
echo '<td style="height:10px; width:200px; line-height:0;">
<div style="padding:10px;">
<span style="font-size:16px; color:#54bc00;">'.substr($NameP.' '.$SurnameP,0,8).$AddNomP.'</span>
<span style="font-size:12px; color:grey;">  to </span>
<img src="images/FlatH2M.png" alt="" width="30" height="30">
<span style="font-size:16px; color:#22aeff;">'.substr($nomDoc,0,18).$AddNom.'</span>
<div style="width:100%; margin-top:15px;"></div>
<span style="font-size:10px; color:grey;">'.date("F j, Y",strtotime($row['Fecha'])).'</span>
</div>
</td>';

    
    //<span style="font-size:12px; color:grey;">Stages</span>
    //<div style="width:100%; margin-top:15px;"></div>
echo '<td style="height:10px; width:200px; line-height:0;">
<div class="'.$switchA.'">A</div>
<div class="'.$switchB.'">B</div>
<div class="'.$switchC.'">C</div>
<div class="'.$switchD.'">D</div>
<div style="position:relative; left:45px; top:10px; height:10px; font-size:10px; color:grey; margin-left:45px; width:150px; margin-top:0px; color:'.$dayscolor.'">'.$text_time.'</div>
<div style="float:left; width:100px; font-size:16px; color:orange; margin-left:45px; margin-top:15px; color:'.$dayscolor.'">'.$daystovisit.' days</div>
<i class="icon-envelope icon-2x" style="color:'.$color_envelope.'; margin-left:0px; margin-top:10px;"></i>
<span style="visibility:'.$visible_baloon.'" class="H2MBaloon">'.$countMC.'</span>

</td>';


/*
echo '<td style="height:10px; width:200px; line-height:0;">
<div style="padding:10px; margin-top:0px;">
<span style="font-size:22px; color:#54bc00; margin-left:20px;">A</span>
<span style="font-size:22px; color:#54bc00; margin-left:20px;">B</span>
<span style="font-size:22px; color:lightgrey; margin-left:20px;">C</span>
<span style="font-size:22px; color:lightgrey; margin-left:20px;">D</span>
<span style="font-size:20px; color:grey; margin-left:25px;">6.5 days</span>
<i class="icon-envelope icon-2x" style="color:#cacaca; margin-left:25px;"></i>
<span style="" class="H2MBaloon">2</span>
<div style="width:100%; margin-top:15px;"></div>
</div>
</td>';
*/
  //<span style="font-size:12px; color:grey; margin-left:20px; font-style:italic;">Scheduled</span>

echo '<td style="text-align:center; padding-top:18px;">'.$validated.'</td>';

if ($row['estado']==2)
{
	if($referral_stage==-1 or $referral_stage==0){
		echo '<td class="CFILASents" id="'.$row['id'].'" style="text-align:center;"><div id="BotRevoke" style="text-align:center; margin-left:0px; margin-top:0px; font-size:10px;" class=""><a href="javascript:void(0)" class="btn" title="Revoke Referral" ><i class="icon-off"></i>Revoke</a></div></td>';
	}else if($referral_stage==4){
		echo '<td class="CFILASents" id="'.$row['id'].'" style="text-align:center;"><div id="BotArchive" style="text-align:center; margin-left:0px; margin-top:0px; font-size:10px;" class=""><a href="javascript:void(0)" class="btn" title="Archive Referral" ><i class="icon-off"></i>Archive</a></div></td>';
	}else {
		echo '<td class="CFILASents" id="'.$row['id'].'" style="text-align:center;"><div style="text-align:center; margin-left:0px; margin-top:0px; font-size:14px;" class=""><a href="javascript:void(0)" class="btn" title="Click to see details" >Details</a></div></td>';
	}
}else
{
	echo '<td class="CFILASents" id="'.$row['id'].'"><div id="BotCancel" style="margin-left:0px; margin-top:0px; float:left; " class="pull-left"><a href="javascript:void(0)" class="btn" title="Cancel Referral" style="text-align:center;  width:10px; font-size:12px;"><i class="icon-remove-sign" ></i></a></div></td>';
}    
 
    
}

echo '</tbody></table>';    
    

?>