<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Company;
use App\Models\Department;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'role_id' => $request->user()->role_id,
                    'department_id' => $request->user()->department_id,
                    'department' => $request->user()->department,
'department_name' => $request->user()->department_id ? (Department::find($request->user()->department_id)?->name ?? $request->user()->department) : $request->user()->department,
                    'company_id' => $request->user()->company_id,
'company_name' => $request->user()->company_id ? (Company::find($request->user()->company_id)?->name ?? null) : null,
                    'student_id' => $request->user()->student_id,
                    'supervisor_id' => $request->user()->supervisor_id,
                    'is_active' => $request->user()->is_active,
                ] : null,
            ],
            'notifications' => fn () => $request->user()
                ? $request->user()
                    ->notifications()
                    ->latest()
                    ->take(15)
                    ->get()
                    ->map(fn ($notification) => [
                        'id' => $notification->id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'type' => $notification->type,
                        'is_read' => $notification->is_read,
                        'created_at' => optional($notification->created_at)?->diffForHumans(),
                        'data' => $notification->data,
                    ])
                    ->values()
                : [],
            'unreadNotificationsCount' => fn () => $request->user()
                ? $request->user()->notifications()->where('is_read', false)->count()
                : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
