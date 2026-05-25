<?php
namespace App\Http\Controllers;
use App\Models\File;
use App\Http\Requests\FileUploadRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function upload(FileUploadRequest $request)
    {
        $file = $request->file('file');
        $path = $file->store('omnibox/' . $request->user()->id, 'public');

        $dbFile = $request->user()->files()->create([
            'name' => $file->getClientOriginalName(),
            'type' => $request->type,
            'size' => $file->getSize(),
            'project_id' => $request->project_id,
            'path' => $path,
            'url' => Storage::url($path)
        ]);

        $metrics = $request->user()->metrics;
        $metrics->increment('storage_used', $file->getSize());

        return response()->json(['data' => $dbFile], 201);
    }

    public function getRecentFiles(Request $request)
    {
        $files = File::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($file) {
                $file->url = asset('storage/' . $file->path);
                return $file;
            });

        return response()->json($files);
    }

    public function getStarredFiles(Request $request)
    {
        $files = File::where('user_id', $request->user()->id)
            ->where('is_starred', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($file) {
                $file->url = asset('storage/' . $file->path);
                return $file;
            });

        return response()->json($files);
    }

    public function destroy(Request $request, $id)
    {
        $file = File::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        
        Storage::disk('public')->delete($file->path);
        
        $metrics = $request->user()->metrics;
        if ($metrics) {
            $metrics->decrement('storage_used', $file->size);
        }
        
        $file->delete();
        
        return response()->json(['message' => 'File deleted successfully']);
    }
}
