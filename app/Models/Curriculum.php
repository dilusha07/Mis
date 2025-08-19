<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Curriculum extends Model
{
    use HasFactory;

    protected $table = 'curriculums';

    protected $fillable = [
        'curriculum_code',
        'curriculum_name',
        'start_date',
        'start_batch_from',
        'end_batch_to',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'start_date' => 'datetime', 
        'created_at' => 'datetime', 
        'updated_at' => 'datetime',
    ];
}
