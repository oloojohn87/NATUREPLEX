<?php
/*
Uploadify
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

 session_start();
 require "environment_detail.php";
$dbhost = $env_var_db['dbhost'];
$dbname = $env_var_db['dbname'];
$dbuser = $env_var_db['dbuser'];
$dbpass = $env_var_db['dbpass'];
		
		
$path_for_ffmpeg = "ffmpeg\\bin\\";
		
$link = mysql_connect("$dbhost", "$dbuser", "$dbpass")or die("cannot connect");
mysql_select_db("$dbname")or die("cannot select DB");
$enc_result = mysql_query("select pass from encryption_pass where id = (select max(id) from encryption_pass)");
$row_enc = mysql_fetch_array($enc_result);
$enc_pass=$row_enc['pass'];
// Define a destination
$targetFolder = '/PatientImage'; // Relative to the root

$verifyToken = md5('unique_salt' . $_POST['timestamp']);

if (!empty($_FILES) && $_POST['token'] == $verifyToken) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
	$targetFile = rtrim($targetPath,'/') . '/' .$_FILES['Filedata']['name'];
	$dimLess= "0";
	// Validate the file type
	$fileTypes = array('jpg','jpeg','gif','png'); // File extensions
	$fileParts = pathinfo($_FILES['Filedata']['name']);
	$newTargetFile = rtrim($targetPath,'/') . '/' .$_SESSION['MEDID'].'.'.$fileParts['extension'];
	
	
	if (in_array($fileParts['extension'],$fileTypes)) {
		move_uploaded_file($tempFile,$newTargetFile);
		list($width, $height, $type, $attr) = getimagesize($newTargetFile);
		if($width<80 || $height<80)
		{
			 $dimLess= "1";
			 unlink($newTargetFile);
		}
			shell_exec('../../Encrypt.bat PatientImage '.$_SESSION['MEDID'].'.'.$fileParts['extension'].' '.$enc_pass);          //Encrypt the image (prasanna)
		echo $targetFolder. '/' .$_SESSION['MEDID'].'.'.$fileParts['extension']."|".$dimLess;
	} else {
		echo 'fileError';
	}
}
?>