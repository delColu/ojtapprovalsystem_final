<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Submission;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SupervisorController extends Controller
{
    public function index(Request $request): Response
    {
        $data = $this->buildSupervisorData($request);

        return Inertia::render('Supervisor/Dashboard', [
            'statistics' => $data['statistics'],
            'approvalRate' => $data['approvalRate'],
            'recentActivities' => $data['recentActivities'],
            'pendingSubmissions' => $data['pendingSubmissions']->take(5)->values(),
        ]);
    }

    public function tasks(Request $request): Response
    {
        $data = $this->buildSupervisorData($request);

        return Inertia::render('Supervisor/Tasks', [
            'folders' => $data['folders'],
        ]);
    }

    public function interns(Request $request): Response
    {
        $data = $this->buildSupervisorData($request);

        return Inertia::render('Supervisor/Interns', [
            'interns' => $data['interns'],
            'approvalRate' => $data['approvalRate'],
            'statistics' => $data['statistics'],
        ]);
    }

    public function exportInternsPdf(Request $request)
    {
        $data = $this->buildSupervisorData($request);

        $pdf = Pdf::loadView('pdf.supervisor-interns', [
            'interns' => $data['interns'],
            'supervisor' => Auth::user(),
        ]);

        return $pdf->download('supervisor-interns.pdf');
    }

    public function submissions(Request $request): Response
    {
        $data = $this->buildSupervisorData($request);

        return Inertia::render('Supervisor/Submissions', [
            'pendingSubmissions' => $data['pendingSubmissions'],
        ]);
    }

    public function reports(Request $request): Response
    {
        $data = $this->buildSupervisorData($request);

        return Inertia::render('Supervisor/Reports', [
            'reports' => $data['reports'],
            'search' => $data['search'],
        ]);
    }

    private function buildSupervisorData(Request $request): array
    {
        $user = Auth::user();
        abort_unless($user && $user->isSupervisor(), 403, 'Unauthorized');

        $supervisorId = $user->id;
        $search = trim((string) $request->string('search'));

        $submissionScope = Submission::query()
            ->whereHas('folder', fn ($query) => $query->where('supervisor_id', $supervisorId));

        $statistics = [
            'total_pending' => (clone $submissionScope)->where('status', 'pending')->count(),
            'total_approved' => (clone $submissionScope)->where('status', 'approved')->count(),
            'total_rejected' => (clone $submissionScope)->where('status', 'rejected')->count(),
            'total_submissions' => (clone $submissionScope)->count(),
        ];

        $pendingSubmissions = (clone $submissionScope)
            ->where('status', 'pending')
            ->with(['student', 'folder', 'supervisor', 'dean'])
            ->latest()
            ->get()
            ->map(fn (Submission $submission) => $this->mapSubmission($submission));

        $reports = (clone $submissionScope)
            ->with(['student', 'folder', 'supervisor', 'dean'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nestedQuery) use ($search) {
                    $nestedQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('student', fn ($studentQuery) => $studentQuery->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('folder', fn ($folderQuery) => $folderQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->get()
            ->map(fn (Submission $submission) => $this->mapSubmission($submission));

        $recentActivities = (clone $submissionScope)
            ->with(['student', 'supervisor', 'dean'])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn (Submission $submission) => [
                'id' => $submission->id,
                'title' => $submission->title,
                'status' => $submission->status,
                'created_at' => optional($submission->submitted_at ?? $submission->created_at)?->toISOString(),
                'student' => [
                    'name' => $submission->student?->name,
                ],
            ]);

        $folders = Folder::query()
            ->where('supervisor_id', $supervisorId)
            ->withCount('submissions')
            ->latest()
            ->get()
            ->map(function (Folder $folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'description' => $folder->description,
                    'due_date' => optional($folder->due_date)?->format('Y-m-d'),
                    'is_reopened' => $folder->is_reopened,
                    'reopened_at' => optional($folder->reopened_at)?->format('Y-m-d H:i'),
                    'is_closed_for_submission' => $folder->due_date?->lt(today()) && ! $folder->is_reopened,
                    'is_temporarily_reopened' => $folder->due_date?->lt(today()) && $folder->is_reopened,
                    'submissions_count' => $folder->submissions_count,
                ];
            });

        $interns = User::query()
            ->where('role', 'student')
            ->where('department_id', $user->department_id)
            ->where('company_id', $user->company_id)
            ->withCount(['submissions as submissions_count' => fn ($query) => $query->whereHas('folder', fn ($folderQuery) => $folderQuery->where('supervisor_id', $supervisorId))])
            ->orderBy('name')
            ->get()
            ->map(function (User $intern) {
                $department = $intern->department;
                $company = $intern->company;

                if (blank($department) && filled($company) && str_contains(strtoupper($company), 'CAST')) {
                    $department = 'CAST';
                    $company = null;
                }

                return [
                    'id' => $intern->id,
                    'name' => $intern->name,
                    'email' => $intern->email,
                    'student_id' => $intern->student_id,
                    'department' => $department ?: 'CAST',
                    'company' => $company,
                    'submissions_count' => $intern->submissions_count,
                ];
            })
            ->values();

        $approvalRate = $statistics['total_submissions'] > 0
            ? round(($statistics['total_approved'] / $statistics['total_submissions']) * 100, 1)
            : 0;

        return [
            'statistics' => $statistics,
            'pendingSubmissions' => $pendingSubmissions,
            'recentActivities' => $recentActivities,
            'folders' => $folders,
            'interns' => $interns,
            'reports' => $reports,
            'approvalRate' => $approvalRate,
            'search' => $search,
        ];
    }

    private function mapSubmission(Submission $submission): array
    {
        return [
            'id' => $submission->id,
            'title' => $submission->title,
            'description' => $submission->description,
            'status' => $submission->status,
            'file_path' => $submission->file_path,
            'file_name' => $submission->file_name ?: ($submission->file_path ? basename($submission->file_path) : null),
            'feedback' => $submission->feedback,
            'supervisor_feedback' => $submission->supervisor_feedback,
            'dean_feedback' => $submission->dean_feedback,
            'submitted_at' => optional($submission->submitted_at ?? $submission->created_at)?->format('Y-m-d H:i'),
            'created_at' => optional($submission->submitted_at ?? $submission->created_at)?->toISOString(),
            'supervisor_approved_at' => optional($submission->supervisor_approved_at)?->format('Y-m-d H:i'),
            'forwarded_to_dean_at' => optional($submission->forwarded_to_dean_at)?->format('Y-m-d H:i'),
            'dean_reviewed_at' => optional($submission->dean_reviewed_at)?->format('Y-m-d H:i'),
            'student' => [
                'id' => $submission->student?->id,
                'name' => $submission->student?->name,
                'email' => $submission->student?->email,
                'student_id' => $submission->student?->student_id,
                'department' => $submission->student?->departmentRecord?->name ?? $submission->student?->department,
                'company' => $submission->student?->company,
            ],
            'folder' => [
                'id' => $submission->folder?->id,
                'name' => $submission->folder?->name,
            ],
            'supervisor' => [
                'name' => $submission->supervisor?->name,
            ],
            'dean' => [
                'name' => $submission->dean?->name,
            ],
        ];
    }
}

