<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected static function booted(): void
    {
        static::saving(function (User $user) {
            if ($user->role_id && (! $user->role || $user->isDirty('role_id'))) {
                $user->role = Role::query()->find($user->role_id)?->name ?? $user->role;
            }

            if ($user->role && (! $user->role_id || $user->isDirty('role'))) {
                $user->role_id = Role::query()->firstOrCreate(
                    ['name' => $user->role]
                )->id;
            }
        });
    }

    protected $fillable = [
        'name',
        'email',
        'role', // Direct role column
        'role_id',
        'department_id',
        'password',
        'department',
        'company_id',
        'student_id',
        'supervisor_id',
        'is_active',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    /* Relationships */

    public function assignedRole(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function departmentRecord(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'student_id');
    }

    public function supervisedSubmissions()
    {
        return $this->hasMany(Submission::class, 'supervisor_id');
    }

    public function createdFolders()
    {
        return $this->hasMany(Folder::class, 'supervisor_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    /* Role Checkers - Direct role column */

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function isDean()
    {
        return $this->hasRole('dean');
    }

    public function isSupervisor()
    {
        return $this->hasRole('supervisor');
    }

    public function isStudent()
    {
        return $this->hasRole('student');
    }

    protected function hasRole(string $role): bool
    {
        if ($this->assignedRole?->name === $role) {
            return true;
        }

        $roleFromId = [
            1 => 'admin',
            2 => 'dean',
            3 => 'supervisor',
            4 => 'student',
        ][$this->role_id] ?? null;

        if ($roleFromId === $role) {
            return true;
        }

        return $this->role === $role;
    }
}
