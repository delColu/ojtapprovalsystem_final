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
            ['email' => 'supervisor@gmail.com'],
            [
                'name'              => 'Supervisor User',
                'email'             => 'supervisor@gmail.com',
                'password'          => Hash::make('Supervisor@123'),
                'role'              => 'supervisor',
                'role_id'           => 3,
                'department'        => 'CAST',
                'company'           => 'OJT Partner Company',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('=====================================');
        $this->command->info('Supervisor user created successfully!');
        $this->command->info('Email: supervisor@gmail.com');
        $this->command->info('Password: Supervisor@123');
        $this->command->info('=====================================');
    }
}
