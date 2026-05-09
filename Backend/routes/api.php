<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\GalleryController;

Route::prefix('v1')->group(function () {

    // ── Public (Rate-Limited: 5 req/min per IP for brute-force protection) ────
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login',    [AuthController::class, 'login']);
    });

    // ── Protected (Sanctum) ──────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::get('/auth/me',      [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboards
        Route::get('/dashboard/customer', [DashboardController::class, 'customerData']);
        Route::get('/dashboard/admin',    [DashboardController::class, 'adminData']);

        // Files – upload
        Route::post('/files', [FileController::class, 'upload']);

        // Files – queries
        Route::get('/files/recent',  [GalleryController::class, 'getRecentFiles']);
        Route::get('/files/starred', [GalleryController::class, 'getStarredFiles']);

        // Gallery
        Route::get('/gallery/personal',  [GalleryController::class, 'getPersonalGallery']);
        Route::get('/gallery/community', [GalleryController::class, 'getCommunityGallery']);
    });
});

Route::middleware('auth:sanctum')->get('/user/metrics', [GalleryController::class, 'getUserMetrics']);
