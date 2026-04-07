<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'College of Engineering', 'company' => 'University of Technology'],
            ['name' => 'College of Computer Studies', 'company' => 'University of Technology'],
            ['name' => 'College of Business Administration', 'company' => 'University of Technology'],
            ['name' => 'CAST', 'company' => 'OJT Partner Company'],
        ];

        foreach ($departments as $entry) {
            $deanId = User::query()
                ->where('role_id', 2)
                ->where('department', $entry['name'])
                ->value('id');

            $department = Department::query()->updateOrCreate(
                ['name' => $entry['name'], 'company' => $entry['company']],
                [
                    'description' => null,
                    'dean_id' => $deanId,
                    'is_active' => true,
                ]
            );

            User::query()
                ->where('department', $entry['name'])
                ->update(['department_id' => $department->id]);
        }
    }
}
