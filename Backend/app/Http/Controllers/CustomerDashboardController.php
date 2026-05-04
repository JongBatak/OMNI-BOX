<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'storage_used' => '45%',
                'subscription_tier' => 'Premium',
                'recent_files' => [
                    ['name' => 'Project_Alpha_Assets.zip', 'size' => '2.4 GB', 'date' => 'Today, 14:30'],
                    ['name' => 'Q3_Financial_Report.pdf', 'size' => '4.1 MB', 'date' => 'Yesterday'],
                    ['name' => 'Omni_Brand_Kit.fig', 'size' => '128 MB', 'date' => 'Oct 24']
                ],
                'feed' => [
                    ['user' => 'Sarah Jenkins', 'action' => 'shared a folder with you', 'target' => 'Design Resources', 'time' => '2h ago'],
                    ['user' => 'Alex Chen', 'action' => 'commented on', 'target' => 'Q3_Financial_Report.pdf', 'time' => '5h ago']
                ]
            ]
        ]);
    }
}
