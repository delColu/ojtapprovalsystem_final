// database/migrations/2024_01_01_000001_create_roles_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Default roles
        DB::table('roles')->insert([
            ['name' => 'admin'],
            ['name' => 'dean'],
            ['name' => 'supervisor'],
            ['name' => 'student'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
