<?php

$keyword = $_GET['keyword'];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.deezer.com/search/album?q=" . $keyword);
$server_output = curl_exec($ch);
curl_close($ch);

echo $server_output;
