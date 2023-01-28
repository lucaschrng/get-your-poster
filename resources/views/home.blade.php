<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
{{--  <link rel="stylesheet" href="{{ asset('/css/style.css') }}">--}}
    @vite(['resources/scss/main.scss', 'resources/js/home.js'])
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
    <h2 class="trending-title">Trending:</h2>
    <div class="results"></div>
  </div>

{{--  <script src="{{ asset('/js/home.js') }}"></script>--}}
</body>

</html>
