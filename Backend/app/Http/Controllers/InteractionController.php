<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Like;
use App\Models\Comment;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function likeFile(Request $request, $id)
    {
        $file = File::findOrFail($id);
        
        Like::firstOrCreate([
            'user_id' => $request->user()->id,
            'file_id' => $file->id
        ]);
        
        return response()->json(['message' => 'File liked successfully']);
    }

    public function unlikeFile(Request $request, $id)
    {
        Like::where('user_id', $request->user()->id)
            ->where('file_id', $id)
            ->delete();
            
        return response()->json(['message' => 'File unliked successfully']);
    }

    public function commentOnFile(Request $request, $id)
    {
        $request->validate(['content' => 'required|string|max:1000']);
        $file = File::findOrFail($id);
        
        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'file_id' => $file->id,
            'content' => $request->content
        ]);
        
        $comment->load('user:id,name');
        
        return response()->json(['message' => 'Comment added', 'data' => $comment], 201);
    }

    public function deleteComment(Request $request, $id, $commentId)
    {
        $comment = Comment::where('id', $commentId)
            ->where('file_id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();
            
        $comment->delete();
        
        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
