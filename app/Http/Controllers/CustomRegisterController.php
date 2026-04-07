<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use App\Models\Role;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class CustomRegisterController extends Controller
{
    /**
     * Show the registration form.
     */
    public function showRegistrationForm()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle the registration request.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'password'   => ['required', 'confirmed', Rules\Password::defaults()],
            'student_id' => 'nullable|string|unique:users',
            'department' => 'nullable|string|max:255',
            'company'    => 'nullable|string|max:255',
        ]);

        // Ensure the student role exists
        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $department = null;

        if ($request->filled('department')) {
            $department = Department::query()->firstOrCreate(
                ['name' => $request->department, 'company' => $request->company],
                ['description' => null, 'is_active' => true]
            );
        }

        // Create the user
        $user = User::create([
            'name'       => $request->name,
            'email'      => strtolower($request->email),
            'password'   => Hash::make($request->password),
            'role_id'    => $studentRole->id,
            'department_id' => $department?->id,
            'student_id' => $request->student_id,
            'department' => $department?->name ?? ($request->department ?: 'CAST'),
            'company'    => $request->company,
            'is_active'  => true,
        ]);

        // Log the activity
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'register',
            'status' => 'success',
            'details' => "New student registered: {$user->name} ({$user->email})",
            'ip_address' => $request->ip()
        ]);

        // Log the user in
        Auth::login($user);

        // Redirect to dashboard
        return redirect()->route('dashboard');
    }
}
