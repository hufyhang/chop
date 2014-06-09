<?php
header('Content-Type: text/css;charset=utf-8');

$GITHUB = 'https://raw.githubusercontent.com/hufyhang/chop/master/css/';
$q = $_GET['q'];
$url = $GITHUB . $q . '.css';
echo url_get_contents($url);

function url_get_contents ($url) {
    if (!function_exists('curl_init')){
        die('CURL is not installed!');
    }
    $ch = curl_init();
    curl_setopt_array( $ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_URL => $url) );
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}
?>
