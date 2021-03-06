<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('search', 'MusicBrainzController@search');
Route::get('get_song_or_lyric', 'LyricController@getSongOrLyric');
Route::get('get_revision', 'LyricController@getRevision');
Route::get('get_recent', 'HomeController@getRecent');

Route::post('test', 'LyricController@testFunc');

Route::group(['middleware' => ['auth:sanctum', 'can:contribute']], function() {
	Route::post('contribute', 'LyricController@contribute');
});

Route::group(['middleware' => ['auth:sanctum', 'can:approve']], function() {
	Route::get('need_review', 'HomeController@getNeedReview');
	Route::post('approve', 'LyricController@approve');
	Route::post('reject', 'LyricController@reject');
});

Route::group([
	'prefix' => 'auth'
], function () {
	Route::post('login', 'AuthController@login');
	Route::post('register', 'AuthController@register');

	Route::group(['middleware' => 'auth:sanctum'], function () {
		Route::get('logout', 'AuthController@logout');
		Route::get('user', 'AuthController@user');
	});
});

Route::fallback(function() {
	return response()->json(['message' => 'Not Found'], 404);
});

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
