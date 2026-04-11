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
        $this->call(RolesTableSeeder::class);

        $this->call([
            CompanySeeder::class,
            AdminUserSeeder::class,
            DeanUserSeeder::class,
            DepartmentSeeder::class,
            SupervisorUserSeeder::class,
            StudentUserSeeder::class,
            UserSeeder::class,
        ]);

        $this->command->info('All seeders completed successfully!');
        $this->command->info('Default passwords:');
        $this->command->info('- Admin: admin@123');
        $this->command->info('- Dean: dean@123');
        $this->command->info('- Supervisor: supervisor@123');
        $this->command->info('- Student: student@123');
    }
}
