<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PosterController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\TrendingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'show']);

Route::middleware(['updateApiKey'])->group(function () {
    Route::get('/trending', [TrendingController::class, 'get']);
    Route::get('/search/{keywords}', [SearchController::class, 'get']);
    Route::get('/poster/{album_id}', [PosterController::class, 'show']);
});
