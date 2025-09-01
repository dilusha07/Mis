<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Student;
use App\Models\Module;
use App\Models\BatchSemModule;

class StuModuleRegister extends Model
{
    use HasFactory;

    protected $table = 'stu_module_registers';

    protected $fillable = [
        'student_id',
        'batch_sem_module_id',
        'module_id',
        'module_reg_type',
        'reg_status',
        'attempts',
        'created_by',
        'modified_by'
    ];

    // Relationship: Student
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    // Relationship: Module
    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    // Relationship: Batch-Semester-Module
    public function batchSemModule()
    {
        return $this->belongsTo(BatchSemModule::class, 'batch_sem_module_id');
    }
}
