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
             ['name' => 'College of Engineering', 'company' => 'DICT Bohol', 'address' => 'Tagbilaran City, Bohol'],
            ['name' => 'College of Computer Studies', 'company' => 'BOHECO I', 'address' => 'Cabulijan, Tubigon, Bohol'],
            ['name' => 'College of Business Administration', 'company' => 'DILG Bohol', 'address' => 'Tagbilaran City, Bohol'],

            // CAST entries
            ['name' => 'CAST', 'company' => 'IBEX Global Bohol', 'address' => 'Alturas Mall, Tagbilaran City, Bohol'],
            ['name' => 'CAST', 'company' => 'TaskUs Bohol', 'address' => 'Tagbilaran City, Bohol'],
            ['name' => 'CAST', 'company' => 'DICT Bohol', 'address' => 'Tagbilaran City, Bohol'],
            ['name' => 'CAST', 'company' => 'BOHECO I', 'address' => 'Cabulijan, Tubigon, Bohol'],
        ];

        foreach ($departments as $entry) {
            $deanId = null;

            if ($entry['name'] === 'CAST') {
$deanId = User::query()
                    ->where('role_id', 2)
                    ->where('email', 'dean@gmail.com')
                    ->value('id');
            }

            if (! $deanId) {
// $deanId = User::query()
                    // ->where('role_id', 2)
                    // ->where('department', $entry['name'])
                    // ->value('id');
            }

$department = Department::query()->updateOrCreate(
                ['name' => $entry['name']],
                [
                    'address' => $entry['address'] ?? null,
                    'description' => null,
                    'dean_id' => $deanId,
                    'is_active' => true,
                ]
            );

// User::query()
                // ->where('department', $entry['name'])
                // ->update(['department_id' => $department->id]);
        }
    }
}
