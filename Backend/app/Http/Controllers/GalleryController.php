<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Personal Gallery — all files belonging to the authenticated user.
     * (is_community_shared = false OR true — shows everything the user owns)
     */
    public function getPersonalGallery(Request $request)
    {
        $query = File::where('user_id', $request->user()->id);

        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->has('format') && $request->format !== '') {
            $query->where('type', 'like', '%' . $request->format . '%');
        }

        $files = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($file) => $this->appendUrl($file));

        return response()->json([
            'data'  => $files,
            'count' => $files->count(),
        ]);
    }

    /**
     * Community Gallery — all files marked as community_shared, with uploader info.
     */
    public function getCommunityGallery(Request $request)
    {
        $query = File::with(['user:id,name,email', 'comments.user:id,name'])
            ->withCount('likes')
            ->where('is_community_shared', true);

        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->has('format') && $request->format !== '') {
            $query->where('type', 'like', '%' . $request->format . '%');
        }

        $files = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($file) => $this->appendUrl($file));

        return response()->json([
            'data'  => $files,
            'count' => $files->count(),
        ]);
    }

    /**
     * Recent Files — last 10 files uploaded by the authenticated user.
     */
    public function getRecentFiles(Request $request)
    {
        $files = File::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn ($file) => $this->appendUrl($file));

        return response()->json([
            'data'  => $files,
            'count' => $files->count(),
        ]);
    }

    /**
     * Starred Files — files the authenticated user has starred.
     */
    public function getStarredFiles(Request $request)
    {
        $files = File::where('user_id', $request->user()->id)
            ->where('is_starred', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($file) => $this->appendUrl($file));

        return response()->json([
            'data'  => $files,
            'count' => $files->count(),
        ]);
    }

    /**
     * User Metrics — get storage usage and total files.
     */
    public function getUserMetrics(Request $request)
    {
        $userId = $request->user()->id;
        $totalSizeKb = File::where('user_id', $userId)->sum('size');
        $totalFiles = File::where('user_id', $userId)->count();

        return response()->json([
            'total_storage_used' => (int) $totalSizeKb,
            'total_files' => $totalFiles,
            'storage_limit' => 15000000, // 15GB in KB
        ]);
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private function appendUrl(File $file): File
    {
        $file->url = asset('storage/' . $file->path);
        return $file;
    }
}
