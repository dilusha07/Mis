<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $primaryKey = 'id';

    protected $fillable = [
        'student_id',
        'first_name',
        'last_name',
        'full_name',
        'personal_email',
        'university_email',
        'batch_id',
        'advisor_id',
        'student_status',
        'created_by',
        'modified_by',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the student's full name
     */
    public function getNameAttribute()
    {
        return $this->full_name ?: ($this->first_name . ' ' . $this->last_name);
    }

    public function status() {
        return $this->hasOne(StudentStatus::class, 'student_id', 'student_id');
    }
}
