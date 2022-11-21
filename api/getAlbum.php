<?php

$id = $_GET['album_id'];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.deezer.com/album/" . $id);
$server_output = curl_exec($ch);
curl_close($ch);

echo $server_output;
