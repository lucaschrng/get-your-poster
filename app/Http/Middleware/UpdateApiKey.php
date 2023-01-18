<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use MongoDB\Driver\Session;

function getNewToken()
{
    $response = Http::asForm()->post('https://accounts.spotify.com/api/token', [
        'grant_type' => 'client_credentials',
        'client_id' => $_ENV['SPOTIFY_CLIENT_ID'],
        'client_secret' => $_ENV['SPOTIFY_CLIENT_SECRET'],
    ])->json();
    session([
        'token' => $response['access_token'],
        'genTime' => time()
    ]);
}

class UpdateApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (session('genTime')) {
            if (time() - session('genTime') >= 3600) {
                getNewToken();
            }
        } else {
            getNewToken();
        };
        return $next($request);
    }
}
