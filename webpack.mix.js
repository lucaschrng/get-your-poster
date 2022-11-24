let mix = require('laravel-mix');

mix
    .sass('resources/scss/main.scss', 'public/css/style.css')
    .js('resources/js/homepage.js', 'public/js/')
    .js('resources/js/generate.js', 'public/js/')