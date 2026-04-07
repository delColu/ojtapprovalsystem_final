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
use Illuminate\Support\Str;
use App\Models\Submission;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->with(['assignedRole', 'departmentRecord'])
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
                    'student_id' => $user->student_id,
                    'department_id' => $user->department_id,
                    'department' => $user->departmentRecord?->name ?? $user->department,
                    'company' => $user->departmentRecord?->company ?? $user->company,
                    'tasks' => $taskStats,
                    'joined' => optional($user->created_at)?->format('M j, Y'),
                    'status' => $user->is_active ? 'Active' : 'Inactive',
                ];
            })
            ->values();

        $roles = Role::query()->orderBy('name')->get(['id', 'name']);
        $departments = Department::query()->orderBy('name')->get(['id', 'name']);

        return inertia('Admin/Users', compact('users', 'roles', 'departments'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users',
            'role_id'    => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
            'department' => 'nullable|string',
            'company'    => 'nullable|string',
            'student_id' => 'nullable|unique:users',
            'is_active' => 'nullable|boolean',
        ]);

        $role = Role::query()->findOrFail($request->role_id);
        $department = $request->filled('department_id')
            ? Department::query()->find($request->department_id)
            : null;

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make(Str::random(16)),
            'role_id'    => $request->role_id,
            'role'       => $role->name,
            'department_id' => $department?->id,
            'department' => $department?->name ?? $request->department,
            'company'    => $department?->company ?? $request->company,
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

        return redirect()->back()->with('success', 'User created successfully!');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $user->id,
            'role_id'   => 'required|exists:roles,id',
            'department_id' => 'nullable|exists:departments,id',
            'is_active' => 'boolean',
        ]);
        $role = Role::query()->findOrFail($request->role_id);
        $department = $request->filled('department_id')
            ? Department::query()->find($request->department_id)
            : null;

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'role' => $role->name,
            'department_id' => $department?->id,
            'department' => $department?->name ?? $user->department,
            'company' => $department?->company ?? $user->company,
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
