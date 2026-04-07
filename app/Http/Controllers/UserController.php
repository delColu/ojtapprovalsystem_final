<?php

namespace App\Http\Controllers;

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
        $users = User::with('role')->paginate(20);
        $roles = Role::all();

        return inertia('Admin/Users/Index', compact('users', 'roles'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:users',
            'role_id'    => 'required|exists:roles,id',
            'department' => 'nullable|string',
            'company'    => 'nullable|string',
            'student_id' => 'nullable|unique:users',
        ]);

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make(Str::random(16)),
            'role_id'    => $request->role_id,
            'department' => $request->department,
            'company'    => $request->company,
            'student_id' => $request->student_id,
            'is_active'  => true,
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
            'is_active' => 'boolean',
        ]);

$user->update($request->only(['name', 'email', 'role_id', 'is_active']));

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
        $users = User::with('role')->get();
        $pdf = Pdf::loadView('pdf.users', compact('users'));
        return $pdf->download('users-list.pdf');
    }

    public function reports()
    {
        $submissions = Submission::with(['student', 'folder', 'supervisor'])->latest()->paginate(20);
        return inertia('Admin/Reports/Index', compact('submissions'));
    }
}
