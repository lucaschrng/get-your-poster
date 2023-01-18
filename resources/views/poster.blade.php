<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" id="viewportMeta">
    <link rel="stylesheet" href="{{ asset('/css/style.css') }}">
    <title>Get Your Poster</title>
</head>

<body class="poster-generate">
    <span>.</span>
    <div class="poster invert">
        <img src="{{ asset('/img/folded_texture.jpg') }}" class="overlay" alt="">
        <div>
            <h2>{{ $artists }}</h2>
            <h1 class="album-title">
                @foreach($name as $word)
                    <span>{{ $word }}</span>
                @endforeach
            </h1>
        </div>
        <img src="{{ $albumCoverUrl }}" class="album-cover">
        <ul style="grid-template-rows: repeat({{ ceil(count($tracks)/2) }}, 1fr);" class="tracklist">
            @foreach($tracks as $track)
                <li><span>{{ $loop->iteration }}</span><span class="separator"></span><span>{{ $track }}</span></li>
            @endforeach
        </ul>
    </div>

    <div class="poster-img-wrapper">
        <div class="poster-img">
            <div class="poster-preview-wrapper">
                <div class="preview-wrapper">
                    <img class="preview" src="" alt="">
                    <div class="loader-wrapper">
                        <img class="loader" src="{{ asset('/img/loading.gif') }}" alt="">
                    </div>
                </div>
            </div>
            <div class="right-panel">
                <div class="options">
                    <div class="option">
                        <label for="invert">Invert colors</label>
                        <input type="checkbox" name="invert" id="invert">
                    </div>
                    <div class="option">
                        <label for="folded">No texture</label>
                        <input type="checkbox" name="folded" id="folded">
                    </div>
                    <div class="option">
                        <label for="wallpaper">Wallpaper size</label>
                        <input type="checkbox" name="wallpaper" id="wallpaper">
                    </div>
                    <div class="option">
                        <label for="justify">Justify title</label>
                        <input type="checkbox" name="justify" id="justify">
                    </div>
                    <div class="option">
                        <label for="hidden-artist">Hide artist<span>Recommended on with wallpaper size</span></label>
                        <input type="checkbox" name="hidden-artist" id="hidden-artist">
                    </div>
                    <div class="option">
                        <label for="hidden-title">Hide title<span>Recommended on with wallpaper size</span></label>
                        <input type="checkbox" name="hidden-title" id="hidden-title">
                    </div>
                    <div class="option">
                        <label for="hidden-tracks">Hide tracks</label>
                        <input type="checkbox" name="hidden-tracks" id="hidden-tracks">
                    </div>
                    <div class="option">
                        <label for="custom-color">Choose color</label>
                        <input type="color" name="custom-color" id="custom-color">
                    </div>
                    <div class="option custom-image">
                        <p>Drag and drop,<br>or
                            <button>select file<input type="file" accept="image/png, image/jpg" class="file-select"></button>
                        </p>
                    </div>
                </div>
                <a class="download" href="" download="{{ $fileName }}">Download</a>
                <a class="new-poster" href="/">Make another poster →</a>
            </div>
        </div>
    </div>
    <script src="{{ asset('/js/poster.js') }}" defer></script>
</body>

</html>
