<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'folder_id',
        'title',
        'description',
        'file_path',
        'file_name',
        'status',
        'feedback',
        'supervisor_feedback',
        'dean_feedback',
        'supervisor_id',
        'dean_id',
        'submitted_at',
        'approved_at',
        'rejected_at',
        'supervisor_approved_at',
        'forwarded_to_dean_at',
        'dean_reviewed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at'  => 'datetime',
        'rejected_at'  => 'datetime',
        'supervisor_approved_at' => 'datetime',
        'forwarded_to_dean_at' => 'datetime',
        'dean_reviewed_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function dean()
    {
        return $this->belongsTo(User::class, 'dean_id');
    }
}
