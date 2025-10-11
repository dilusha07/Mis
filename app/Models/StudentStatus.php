<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StudentStatus extends Model
{
    use HasFactory;

    protected $table = 'student_statuses';

    /** The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $fillable = [
        'student_id',
        'degree_year',
        'semester',
        'batch_id',
        'acc_year_id',
        'created_by',
        'modified_by',
    ];

    /**
     * Relationships
     */

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class, 'batch_id');
    }
}
