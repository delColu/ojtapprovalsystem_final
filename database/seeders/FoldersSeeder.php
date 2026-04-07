<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Folder;
use App\Models\User;

class FoldersSeeder extends Seeder
{
    public function run(): void
    {
        $supervisors = [
            'supervisor.tech@ojt-system.com',
            'supervisor.marketing@ojt-system.com',
            'supervisor.finance@ojt-system.com',
            'supervisor.healthcare@ojt-system.com',
            'supervisor.education@ojt-system.com',
        ];

        $folderTemplates = [
            [
                'name' => 'Week 1 - Initial Assessment',
                'description' => 'Submit your initial company assessment and first week activities.',
                'due_date' => now()->addDays(7),
            ],
            [
                'name' => 'Week 2 - Technical Report',
                'description' => 'Detailed report on technical tasks completed during week 2.',
                'due_date' => now()->addDays(14),
            ],
            [
                'name' => 'Monthly Progress Report',
                'description' => 'Comprehensive monthly progress including challenges and achievements.',
                'due_date' => now()->addMonth(),
            ],
        ];

        foreach ($supervisors as $email) {
            $supervisor = User::where('email', $email)->first();
            if ($supervisor) {
                foreach ($folderTemplates as $template) {
                    Folder::updateOrCreate(
                        [
                            'supervisor_id' => $supervisor->id,
                            'name' => $template['name'],
                        ],
                        [
                            'description' => $template['description'],
                            'due_date' => $template['due_date'],
                        ]
                    );
                }
            }
        }

        $this->command->info('Sample folders seeded for supervisors!');
    }
}

