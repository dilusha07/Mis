<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AcademicAdvisor extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'student_id',
        'advisor_id',
        'created_by',
        'modified_by',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the student associated with this academic advisor.
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Get the advisor (employee) associated with this academic advisor.
     */
    public function advisor()
    {
        return $this->belongsTo(Employee::class, 'advisor_id');
    }

    /**
     * Get the user who created this record.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last modified this record.
     */
    public function modifier()
    {
        return $this->belongsTo(User::class, 'modified_by');
    }
}
