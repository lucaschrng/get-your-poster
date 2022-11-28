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

<body class="poster-generate hidden-title">
    <input type="hidden" class="album_id" value="<?= $_GET['album_id'] ?>">
    <span>.</span>
    <div class="poster invert"><img src="/img/folded_texture.jpg" class="overlay" alt=""></div>

    <div class="poster-img-wrapper">
        <div class="poster-img">
            <div class="poster-preview-wrapper">
                <div class="preview-wrapper">
                    <img class="preview" src="" alt="">
                    <div class="loader-wrapper">
                        <img class="loader" src="/img/loading.gif" alt="">
                    </div>
                </div>
            </div>
            <div class="right-panel">
                <div class="options">
                    <!-- <div class="option-nav">
                        <h2>Options</h2>
                    </div> -->
                    <div class="option">
                        <label for="invert">Invert colors</label>
                        <input type="checkbox" name="invert" id="invert">
                    </div>
                    <div class="option">
                        <label for="folded">No texture</label for="">
                        <input type="checkbox" name="folded" id="folded">
                    </div>
                    <div class="option">
                        <label for="wallpaper">Wallpaper size</label for="">
                        <input type="checkbox" name="wallpaper" id="wallpaper">
                    </div>
                    <div class="option">
                        <label for="justify">Justify title</label for="">
                        <input type="checkbox" name="justify" id="justify">
                    </div>
                    <div class="option">
                        <label for="hidden-artist">Hide artist<span>Recommended on with wallpaper size</span></label for="">
                        <input type="checkbox" name="hidden-artist" id="hidden-artist">
                    </div>
                    <div class="option">
                        <label for="hidden-title">Hide title<span>Recommended on with wallpaper size</span></label for="">
                        <input type="checkbox" name="hidden-title" id="hidden-title">
                    </div>
                    <div class="option">
                        <label for="hidden-tracks">Hide tracks</label for="">
                        <input type="checkbox" name="hidden-tracks" id="hidden-tracks">
                    </div>
                    <div class="option">
                        <label for="custom-color">Choose color</label for="">
                        <input type="color" name="custom-color" id="custom-color" value="">
                    </div>
                    <!-- <div class="custom-image-option">
                        <p>Drag and drop,<br>or <span class="file-select">select file</span></p>
                    </div> -->
                </div>
                <a class="download" href="">Download</a>
                <a class="new-poster" href="/">Make another poster →</a>
            </div>
        </div>
    </div>
    <script src="/js/generate.js" defer></script>
</body>

</html>