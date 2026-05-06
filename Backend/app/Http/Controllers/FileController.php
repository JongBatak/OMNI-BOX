<?php
namespace App\Http\Controllers;
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
}
