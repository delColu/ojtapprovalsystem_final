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
      User::updateOrCreate(
    ['email' => 'dean@gmail.com'],
    [
        'name' => 'Dr. Robert Martinez',
        'email' => 'dean@gmail.com',
        'password' => Hash::make('dean@123'),
        'role_id' => 2,
        'role' => 'dean',
        'department' => 'CAST',
        'company' => 'Mater Dei College',
        'is_active' => true,
        'email_verified_at' => now(),
    ]
);

        // Create Dean for College of Computer Studies
        User::updateOrCreate(
            ['email' => 'deancomputing@gmail.com'],
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'deancomputing@gmail.com',
                'password' => Hash::make('Dean@123'),
                'role_id' => 2, // Dean role ID
                'role' => 'dean',
                'department' => 'College of Computer Studies',
                'company' => 'Mater Dei College',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create Dean for College of Business
        User::updateOrCreate(
            ['email' => 'deanbusiness@gmail.com'],
            [
                'name' => 'Prof. Michael Chen',
                'email' => 'deanbusiness@gmail.com',
                'password' => Hash::make('Dean@123'),
                'role_id' => 2, // Dean role ID
                'role' => 'dean',
                'department' => 'College of Business Administration',
                'company' => 'Mater Dei College',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Dean users seeded successfully!');
    }
}
