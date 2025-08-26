<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'module_name',
        'module_code',
        'module_details',
        'credits',
        'semester',
        'module_type',
        'allowed_stream',
        'curriculum_id',
        'department_id',
        'created_by',
        'modified_by',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        // No casting needed - handling JSON manually in controller
        'allowed_stream' => 'array',
    ];
}
