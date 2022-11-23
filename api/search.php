<?php

$keyword = implode('+', explode(' ', $_GET['keyword']));
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.deezer.com/search/album?q=' . $keyword);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
