let mix = require('laravel-mix');

mix
    .sass('resources/scss/main.scss', 'public/css/style.css')
    .js('resources/js/home.js', 'public/js/')
    .js('resources/js/poster.js', 'public/js/')
