<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Department;
use App\Models\Folder;
use App\Models\Role;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        $this->assertAdmin();

        $tasks = Folder::query()->with(['supervisor.departmentRecord', 'submissions'])->latest()->get();
        $taskItems = $tasks->map(fn (Folder $task) => $this->mapTask($task));

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_interns' => User::query()->where('role', 'student')->count(),
                'active_tasks' => $taskItems->whereIn('status', ['Pending', 'In Progress'])->count(),
                'completed' => $taskItems->where('status', 'Completed')->count(),
                'overdue' => $taskItems->where('status', 'Overdue')->count(),
            ],
            'recentTasks' => $taskItems->take(8)->values(),
        ]);
    }

    public function tasks(Request $request): Response
    {
        $this->assertAdmin();

        $status = (string) $request->string('status');
        $department = (string) $request->string('department');
        $company = (string) $request->string('company');

        $tasks = Folder::query()
            ->with(['supervisor.departmentRecord', 'submissions'])
            ->latest()
            ->get()
            ->map(fn (Folder $task) => $this->mapTask($task))
            ->when($status !== '', fn ($collection) => $collection->where('status', $this->normalizeFilterStatus($status)))
            ->when($department !== '', fn ($collection) => $collection->where('department', $department))
            ->when($company !== '', fn ($collection) => $collection->where('company', $company))
            ->values();

        return Inertia::render('Admin/Tasks', [
            'tasks' => $tasks,
            'departments' => $this->departmentNames(),
            'companies' => $this->companyNames(),
            'filters' => [
                'status' => $status,
                'department' => $department,
                'company' => $company,
            ],
            'supervisors' => User::query()
                ->where('role', 'supervisor')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (User $user) => ['id' => $user->id, 'name' => $user->name])
                ->values(),
        ]);
    }

    public function storeTask(Request $request): RedirectResponse
    {
        $this->assertAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'supervisor_id' => ['required', 'exists:users,id'],
        ]);

        Folder::create($data);

        return back()->with('success', 'Task created successfully.');
    }

    public function updateTask(Request $request, Folder $folder): RedirectResponse
    {
        $this->assertAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'supervisor_id' => ['required', 'exists:users,id'],
        ]);

        $folder->update($data);

        return back()->with('success', 'Task updated successfully.');
    }

    public function destroyTask(Folder $folder): RedirectResponse
    {
        $this->assertAdmin();
        $folder->delete();

        return back()->with('success', 'Task deleted successfully.');
    }

    public function activityLogs(Request $request): Response
    {
        $this->assertAdmin();

        $action = trim((string) $request->string('action'));
        $userId = (string) $request->string('user_id');
        $status = trim((string) $request->string('status'));
        $dateFrom = (string) $request->string('date_from');
        $dateTo = (string) $request->string('date_to');

        $logs = ActivityLog::query()
            ->with('user')
            ->when($action !== '', fn ($query) => $query->where('action', 'like', "%{$action}%"))
            ->when($userId !== '', fn ($query) => $query->where('user_id', $userId))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->when($dateFrom !== '', fn ($query) => $query->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo !== '', fn ($query) => $query->whereDate('created_at', '<=', $dateTo))
            ->latest()
            ->get()
            ->map(function (ActivityLog $log) {
                return [
                    'id' => $log->id,
                    'timestamp' => optional($log->created_at)?->format('Y-m-d H:i:s'),
                    'user' => $log->user?->name ?? 'System',
                    'action' => str($log->action)->replace('_', ' ')->title()->toString(),
                    'status' => ucfirst($log->status),
                    'details' => $log->details,
                ];
            })
            ->values();

        return Inertia::render('Admin/ActivityLogs', [
            'logs' => $logs,
            'users' => User::query()->orderBy('name')->get(['id', 'name'])->map(fn (User $user) => ['id' => $user->id, 'name' => $user->name])->values(),
            'filters' => [
                'action' => $action,
                'user_id' => $userId,
                'status' => $status,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }

    private function mapTask(Folder $task): array
    {
        $submissionCount = $task->submissions->count();
        $approvedCount = $task->submissions->where('status', 'approved')->count();
        $pendingCount = $task->submissions->where('status', 'pending')->count();
        $rejectedCount = $task->submissions->where('status', 'rejected')->count();

        $status = 'Pending';

        if ($task->due_date && $task->due_date->isPast() && $approvedCount < max($submissionCount, 1)) {
            $status = 'Overdue';
        } elseif ($submissionCount > 0 && $approvedCount === $submissionCount) {
            $status = 'Completed';
        } elseif ($submissionCount > 0 && ($approvedCount > 0 || $pendingCount > 0 || $rejectedCount > 0)) {
            $status = 'In Progress';
        }

        return [
            'id' => $task->id,
            'title' => $task->name,
            'description' => $task->description,
            'assigned_to' => $task->supervisor?->name ?? 'Unassigned',
            'company' => $task->supervisor?->departmentRecord?->company ?? $task->supervisor?->company ?? 'N/A',
            'department' => $task->supervisor?->departmentRecord?->name ?? $task->supervisor?->department ?? 'N/A',
            'due_date' => optional($task->due_date)?->format('M d, Y') ?? 'No due date',
            'due_date_raw' => optional($task->due_date)?->format('Y-m-d'),
            'status' => $status,
            'submissions_count' => $submissionCount,
            'supervisor_id' => $task->supervisor_id,
        ];
    }

    private function departmentNames(): array
    {
        return Department::query()
            ->orderBy('name')
            ->pluck('name')
            ->unique()
            ->values()
            ->all();
    }

    private function companyNames(): array
    {
        return Department::query()
            ->whereNotNull('company')
            ->orderBy('company')
            ->pluck('company')
            ->unique()
            ->values()
            ->all();
    }

    private function normalizeFilterStatus(string $status): string
    {
        return match ($status) {
            'completed' => 'Completed',
            'in_progress' => 'In Progress',
            'pending' => 'Pending',
            'overdue' => 'Overdue',
            default => $status,
        };
    }

    private function assertAdmin(): void
    {
        abort_unless(Auth::user()?->isAdmin(), 403);
    }
}
