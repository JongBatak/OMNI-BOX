<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Project;

class DashboardController extends Controller
{
    public function customerData(Request $request)
    {
        $user = $request->user()->load('metrics');
        
        $recentProjects = $user->projects()->latest()->take(5)->get();
        $filesByType = $user->files()
            ->selectRaw('type, count(*) as count, sum(size) as total_size')
            ->groupBy('type')
            ->get();

        return response()->json([
            'metrics' => $user->metrics,
            'recent_projects' => $recentProjects,
            'storage_breakdown' => $filesByType
        ]);
    }

    public function adminData(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $totalUsers = User::count();
        $totalStorage = User::with('metrics')->get()->sum('metrics.storage_used');
        $activeProjects = Project::where('status', 'active')->count();

        return response()->json([
            'system_health' => 'Operational',
            'server_cpu_uptime' => '99.99%',
            'total_users' => $totalUsers,
            'active_projects' => $activeProjects,
            'total_storage_bytes' => $totalStorage
        ]);
    }
}
