<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        $this->normalizeUserRole($request);
        $this->syncSelectedCompany($request);

        if (Auth::check() && Auth::user()->isSupervisor()) {
            return redirect()->route('supervisor.dashboard');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function companyPreview(Request $request): JsonResponse
    {
        $email = strtolower(trim((string) $request->query('email', '')));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'user' => null,
                'company' => null,
                'companies' => [],
                'can_switch' => false,
            ]);
        }

        $user = User::query()
            ->with('departmentRecord')
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        if (! $user) {
            return response()->json([
                'user' => null,
                'company' => null,
                'companies' => [],
                'can_switch' => false,
            ]);
        }

        $departmentName = $user->departmentRecord?->name ?? $user->department;
        $companies = collect();

        if ($user->isStudent() && filled($departmentName)) {
            $companies = Department::query()
                ->where('name', $departmentName)
                ->whereNotNull('company')
                ->orderBy('company')
                ->get(['id', 'name', 'company', 'address']);
        }

        if ($companies->isEmpty() && $user->departmentRecord) {
            $companies = collect([$user->departmentRecord]);
        }

        $mappedCompanies = $companies
            ->filter(fn (Department $department) => filled($department->company))
            ->unique(fn (Department $department) => mb_strtolower($department->name . '|' . $department->company))
            ->values()
            ->map(fn (Department $department) => [
                'id' => $department->id,
                'department' => $department->name,
                'company' => $department->company,
                'address' => $department->address,
            ]);

        $currentCompany = $mappedCompanies->firstWhere('id', $user->department_id)
            ?? ($user->company ? [
                'id' => $user->department_id,
                'department' => $departmentName,
                'company' => $user->company,
                'address' => $user->departmentRecord?->address,
            ] : null);

        return response()->json([
            'user' => [
                'name' => $user->name,
                'department' => $departmentName,
            ],
            'company' => $currentCompany,
            'companies' => $mappedCompanies->all(),
            'can_switch' => $user->isStudent() && $mappedCompanies->count() > 1,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function syncSelectedCompany(Request $request): void
    {
        $user = $request->user();

        if (! $user || ! $user->isStudent()) {
            return;
        }

        $selectedCompanyId = $request->integer('selected_company_id');

        if (! $selectedCompanyId) {
            return;
        }

        $departmentName = $user->departmentRecord?->name ?? $user->department;

        if (blank($departmentName)) {
            return;
        }

        $selectedDepartment = Department::query()
            ->whereKey($selectedCompanyId)
            ->where('name', $departmentName)
            ->first();

        if (! $selectedDepartment || blank($selectedDepartment->company)) {
            return;
        }

        $user->forceFill([
            'department_id' => $selectedDepartment->id,
            'department' => $selectedDepartment->name,
            'company' => $selectedDepartment->company,
        ])->save();
    }

    private function normalizeUserRole(Request $request): void
    {
        $user = $request->user();

        if (! $user) {
            return;
        }

        $resolvedRole = $user->assignedRole?->name ?? [
            1 => 'admin',
            2 => 'dean',
            3 => 'supervisor',
            4 => 'student',
        ][$user->role_id] ?? null;

        if ($resolvedRole && $user->role !== $resolvedRole) {
            $user->forceFill(['role' => $resolvedRole])->save();
        }
    }
}
