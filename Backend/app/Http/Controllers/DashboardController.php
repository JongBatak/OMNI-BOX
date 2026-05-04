<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function customerData(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
            'storage_status' => '45GB used',
            'recent_projects' => [
                ['id' => 1, 'name' => 'Project Alpha'],
                ['id' => 2, 'name' => 'Project Beta'],
            ],
            'tier' => 'Pro Omnispace'
        ]);
    }

    public function adminData(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden - Admins only'], 403);
        }

        return response()->json([
            'server_metrics' => [
                'cpu_usage' => '42%',
                'memory_usage' => '68%',
            ],
            'revenue_stats' => [
                'mrr' => '$12,450',
                'growth' => '+15%',
            ],
            'recent_alerts' => [
                ['id' => 1, 'message' => 'High load on Web Node 2', 'severity' => 'warning'],
            ]
        ]);
    }
}