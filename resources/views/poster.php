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