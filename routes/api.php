<?php

use App\Http\Controllers\SupervisorController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/supervisor/dashboard', [SupervisorController::class, 'index']);
    Route::post('/submissions/{submission}/approve', [SupervisorController::class, 'approve']);
    Route::post('/submissions/{submission}/reject', [SupervisorController::class, 'reject']);
});
