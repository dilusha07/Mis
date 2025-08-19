<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AcademicYear extends Model
{
    use HasFactory;

    protected $table = 'academic_years';
    protected $primaryKey = 'id';

    protected $fillable = [
        'academic_year',
        'year_begin',
        'year_end',
        'status',
        'curriculum_id',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'year_begin' => 'datetime',
        'year_end' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relation with Curriculum
    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }
}
