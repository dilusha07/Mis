<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    protected $table = 'departments';
    protected $primaryKey = 'id';

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'created_by' => 'int',
        'modified_by' => 'int',
    ];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'dept_name',
        'dept_code',
        'dept_type',
        'dept_desc',
        'created_by',
        'modified_by',
    ];
}
