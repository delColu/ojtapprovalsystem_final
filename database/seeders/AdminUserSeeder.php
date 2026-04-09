<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'              => 'System Administrator',
                'email'             => 'admin@gmail.com',
                'password'          => Hash::make('admin@123'),
                'role'              => 'admin',
                'role_id'           => 1,
                'department'        => 'Information Technology',
                'company'           => 'DICT Bohol',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'superadmin@ojt-system.com'],
            [
                'name'              => 'Super Admin',
                'email'             => 'superadmin@ojt-system.com',
                'password'          => Hash::make('SuperAdmin@123'),
                'role'              => 'admin',
                'role_id'           => 1,
                'department'        => 'System Administration',
                'company'           => 'TaskUs Bohol',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin users seeded successfully!');
    }
}
