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
    $client_id = $_ENV['SPOTIFY_CLIENT_ID'];
    $client_secret = $_ENV['SPOTIFY_CLIENT_SECRET'];
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
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" id="viewportMeta">
    <link rel="stylesheet" href="/css/style.css">
    <title>Get Your Poster</title>
</head>

<body class="poster-generate">
    <input type="hidden" class="album_id" value="<?= $_GET['album_id'] ?>">
    <span>.</span>
    <div class="poster"></div>

    <div class="poster-img">
        <div class="poster-preview">
            <p>Preview</p>
            <div class="preview-wrapper">
                <img class="preview" src="" alt="">
                <img class="loader" src="/img/loading.gif" alt="">
            </div>
        </div>
        <a class="download" href="">Download</a>
        <a class="new-poster" href="/">Make another poster →</a>
    </div>
    <script src="/js/generate.js"></script>
</body>

</html>