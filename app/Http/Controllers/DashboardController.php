<?php

namespace App\Http\Controllers;

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
                ->with('folder')
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
                    ];
                });

            $availableFolders = Folder::whereDoesntHave('submissions', function($q) use ($user) {
                    $q->where('student_id', $user->id);
                })
                ->with('supervisor')
                ->get()
                ->map(function($folder) {
                    return [
                        'id' => $folder->id,
                        'name' => $folder->name,
                        'description' => $folder->description,
                        'due_date' => $folder->due_date->format('Y-m-d'),
                        'supervisor_name' => $folder->supervisor->name ?? 'Unknown',
                    ];
                });

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

            return inertia('Student/Dashboard', [
                'stats' => $stats,
                'recentReports' => $recentReports,
                'availableFolders' => $availableFolders,
                'notifications' => $notifications
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
            $stats = [
                'total_interns' => User::where('role_id', 4)->count(),
                'active_tasks'  => Submission::where('status', 'pending')->count(),
                'completed'     => Submission::where('status', 'approved')->count(),
                'overdue'       => Submission::where('status', 'pending')
                                    ->where('created_at', '<', now()->subDays(7))
                                    ->count(),
            ];

            return inertia('Dean/Dashboard', ['stats' => $stats]);
        }

        if ($user->isAdmin()) {
            $stats = [
                'total_interns'   => User::where('role_id', 4)->count(),
                'pending_review'  => Submission::where('status', 'pending')->count(),
                'approved'        => Submission::where('status', 'approved')->count(),
                'rejected'        => Submission::where('status', 'rejected')->count(),
            ];

            $submissions = Submission::with(['student', 'folder', 'supervisor'])
                ->latest()
                ->take(10)
                ->get()
                ->map(function($submission) {
                    return [
                        'id' => $submission->id,
                        'title' => $submission->title,
                        'student_name' => $submission->student->name,
                        'folder_name' => $submission->folder->name,
                        'supervisor_name' => $submission->supervisor->name ?? 'N/A',
                        'status' => $submission->status,
                        'created_at' => $submission->created_at->format('Y-m-d'),
                    ];
                });

            $interns = User::where('role_id', 4)
                ->get()
                ->map(function($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'student_id' => $user->student_id,
                        'department' => $user->department,
                    ];
                });

            return inertia('Admin/Dashboard', [
                'stats' => $stats,
                'submissions' => $submissions,
                'interns' => $interns
            ]);
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

        $availableFolders = Folder::whereDoesntHave('submissions', function($q) use ($user) {
                $q->where('student_id', $user->id);
            })
            ->where('due_date', '>=', now()) // Only show folders that are not yet due
            ->with('supervisor')
            ->get()
            ->map(function($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'description' => $folder->description,
                    'due_date' => $folder->due_date->format('Y-m-d'),
                    'supervisor_name' => $folder->supervisor->name ?? 'Unknown',
                ];
            });

        return Inertia::render('Student/SubmitReports', [
            'availableFolders' => $availableFolders
        ]);
    }
}
