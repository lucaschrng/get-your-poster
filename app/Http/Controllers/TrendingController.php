<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TrendingController extends Controller
{
    function get() {
        return collect(Http::withHeaders([
            'Authorization' => 'Bearer ' . session('token'),
            'Content-Type' => 'x-www-form-urlencoded'
        ])->get('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks')->json()['items'])->filter(function ($track, $key) {
            return $track['track']['album']['album_type'] === 'album';
        })->unique('track.album.id')->map(function ($track, $key) {
            return [
                'id' => $track['track']['album']['id'],
                'name' => $track['track']['album']['name'],
                'artists' => implode(', ', collect($track['track']['album']['artists'])->pluck('name')->toArray()),
                'album_cover_url' => $track['track']['album']['images'][1]['url']
            ];
        })->values()->toArray();
    }
}
