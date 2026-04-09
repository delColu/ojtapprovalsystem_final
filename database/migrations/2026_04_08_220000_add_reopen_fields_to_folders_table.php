<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('folders', function (Blueprint $table) {
            $table->boolean('is_reopened')->default(false)->after('due_date');
            $table->timestamp('reopened_at')->nullable()->after('is_reopened');
        });
    }

    public function down(): void
    {
        Schema::table('folders', function (Blueprint $table) {
            $table->dropColumn(['is_reopened', 'reopened_at']);
        });
    }
};
