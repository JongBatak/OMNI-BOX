<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * Creates the user with 'customer' role, initializes metrics,
     * generates a Sanctum token, and returns both.
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'customer',
        ]);

        $user->metrics()->create();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data'         => $user->load('metrics'),
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 201);
    }

    /**
     * Authenticate an existing user.
     *
     * Validates credentials, generates a Sanctum token, returns user + token.
     * Returns 401 on invalid credentials with a parseable JSON message.
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke old tokens for this device to prevent token sprawl
        $user->tokens()->where('name', $request->device_name ?? 'web')->delete();

        $token = $user->createToken($request->device_name ?? 'web')->plainTextToken;

        return response()->json([
            'data'         => $user->load('metrics'),
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    /**
     * Revoke the current access token (logout).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Return the currently authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json([
            'data' => $request->user()->load('metrics'),
        ]);
    }
}
