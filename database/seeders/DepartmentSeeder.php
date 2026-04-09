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
            ['name' => 'College of Engineering', 'company' => 'University of Technology', 'address' => 'Main Campus, Engineering Avenue, Manila'],
            ['name' => 'College of Computer Studies', 'company' => 'University of Technology', 'address' => 'Innovation Hall, Quezon City'],
            ['name' => 'College of Business Administration', 'company' => 'University of Technology', 'address' => 'Commerce Building, Makati City'],
            ['name' => 'CAST', 'company' => 'OJT Partner Company', 'address' => '2nd Floor, CAST Industry Center, Pasig City'],
            ['name' => 'CAST', 'company' => 'Tech Innovations Inc.', 'address' => '18 Pioneer Street, Mandaluyong City'],
            ['name' => 'CAST', 'company' => 'Global Engineering Solutions', 'address' => '45 Industrial Road, Taguig City'],
            ['name' => 'CAST', 'company' => 'Creative Solutions Agency', 'address' => '27 Media Avenue, Makati City'],
        ];

        foreach ($departments as $entry) {
            $deanId = null;

            if ($entry['name'] === 'CAST') {
                $deanId = User::query()
                    ->where('role_id', 2)
                    ->where(function ($query) {
                        $query->where('department', 'CAST')
                            ->orWhere('email', 'dean@gmail.com');
                    })
                    ->value('id');
            }

            if (! $deanId) {
                $deanId = User::query()
                    ->where('role_id', 2)
                    ->where('department', $entry['name'])
                    ->value('id');
            }

            $department = Department::query()->updateOrCreate(
                ['name' => $entry['name'], 'company' => $entry['company']],
                [
                    'address' => $entry['address'] ?? null,
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
