<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'due_date',
        'supervisor_id',
        'is_reopened',
        'reopened_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_reopened' => 'boolean',
        'reopened_at' => 'datetime',
    ];

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
