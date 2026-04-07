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
            // Computer Science
            ['name' => 'Alice Johnson', 'student_id' => 'CS2024001', 'email' => 'alice.johnson@student.edu', 'department' => 'CAST', 'company' => 'Tech Innovations Inc.'],
            ['name' => 'Bob Smith', 'student_id' => 'CS2024002', 'email' => 'bob.smith@student.edu', 'department' => 'CAST', 'company' => 'Tech Innovations Inc.'],
            ['name' => 'Carol Davis', 'student_id' => 'CS2024003', 'email' => 'carol.davis@student.edu', 'department' => 'CAST', 'company' => 'Tech Innovations Inc.'],
            ['name' => 'David Brown', 'student_id' => 'CS2024004', 'email' => 'david.brown@student.edu', 'department' => 'CAST', 'company' => 'Tech Innovations Inc.'],
            ['name' => 'Emma Wilson', 'student_id' => 'CS2024005', 'email' => 'emma.wilson@student.edu', 'department' => 'CAST', 'company' => 'Tech Innovations Inc.'],

            // Engineering
            ['name' => 'Frank Miller', 'student_id' => 'ENG2024001', 'email' => 'frank.miller@student.edu', 'department' => 'CAST', 'company' => 'Global Engineering Solutions'],
            ['name' => 'Grace Lee', 'student_id' => 'ENG2024002', 'email' => 'grace.lee@student.edu', 'department' => 'CAST', 'company' => 'Global Engineering Solutions'],
            ['name' => 'Henry Taylor', 'student_id' => 'ENG2024003', 'email' => 'henry.taylor@student.edu', 'department' => 'CAST', 'company' => 'Global Engineering Solutions'],
            ['name' => 'Ivy Chen', 'student_id' => 'ENG2024004', 'email' => 'ivy.chen@student.edu', 'department' => 'CAST', 'company' => 'Global Engineering Solutions'],
            ['name' => 'Jack Robinson', 'student_id' => 'ENG2024005', 'email' => 'jack.robinson@student.edu', 'department' => 'CAST', 'company' => 'Global Engineering Solutions'],

            // Business
            ['name' => 'Karen White', 'student_id' => 'BUS2024001', 'email' => 'karen.white@student.edu', 'department' => 'CAST', 'company' => 'Creative Solutions Agency'],
            ['name' => 'Leo Martinez', 'student_id' => 'BUS2024002', 'email' => 'leo.martinez@student.edu', 'department' => 'CAST', 'company' => 'Creative Solutions Agency'],
            ['name' => 'Mia Anderson', 'student_id' => 'BUS2024003', 'email' => 'mia.anderson@student.edu', 'department' => 'CAST', 'company' => 'Creative Solutions Agency'],
            ['name' => 'Noah Thomas', 'student_id' => 'BUS2024004', 'email' => 'noah.thomas@student.edu', 'department' => 'CAST', 'company' => 'Creative Solutions Agency'],
            ['name' => 'Olivia Jackson', 'student_id' => 'BUS2024005', 'email' => 'olivia.jackson@student.edu', 'department' => 'CAST', 'company' => 'Creative Solutions Agency'],
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
                    'department'        => $student['department'],
                    'company'           => $student['company'],
                    'supervisor_id'     => $supervisor?->id,
                    'is_active'         => true,
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info('Student users seeded successfully!');
    }
}
