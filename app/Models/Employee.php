<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        'user_id',
        'department_id',
        'category_id',
        'designation',
        'primary_role',
        'personal_email',
        'university_email',
        'first_name',
        'last_name',
        'full_name',
        'contact_number',
        'employee_status',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user associated with this employee
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the department this employee belongs to
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the employee category
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(EmployeeCategory::class);
    }

    /**
     * Get the employee's full name
     */
    public function getNameAttribute()
    {
        return $this->full_name ?: ($this->first_name . ' ' . $this->last_name);
    }
}
