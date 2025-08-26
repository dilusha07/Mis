<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BatchStatus extends Model
{
    use HasFactory;

    protected $table = 'batch_statuses';
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'batch_id',
        'degree_year',
        'semester',
        'semester_order', // JSON column
        'acc_year_id',
        'status',
        'created_by',
        'modified_by',
    ];
    
    protected $casts = [
        'semester_order' => 'array', 
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


     /**
     * Relationships
     */
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'acc_year_id');
    }

    // Accessor for readable status
    public function getStatusTextAttribute()
    {
        return $this->status == 1 ? 'Active' : 'Passing Out';
    }

     public function getBatchNameAttribute()
    {
        return $this->batch?->batch_name ?? '';
    }

    public function getAcademicYearNameAttribute()
    {
        return $this->academicYear?->academic_year ?? '';
    }

}
