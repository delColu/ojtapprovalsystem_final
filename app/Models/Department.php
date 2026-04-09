<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company',
        'address',
        'description',
        'dean_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function dean(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dean_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
