<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PosterController extends Controller
{
    public function show($album_id) {
        $album = Http::withHeaders([
            'Authorization' => 'Bearer ' . session('token'),
            'Content-Type' => 'x-www-form-urlencoded'
        ])->get('https://api.spotify.com/v1/albums/' . $album_id)->json();
        return view('poster', [
            'name' => explode(' ', $album['name']),
            'artists' => implode(', ', collect($album['artists'])->pluck('name')->toArray()),
            'albumCoverUrl' => $album['images'][0]['url'],
            'tracks' => collect($album['tracks']['items'])->pluck('name')->toArray(),
            'fileName' => str_replace(' ', '_', implode('', collect($album['artists'])->pluck('name')->toArray()) . '-' . $album['name'] . '-Poster'),
        ]);
    }
}
