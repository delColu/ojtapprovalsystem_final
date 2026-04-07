<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'department',
        'company',
        'student_id',
        'supervisor_id',
        'is_active'
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

    public function role()
    {
        return $this->belongsTo(Role::class);
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

    /* Role Checkers - FIXED VERSION */

    public function isAdmin()
    {
        // Check if role relationship exists and role name is 'admin'
        return $this->role && $this->role->name === 'admin';
    }

    public function isDean()
    {
        return $this->role && $this->role->name === 'dean';
    }

    public function isSupervisor()
    {
        return $this->role && $this->role->name === 'supervisor';
    }

    public function isStudent()
    {
        return $this->role && $this->role->name === 'student';
    }
}
