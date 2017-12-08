<?php
define('INCLUDE_CHECK',1);
require "logger.php";

$IDBLOCK = $_GET['IDBLOCK'];
$Content = $_GET['Content'];
$IdMEDEmail = $_GET['IdMEDEmail'];
$IdMEDRESERV = $_GET['IdMEDRESERV'];
$IdUsFIXED = $_GET['IdUsFIXED'];
$IdUsFIXEDNAME = $_GET['IdUsFIXEDNAME'];
$IdUsRESERV = $_GET['IdUsRESERV'];
$Canal = $_GET['Canal'];
$VIEWIdUser = $_GET['VIEWIdUser'];
$VIEWIdMed = $_GET['VIEWIdMed'];
$VIEWIP = $_GET['VIEWIP'];


LogBLOCKAMP ($IDBLOCK, $Content, $VIEWIdUser, $VIEWIdMed, $VIEWIP)

?>