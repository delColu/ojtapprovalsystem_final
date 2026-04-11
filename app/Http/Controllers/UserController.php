<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Folder;
use App\Models\User;
use App\Models\Role;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Company;
use App\Models\Submission;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()
->with(['assignedRole', 'departmentRecord', 'company'])
            ->latest()
            ->get()
            ->map(function (User $user) {
                $taskStats = match ($user->role) {
                    'student' => Submission::query()->where('student_id', $user->id)->count(),
                    'supervisor' => Submission::query()->where('supervisor_id', $user->id)->count(),
                    'dean' => Department::query()->where('dean_id', $user->id)->count(),
                    default => Folder::query()->count(),
                };

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role ?? $user->assignedRole?->name,
                    'role_id' => $user->role_id,
                    'student_id' => $user->student_id,
                    'department_id' => $user->department_id,
                    'department' => $user->departmentRecord?->name ?? $user->department,
                    'company_id' => $user->company_id,
'company' => $user->company?->name ?? null,
                    'tasks' => $taskStats,
                    'joined' => optional($user->created_at)?->format('M j, Y'),
                    'status' => $user->is_active ? 'Active' : 'Inactive',
                ];
            })
            ->values();

        $roles = Role::query()->orderBy('name')->get(['id', 'name']);
        $departments = Department::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->unique('name')
            ->values();
        $companies = Company::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return inertia('Admin/Users', compact('users', 'roles', 'departments', 'companies'));
    }

    public function store(Request $request)
    {
        $role = Role::query()->findOrFail($request->role_id);

        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users',
            'role_id'    => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
            'company_id' => 'nullable|exists:companies,id',
            'student_id' => $role->name === 'student' ? 'required|unique:users' : 'nullable|unique:users',
            'is_active' => 'nullable|boolean',
        ]);
        $department = $request->filled('department_id')
            ? Department::query()->find($request->department_id)
            : null;

        $company = $request->filled('company_id') ? Company::find($request->company_id) : null;

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make('Welcome123!'),
            'role_id'    => $request->role_id,
            'role'       => $role->name,
            'department_id' => $department?->id,
            'department' => $department?->name,
            'company_id' => $company?->id,
            'student_id' => $request->student_id,
            'is_active'  => $request->boolean('is_active', true),
        ]);

        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => 'user_created',
            'status'     => 'success',
            'details'    => "Created user: {$user->name}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'User created successfully. Temporary password: Welcome123!');
    }

    public function update(Request $request, User $user)
    {
        $role = Role::query()->findOrFail($request->role_id);

        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $user->id,
            'role_id'   => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
            'company_id' => 'nullable|exists:companies,id',
            'student_id' => $role->name === 'student'
                ? 'required|unique:users,student_id,' . $user->id
                : 'nullable|unique:users,student_id,' . $user->id,
            'is_active' => 'boolean',
        ]);
        $department = $request->filled('department_id')
            ? Department::query()->find($request->department_id)
            : null;

        $company = $request->filled('company_id') ? Company::find($request->company_id) : null;

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'role' => $role->name,
            'department_id' => $department?->id,
'department_id' => $department?->id,
            'company_id' => $company?->id,
            'student_id' => $role->name === 'student' ? $request->student_id : null,
            'is_active' => $request->boolean('is_active'),
        ]);

        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => 'user_updated',
            'status'     => 'success',
            'details'    => "Updated user: {$user->name}",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->back()->with('success', 'User updated successfully!');
    }

    public function destroy(User $user)
    {
        $user->delete();

        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => 'user_deleted',
            'status'     => 'success',
            'details'    => "Deleted user: {$user->name}",
            'ip_address' => request()->ip(),
        ]);

        return redirect()->back()->with('success', 'User deleted successfully!');
    }

    public function exportPdf()
    {
        $users = User::all();
        $pdf = Pdf::loadView('pdf.users', compact('users'));
        return $pdf->download('users-list.pdf');
    }

    public function reports()
    {
        $submissions = Submission::with(['student', 'folder', 'supervisor'])->latest()->paginate(20);
        return inertia('Admin/Reports/Index', compact('submissions'));
    }
}
