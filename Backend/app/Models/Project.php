<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasUuids;
    protected $fillable = ['user_id', 'name', 'description', 'status'];

    public function user() { return $this->belongsTo(User::class); }
    public function files() { return $this->hasMany(File::class); }
}
