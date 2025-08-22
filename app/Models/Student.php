<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = [
        'id',
        'student_id',
        'first_name',
        'last_name',
        'full_name',
        'email',
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
}
