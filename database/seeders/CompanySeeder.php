<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            ['name' => 'DICT Bohol', 'address' => 'Tagbilaran City, Bohol'],
            ['name' => 'BOHECO I', 'address' => 'Cabulijan, Tubigon, Bohol'],
            ['name' => 'DILG Bohol', 'address' => 'Tagbilaran City, Bohol'],
            ['name' => 'IBEX Global Bohol', 'address' => 'Alturas Mall, Tagbilaran City, Bohol'],
            ['name' => 'TaskUs Bohol', 'address' => 'Tagbilaran City, Bohol'],

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
