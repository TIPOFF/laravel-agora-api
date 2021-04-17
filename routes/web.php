<?php

use Illuminate\Support\Facades\Route;
use Tipoff\LaravelAgoraApi\Http\Controllers\AgoraController;

Route::post('/retrieve-token', [AgoraController::class, 'retrieveToken'])->name('agora.retrieve-token');
Route::post('/place-call', [AgoraController::class, 'placeCall'])->name('agora.place-call');
Route::post('/reject-call', [AgoraController::class, 'rejectCall'])->name('agora.reject-call');
