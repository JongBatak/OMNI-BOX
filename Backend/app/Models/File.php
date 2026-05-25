<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasUuids;
    protected $fillable = ['user_id', 'project_id', 'name', 'type', 'size', 'path', 'url', 'is_community_shared', 'is_starred'];

    public function user() { return $this->belongsTo(User::class); }
    public function project() { return $this->belongsTo(Project::class); }
    public function likes() { return $this->hasMany(Like::class); }
    public function comments() { return $this->hasMany(Comment::class); }
}
