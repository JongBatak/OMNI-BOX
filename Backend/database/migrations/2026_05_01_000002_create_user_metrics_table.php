<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('storage_used')->default(0); // bytes
            $table->integer('social_score')->default(0); // 0-100
            $table->decimal('performance_rating', 5, 2)->default(0.00); // e.g. 99.99
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_metrics');
    }
};
