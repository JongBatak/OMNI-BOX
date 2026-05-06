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
}
