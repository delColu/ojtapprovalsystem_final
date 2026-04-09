<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StudentUserSeeder extends Seeder
{
    public function run(): void
    {
        $department = Department::query()->where('name', 'CAST')->first();
        $supervisor = User::query()->where('email', 'supervisor@gmail.com')->first();

        $students = [
            ['name' => 'Alice Johnson', 'student_id' => 'CAST2024001', 'email' => 'alice.johnson@student.edu', 'company' => 'BOHECO I'],
            ['name' => 'Bob Smith', 'student_id' => 'CAST2024002', 'email' => 'bob.smith@student.edu', 'company' => 'IBEX Global Bohol'],
            ['name' => 'Carol Davis', 'student_id' => 'CAST2024003', 'email' => 'carol.davis@student.edu', 'company' => 'DICT Bohol'],
            ['name' => 'David Brown', 'student_id' => 'CAST2024004', 'email' => 'david.brown@student.edu', 'company' => 'DILG Bohol'],
            ['name' => 'Emma Wilson', 'student_id' => 'CAST2024005', 'email' => 'emma.wilson@student.edu', 'company' => 'TaskUs Bohol'],
        ];

        foreach ($students as $student) {
            User::updateOrCreate(
                ['email' => $student['email']],
                [
                    'name'              => $student['name'],
                    'email'             => $student['email'],
                    'password'          => Hash::make('Student@123'),
                    'role_id'           => 4,
                    'department_id'     => $department?->id,
                    'student_id'        => $student['student_id'],
                    'department'        => 'CAST',
                    'company'           => $student['company'],
                    'supervisor_id'     => $supervisor?->id,
                    'is_active'         => true,
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('5 CAST student users seeded successfully!');
    }
}
