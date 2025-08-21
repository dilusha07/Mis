<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BatchStatus extends Model
{
    use HasFactory;

    protected $table = 'batch_statuses';
    protected $primaryKey = 'id';

    protected $fillable = [
        'batch_id',
        'degree_year',
        'semester',
        'semester_order',
        'acc_year_id',
        'status',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
