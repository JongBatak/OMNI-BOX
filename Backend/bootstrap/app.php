<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
            'customer' => \App\Http\Middleware\IsCustomer::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Rate limiting — return a clear JSON 429 for the frontend
        $exceptions->renderable(function (ThrottleRequestsException $e) {
            return response()->json([
                'message' => 'Too many requests. Please try again in a minute.',
            ], 429);
        });

        // Unauthenticated — return JSON 401 instead of redirecting to /login
        $exceptions->renderable(function (AuthenticationException $e) {
            if (request()->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthenticated. Please log in.',
                ], 401);
            }
        });

        // Catch Payload Too Large exceptions from Laravel
        $exceptions->renderable(function (\Illuminate\Http\Exceptions\PostTooLargeException $e) {
            return response()->json([
                'message' => 'File exceeds server post_max_size limit. Please update php.ini on your production server.',
            ], 413);
        });
    })->create();
