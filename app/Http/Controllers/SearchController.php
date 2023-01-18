<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SearchController extends Controller
{
    function get($keywords) {
        return collect(Http::withHeaders([
            'Authorization' => 'Bearer ' . session('token'),
            'Content-Type' => 'x-www-form-urlencoded'
        ])->get('https://api.spotify.com/v1/search?q=' . urlencode($keywords) . '&type=album')->json()['albums']['items'])->filter(function ($album, $key) {
            return $album['album_type'] === 'album';
        })->map(function ($album, $key) {
            return [
                'id' => $album['id'],
                'name' => $album['name'],
                'artists' => implode(', ', collect($album['artists'])->pluck('name')->toArray()),
                'album_cover_url' => $album['images'][1]['url']
            ];
        })->values()->toArray();
    }
}
