<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Batch extends Model
{
    use HasFactory;

    protected $table = 'batches';
    protected $primaryKey = 'id';

    protected $fillable = [
        'batch_name',
        'curriculum_id',
        'start_date',
        'effective_date',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'effective_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
