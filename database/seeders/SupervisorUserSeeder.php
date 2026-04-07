<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SupervisorUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'supervisor.tech@ojt-system.com'],
            [
                'name'              => 'John Anderson',
                'email'             => 'supervisor.tech@ojt-system.com',
                'password'          => Hash::make('Supervisor@123'),
                'role_id'           => 3,
                'department'        => 'Software Development',
                'company'           => 'Tech Innovations Inc.',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'supervisor.marketing@ojt-system.com'],
            [
                'name'              => 'Emily Rodriguez',
                'email'             => 'supervisor.marketing@ojt-system.com',
                'password'          => Hash::make('Supervisor@123'),
                'role_id'           => 3,
                'department'        => 'Digital Marketing',
                'company'           => 'Creative Solutions Agency',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'supervisor.finance@ojt-system.com'],
            [
                'name'              => 'David Williams',
                'email'             => 'supervisor.finance@ojt-system.com',
                'password'          => Hash::make('Supervisor@123'),
                'role_id'           => 3,
                'department'        => 'Financial Analysis',
                'company'           => 'Global Finance Corp',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'supervisor.healthcare@ojt-system.com'],
            [
                'name'              => 'Dr. Lisa Thompson',
                'email'             => 'supervisor.healthcare@ojt-system.com',
                'password'          => Hash::make('Supervisor@123'),
                'role_id'           => 3,
                'department'        => 'Healthcare Administration',
                'company'           => 'City General Hospital',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'supervisor.education@ojt-system.com'],
            [
                'name'              => 'Prof. James Wilson',
                'email'             => 'supervisor.education@ojt-system.com',
                'password'          => Hash::make('Supervisor@123'),
                'role_id'           => 3,
                'department'        => 'Academic Affairs',
                'company'           => 'Premier Learning Institute',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Supervisor users seeded successfully!');
    }
}
