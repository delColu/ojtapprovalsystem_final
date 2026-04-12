<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\Notification;
use App\Models\User;

class CompanyController extends Controller
{
    public function index(): Response
    {
        $this->assertAdmin();

        $companies = Company::query()
            ->orderBy('name')
            ->get()
            ->map(function (Company $company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'address' => $company->address,
                    'status' => $company->is_active ? 'Active' : 'Inactive',
                    'created_at' => $company->created_at?->format('M j, Y'),
                ];
            })
            ->values();

        return Inertia::render('Admin/Company', compact('companies'));
    }

    public function store(Request $request): RedirectResponse
    {
        $this->assertAdmin();

        $request->validate([
            'name' => 'required|string|max:255|unique:companies,name',
            'address' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $company = Company::create($request->only(['name', 'address', 'is_active']));

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'company_created',
            'status' => 'success',
            'details' => "Created company: {$company->name}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Company created successfully!');
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $this->assertAdmin();

        $request->validate([
            'name' => 'required|string|max:255|unique:companies,name,' . $company->id,
            'address' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $oldName = $company->getOriginal('name');
        $company->update($request->only(['name', 'address', 'is_active']));

        // Update user company cache if name changed
        if ($oldName !== $company->name) {
            User::where('company_id', $company->id)->update(['company' => $company->name]);
        }

        // Notify users about changes
        $users = User::where('company_id', $company->id)
                     ->where('is_active', true)
                     ->get();

        foreach ($users as $user) {
            $message = [];
            if ($oldName !== $company->name) {
                $message[] = "Company '{$oldName}' renamed to '{$company->name}'";
            }
            if ($company->wasChanged('is_active')) {
                $status = $company->is_active ? 'Active' : 'Inactive';
                $message[] = "Status changed to {$status}";
            }
            Notification::create([
                'user_id' => $user->id,
                'title' => 'Company Updated',
                'message' => implode('. ', $message) . '.',
                'type' => 'company_update',
                'data' => ['company_id' => $company->id, 'new_name' => $company->name],
            ]);
        }

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'company_updated',
            'status' => 'success',
            'details' => "Updated company: {$company->name}",
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Company updated successfully!');
    }

    public function destroy(Company $company): RedirectResponse
    {
        $this->assertAdmin();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'company_deleted',
            'status' => 'success',
            'details' => "Deleted company: {$company->name}",
            'ip_address' => request()->ip(),
        ]);

        $company->delete();

        return back()->with('success', 'Company deleted successfully!');
    }

    private function assertAdmin(): void
    {
        if (!Auth::user() || !Auth::user()->isAdmin()) {
            abort(403, 'Admin access required.');
        }
    }
}

