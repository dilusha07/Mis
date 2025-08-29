<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamPlan extends Model
{
    use HasFactory;

    protected $table = 'exam_plans';

    protected $fillable = [
        'first_examiner_id',
        'second_examiner_id',
        'department_id',
        'module_id',
        'final_marks',
        'mid_marks',
        'ca_marks',
        'other_marks',
        'created_by',
        'edited_by',
    ];

    protected $casts = [
        'final_marks' => 'array',
        'mid_marks' => 'array',
        'ca_marks' => 'array',
        'other_marks' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the first examiner (employee)
     */
    public function firstExaminer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'first_examiner_id');
    }

    /**
     * Get the second examiner (employee)
     */
    public function secondExaminer(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'second_examiner_id');
    }

    /**
     * Get the department
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the module
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the user who created this exam plan
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last edited this exam plan
     */
    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'edited_by');
    }
}
