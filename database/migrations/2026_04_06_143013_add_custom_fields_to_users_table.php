<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained('roles')->after('password');
            $table->string('department')->nullable()->after('role_id');
            $table->string('company')->nullable()->after('department');
            $table->string('student_id')->nullable()->unique()->after('company');
            $table->string('supervisor_id')->nullable()->after('student_id');
            $table->boolean('is_active')->default(true)->after('supervisor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn(['role_id', 'department', 'company', 'student_id', 'supervisor_id', 'is_active']);
        });
    }
};
