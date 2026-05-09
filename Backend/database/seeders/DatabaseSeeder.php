<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\File;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File as FileFacade;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $mainUser = User::firstOrCreate(
            ['email' => 'test@omnibox.com'],
            [
                'name' => 'OmniBox Admin',
                'password' => Hash::make('password'),
            ]
        );
        $mainUser->metrics()->firstOrCreate(['storage_used' => 0]);

        $dummyUsers = User::factory(5)->create();
        foreach ($dummyUsers as $user) {
            $user->metrics()->firstOrCreate(['storage_used' => 0]);
        }

        // 2. Scan dummy files
        $dummyPath = database_path('dummy_files');
        if (!FileFacade::exists($dummyPath)) {
            $this->command->warn("Dummy files directory does not exist at {$dummyPath}");
            return;
        }

        $files = FileFacade::files($dummyPath);
        if (empty($files)) {
            $this->command->warn("No files found in {$dummyPath}");
            return;
        }

        // 3. Create Storage path
        $storagePath = storage_path('app/public/files');
        if (!FileFacade::exists($storagePath)) {
            FileFacade::makeDirectory($storagePath, 0755, true);
        }

        // 4. Iterate and Insert
        foreach ($files as $index => $file) {
            $fileName = $file->getFilename();
            $newPath = "files/{$fileName}";
            
            // Copy file to storage
            FileFacade::copy($file->getPathname(), storage_path("app/public/{$newPath}"));

            $ext = strtolower($file->getExtension());
            $type = 'unknown';
            if (in_array($ext, ['js', 'jsx', 'ts', 'tsx', 'py', 'cpp', 'c', 'java', 'html', 'css', 'json', 'php', 'rb', 'go', 'rs', 'sql'])) {
                $type = 'code';
            } elseif (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'])) {
                $type = 'image';
            } elseif (in_array($ext, ['glb', 'gltf', 'obj', 'stl'])) {
                $type = '3d';
            } elseif (in_array($ext, ['pdf', 'doc', 'docx', 'txt', 'md'])) {
                $type = 'document';
            } elseif (in_array($ext, ['mp4', 'webm', 'ogg', 'mov'])) {
                $type = 'video';
            }

            // Distribute files
            if ($index % 2 === 0) {
                // Assign to main user
                File::create([
                    'user_id' => $mainUser->id,
                    'name' => $fileName,
                    'type' => $type,
                    'path' => $newPath,
                    'size' => $file->getSize(),
                    'is_community_shared' => false,
                    'is_starred' => ($index % 4 === 0),
                ]);
                $mainUser->metrics()->increment('storage_used', $file->getSize());
            } else {
                // Assign to dummy user
                $randomDummy = $dummyUsers->random();
                File::create([
                    'user_id' => $randomDummy->id,
                    'name' => $fileName,
                    'type' => $type,
                    'path' => $newPath,
                    'size' => $file->getSize(),
                    'is_community_shared' => true,
                    'is_starred' => false,
                ]);
                $randomDummy->metrics()->increment('storage_used', $file->getSize());
            }
        }

        $this->command->info('Database seeded successfully with dynamic files!');
    }
}
