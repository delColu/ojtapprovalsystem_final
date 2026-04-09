<?php

namespace App\Http\Controllers;

use App\Models\Company;
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
        return Inertia::render('Auth/Register', [
            'companies' => Company::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'address'])
                ->map(fn (Company $company) => [
                    'id' => $company->id,
                    'company' => $company->name,
                    'address' => $company->address,
                ])
                ->values(),
        ]);
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
            'department' => 'required|string|max:255',
            'company'    => 'required|string|max:255|exists:companies,name',
        ]);

        $company = Company::query()
            ->get()
            ->first(fn (Company $company) => $this->normalizeCompany($company->name) === $this->normalizeCompany($request->company));

        $canonicalCompanyName = $company?->name ?? $request->company;

        // Ensure the student role exists
        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $department = Department::query()
            ->get()
            ->first(function (Department $department) use ($request, $canonicalCompanyName) {
                return $department->name === $request->department
                    && $this->normalizeCompany($department->company) === $this->normalizeCompany($canonicalCompanyName);
            });

        if (! $department) {
            $department = Department::query()->create([
                'name' => $request->department,
                'company' => $canonicalCompanyName,
                'description' => null,
                'is_active' => true,
            ]);
        }

        $supervisor = User::query()
            ->with('departmentRecord')
            ->where('role', 'supervisor')
            ->get()
            ->first(function (User $supervisor) use ($canonicalCompanyName) {
                $supervisorCompany = $supervisor->company ?: $supervisor->departmentRecord?->company;

                return $this->normalizeCompany($supervisorCompany) === $this->normalizeCompany($canonicalCompanyName);
            });

        // Create the user
        $user = User::create([
            'name'       => $request->name,
            'email'      => strtolower($request->email),
            'password'   => Hash::make($request->password),
            'role_id'    => $studentRole->id,
            'department_id' => $department?->id,
            'student_id' => $request->student_id,
            'department' => $department?->name ?? ($request->department ?: 'CAST'),
            'company'    => $canonicalCompanyName,
            'supervisor_id' => $supervisor?->id,
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

    private function normalizeCompany(?string $company): string
    {
        return strtolower(preg_replace('/[^a-z0-9]+/i', '', (string) $company));
    }
}
