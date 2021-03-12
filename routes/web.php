<?php

use Illuminate\Support\Facades\Route;

Route::post('/agora/retrieve-token', 'App\Http\Controllers\AgoraController@retrieveToken');
