<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['admin', 'dean', 'supervisor', 'student'];

        foreach ($roles as $index => $roleName) {
            DB::table('roles')->updateOrInsert(
                ['id' => $index + 1],
                [
                    'name'       => $roleName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('Roles table seeded successfully!');
    }
}
