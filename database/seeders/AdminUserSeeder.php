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
            ['email' => 'admin@ojt-system.com'],
            [
                'name'              => 'System Administrator',
                'email'             => 'admin@ojt-system.com',
                'password'          => Hash::make('Admin@123'),
                'role_id'           => 1,
                'department'        => 'Information Technology',
                'company'           => 'OJT Approval System',
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
                'role_id'           => 1,
                'department'        => 'System Administration',
                'company'           => 'OJT Approval System',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin users seeded successfully!');
    }
}
