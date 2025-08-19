<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class module extends Model
{

    use HasFactory;

    protected $fillable = [
        'id',
        'module_name',
        //odule_cord',
        'module_code',
        'module_details',
        'credits',
        'created_by',
        'modified_by',
        'created_at',
        'updated_at',
    ];
}
