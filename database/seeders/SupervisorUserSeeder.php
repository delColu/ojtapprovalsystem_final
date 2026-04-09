<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SupervisorUserSeeder extends Seeder
{
    public function run(): void
    {
        $castDepartment = Department::query()->where('name', 'CAST')->first();
        $otherDepartment = Department::query()->where('name', '!=', 'CAST')->first();

        // Supervisor 1 - CAST Department
        User::updateOrCreate(
            ['email' => 'supervisor@gmail.com'],
            [
                'name'              => 'Supervisor User',
                'email'             => 'supervisor@gmail.com',
                'password'          => Hash::make('supervisor@123'),
                'role'              => 'supervisor',
                'role_id'           => 3,
                'department_id'     => $castDepartment?->id,
                'department'        => 'CAST',
                'company'           => 'DICT Bohol',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        // Supervisor 2 - Other Department (or same CAST if no other department)
        User::updateOrCreate(
            ['email' => 'supervisor2@gmail.com'],
            [
                'name'              => 'Supervisor User 2',
                'email'             => 'supervisor2@gmail.com',
                'password'          => Hash::make('supervisor@123'),
                'role'              => 'supervisor',
                'role_id'           => 3,
                'department_id'     => $otherDepartment?->id ?? $castDepartment?->id,
                'department'        => $otherDepartment?->name ?? 'CAST',
                'company'           => 'IBEX Global Bohol',
                'is_active'         => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('=====================================');
        $this->command->info('2 Supervisor users created successfully!');
        $this->command->info('Supervisor 1 - Email: supervisor@gmail.com | Password: supervisor@123');
        $this->command->info('Supervisor 2 - Email: supervisor2@gmail.com | Password: supervisor@123');
        $this->command->info('=====================================');
    }
}
