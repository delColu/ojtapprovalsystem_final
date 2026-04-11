<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 random users
        User::factory()->count(10)->create();

        // Optionally, you can create specific users with known credentials for testing
        $company = Company::first();
        $department = Department::first();

        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('test@123'),
            'role' => 'student',
            'company_id' => $company ? $company->id : null,
            'department_id' => $department ? $department->id : null,
            'email_verified_at' => now(),
        ]);
    }
}
