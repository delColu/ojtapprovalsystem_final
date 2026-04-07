<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1️⃣ Seed roles first
        $this->call(RolesTableSeeder::class);

        // 2️⃣ Seed users by role
        $this->call([
            AdminUserSeeder::class,
            DeanUserSeeder::class,
            SupervisorUserSeeder::class,
            StudentUserSeeder::class,
        ]);



        // 3️⃣ Display default passwords
        $this->command->info('All seeders completed successfully!');
        $this->command->info('Default passwords:');
        $this->command->info('- Admin: Admin@123');
        $this->command->info('- Dean: Dean@123');
        $this->command->info('- Supervisor: Supervisor@123');
        $this->command->info('- Student: Student@123');

    }
}

