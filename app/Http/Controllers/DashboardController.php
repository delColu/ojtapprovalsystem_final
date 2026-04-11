<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Submission;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->isStudent()) {
            $stats = [
                'total'    => Submission::where('student_id', $user->id)->count(),
                'pending'  => Submission::where('student_id', $user->id)->where('status', 'pending')->count(),
                'approved' => Submission::where('student_id', $user->id)->where('status', 'approved')->count(),
                'rejected' => Submission::where('student_id', $user->id)->where('status', 'rejected')->count(),
            ];

            $recentReports = Submission::where('student_id', $user->id)
                ->with(['folder', 'supervisor', 'dean'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function($submission) {
                    return [
                        'id' => $submission->id,
                        'title' => $submission->title,
                        'description' => $submission->description,
                        'status' => $submission->status,
                        'folder_name' => $submission->folder->name ?? 'No Folder',
                        'created_at' => $submission->created_at->format('Y-m-d'),
                        'file_path' => $submission->file_path,
                        'feedback' => $submission->feedback,
                        'supervisor_name' => $submission->supervisor?->name,
                        'dean_name' => $submission->dean?->name,
                        'supervisor_approved_at' => optional($submission->supervisor_approved_at)->format('Y-m-d H:i'),
                        'forwarded_to_dean_at' => optional($submission->forwarded_to_dean_at)->format('Y-m-d H:i'),
                        'dean_reviewed_at' => optional($submission->dean_reviewed_at)->format('Y-m-d H:i'),
                    ];
                });

            if (!$user->department_id || !$user->company_id) {
                $availableFolders = collect();
            } else {
                $rawFolders = Folder::query()
                    ->where(function ($query) {
                        $query->whereNull('due_date')
                            ->orWhereDate('due_date', '>=', today());
                    })
                    ->orWhere(function ($query) {
                        $query->whereNotNull('due_date')
                            ->whereDate('due_date', '<', today())
                            ->where('is_reopened', true);
                    })
                    ->whereHas('supervisor', function ($query) use ($user) {
                        $query->where('department_id', $user->department_id)
                              ->where('company_id', $user->company_id);
                    })
                    ->with('supervisor')
                    ->get();

                // DEBUG: Log folders found and policy check
                \Illuminate\Support\Facades\Log::info('Dashboard folders for student ' . $user->id . ' (dept:' . $user->department_id . ', company:' . $user->company_id . ')', [
                    'count' => $rawFolders->count(),
                    'user_dept' => $user->department_id,
                    'user_company' => $user->company_id,
                    'folders' => $rawFolders->map(fn($f) => [
                        'id' => $f->id,
                        'name' => $f->name,
                        'supervisor_id' => $f->supervisor_id,
                        'supervisor_dept' => $f->supervisor->department_id,
                        'supervisor_company' => $f->supervisor->company_id,
                        'policy_can_view' => $user->can('view', $f)
                    ])
                ]);

                // Apply policy filter for extra safety
                $rawFolders = $rawFolders->filter(fn($folder) => $user->can('view', $folder));

                $availableFolders = $rawFolders->map(function($folder) {
                    return [
                        'id' => $folder->id,
                        'name' => $folder->name,
                        'description' => $folder->description,
                        'due_date' => optional($folder->due_date)?->format('Y-m-d'),
                        'supervisor_name' => $folder->supervisor->name ?? 'Unknown',
                        'is_reopened' => $folder->is_reopened,
                    ];
                });
            }

            $notifications = $user->notifications()
                ->latest()
                ->take(10)
                ->get()
                ->map(function($notification) {
                    return [
                        'id' => $notification->id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'is_read' => $notification->is_read,
                        'created_at' => $notification->created_at->diffForHumans(),
                    ];
                });

            $companies = Company::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'address'])
                ->map(fn (Company $company) => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'address' => $company->address,
                ])
                ->values();

            return inertia('Student/Dashboard', [
                'stats' => $stats,
                'recentReports' => $recentReports,
                'availableFolders' => $availableFolders,
                'notifications' => $notifications,
'companies' => $companies,
                'currentCompany' => [
                    'name' => $user->company,
                    'address' => '',
                ],
            ]);
        }

        if ($user->isSupervisor()) {
            $stats = [
                'total'    => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))->count(),
                'pending'  => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
                                ->where('status', 'pending')->count(),
                'approved' => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
                                ->where('status', 'approved')->count(),
                'rejected' => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
                                ->where('status', 'rejected')->count(),
            ];

            $interns = User::where('role_id', 4)->count();
            $approvalRate = $stats['total'] > 0 ? ($stats['approved'] / $stats['total']) * 100 : 0;

            $pendingSubmissions = Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
                ->with('student')
                ->where('status', 'pending')
                ->latest()
                ->take(5)
                ->get()
                ->map(function($submission) {
                    return [
                        'id' => $submission->id,
                        'title' => $submission->title,
                        'description' => substr($submission->description, 0, 100),
                        'student_name' => $submission->student->name,
                        'submitted_at' => $submission->created_at->format('Y-m-d'),
                    ];
                });

            return inertia('Supervisor/Dashboard', [
                'stats' => $stats,
                'interns' => $interns,
                'approvalRate' => $approvalRate,
                'pendingSubmissions' => $pendingSubmissions
            ]);
        }

        if ($user->isDean()) {
            return redirect()->route('dean.dashboard');
        }

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // Fallback for any other role or no role
        return inertia('Student/Dashboard', [
            'stats' => ['total' => 0, 'pending' => 0, 'approved' => 0, 'rejected' => 0],
            'recentReports' => [],
            'availableFolders' => [],
            'notifications' => []
        ]);
    }

    public function supervisorDashboard()
    {
        $user = Auth::user();

        $stats = [
            'total'    => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))->count(),
            'pending'  => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
                            ->where('status', 'pending')->count(),
            'approved' => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
                            ->where('status', 'approved')->count(),
            'rejected' => Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
                            ->where('status', 'rejected')->count(),
        ];

        $interns = User::where('role_id', 4)->count();
        $approvalRate = $stats['total'] > 0 ? ($stats['approved'] / $stats['total']) * 100 : 0;

        $pendingSubmissions = Submission::whereHas('folder', fn($q) => $q->where('supervisor_id', $user->id))
            ->with('student')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($submission) {
                return [
                    'id' => $submission->id,
                    'title' => $submission->title,
                    'description' => substr($submission->description, 0, 100),
                    'student_name' => $submission->student->name,
                    'submitted_at' => $submission->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('Supervisor/Dashboard', [
            'stats' => $stats,
            'interns' => $interns,
            'approvalRate' => $approvalRate,
            'pendingSubmissions' => $pendingSubmissions
        ]);
    }

    // Submit Reports method
    public function submitReports()
    {
        $user = Auth::user();

        // Only students can access this page
        if (!$user->isStudent()) {
            return redirect()->route('dashboard')->with('error', 'Only students can submit reports.');
        }

        if (!$user->department_id || !$user->company_id) {
            $availableFolders = collect();
        } else {
                $rawFolders = Folder::query()
                ->where(function ($query) {
                    $query->whereNull('due_date')
                        ->orWhereDate('due_date', '>=', today());
                })
                ->orWhere(function ($query) {
                    $query->whereNotNull('due_date')
                        ->whereDate('due_date', '<', today())
                        ->where('is_reopened', true);
                })
                ->whereHas('supervisor', function ($query) use ($user) {
                    $query->where('department_id', $user->department_id)
                          ->where('company_id', $user->company_id);
                })
                ->with('supervisor')
                ->get();

            // DEBUG: Log folders found and policy check (submit-reports method)
            \Illuminate\Support\Facades\Log::info('SubmitReports folders for student ' . $user->id . ' (dept:' . $user->department_id . ', company:' . $user->company_id . ')', [
                'count' => $rawFolders->count(),
                'user_dept' => $user->department_id,
                'user_company' => $user->company_id,
                'folders' => $rawFolders->map(fn($f) => [
                    'id' => $f->id,
                    'name' => $f->name,
                    'supervisor_id' => $f->supervisor_id,
                    'supervisor_dept' => $f->supervisor->department_id,
                    'supervisor_company' => $f->supervisor->company_id,
                    'policy_can_view' => $user->can('view', $f)
                ])
            ]);

            // Apply policy filter for extra safety
            $rawFolders = $rawFolders->filter(fn($folder) => $user->can('view', $folder));

            $availableFolders = $rawFolders->map(function($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'description' => $folder->description,
                    'due_date' => optional($folder->due_date)?->format('Y-m-d'),
                    'supervisor_name' => $folder->supervisor->name ?? 'Unknown',
                    'is_reopened' => $folder->is_reopened,
                ];
            });
        }

        return Inertia::render('Student/SubmitReports', [
            'availableFolders' => $availableFolders
        ]);
    }
}
