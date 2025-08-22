<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAdmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'batch_sem_module_id',
        'exam_date',
        'start_time',
        'end_time',
        'venue',
        'student_group',
        'created_by',
        'modified_by',
    ];

    protected $casts = [
        'exam_date' => 'datetime',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function batchSemModule(): BelongsTo
    {
        return $this->belongsTo(BatchSemModule::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function modifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by');
    }
}
