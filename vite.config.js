import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/scss/main.scss',
                'resources/js/home.js',
                'resources/js/poster.js'
            ],
            refresh: true,
        }),
    ],
});
