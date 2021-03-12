<?php

use Illuminate\Support\Facades\Route;
use Tipoff\LaravelAgoraApi\Http\Controllers\AgoraController;

Route::post('/agora/retrieve-token', [AgoraController::class, 'retrieveToken'])->name('agora.retrieve-token');
