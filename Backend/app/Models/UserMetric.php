<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class UserMetric extends Model
{
    use HasUuids;
    protected $fillable = ['user_id', 'storage_used', 'social_score', 'performance_rating'];
    public function user() { return $this->belongsTo(User::class); }
}
