<?php

    namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DeanUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Dean for College of Engineering
        User::updateOrCreate(
            ['email' => 'dean.engineering@ojt-system.com'],
            [
                'name' => 'Dr. Robert Martinez',
                'email' => 'dean.engineering@ojt-system.com',
                'password' => Hash::make('Dean@123'),
                'role_id' => 2, // Dean role ID
                'department' => 'College of Engineering',
                'company' => 'University of Technology',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create Dean for College of Computer Studies
        User::updateOrCreate(
            ['email' => 'dean.computing@ojt-system.com'],
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'dean.computing@ojt-system.com',
                'password' => Hash::make('Dean@123'),
                'role_id' => 2, // Dean role ID
                'department' => 'College of Computer Studies',
                'company' => 'University of Technology',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create Dean for College of Business
        User::updateOrCreate(
            ['email' => 'dean.business@ojt-system.com'],
            [
                'name' => 'Prof. Michael Chen',
                'email' => 'dean.business@ojt-system.com',
                'password' => Hash::make('Dean@123'),
                'role_id' => 2, // Dean role ID
                'department' => 'College of Business Administration',
                'company' => 'University of Technology',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Dean users seeded successfully!');
    }
}
