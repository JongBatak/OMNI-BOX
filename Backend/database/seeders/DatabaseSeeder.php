<?php
namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\File;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin
        $admin = User::create([
            'name' => 'OmniBox Admin',
            'email' => 'admin@omnibox.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'tier' => 'enterprise'
        ]);
        $admin->metrics()->create(['storage_used' => 0, 'social_score' => 100, 'performance_rating' => 99.9]);

        // 2. Customers
        $tiers = ['basic', 'pro', 'enterprise'];
        foreach ($tiers as $index => $tier) {
            $user = User::create([
                'name' => 'Customer ' . ucfirst($tier),
                'email' => "customer{$index}@omnibox.com",
                'password' => Hash::make('password'),
                'role' => 'customer',
                'tier' => $tier
            ]);

            // Fake expensive data metrics
            $storageUsed = rand(1024 * 1024 * 100, 1024 * 1024 * 5000); // 100MB to 5GB
            $user->metrics()->create([
                'storage_used' => $storageUsed,
                'social_score' => rand(40, 95),
                'performance_rating' => rand(8500, 9999) / 100
            ]);

            // Mock Projects
            for ($i = 1; $i <= 3; $i++) {
                $project = Project::create([
                    'user_id' => $user->id,
                    'name' => "Project Alpha " . Str::random(4),
                    'description' => "Deep learning data footprint analysis batch {$i}",
                    'status' => 'active'
                ]);

                // Mock Files / Social Data
                $types = ['SocialData', 'Code', 'Webview'];
                foreach ($types as $type) {
                    File::create([
                        'user_id' => $user->id,
                        'project_id' => $project->id,
                        'name' => "export_{$type}_" . time() . ".json",
                        'type' => $type,
                        'size' => rand(5000, 5000000), // fake file size bytes
                        'path' => "omnibox/mock/{$type}.json",
                        'url' => "/storage/omnibox/mock/{$type}.json"
                    ]);
                }
            }
        }
    }
}
