<?php

session_start();

if ($_SESSION || isset($_SESSION['genTime'])) {
  if (time() - $_SESSION['genTime'] >= 3600) {
    getNewToken();
  }
} else {
  getNewToken();
};

function getNewToken()
{
  $client_id = '8f93822c9e32410fb4aa75408ed39003';
  $client_secret = '23080da88d804a95b4843872667e7914';
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'https://accounts.spotify.com/api/token');
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HEADER, [
    'Content-Type: application/x-www-form-urlencoded',
  ]);
  curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'grant_type' => 'client_credentials',
    'client_id' => $client_id,
    'client_secret' => $client_secret
  ]));
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  $output = json_decode(curl_exec($ch));
  curl_close($ch);
  $_SESSION['token'] = $output->access_token;
  $_SESSION['genTime'] = time();
};

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="css/style.css">
  <title>Get Your Poster</title>
</head>

<body class="home">
  <div class="search-wrapper">
    <div class="search-bar">
      <input class="search-input" type="text" name="album" placeholder="Search for an album" autofocus>
      <img class="cross" src="img/cross.svg" alt="">
    </div>
  </div>
  <div class="results-wrapper">
    <h2 class="trending-title">Trending</h2>
    <div class="results"></div>
  </div>

  <script src="js/homepage.js"></script>
</body>

</html>