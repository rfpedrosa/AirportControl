<?php
//echo dirname(__FILE__) . "\\..\\model\\Scores.php";
require(dirname(__FILE__) . "/../model/Scores.php");

if(isset($_REQUEST["name"])) {
    $name = htmlspecialchars($_REQUEST["name"]);
} else {
    $name = "Unknow";
}

if(isset($_REQUEST["score"])) {
    $score = $_REQUEST["score"];
} else {
    return;
}

if(isset($_REQUEST["country"])) {
    $country = htmlspecialchars($_REQUEST["country"]);
} else {
    $country = "Unknow";
}

Scores::addScore($name, $score, $country);

//echo dirname(__FILE__) . "\\..\\index.php";
//include(dirname(__FILE__) . "\\..\\index.php");
/* Redirect to a different page in the current directory that was requested */
$host  = $_SERVER['HTTP_HOST'];
$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
$extra = '../index.php';
//header("Location: http://$host$uri/$extra");
header("Location: http://airportcontrol.x10.mx/");
exit;

?>
