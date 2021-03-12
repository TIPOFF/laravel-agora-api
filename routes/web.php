<?php

use Illuminate\Support\Facades\Route;
use Tipoff\LaravelAgoraApi\Http\Controllers\AgoraController;

Route::post('/retrieve-token', [AgoraController::class, 'retrieveToken'])->name('agora.retrieve-token');
