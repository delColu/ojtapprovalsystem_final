<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification as FacadeNotification;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Notification;

class DepartmentController extends Controller
{
    public function index(Request $request): Response
    {
        $this->assertAdmin();

        $search = trim((string) $request->string('search'));
        $statusFilter = (string) $request->string('status');

        $departmentsQuery = Department::query()
            ->withCount(['users as interns_count' => fn ($query) => $query->where('role', 'student')])
            ->orderBy('name');

        $departmentsQuery->when($search !== '', function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
        });

        $departmentsQuery->when($statusFilter === 'active', fn ($query) => $query->where('is_active', true))
                         ->when($statusFilter === 'inactive', fn ($query) => $query->where('is_active', false));

        $departments = $departmentsQuery->get()->map(function (Department $department) {
            $supervisorCount = User::where('role', 'supervisor')->where('department_id', $department->id)->count();
            $status = $department->is_active ? 'Active' : 'Inactive';

            return [
                'id' => $department->id,
                'name' => $department->name,
                'address' => $department->address ?? 'No address',
                'created_at' => $department->created_at?->format('M d, Y'),
                'status' => $status,
                'interns_count' => $department->users_count ?? 0,
                'supervisors_count' => $supervisorCount,
            ];
        });

        return Inertia::render('Admin/Departments', [
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->assertAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('departments')],
            'address' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        Department::create($data);

        return back()->with('success', 'Department created successfully.');
    }

    public function update(Request $request, Department $department): RedirectResponse
    {
        $this->assertAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('departments', 'name')->ignore($department->id)],
            'address' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ]);

        $department->update($data);

        // Notify users about changes
        $users = User::where('department_id', $department->id)
                     ->where('is_active', true)
                     ->get();

        foreach ($users as $user) {
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Department Updated',
                'message' => "Your department '{$department->name}' has been updated.",
                'type' => 'department_update',
                'data' => ['department_id' => $department->id, 'new_name' => $department->name],
            ]);
        }

        // Removed: No 'department' DB column exists. Use $user->departmentRecord->name instead
        // User::where('department_id', $department->id)->update([
        //     'department' => $department->name,
        // ]);

        return back()->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $this->assertAdmin();

        // Set department_id to null (column exists), skip 'department' (no column)
        User::where('department_id', $department->id)->update([
            'department_id' => null,
        ]);

        $department->delete();

        return back()->with('success', 'Department deleted successfully.');
    }

    private function assertAdmin(): void
    {
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }
    }
}

