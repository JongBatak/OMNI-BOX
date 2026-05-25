<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\InteractionController;

Route::prefix('v1')->group(function () {

    // ── Public (Rate-Limited: 3 req/min per IP for brute-force protection) ────
    Route::middleware('throttle:3,1')->group(function () {
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
        Route::get('/dashboard/admin/users', [\App\Http\Controllers\AdminDashboardController::class, 'getUsers']);

        // Files – upload & delete
        Route::post('/files', [FileController::class, 'upload']);
        Route::delete('/files/{id}', [FileController::class, 'destroy']);

        // Interactions (Likes & Comments)
        Route::post('/files/{id}/like', [InteractionController::class, 'likeFile']);
        Route::delete('/files/{id}/like', [InteractionController::class, 'unlikeFile']);
        Route::post('/files/{id}/comments', [InteractionController::class, 'commentOnFile']);
        Route::delete('/files/{id}/comments/{commentId}', [InteractionController::class, 'deleteComment']);

        // Files – queries
        Route::get('/files/recent',  [GalleryController::class, 'getRecentFiles']);
        Route::get('/files/starred', [GalleryController::class, 'getStarredFiles']);

        // Gallery
        Route::get('/gallery/personal',  [GalleryController::class, 'getPersonalGallery']);
        Route::get('/gallery/community', [GalleryController::class, 'getCommunityGallery']);
    });
});

Route::middleware('auth:sanctum')->get('/user/metrics', [GalleryController::class, 'getUserMetrics']);
