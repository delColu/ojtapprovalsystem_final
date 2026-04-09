<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            ['name' => 'OJT Partner Company', 'address' => '2nd Floor, CAST Industry Center, Pasig City'],
            ['name' => 'Tech Innovations Inc.', 'address' => '18 Pioneer Street, Mandaluyong City'],
            ['name' => 'Global Engineering Solutions', 'address' => '45 Industrial Road, Taguig City'],
            ['name' => 'Creative Solutions Agency', 'address' => '27 Media Avenue, Makati City'],
        ];

        foreach ($companies as $company) {
            Company::query()->updateOrCreate(
                ['name' => $company['name']],
                [
                    'address' => $company['address'],
                    'is_active' => true,
                ]
            );
        }
    }
}
