<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('dean_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['name', 'company']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('department_id')->nullable()->after('role_id')->constrained('departments')->nullOnDelete();
        });

        $users = DB::table('users')
            ->select('id', 'role_id', 'department', 'company')
            ->whereNotNull('department')
            ->get();

        foreach ($users->groupBy(fn ($user) => $user->department . '|' . ($user->company ?? '')) as $group) {
            $sample = $group->first();
            $deanId = DB::table('users')
                ->where('role_id', 2)
                ->where('department', $sample->department)
                ->value('id');

            $departmentId = DB::table('departments')->insertGetId([
                'name' => $sample->department,
                'company' => $sample->company,
                'description' => null,
                'dean_id' => $deanId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('users')
                ->whereIn('id', $group->pluck('id'))
                ->update(['department_id' => $departmentId]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('department_id');
        });

        Schema::dropIfExists('departments');
    }
};
