<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->text('supervisor_feedback')->nullable()->after('feedback');
            $table->text('dean_feedback')->nullable()->after('supervisor_feedback');
            $table->timestamp('supervisor_approved_at')->nullable()->after('approved_at');
            $table->timestamp('forwarded_to_dean_at')->nullable()->after('supervisor_approved_at');
            $table->timestamp('dean_reviewed_at')->nullable()->after('forwarded_to_dean_at');
        });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn([
                'supervisor_feedback',
                'dean_feedback',
                'supervisor_approved_at',
                'forwarded_to_dean_at',
                'dean_reviewed_at',
            ]);
        });
    }
};
