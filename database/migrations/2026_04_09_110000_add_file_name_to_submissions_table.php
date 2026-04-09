<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->string('file_name')->nullable()->after('file_path');
        });

        DB::table('submissions')
            ->whereNotNull('file_path')
            ->whereNull('file_name')
            ->lazyById()
            ->each(function ($submission) {
                $fileName = basename((string) $submission->file_path);

                DB::table('submissions')
                    ->where('id', $submission->id)
                    ->update(['file_name' => $fileName]);
            });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn('file_name');
        });
    }
};
