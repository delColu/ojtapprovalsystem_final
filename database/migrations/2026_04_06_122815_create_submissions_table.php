// database/migrations/2024_01_01_000004_create_submissions_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users');
            $table->foreignId('folder_id')->constrained();
            $table->string('title');
            $table->text('description');
            $table->string('file_path')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'forwarded'])->default('pending');
            $table->text('feedback')->nullable();
            $table->foreignId('supervisor_id')->nullable()->constrained('users');
            $table->foreignId('dean_id')->nullable()->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
