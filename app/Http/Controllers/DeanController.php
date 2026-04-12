<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Role;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DeanController extends Controller
{
    public function dashboard(): Response
    {
        $dean = $this->deanUser();
        $departmentIds = $this->departmentIds($dean);
        $submissionsQuery = $this->submissionScope($departmentIds);

        $submitted = (clone $submissionsQuery)->count();
        $approved = (clone $submissionsQuery)->where('status', 'approved')->count();
        $pending = (clone $submissionsQuery)->where('status', 'pending')->count();
        $rejected = (clone $submissionsQuery)->where('status', 'rejected')->count();

        $interns = $this->internScope($departmentIds)
            ->with('departmentRecord')
            ->orderBy('name')
            ->get()
            ->map(fn (User $intern) => $this->mapIntern($intern));

        $departmentSummary = Department::query()
            ->whereIn('id', $departmentIds)
            ->orderBy('name')
            ->get()
            ->map(function (Department $department) {
                $departmentSubmissions = Submission::query()
                    ->whereHas('student', fn ($query) => $query->where('department_id', $department->id));

                $submitted = (clone $departmentSubmissions)->count();
                $approved = (clone $departmentSubmissions)->where('status', 'approved')->count();
                $pending = (clone $departmentSubmissions)->where('status', 'pending')->count();

                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'company' => $department->company,
                    'supervisor_name' => User::query()
                        ->where('role', 'supervisor')
                        ->where('department_id', $department->id)
                        ->orderBy('name')
                        ->value('name') ?? 'Unassigned',
                    'interns_count' => User::query()->where('role', 'student')->where('department_id', $department->id)->count(),
                    'submitted' => $submitted,
                    'approved' => $approved,
                    'pending' => $pending,
                    'approval_rate' => $submitted > 0 ? round(($approved / $submitted) * 100) : 0,
                ];
            })
            ->values();

        return Inertia::render('Dean/Dashboard', [
            'stats' => [
                'total_interns' => $interns->count(),
                'pending_review' => $pending,
                'approved' => $approved,
                'rejected' => $rejected,
            ],
            'submissionOverview' => [
                'approval_rate' => $submitted > 0 ? round(($approved / $submitted) * 100) : 0,
                'pending_rate' => $submitted > 0 ? round(($pending / $submitted) * 100) : 0,
                'rejection_rate' => $submitted > 0 ? round(($rejected / $submitted) * 100) : 0,
                'submitted' => $submitted,
                'approved' => $approved,
                'pending' => $pending,
                'rejected' => $rejected,
            ],
            'interns' => $interns->take(5)->values(),
            'departmentSummary' => $departmentSummary,
        ]);
    }

    public function supervisors(Request $request): Response
    {
        $departmentIds = $this->departmentIds($this->deanUser());
        $search = trim((string) $request->string('search'));
        $department = (string) $request->string('department');

        $supervisors = User::query()
            ->where('role', 'supervisor')
            ->whereIn('department_id', $departmentIds)
            ->with('departmentRecord')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nestedQuery) use ($search) {
                    $nestedQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($department !== '', fn ($query) => $query->where('department_id', $department))
            ->orderBy('name')
            ->get()
            ->map(function (User $supervisor) {
                $internsCount = User::query()->where('role', 'student')->where('supervisor_id', $supervisor->id)->count();
                $submissionScope = Submission::query()->where('supervisor_id', $supervisor->id);
                $approved = (clone $submissionScope)->where('status', 'approved')->count();
                $pending = (clone $submissionScope)->where('status', 'pending')->count();
                $rejected = (clone $submissionScope)->where('status', 'rejected')->count();
                $total = $approved + $pending + $rejected;

                return [
                    'id' => $supervisor->id,
                    'name' => $supervisor->name,
                    'email' => $supervisor->email,
                    'department_id' => $supervisor->department_id,
                    'department' => $supervisor->departmentRecord?->name ?? $supervisor->department,
                    'company' => $supervisor->company ?? $supervisor->departmentRecord?->company,
                    'interns_count' => $internsCount,
                    'approved_count' => $approved,
                    'pending_count' => $pending,
                    'rejected_count' => $rejected,
                    'approval_rate' => $total > 0 ? round(($approved / $total) * 100) : 0,
                    'is_active' => $supervisor->is_active,
                ];
            })
            ->values();

        return Inertia::render('Dean/Supervisors', [
            'supervisors' => $supervisors,
            'departments' => $this->departmentOptions($departmentIds),
            'filters' => [
                'search' => $search,
                'department' => $department,
            ],
        ]);
    }

    public function interns(Request $request): Response
    {
        $departmentIds = $this->departmentIds($this->deanUser());
        $search = trim((string) $request->string('search'));
        $department = (string) $request->string('department');
        $status = (string) $request->string('status');

        $interns = $this->internScope($departmentIds)
            ->with('departmentRecord')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nestedQuery) use ($search) {
                    $nestedQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('student_id', 'like', "%{$search}%");
                });
            })
            ->when($department !== '', fn ($query) => $query->where('department_id', $department))
            ->when($status !== '', function ($query) use ($status) {
                if ($status === 'active') {
                    $query->where('is_active', true);
                }

                if ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            })
            ->orderBy('name')
            ->get()
            ->map(fn (User $intern) => $this->mapIntern($intern));

        return Inertia::render('Dean/Interns', [
            'interns' => $interns,
            'departments' => $this->departmentOptions($departmentIds),
            'supervisors' => $this->supervisorOptions($departmentIds),
            'filters' => [
                'search' => $search,
                'department' => $department,
                'status' => $status,
            ],
        ]);
    }

    public function departments(): Response
    {
        $departmentIds = $this->departmentIds($this->deanUser());

        $departments = Department::query()
            ->whereIn('id', $departmentIds)
            ->orderBy('name')
            ->get()
            ->map(function (Department $department) {
                $submissionScope = Submission::query()
                    ->whereHas('student', fn ($query) => $query->where('department_id', $department->id));

                $approved = (clone $submissionScope)->where('status', 'approved')->count();
                $pending = (clone $submissionScope)->where('status', 'pending')->count();
                $total = (clone $submissionScope)->count();

                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'company' => $department->company,
                    'address' => $department->address,
                    'description' => $department->description,
                    'is_active' => $department->is_active,
                    'interns_count' => User::query()->where('role', 'student')->where('department_id', $department->id)->count(),
                    'supervisor_name' => User::query()
                        ->where('role', 'supervisor')
                        ->where('department_id', $department->id)
                        ->orderBy('name')
                        ->value('name') ?? 'Unassigned',
                    'approved_count' => $approved,
                    'pending_count' => $pending,
                    'approval_rate' => $total > 0 ? round(($approved / $total) * 100) : 0,
                ];
            })
            ->values();

        return Inertia::render('Dean/Departments', [
            'departments' => $departments,
        ]);
    }

    public function submissions(Request $request): Response
    {
        return $this->submissionPage($request, 'Dean/Submissions', true);
    }

    public function reports(Request $request): Response
    {
        return $this->submissionPage($request, 'Dean/Reports', false);
    }

    public function downloadReportsPdf(Request $request)
    {
        $departmentIds = $this->departmentIds($this->deanUser());
        $search = trim((string) $request->string('search'));
        $status = (string) $request->string('status');
        $department = (string) $request->string('department');

        $submissions = $this->submissionScope($departmentIds)
            ->with(['student.departmentRecord', 'folder', 'supervisor', 'dean'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nestedQuery) use ($search) {
                    $nestedQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhereHas('student', fn ($studentQuery) => $studentQuery->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('folder', fn ($folderQuery) => $folderQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($department !== '', fn ($query) => $query->whereHas('student', fn ($studentQuery) => $studentQuery->where('department_id', $department)))
            ->latest('submitted_at')
            ->get();

        $pdf = Pdf::loadView('pdf.dean-reports', [
            'submissions' => $submissions,
            'dean' => $this->deanUser(),
        ]);

        return $pdf->download('dean-reports.pdf');
    }

    public function storeSupervisor(Request $request): RedirectResponse
    {
        $department = $this->findDeanDepartment($request->integer('department_id'));

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'department_id' => ['required', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make(Str::random(16)),
            'role_id' => Role::query()->where('name', 'supervisor')->value('id'),
            'role' => 'supervisor',
            'department_id' => $department->id,
            // 'department' => $department->name,  // Use accessor: $user->departmentRecord->name
            // 'company' => $department->company,  // Use accessor: $user->departmentRecord->company
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Supervisor created successfully.');
    }

    public function updateSupervisor(Request $request, User $user): RedirectResponse
    {
        abort_unless($user->isSupervisor(), 404);
        $this->assertDeanOwnsUserDepartment($user);
        $department = $this->findDeanDepartment($request->integer('department_id'));

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'department_id' => ['required', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'department_id' => $department->id,
            // 'department' => $department->name,  // Use accessor
            // 'company' => $department->company,  // Use accessor
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Supervisor updated successfully.');
    }

    public function destroySupervisor(User $user): RedirectResponse
    {
        abort_unless($user->isSupervisor(), 404);
        $this->assertDeanOwnsUserDepartment($user);

        User::query()->where('supervisor_id', $user->id)->update(['supervisor_id' => null]);
        $user->delete();

        return back()->with('success', 'Supervisor deleted successfully.');
    }

    public function storeIntern(Request $request): RedirectResponse
    {
        $department = $this->findDeanDepartment($request->integer('department_id'));
        $supervisor = $this->findDeanSupervisor($request->input('supervisor_id'));

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'student_id' => ['nullable', 'string', 'max:255', 'unique:users,student_id'],
            'department_id' => ['required', 'integer'],
            'supervisor_id' => ['nullable', 'integer'],
            'company' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make(Str::random(16)),
            'role_id' => Role::query()->where('name', 'student')->value('id'),
            'role' => 'student',
            'student_id' => $data['student_id'],
            'department_id' => $department->id,
            // 'department' => $department->name,  // Use accessor
            'company' => $data['company'] ?: $department->company,
            'supervisor_id' => $supervisor?->id,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Intern created successfully.');
    }

    public function updateIntern(Request $request, User $user): RedirectResponse
    {
        abort_unless($user->isStudent(), 404);
        $this->assertDeanOwnsUserDepartment($user);
        $department = $this->findDeanDepartment($request->integer('department_id'));
        $supervisor = $this->findDeanSupervisor($request->input('supervisor_id'));

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'student_id' => ['nullable', 'string', 'max:255', Rule::unique('users', 'student_id')->ignore($user->id)],
            'department_id' => ['required', 'integer'],
            'supervisor_id' => ['nullable', 'integer'],
            'company' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'student_id' => $data['student_id'],
            'department_id' => $department->id,
            // 'department' => $department->name,  // Use accessor
            'company' => $data['company'] ?: $department->company,
            'supervisor_id' => $supervisor?->id,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Intern updated successfully.');
    }

    public function destroyIntern(User $user): RedirectResponse
    {
        abort_unless($user->isStudent(), 404);
        $this->assertDeanOwnsUserDepartment($user);

        $user->delete();

        return back()->with('success', 'Intern deleted successfully.');
    }

    public function storeDepartment(Request $request): RedirectResponse
    {
        $dean = $this->deanUser();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        Department::create([
            'name' => $data['name'],
            'company' => $data['company'] ?? null,
            'address' => $data['address'] ?? null,
            'description' => $data['description'] ?? null,
            'dean_id' => $dean->id,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Department created successfully.');
    }

    public function updateDepartment(Request $request, Department $department): RedirectResponse
    {
        $this->assertDeanOwnsDepartment($department);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $oldName = $department->name;
        $oldCompany = $department->company;
        $department->update([
            'name' => $data['name'],
            'company' => $data['company'] ?? null,
            'address' => $data['address'] ?? null,
            'description' => $data['description'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Removed: No 'department'/'company' DB columns on users. Use relationships/accessors
        // User::query()->where('department_id', $department->id)->update([
        //     'department' => $department->name,
        //     'company' => $department->company,
        // ]);

        // Notify active users about name or company changes
        $users = User::where('department_id', $department->id)
                     ->where('is_active', true)
                     ->pluck('id');

        if ($users->isNotEmpty() && ($oldName !== $department->name || $oldCompany !== $department->company)) {
            $notifications = $users->map(function ($userId) use ($department, $oldName, $oldCompany) {
                $message = "Your department '{$oldName}' has been updated to '{$department->name}'";
                if ($oldCompany !== $department->company) {
                    $message .= ". Company changed to '{$department->company}'";
                }
                return [
                    'user_id' => $userId,
                    'title' => 'Department Updated',
                    'message' => $message,
                    'type' => 'department_update',
                    'data' => ['department_id' => $department->id, 'new_name' => $department->name, 'new_company' => $department->company],
                    'is_read' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            \App\Models\Notification::insert($notifications);
        }

        return back()->with('success', 'Department updated successfully.');
    }

    public function destroyDepartment(Department $department): RedirectResponse
    {
        $this->assertDeanOwnsDepartment($department);

        // Set only department_id to null (column exists), skip phantom columns
        User::query()->where('department_id', $department->id)->update([
            'department_id' => null,
        ]);

        $department->delete();

        return back()->with('success', 'Department deleted successfully.');
    }

    private function submissionPage(Request $request, string $component, bool $includeDepartment): Response
    {
        $departmentIds = $this->departmentIds($this->deanUser());
        $search = trim((string) $request->string('search'));
        $status = (string) $request->string('status');
        $department = (string) $request->string('department');

        $submissions = $this->submissionScope($departmentIds)
            ->with(['student.departmentRecord', 'folder', 'supervisor'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nestedQuery) use ($search) {
                    $nestedQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhereHas('student', fn ($studentQuery) => $studentQuery->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('folder', fn ($folderQuery) => $folderQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($department !== '', fn ($query) => $query->whereHas('student', fn ($studentQuery) => $studentQuery->where('department_id', $department)))
            ->latest('submitted_at')
            ->get()
            ->map(function (Submission $submission) use ($includeDepartment) {
                $payload = [
                    'id' => $submission->id,
                    'intern_name' => $submission->student?->name,
                    'intern_email' => $submission->student?->email,
                    'report_title' => $submission->title,
                    'description' => $submission->description,
                    'folder_name' => $submission->folder?->name ?? 'No Folder',
                    'supervisor_name' => $submission->supervisor?->name ?? 'Unassigned',
                    'date' => optional($submission->submitted_at ?? $submission->created_at)?->format('M d, Y'),
                    'status' => $submission->status,
                    'file_path' => $submission->file_path,
                    'file_name' => $submission->file_name ?: ($submission->file_path ? basename($submission->file_path) : null),
                    'feedback' => $submission->feedback,
                    'supervisor_feedback' => $submission->supervisor_feedback,
                    'dean_feedback' => $submission->dean_feedback,
                    'supervisor_approved_at' => optional($submission->supervisor_approved_at)->format('M d, Y h:i A'),
                    'forwarded_to_dean_at' => optional($submission->forwarded_to_dean_at)->format('M d, Y h:i A'),
                    'dean_reviewed_at' => optional($submission->dean_reviewed_at)->format('M d, Y h:i A'),
                ];

                if ($includeDepartment) {
                    $payload['department'] = $submission->student?->departmentRecord?->name ?? $submission->student?->department ?? 'Unassigned';
                }

                return $payload;
            })
            ->values();

        return Inertia::render($component, [
            'submissions' => $submissions,
            'departments' => $this->departmentOptions($departmentIds),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'department' => $department,
            ],
        ]);
    }

    private function deanUser(): User
    {
        $user = Auth::user();
        abort_unless($user && $user->isDean(), 403);

        return $user;
    }

    private function departmentIds(User $dean): array
    {
        $ids = Department::query()->where('dean_id', $dean->id)->pluck('id')->all();

        if ($ids === [] && filled($dean->department)) {
            if ($this->isCastDean($dean)) {
                $ids = Department::query()->where('name', 'CAST')->pluck('id')->all();
            } else {
                $ids = Department::query()->where('name', $dean->department)->pluck('id')->all();
            }
        }

        return $ids;
    }

    private function isCastDean(User $dean): bool
    {
        $department = strtolower((string) $dean->department);

        return str_contains($department, 'arts')
            || str_contains($department, 'sciences')
            || str_contains($department, 'technology')
            || $department === 'cast';
    }

    private function submissionScope(array $departmentIds)
    {
        return Submission::query()
            ->whereHas('student', fn ($query) => $query->whereIn('department_id', $departmentIds));
    }

    private function internScope(array $departmentIds)
    {
        return User::query()
            ->where('role', 'student')
            ->whereIn('department_id', $departmentIds);
    }

    private function mapIntern(User $intern): array
    {
        $submissions = Submission::query()->where('student_id', $intern->id);
        $submitted = (clone $submissions)->count();
        $approved = (clone $submissions)->where('status', 'approved')->count();

        return [
            'id' => $intern->id,
            'name' => $intern->name,
            'email' => $intern->email,
            'student_id' => $intern->student_id,
            'department_id' => $intern->department_id,
            'department' => $intern->departmentRecord?->name ?? $intern->department,
            'company' => $intern->company,
            'supervisor_id' => $intern->supervisor_id,
            'supervisor_name' => User::query()->where('id', $intern->supervisor_id)->value('name') ?? 'Unassigned',
            'submitted' => $submitted,
            'approved' => $approved,
            'status' => ! $intern->is_active ? 'Inactive' : ($submitted > 0 && $submitted === $approved ? 'Approved' : 'Active'),
            'is_active' => $intern->is_active,
        ];
    }

    private function departmentOptions(array $departmentIds): array
    {
        return Department::query()
            ->whereIn('id', $departmentIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->unique('name')
            ->map(fn (Department $department) => [
                'id' => $department->id,
                'name' => $department->name,
            ])
            ->values()
            ->all();
    }

    private function supervisorOptions(array $departmentIds): array
    {
        return User::query()
            ->where('role', 'supervisor')
            ->whereIn('department_id', $departmentIds)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (User $supervisor) => [
                'id' => $supervisor->id,
                'name' => $supervisor->name,
            ])
            ->values()
            ->all();
    }

    private function findDeanDepartment(?int $departmentId): Department
    {
        $department = Department::query()->findOrFail($departmentId);
        $this->assertDeanOwnsDepartment($department);

        return $department;
    }

    private function findDeanSupervisor($supervisorId): ?User
    {
        if (blank($supervisorId)) {
            return null;
        }

        $supervisor = User::query()->findOrFail($supervisorId);
        abort_unless($supervisor->isSupervisor(), 404);
        $this->assertDeanOwnsUserDepartment($supervisor);

        return $supervisor;
    }

    private function assertDeanOwnsDepartment(Department $department): void
    {
        abort_unless($department->dean_id === $this->deanUser()->id, 403);
    }

    private function assertDeanOwnsUserDepartment(User $user): void
    {
        $department = Department::query()->find($user->department_id);
        abort_if(! $department, 403);
        $this->assertDeanOwnsDepartment($department);
    }
}
