<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'revenue' => '$2.4M',
                'active_users' => 14208,
                'servers' => [
                    ['name' => 'US-East-1', 'status' => 'Optimal', 'load' => 45],
                    ['name' => 'EU-West-2', 'status' => 'Warning', 'load' => 88],
                ],
                'logs' => [
                    ['id' => 1, 'action' => 'System Update Complete', 'time' => '2 mins ago'],
                    ['id' => 2, 'action' => 'New Node Connected', 'time' => '15 mins ago'],
                    ['id' => 3, 'action' => 'Security Scan Clear', 'time' => '1 hour ago'],
                ]
            ]
        ]);
    }

    public function getUsers(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = \App\Models\User::with('metrics')
            ->withCount('files')
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'storage_used' => $u->metrics ? $u->metrics->storage_used : 0,
                    'storage_limit' => 15000000, // 15 GB
                    'total_files' => $u->files_count,
                    'created_at' => $u->created_at,
                ];
            });

        return response()->json(['data' => $users]);
    }
}
